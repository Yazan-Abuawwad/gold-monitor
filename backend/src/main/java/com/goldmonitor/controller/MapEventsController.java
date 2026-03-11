package com.goldmonitor.controller;

import com.goldmonitor.dto.MapEventsResponse;
import com.goldmonitor.dto.MapEventsResponse.MapEventDto;
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
@RequestMapping("/api/map-events")
public class MapEventsController {

    private final JdbcTemplate jdbc;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public MapEventsController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private Bucket getBucket(String key) {
        return buckets.computeIfAbsent(key, k ->
                Bucket.builder()
                        .addLimit(Bandwidth.simple(60, Duration.ofMinutes(1)))
                        .build());
    }

    @GetMapping
    public MapEventsResponse getMapEvents(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String since,
            jakarta.servlet.http.HttpServletRequest request) {

        String clientKey = request.getRemoteAddr();
        if (!getBucket(clientKey).tryConsume(1)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Rate limit exceeded");
        }

        StringBuilder sql = new StringBuilder(
                "SELECT id, title, description, lat, lng, event_type, severity, source, occurred_at " +
                "FROM map_events WHERE 1=1");

        List<Object> params = new ArrayList<>();

        if (type != null) {
            sql.append(" AND event_type = ?");
            params.add(type);
        }

        if (severity != null) {
            sql.append(" AND severity = ?");
            params.add(severity);
        }

        if (since != null) {
            sql.append(" AND occurred_at >= ?");
            params.add(since);
        }

        sql.append(" ORDER BY occurred_at DESC");

        List<MapEventDto> events = jdbc.query(sql.toString(), params.toArray(), (rs, i) ->
                new MapEventDto(
                        rs.getLong("id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getDouble("lat"),
                        rs.getDouble("lng"),
                        rs.getString("event_type"),
                        rs.getString("severity"),
                        rs.getString("source"),
                        rs.getString("occurred_at")
                ));

        return new MapEventsResponse(events);
    }
}
