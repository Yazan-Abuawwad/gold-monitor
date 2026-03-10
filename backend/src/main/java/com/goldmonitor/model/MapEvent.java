package com.goldmonitor.model;

public class MapEvent {
    private Long id;
    private String title;
    private String description;
    private double lat;
    private double lng;
    private String eventType;
    private String severity;
    private String source;
    private String occurredAt;
    private String createdAt;

    public MapEvent() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getOccurredAt() { return occurredAt; }
    public void setOccurredAt(String occurredAt) { this.occurredAt = occurredAt; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
