package com.goldmonitor.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class OllamaService {

    private static final Logger log = LoggerFactory.getLogger(OllamaService.class);
    private static final Set<String> ALLOWED_TYPES =
            Set.of("world", "security", "political", "humanitarian", "military", "economic");

    @Value("${ollama.host}")
    private String ollamaHost;

    @Value("${ollama.model}")
    private String ollamaModel;

    public String getModel() {
        return ollamaModel;
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
        StringBuilder headlineList = new StringBuilder();
        for (String h : headlines) {
            headlineList.append("- ").append(h).append("\n");
        }

        String capitalised = safeType.substring(0, 1).toUpperCase() + safeType.substring(1);
        String prompt = String.format(
                "You are a geopolitical intelligence analyst. Given these recent headlines, " +
                "write a concise 3-paragraph \"%s Brief\" summarizing the most significant global " +
                "developments, key themes, and any emerging risks.\nHeadlines:\n%s\n" +
                "Write in the style of a professional intelligence briefing. Be factual and concise.",
                capitalised, headlineList);

        RestClient client = RestClient.create();
        Map<String, Object> body = Map.of(
                "model", ollamaModel,
                "prompt", prompt,
                "stream", false);

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
