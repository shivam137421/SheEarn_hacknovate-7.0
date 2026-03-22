package com.shearn.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * Review model - ratings and reviews for service providers
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String gigId;
    private String reviewerId;    // customer who gave review
    private String reviewerName;
    private String providerId;    // woman who received review

    private double rating; // 1 to 5
    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();
}
