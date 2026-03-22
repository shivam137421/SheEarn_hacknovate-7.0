package com.shearn.controller;

import com.shearn.service.SkillAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * AI Skill Analysis Controller
 *
 * POST /api/skills/analyze   - Submit skill for AI analysis
 * GET  /api/skills/my        - Get my analysis history
 */
@RestController
@RequestMapping("/api/skills")
public class SkillAnalysisController {

    @Autowired private SkillAnalysisService skillAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeSkill(@RequestBody Map<String, String> body,
                                          Authentication auth) {
        try {
            String userId   = (String) auth.getPrincipal();
            String category = body.getOrDefault("category", "OTHER");
            String imageUrl = body.getOrDefault("imageUrl", "");
            String info     = body.getOrDefault("additionalInfo", "");

            return ResponseEntity.ok(
                    skillAnalysisService.analyzeSkill(userId, category, imageUrl, info));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAnalyses(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(skillAnalysisService.getUserAnalyses(userId));
    }
}
