package com.shearn.service;

import com.shearn.model.User;
import com.shearn.repository.GigRepository;
import com.shearn.repository.ReviewRepository;
import com.shearn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

/**
 * User Service - profile updates, provider discovery, dashboard stats
 */
@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private GigRepository gigRepository;
    @Autowired private ReviewRepository reviewRepository;

    /** Get user profile by ID */
    public User getProfile(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /** Update user profile */
    public User updateProfile(String userId, Map<String, Object> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("name"))             user.setName((String) updates.get("name"));
        if (updates.containsKey("phone"))            user.setPhone((String) updates.get("phone"));
        if (updates.containsKey("bio"))              user.setBio((String) updates.get("bio"));
        if (updates.containsKey("city"))             user.setCity((String) updates.get("city"));
        if (updates.containsKey("address"))          user.setAddress((String) updates.get("address"));
        if (updates.containsKey("emergencyContact")) user.setEmergencyContact((String) updates.get("emergencyContact"));
        if (updates.containsKey("emergencyPhone"))   user.setEmergencyPhone((String) updates.get("emergencyPhone"));
        if (updates.containsKey("profileImageUrl"))  user.setProfileImageUrl((String) updates.get("profileImageUrl"));

        // Update location
        if (updates.containsKey("latitude"))  user.setLatitude((double) updates.get("latitude"));
        if (updates.containsKey("longitude")) user.setLongitude((double) updates.get("longitude"));

        return userRepository.save(user);
    }

    /** Update user's location */
    public User updateLocation(String userId, double latitude, double longitude, String city) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLatitude(latitude);
        user.setLongitude(longitude);
        if (city != null) user.setCity(city);
        return userRepository.save(user);
    }

    /** Get nearby service providers (women) */
    public List<User> getNearbyProviders(double lat, double lng) {
        double delta = 0.15; // ~15km radius
        return userRepository.findNearbyProviders(
                lat - delta, lat + delta, lng - delta, lng + delta);
    }

    /** Get dashboard stats for a woman provider */
    public Map<String, Object> getProviderDashboard(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long activeGigs    = gigRepository.countByProviderIdAndStatus(userId, "IN_PROGRESS");
        long completedGigs = gigRepository.countByProviderIdAndStatus(userId, "COMPLETED");
        long assignedGigs  = gigRepository.countByProviderIdAndStatus(userId, "ASSIGNED");
        var reviews        = reviewRepository.findByProviderId(userId);

        return Map.of(
            "totalEarnings",  user.getTotalEarnings(),
            "completedJobs",  user.getCompletedJobs(),
            "rating",         user.getRating(),
            "totalReviews",   user.getTotalReviews(),
            "activeGigs",     activeGigs,
            "assignedGigs",   assignedGigs,
            "isVerified",     user.isVerified(),
            "recentReviews",  reviews.stream().limit(5).toList()
        );
    }

    /** Get all verified women providers (for discovery) */
    public List<User> getAllProviders() {
        return userRepository.findByRole("WOMAN");
    }

    /** Get providers by skill */
    public List<User> getProvidersBySkill(String skill) {
        return userRepository.findBySkill(skill);
    }
}
