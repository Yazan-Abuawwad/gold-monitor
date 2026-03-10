package com.goldmonitor.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class SeedService {

    private static final Logger log = LoggerFactory.getLogger(SeedService.class);

    private static final List<Object[]> SAMPLE_EVENTS = List.of(
        new Object[]{"Ukraine-Russia Conflict Zone",
            "Ongoing military operations in eastern Ukraine. Frontline activity reported near Zaporizhzhia.",
            48.37, 31.16, "conflict", "critical", "Defense Monitor"},
        new Object[]{"Middle East Tensions — West Bank",
            "Heightened security operations in the West Bank. Multiple incidents reported.",
            31.77, 35.21, "conflict", "high", "Al Jazeera"},
        new Object[]{"Taiwan Strait Activity",
            "PLA naval exercises reported near the Taiwan Strait. Regional tensions elevated.",
            25.04, 121.56, "military", "high", "Reuters"},
        new Object[]{"Sudan — Khartoum Conflict",
            "Ongoing armed conflict between SAF and RSF forces in and around Khartoum.",
            15.55, 32.53, "conflict", "critical", "BBC World"},
        new Object[]{"South China Sea Dispute",
            "Territorial disputes continue in the South China Sea. Naval patrols increased.",
            14.5, 114.0, "military", "high", "Reuters"},
        new Object[]{"North Korea — Missile Activity",
            "Satellite imagery suggests increased activity at North Korean missile facilities.",
            39.0, 127.5, "military", "high", "Defense News"},
        new Object[]{"India-Pakistan Border Tension",
            "Cross-border incidents reported along the Line of Control in Kashmir.",
            30.37, 73.06, "conflict", "medium", "Reuters"},
        new Object[]{"Venezuela — Political Unrest",
            "Post-election political crisis continues. International pressure mounting on Maduro government.",
            10.48, -66.87, "political", "medium", "AP News"},
        new Object[]{"Syria — Ongoing Instability",
            "Continued instability in northern Syria. Drone strikes reported near Aleppo.",
            33.51, 36.29, "conflict", "high", "Al Jazeera"},
        new Object[]{"Ethiopia — Tigray Region",
            "Humanitarian situation remains dire in the Tigray region. Aid access limited.",
            14.03, 38.74, "humanitarian", "medium", "BBC World"},
        new Object[]{"Iran — Nuclear Tensions",
            "IAEA reports accelerated uranium enrichment activities at Natanz facility.",
            33.69, 51.42, "political", "high", "Reuters"},
        new Object[]{"Myanmar — Civil War",
            "Resistance forces gain ground in Shan State. Military junta intensifies airstrikes.",
            19.76, 96.08, "conflict", "high", "BBC World"},
        new Object[]{"Haiti — Gang Violence",
            "Gang violence paralyzes Port-au-Prince. International security mission deployment delayed.",
            18.54, -72.34, "security", "critical", "AP News"},
        new Object[]{"Niger — Political Crisis",
            "Military junta expels French forces. Regional ECOWAS tensions remain elevated.",
            13.51, 2.12, "political", "medium", "The Guardian World"},
        new Object[]{"Gaza — Humanitarian Crisis",
            "Severe humanitarian crisis continues. International aid efforts face access challenges.",
            31.35, 34.31, "humanitarian", "critical", "Al Jazeera"},
        new Object[]{"Red Sea — Shipping Disruptions",
            "Houthi attacks continue to disrupt Red Sea shipping lanes. Rerouting via Cape of Good Hope.",
            15.55, 42.55, "security", "high", "Reuters"}
    );

    private final JdbcTemplate jdbc;

    public SeedService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @PostConstruct
    public void seedMapEvents() {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM map_events", Integer.class);
        if (count != null && count > 0) {
            log.info("ℹ️  Map events already seeded ({} events). Skipping.", count);
            return;
        }

        for (Object[] ev : SAMPLE_EVENTS) {
            jdbc.update(
                "INSERT INTO map_events (title, description, lat, lng, event_type, severity, source) VALUES (?, ?, ?, ?, ?, ?, ?)",
                ev[0], ev[1], ev[2], ev[3], ev[4], ev[5], ev[6]);
        }
        log.info("✅ Seeded {} map events", SAMPLE_EVENTS.size());
    }
}
