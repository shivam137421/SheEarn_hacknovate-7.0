package com.shearn.controller;

import com.shearn.service.SosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * SOS Safety Controller
 *
 * POST  /api/sos/trigger       - Trigger emergency SOS alert
 * PATCH /api/sos/{id}/resolve  - Mark alert as resolved
 * GET   /api/sos/my            - Get my SOS history
 */
@RestController
@RequestMapping("/api/sos")
public class SosController {

    @Autowired private SosService sosService;

    @PostMapping("/trigger")
    public ResponseEntity<?> triggerSos(@RequestBody Map<String, Object> body,
                                        Authentication auth) {
        try {
            String userId = (String) auth.getPrincipal();
            double lat    = body.containsKey("latitude")  ? (double) body.get("latitude")  : 0.0;
            double lng    = body.containsKey("longitude") ? (double) body.get("longitude") : 0.0;
            String loc    = (String) body.getOrDefault("locationDescription", "");
            String msg    = (String) body.getOrDefault("message", "Emergency! I need help.");

            return ResponseEntity.ok(sosService.triggerSos(userId, lat, lng, loc, msg));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<?> resolveSos(@PathVariable String id, Authentication auth) {
        try {
            String userId = (String) auth.getPrincipal();
            return ResponseEntity.ok(sosService.resolveSos(id, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAlerts(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(sosService.getUserAlerts(userId));
    }
}
