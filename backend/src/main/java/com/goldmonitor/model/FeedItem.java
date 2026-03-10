package com.goldmonitor.model;

public class FeedItem {
    private Long id;
    private Long sourceId;
    private String title;
    private String description;
    private String url;
    private String publishedAt;
    private String category;
    private String fetchedAt;
    private String sourceName;

    public FeedItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getPublishedAt() { return publishedAt; }
    public void setPublishedAt(String publishedAt) { this.publishedAt = publishedAt; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getFetchedAt() { return fetchedAt; }
    public void setFetchedAt(String fetchedAt) { this.fetchedAt = fetchedAt; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }
}
