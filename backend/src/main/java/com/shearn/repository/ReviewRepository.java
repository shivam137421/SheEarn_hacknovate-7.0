package com.shearn.repository;

import com.shearn.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByProviderId(String providerId);
    List<Review> findByReviewerId(String reviewerId);
    List<Review> findByGigId(String gigId);
}
