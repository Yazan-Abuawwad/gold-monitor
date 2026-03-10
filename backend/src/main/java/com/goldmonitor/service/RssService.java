package com.goldmonitor.service;

import com.goldmonitor.model.Source;
import com.goldmonitor.model.FeedItem;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RssService {

    private static final Logger log = LoggerFactory.getLogger(RssService.class);
    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_INSTANT;

    private final JdbcTemplate jdbc;
    private volatile String lastFetchTime = null;

    public RssService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Scheduled(fixedDelayString = "900000", initialDelayString = "5000")
    public void fetchAndCacheFeeds() {
        log.info("🔄 Refreshing RSS feeds...");
        List<Source> sources = jdbc.query(
                "SELECT id, name, url, category FROM sources WHERE enabled = 1",
                (rs, i) -> {
                    Source s = new Source();
                    s.setId(rs.getLong("id"));
                    s.setName(rs.getString("name"));
                    s.setUrl(rs.getString("url"));
                    s.setCategory(rs.getString("category"));
                    return s;
                });

        for (Source source : sources) {
            try {
                SyndFeedInput input = new SyndFeedInput();
                SyndFeed feed = input.build(new XmlReader(new URL(source.getUrl())));

                int count = 0;
                for (SyndEntry entry : feed.getEntries()) {
                    if (count >= 20) break;
                    String title = entry.getTitle() != null ? entry.getTitle() : "";
                    String description = entry.getDescription() != null
                            ? entry.getDescription().getValue() : "";
                    String url = entry.getLink();
                    String pubDate = entry.getPublishedDate() != null
                            ? entry.getPublishedDate().toInstant().atOffset(ZoneOffset.UTC)
                                    .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
                            : null;

                    jdbc.update(
                            "INSERT OR IGNORE INTO feed_items (source_id, title, description, url, published_at, category) VALUES (?, ?, ?, ?, ?, ?)",
                            source.getId(), title, description, url, pubDate, source.getCategory());
                    count++;
                }
                log.info("✅ Fetched {} items from {}", count, source.getName());
            } catch (Exception e) {
                log.error("❌ Failed to fetch feed from {}: {}", source.getName(), e.getMessage());
            }
        }

        lastFetchTime = Instant.now().atOffset(ZoneOffset.UTC).format(ISO);
    }

    public String getLastFetchTime() {
        if (lastFetchTime != null) return lastFetchTime;
        // Fall back to DB
        try {
            return jdbc.queryForObject(
                    "SELECT MAX(fetched_at) FROM feed_items", String.class);
        } catch (Exception e) {
            return null;
        }
    }
}
