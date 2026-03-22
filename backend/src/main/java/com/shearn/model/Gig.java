package com.shearn.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Gig model - represents a micro-job posted by customer or offered by woman
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "gigs")
public class Gig {

    @Id
    private String id;

    private String title;
    private String description;
    private String category; // "COOKING", "STITCHING", "TEACHING", "CLEANING", "BEAUTY", "CRAFTS", "OTHER"

    // Pricing
    private double price;
    private String priceType; // "FIXED", "HOURLY"
    private int estimatedHours;

    // Location
    private double latitude;
    private double longitude;
    private String location;
    private String city;

    // Status
    private String status; // "OPEN", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"

    // Urgency flag (shows in urgent jobs section)
    private boolean isUrgent = false;

    // Relationships
    private String customerId;    // who posted the gig
    private String customerName;
    private String providerId;    // assigned woman provider
    private String providerName;

    // Skill requirement
    private String requiredSkill;
    private String requiredSkillLevel; // "ANY", "BEGINNER", "INTERMEDIATE", "ADVANCED"

    // Timestamps
    private LocalDateTime postedAt = LocalDateTime.now();
    private LocalDateTime assignedAt;
    private LocalDateTime completedAt;
    private LocalDateTime deadline;

    // Reviews
    private double rating;
    private String review;
    private boolean reviewGiven = false;
}
