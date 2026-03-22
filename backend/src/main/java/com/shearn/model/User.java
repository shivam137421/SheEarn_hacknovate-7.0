package com.shearn.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.List;

/**
 * User model - supports both Women (providers) and Customers (seekers)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password; // BCrypt hashed

    private String name;

    private String phone;

    // "WOMAN" = service provider, "CUSTOMER" = service seeker
    private String role;

    // Profile info
    private String bio;
    private String profileImageUrl;
    private List<String> skills; // e.g. ["cooking", "stitching", "teaching"]

    // Location (lat/lng for geo-matching)
    private double latitude;
    private double longitude;
    private String city;
    private String address;

    // Verification & safety
    private boolean isVerified = false;
    private String verificationStatus; // "PENDING", "VERIFIED", "REJECTED"

    // Stats
    private double rating = 0.0;
    private int totalReviews = 0;
    private double totalEarnings = 0.0;
    private int completedJobs = 0;

    // Timestamps
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    // SOS emergency contact
    private String emergencyContact;
    private String emergencyPhone;
}
