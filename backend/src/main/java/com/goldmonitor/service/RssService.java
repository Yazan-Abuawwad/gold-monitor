package com.goldmonitor.service;

import com.goldmonitor.model.Source;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RssService {

    private static final Logger log = LoggerFactory.getLogger(RssService.class);
    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_INSTANT;

    // Mimic a real browser so sites don't block with 403
    private static final String USER_AGENT =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) " +
            "Chrome/122.0.0.0 Safari/537.36";

    private final JdbcTemplate jdbc;
    private volatile String lastFetchTime = null;

    public RssService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /** Open an RSS/Atom URL with proper headers to avoid 403s. */
    private SyndFeed fetchFeed(String urlStr) throws Exception {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(10_000);
        conn.setReadTimeout(15_000);
        conn.setRequestProperty("User-Agent", USER_AGENT);
        conn.setRequestProperty("Accept",
                "application/rss+xml, application/atom+xml, application/xml, text/xml, */*");
        conn.setRequestProperty("Accept-Language", "en-US,en;q=0.9");
        conn.setRequestProperty("Accept-Encoding", "identity"); // avoid gzip complications
        conn.setInstanceFollowRedirects(true);

        int status = conn.getResponseCode();
        if (status == HttpURLConnection.HTTP_MOVED_PERM
                || status == HttpURLConnection.HTTP_MOVED_TEMP
                || status == 307 || status == 308) {
            String newUrl = conn.getHeaderField("Location");
            conn.disconnect();
            return fetchFeed(newUrl);  // follow redirect manually if needed
        }
        if (status < 200 || status >= 300) {
            conn.disconnect();
            throw new RuntimeException("HTTP " + status + " from " + urlStr);
        }

        try (InputStream is = conn.getInputStream()) {
            SyndFeedInput input = new SyndFeedInput();
            input.setAllowDoctypes(true);
            return input.build(new XmlReader(is));
        } finally {
            conn.disconnect();
        }
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
                SyndFeed feed = fetchFeed(source.getUrl());

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
                            "INSERT INTO feed_items (source_id, title, description, url, published_at, category) " +
                            "VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (url) DO NOTHING",
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
                    "SELECT MAX(fetched_at)::text FROM feed_items", String.class);
        } catch (Exception e) {
            return null;
        }
    }
}
