package com.goldmonitor.dto;

import java.util.List;

public class FeedsResponse {
    private List<FeedItemDto> items;
    private List<String> sources;
    private String lastUpdated;

    public FeedsResponse(List<FeedItemDto> items, List<String> sources, String lastUpdated) {
        this.items = items;
        this.sources = sources;
        this.lastUpdated = lastUpdated;
    }

    public List<FeedItemDto> getItems() { return items; }
    public List<String> getSources() { return sources; }
    public String getLastUpdated() { return lastUpdated; }

    public static class FeedItemDto {
        private Long id;
        private String title;
        private String description;
        private String url;
        private String publishedAt;
        private String category;
        private String fetchedAt;
        private SourceDto source;

        public FeedItemDto(Long id, String title, String description, String url,
                           String publishedAt, String category, String fetchedAt, SourceDto source) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.url = url;
            this.publishedAt = publishedAt;
            this.category = category;
            this.fetchedAt = fetchedAt;
            this.source = source;
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getUrl() { return url; }
        public String getPublishedAt() { return publishedAt; }
        public String getCategory() { return category; }
        public String getFetchedAt() { return fetchedAt; }
        public SourceDto getSource() { return source; }
    }

    public static class SourceDto {
        private Long id;
        private String name;

        public SourceDto(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
    }
}
