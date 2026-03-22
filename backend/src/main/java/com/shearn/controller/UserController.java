package com.shearn.controller;

import com.shearn.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * User Controller
 *
 * GET    /api/users/me              - Get my profile
 * PUT    /api/users/me              - Update my profile
 * PATCH  /api/users/me/location     - Update location
 * GET    /api/users/me/dashboard    - Provider dashboard stats
 * GET    /api/users/providers       - List all providers
 * GET    /api/users/providers/nearby - Nearby providers
 * GET    /api/users/{id}            - Public profile
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates,
                                           Authentication auth) {
        try {
            String userId = (String) auth.getPrincipal();
            return ResponseEntity.ok(userService.updateProfile(userId, updates));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/me/location")
    public ResponseEntity<?> updateLocation(@RequestBody Map<String, Object> body,
                                            Authentication auth) {
        try {
            String userId = (String) auth.getPrincipal();
            double lat = (double) body.get("latitude");
            double lng = (double) body.get("longitude");
            String city = (String) body.getOrDefault("city", null);
            return ResponseEntity.ok(userService.updateLocation(userId, lat, lng, city));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/me/dashboard")
    public ResponseEntity<?> getDashboard(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(userService.getProviderDashboard(userId));
    }

    @GetMapping("/providers")
    public ResponseEntity<?> getAllProviders(
            @RequestParam(required = false) String skill) {
        if (skill != null) {
            return ResponseEntity.ok(userService.getProvidersBySkill(skill));
        }
        return ResponseEntity.ok(userService.getAllProviders());
    }

    @GetMapping("/providers/nearby")
    public ResponseEntity<?> getNearbyProviders(@RequestParam double lat,
                                                @RequestParam double lng) {
        return ResponseEntity.ok(userService.getNearbyProviders(lat, lng));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPublicProfile(@PathVariable String id) {
        try {
            return ResponseEntity.ok(userService.getProfile(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
