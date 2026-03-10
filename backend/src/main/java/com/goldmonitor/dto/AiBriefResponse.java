package com.goldmonitor.dto;

public class AiBriefResponse {
    private String brief;
    private String model;
    private String generatedAt;
    private boolean cached;
    private String error;

    public AiBriefResponse() {}

    public AiBriefResponse(String brief, String model, String generatedAt, boolean cached, String error) {
        this.brief = brief;
        this.model = model;
        this.generatedAt = generatedAt;
        this.cached = cached;
        this.error = error;
    }

    public String getBrief() { return brief; }
    public void setBrief(String brief) { this.brief = brief; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(String generatedAt) { this.generatedAt = generatedAt; }

    public boolean isCached() { return cached; }
    public void setCached(boolean cached) { this.cached = cached; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
