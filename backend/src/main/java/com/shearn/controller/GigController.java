package com.shearn.controller;

import com.shearn.dto.GigDto.*;
import com.shearn.service.GigService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * Gig Controller - Micro-Gig Marketplace APIs
 *
 * PUBLIC:
 *   GET  /api/gigs/public          - Browse all open gigs
 *   GET  /api/gigs/urgent          - Get urgent gigs
 *   GET  /api/gigs/public/{id}     - Get single gig
 *   GET  /api/gigs/public/category/{cat} - Filter by category
 *
 * AUTHENTICATED:
 *   POST   /api/gigs               - Post new gig (customer)
 *   GET    /api/gigs/my            - My gigs (customer or provider)
 *   POST   /api/gigs/{id}/accept   - Accept gig (woman provider)
 *   PATCH  /api/gigs/{id}/start    - Start gig
 *   PATCH  /api/gigs/{id}/complete - Complete gig
 *   POST   /api/gigs/{id}/review   - Leave review
 *   GET    /api/gigs/nearby        - Get nearby gigs (location-based)
 */
@RestController
@RequestMapping("/api/gigs")
public class GigController {

    @Autowired private GigService gigService;

    // ---- PUBLIC ENDPOINTS ----

    @GetMapping("/public")
    public ResponseEntity<?> getAllOpenGigs() {
        return ResponseEntity.ok(gigService.getOpenGigs());
    }

    @GetMapping("/urgent")
    public ResponseEntity<?> getUrgentGigs() {
        return ResponseEntity.ok(gigService.getUrgentGigs());
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?> getGigById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(gigService.getGigById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/public/category/{category}")
    public ResponseEntity<?> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(gigService.getGigsByCategory(category));
    }

    // ---- AUTHENTICATED ENDPOINTS ----

    @PostMapping
    public ResponseEntity<?> createGig(@Valid @RequestBody CreateGigRequest request,
                                       Authentication auth) {
        try {
            String userId = (String) auth.getPrincipal();
            return ResponseEntity.ok(gigService.createGig(request, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyGigs(Authentication auth,
                                        @RequestParam(defaultValue = "customer") String view) {
        String userId = (String) auth.getPrincipal();
        if ("provider".equals(view)) {
            return ResponseEntity.ok(gigService.getProviderGigs(userId));
        }
        return ResponseEntity.ok(gigService.getCustomerGigs(userId));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptGig(@PathVariable String id, Authentication auth) {
        try {
            String userId = (String) auth.getPrincipal();
            return ResponseEntity.ok(gigService.acceptGig(id, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/start")
    public ResponseEntity<?> startGig(@PathVariable String id, Authentication auth) {
        try {
            String userId = (String) auth.getPrincipal();
            return ResponseEntity.ok(gigService.startGig(id, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> completeGig(@PathVariable String id, Authentication auth) {
        try {
            String userId = (String) auth.getPrincipal();
            return ResponseEntity.ok(gigService.completeGig(id, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<?> reviewGig(@PathVariable String id,
                                       @Valid @RequestBody ReviewRequest request,
                                       Authentication auth) {
        try {
            String userId = (String) auth.getPrincipal();
            return ResponseEntity.ok(gigService.reviewGig(id, request, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyGigs(@RequestParam double lat,
                                           @RequestParam double lng) {
        return ResponseEntity.ok(gigService.getNearbyGigs(lat, lng));
    }
}
