package com.goldmonitor.model;

public class AiBrief {
    private Long id;
    private String briefType;
    private String content;
    private String headlinesUsed;
    private String modelUsed;
    private String generatedAt;

    public AiBrief() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBriefType() { return briefType; }
    public void setBriefType(String briefType) { this.briefType = briefType; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getHeadlinesUsed() { return headlinesUsed; }
    public void setHeadlinesUsed(String headlinesUsed) { this.headlinesUsed = headlinesUsed; }

    public String getModelUsed() { return modelUsed; }
    public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }

    public String getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(String generatedAt) { this.generatedAt = generatedAt; }
}
