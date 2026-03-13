package com.goldmonitor.controller;

import com.goldmonitor.dto.AiBriefRequest;
import com.goldmonitor.dto.AiBriefResponse;
import com.goldmonitor.service.OllamaService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/ai-brief")
public class AiBriefController {

    private static final Logger log = LoggerFactory.getLogger(AiBriefController.class);
    private static final int CACHE_DURATION_HOURS = 2;

    private final JdbcTemplate jdbc;
    private final OllamaService ollamaService;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public AiBriefController(JdbcTemplate jdbc, OllamaService ollamaService) {
        this.jdbc = jdbc;
        this.ollamaService = ollamaService;
    }

    private Bucket getBucket(String key) {
        return buckets.computeIfAbsent(key, k ->
                Bucket.builder()
                        .addLimit(Bandwidth.simple(10, Duration.ofMinutes(1)))
                        .build());
    }

    @PostMapping
    public AiBriefResponse generateBrief(
            @RequestBody AiBriefRequest req,
            jakarta.servlet.http.HttpServletRequest request) {

        String clientKey = request.getRemoteAddr();
        if (!getBucket(clientKey).tryConsume(1)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Rate limit exceeded");
        }

        String briefType = req.getBriefType() != null ? req.getBriefType() : "world";
        List<String> headlines = req.getHeadlines() != null ? req.getHeadlines() : List.of();

        // Check cache
        List<Map<String, Object>> rows = jdbc.queryForList(
                "SELECT content, model_used, generated_at::text FROM ai_briefs " +
                "WHERE brief_type = ? " +
                "AND generated_at > NOW() - (? || ' hours')::INTERVAL " +
                "ORDER BY generated_at DESC LIMIT 1",
                briefType, CACHE_DURATION_HOURS);

        if (!rows.isEmpty()) {
            Map<String, Object> cached = rows.get(0);
            return new AiBriefResponse(
                    (String) cached.get("content"),
                    (String) cached.get("model_used"),
                    (String) cached.get("generated_at"),
                    true, null);
        }

        // Check Ollama availability
        if (!ollamaService.checkHealth()) {
            return new AiBriefResponse(
                    null, ollamaService.getModel(), Instant.now().toString(), false,
                    "LLM service unavailable — configure OLLAMA_HOST in your environment");
        }

        try {
            List<String> toUse = headlines.stream().limit(20).toList();
            String brief = ollamaService.generateBrief(toUse, briefType);
            String now = Instant.now().toString();

            // Build JSON array of headlines
            StringBuilder jsonArr = new StringBuilder("[");
            for (int i = 0; i < toUse.size(); i++) {
                if (i > 0) jsonArr.append(",");
                jsonArr.append("\"").append(toUse.get(i)
                        .replace("\\", "\\\\")
                        .replace("\"", "\\\"")).append("\"");
            }
            jsonArr.append("]");

            jdbc.update(
                    "INSERT INTO ai_briefs (brief_type, content, headlines_used, model_used) VALUES (?, ?, ?, ?)",
                    briefType, brief, jsonArr.toString(), ollamaService.getModel());

            return new AiBriefResponse(brief, ollamaService.getModel(), now, false, null);

        } catch (Exception e) {
            log.error("Error generating AI brief: {}", e.getMessage(), e);
            return new AiBriefResponse(
                    null, ollamaService.getModel(), Instant.now().toString(), false,
                    "Failed to generate brief. Please try again.");
        }
    }
}
