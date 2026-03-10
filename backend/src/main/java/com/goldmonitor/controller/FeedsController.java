package com.goldmonitor.controller;

import com.goldmonitor.dto.FeedsResponse;
import com.goldmonitor.dto.FeedsResponse.FeedItemDto;
import com.goldmonitor.dto.FeedsResponse.SourceDto;
import com.goldmonitor.service.RssService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/feeds")
public class FeedsController {

    private final JdbcTemplate jdbc;
    private final RssService rssService;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public FeedsController(JdbcTemplate jdbc, RssService rssService) {
        this.jdbc = jdbc;
        this.rssService = rssService;
    }

    private Bucket getBucket(String clientKey) {
        return buckets.computeIfAbsent(clientKey, k ->
                Bucket.builder()
                        .addLimit(Bandwidth.simple(60, Duration.ofMinutes(1)))
                        .build());
    }

    @GetMapping
    public FeedsResponse getFeeds(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) String source,
            jakarta.servlet.http.HttpServletRequest request) {

        String clientKey = request.getRemoteAddr();
        if (!getBucket(clientKey).tryConsume(1)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Rate limit exceeded");
        }

        StringBuilder sql = new StringBuilder("""
                SELECT fi.id, fi.title, fi.description, fi.url, fi.published_at, fi.category, fi.fetched_at,
                       s.id as source_id, s.name as source_name
                FROM feed_items fi
                JOIN sources s ON fi.source_id = s.id
                WHERE 1=1
                """);

        List<Object> params = new ArrayList<>();

        if (category != null && !category.equals("all")) {
            sql.append(" AND fi.category = ?");
            params.add(category);
        }

        if (source != null) {
            sql.append(" AND s.name = ?");
            params.add(source);
        }

        sql.append(" ORDER BY CASE WHEN fi.published_at IS NULL THEN 1 ELSE 0 END, fi.published_at DESC, fi.fetched_at DESC LIMIT ?");
        params.add(Math.min(limit, 200));

        List<FeedItemDto> items = jdbc.query(sql.toString(), params.toArray(), (rs, i) ->
                new FeedItemDto(
                        rs.getLong("id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getString("url"),
                        rs.getString("published_at"),
                        rs.getString("category"),
                        rs.getString("fetched_at"),
                        new SourceDto(rs.getLong("source_id"), rs.getString("source_name"))
                ));

        List<String> sourceNames = items.stream()
                .map(it -> it.getSource().getName())
                .distinct()
                .toList();

        return new FeedsResponse(items, sourceNames, rssService.getLastFetchTime());
    }
}
