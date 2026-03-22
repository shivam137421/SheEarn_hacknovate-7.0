package com.shearn.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class GigDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateGigRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        @Min(value = 0, message = "Price must be positive")
        private double price;

        private String priceType = "FIXED";
        private int estimatedHours = 1;
        private String location;
        private String city;
        private double latitude;
        private double longitude;
        private boolean isUrgent = false;
        private String requiredSkill;
        private String requiredSkillLevel = "ANY";
        private LocalDateTime deadline;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GigResponse {
        private String id;
        private String title;
        private String description;
        private String category;
        private double price;
        private String priceType;
        private int estimatedHours;
        private String status;
        private boolean isUrgent;
        private String location;
        private String city;
        private String customerId;
        private String customerName;
        private String providerId;
        private String providerName;
        private String requiredSkill;
        private String requiredSkillLevel;
        private LocalDateTime postedAt;
        private LocalDateTime deadline;
        private double rating;
        private String review;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewRequest {
        @Min(1) @Max(5)
        private double rating;
        private String comment;
    }
}
