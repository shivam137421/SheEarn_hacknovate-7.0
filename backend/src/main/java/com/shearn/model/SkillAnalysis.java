package com.shearn.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

/**
 * SkillAnalysis model - stores AI analysis results for uploaded work samples
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "skill_analyses")
public class SkillAnalysis {

    @Id
    private String id;

    private String userId;
    private String userName;

    // Uploaded work sample
    private String imageUrl;
    private String fileType; // "IMAGE", "VIDEO"
    private String skillCategory; // "COOKING", "STITCHING", "TEACHING", etc.

    // AI Analysis Results (mock/rule-based)
    private String skillLevel;       // "BEGINNER", "INTERMEDIATE", "ADVANCED"
    private double confidence;       // 0.0 to 1.0
    private String minPrice;         // suggested min price per hour
    private String maxPrice;         // suggested max price per hour
    private List<String> strengths;  // identified strong points
    private List<String> suggestions; // improvement tips
    private String overallScore;     // e.g. "7.5/10"
    private String marketDemand;     // "LOW", "MEDIUM", "HIGH"

    private LocalDateTime analyzedAt = LocalDateTime.now();
}
