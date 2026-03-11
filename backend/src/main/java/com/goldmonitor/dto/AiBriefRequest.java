package com.goldmonitor.dto;

import java.util.List;

public class AiBriefRequest {
    private String briefType = "world";
    private List<String> headlines = List.of();

    public String getBriefType() { return briefType; }
    public void setBriefType(String briefType) { this.briefType = briefType; }

    public List<String> getHeadlines() { return headlines; }
    public void setHeadlines(List<String> headlines) { this.headlines = headlines; }
}
