package com.goldmonitor.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class OllamaService {

    private static final Logger log = LoggerFactory.getLogger(OllamaService.class);
    private static final Set<String> ALLOWED_TYPES =
            Set.of("world", "security", "political", "humanitarian", "military", "economic", "gold");

    @Value("${ollama.host}")
    private String ollamaHost;

    @Value("${ollama.model}")
    private String ollamaModel;

    /** Resolved at startup — may differ from ollamaModel if fallback kicks in. */
    private String resolvedModel;

    @PostConstruct
    @SuppressWarnings("unchecked")
    public void resolveModel() {
        try {
            RestClient client = RestClient.create();
            Map<String, Object> tags = client.get()
                    .uri(ollamaHost + "/api/tags")
                    .retrieve()
                    .body(Map.class);

            if (tags != null && tags.containsKey("models")) {
                List<Map<String, Object>> models = (List<Map<String, Object>>) tags.get("models");
                // Check if the configured model exists
                boolean exists = models.stream()
                        .anyMatch(m -> ollamaModel.equals(m.get("name"))
                                    || String.valueOf(m.get("name")).startsWith(ollamaModel + ":"));
                if (exists) {
                    resolvedModel = ollamaModel;
                    log.info("✅ Ollama model '{}' confirmed available", resolvedModel);
                } else if (!models.isEmpty()) {
                    // Fall back to the first installed model
                    resolvedModel = (String) models.get(0).get("name");
                    log.warn("⚠ Model '{}' not found — falling back to '{}'", ollamaModel, resolvedModel);
                } else {
                    resolvedModel = ollamaModel;
                    log.warn("⚠ No models installed in Ollama. Run: ollama pull llama3.2");
                }
            } else {
                resolvedModel = ollamaModel;
            }
        } catch (Exception e) {
            resolvedModel = ollamaModel;
            log.warn("⚠ Could not reach Ollama at startup: {}", e.getMessage());
        }
    }

    public String getModel() {
        return resolvedModel != null ? resolvedModel : ollamaModel;
    }

    public boolean checkHealth() {
        try {
            RestClient client = RestClient.create();
            var response = client.get()
                    .uri(ollamaHost + "/api/tags")
                    .retrieve()
                    .toBodilessEntity();
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.warn("Ollama health check failed: {}", e.getMessage());
            return false;
        }
    }

    @SuppressWarnings("unchecked")
    public String generateBrief(List<String> headlines, String briefType) {
        String safeType = ALLOWED_TYPES.contains(briefType) ? briefType : "world";
        String activeModel = getModel();

        StringBuilder headlineList = new StringBuilder();
        for (String h : headlines) {
            headlineList.append("- ").append(h).append("\n");
        }

        String capitalised = safeType.substring(0, 1).toUpperCase() + safeType.substring(1);
        String prompt;
        if ("gold".equals(safeType)) {
            prompt = String.format(
                "You are a senior gold market intelligence analyst. Given these recent headlines, " +
                "write a concise 3-paragraph Gold Intelligence Brief covering:\n" +
                "1. Impact on gold prices and market sentiment (safe-haven demand, USD correlation, rate expectations).\n" +
                "2. Geopolitical and macroeconomic risks relevant to gold (conflicts near mining regions, central bank buying, inflation signals).\n" +
                "3. Mining & supply outlook (disruptions, major producer news, output forecasts).\n" +
                "Headlines:\n%2$s\n" +
                "Write in the style of a professional gold market intelligence briefing. Be factual, concise, and focus exclusively on gold-relevant implications.",
                capitalised, headlineList);
        } else {
            prompt = String.format(
                "You are a geopolitical intelligence analyst. Given these recent headlines, " +
                "write a concise 3-paragraph \"%s Brief\" summarizing the most significant global " +
                "developments, key themes, and any emerging risks.\nHeadlines:\n%s\n" +
                "Write in the style of a professional intelligence briefing. Be factual and concise.",
                capitalised, headlineList);
        }

        RestClient client = RestClient.create();
        Map<String, Object> body = Map.of(
                "model", activeModel,
                "prompt", prompt,
                "stream", false);

        log.info("🤖 Generating {} brief using model '{}'", capitalised, activeModel);

        Map<String, Object> result = client.post()
                .uri(ollamaHost + "/api/generate")
                .header("Content-Type", "application/json")
                .body(body)
                .retrieve()
                .body(Map.class);

        if (result == null || !result.containsKey("response")) {
            throw new RuntimeException("Empty response from Ollama");
        }
        return (String) result.get("response");
    }
}


