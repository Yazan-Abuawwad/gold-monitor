package com.goldmonitor.dto;

import java.util.List;

public class MapEventsResponse {
    private List<MapEventDto> events;

    public MapEventsResponse(List<MapEventDto> events) {
        this.events = events;
    }

    public List<MapEventDto> getEvents() { return events; }

    public static class MapEventDto {
        private Long id;
        private String title;
        private String description;
        private double lat;
        private double lng;
        private String type;
        private String severity;
        private String source;
        private String occurredAt;

        public MapEventDto(Long id, String title, String description, double lat, double lng,
                           String type, String severity, String source, String occurredAt) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.lat = lat;
            this.lng = lng;
            this.type = type;
            this.severity = severity;
            this.source = source;
            this.occurredAt = occurredAt;
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public double getLat() { return lat; }
        public double getLng() { return lng; }
        public String getType() { return type; }
        public String getSeverity() { return severity; }
        public String getSource() { return source; }
        public String getOccurredAt() { return occurredAt; }
    }
}
