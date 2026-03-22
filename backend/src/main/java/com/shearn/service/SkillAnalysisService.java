package com.shearn.service;

import com.shearn.model.SkillAnalysis;
import com.shearn.model.User;
import com.shearn.repository.SkillAnalysisRepository;
import com.shearn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

/**
 * AI Skill Analysis Service
 * Uses rule-based mock AI logic to analyze skill categories and return:
 * - Skill level (Beginner / Intermediate / Advanced)
 * - Price range suggestions
 * - Strengths and improvement tips
 * - Market demand
 *
 * In production, this can be replaced with a real ML model or external AI API.
 */
@Service
public class SkillAnalysisService {

    @Autowired private SkillAnalysisRepository skillAnalysisRepository;
    @Autowired private UserRepository userRepository;

    // Rule-based knowledge base per skill category
    private static final Map<String, SkillProfile> SKILL_PROFILES = new HashMap<>();

    static {
        SKILL_PROFILES.put("COOKING", new SkillProfile(
            List.of("Food presentation quality", "Recipe diversity", "Hygiene standards", "Use of spices"),
            new String[]{"150", "300", "600"},   // min prices per level (₹/hr)
            new String[]{"250", "500", "1000"},  // max prices per level
            "HIGH",
            List.of("Learn regional cuisines", "Try baking", "Get a food hygiene certificate", "Explore fusion cooking")
        ));
        SKILL_PROFILES.put("STITCHING", new SkillProfile(
            List.of("Stitch precision", "Pattern complexity", "Fabric knowledge", "Design creativity"),
            new String[]{"120", "250", "500"},
            new String[]{"200", "450", "900"},
            "HIGH",
            List.of("Learn embroidery", "Practice zardosi work", "Try blouse designing", "Learn machine stitching")
        ));
        SKILL_PROFILES.put("TEACHING", new SkillProfile(
            List.of("Subject knowledge depth", "Explanation clarity", "Student engagement", "Material preparation"),
            new String[]{"200", "400", "800"},
            new String[]{"350", "700", "1500"},
            "HIGH",
            List.of("Get certified in your subject", "Try online tutoring", "Learn digital teaching tools", "Build a curriculum")
        ));
        SKILL_PROFILES.put("BEAUTY", new SkillProfile(
            List.of("Technique precision", "Product knowledge", "Hygiene", "Client satisfaction"),
            new String[]{"150", "300", "600"},
            new String[]{"300", "600", "1200"},
            "HIGH",
            List.of("Learn latest beauty trends", "Get bridal makeup certified", "Try nail art", "Learn hair styling")
        ));
        SKILL_PROFILES.put("CRAFTS", new SkillProfile(
            List.of("Creative design", "Material quality", "Finishing", "Originality"),
            new String[]{"100", "200", "400"},
            new String[]{"200", "400", "800"},
            "MEDIUM",
            List.of("Sell on craft marketplaces", "Try DIY decoration", "Learn resin art", "Explore pottery")
        ));
        SKILL_PROFILES.put("CLEANING", new SkillProfile(
            List.of("Thoroughness", "Time efficiency", "Product knowledge", "Client trust"),
            new String[]{"100", "180", "300"},
            new String[]{"180", "300", "500"},
            "MEDIUM",
            List.of("Learn deep cleaning techniques", "Get background verified", "Learn eco-friendly products", "Try office cleaning")
        ));
        SKILL_PROFILES.put("OTHER", new SkillProfile(
            List.of("Work quality", "Client communication", "Reliability", "Creativity"),
            new String[]{"100", "200", "400"},
            new String[]{"200", "400", "800"},
            "MEDIUM",
            List.of("Build a portfolio", "Get reviews from clients", "Join skill platforms", "Consider formal training")
        ));
    }

    /**
     * Analyze skill based on category and optional metadata.
     * Mock AI logic: uses deterministic scoring with slight randomness for realism.
     */
    public SkillAnalysis analyzeSkill(String userId, String skillCategory,
                                      String imageUrl, String additionalInfo) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SkillProfile profile = SKILL_PROFILES.getOrDefault(
                skillCategory.toUpperCase(), SKILL_PROFILES.get("OTHER"));

        // Simulate AI analysis with rule-based scoring
        // In real app: send image to ML model / vision API
        int levelIndex = mockDetermineLevel(userId, skillCategory);
        String[] levels = {"BEGINNER", "INTERMEDIATE", "ADVANCED"};
        String skillLevel = levels[levelIndex];

        // Build analysis result
        SkillAnalysis analysis = new SkillAnalysis();
        analysis.setUserId(userId);
        analysis.setUserName(user.getName());
        analysis.setSkillCategory(skillCategory.toUpperCase());
        analysis.setImageUrl(imageUrl);
        analysis.setFileType("IMAGE");
        analysis.setSkillLevel(skillLevel);
        analysis.setConfidence(0.72 + (levelIndex * 0.08)); // 72%-88%
        analysis.setMinPrice("₹" + profile.minPrices[levelIndex]);
        analysis.setMaxPrice("₹" + profile.maxPrices[levelIndex]);
        analysis.setOverallScore((5.5 + levelIndex * 1.5) + "/10");
        analysis.setMarketDemand(profile.marketDemand);

        // Strengths: pick random 2-3 from category strengths
        List<String> strengths = new ArrayList<>(profile.strengths);
        Collections.shuffle(strengths);
        analysis.setStrengths(strengths.subList(0, Math.min(3, strengths.size())));

        // Suggestions: pick 2 improvement tips
        List<String> suggestions = new ArrayList<>(profile.suggestions);
        Collections.shuffle(suggestions);
        analysis.setSuggestions(suggestions.subList(0, Math.min(2, suggestions.size())));

        SkillAnalysis saved = skillAnalysisRepository.save(analysis);

        // Update user's skill list
        List<String> userSkills = user.getSkills() != null ? new ArrayList<>(user.getSkills()) : new ArrayList<>();
        if (!userSkills.contains(skillCategory.toUpperCase())) {
            userSkills.add(skillCategory.toUpperCase());
            user.setSkills(userSkills);
            userRepository.save(user);
        }

        return saved;
    }

    /** Get all analyses for a user */
    public List<SkillAnalysis> getUserAnalyses(String userId) {
        return skillAnalysisRepository.findByUserIdOrderByAnalyzedAtDesc(userId);
    }

    /**
     * Mock level determination:
     * Uses hash of userId + category for determinism (same user gets same level),
     * biased toward intermediate for realism.
     */
    private int mockDetermineLevel(String userId, String category) {
        int hash = Math.abs((userId + category).hashCode());
        int mod = hash % 10;
        if (mod <= 2) return 0;      // 30% Beginner
        else if (mod <= 7) return 1; // 50% Intermediate
        else return 2;               // 20% Advanced
    }

    // Inner class: skill knowledge profile
    static class SkillProfile {
        List<String> strengths;
        String[] minPrices;
        String[] maxPrices;
        String marketDemand;
        List<String> suggestions;

        SkillProfile(List<String> strengths, String[] minPrices, String[] maxPrices,
                     String marketDemand, List<String> suggestions) {
            this.strengths = strengths;
            this.minPrices = minPrices;
            this.maxPrices = maxPrices;
            this.marketDemand = marketDemand;
            this.suggestions = suggestions;
        }
    }
}
