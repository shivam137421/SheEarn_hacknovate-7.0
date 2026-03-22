package com.shearn.repository;

import com.shearn.model.Gig;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GigRepository extends MongoRepository<Gig, String> {

    List<Gig> findByStatus(String status);

    List<Gig> findByCustomerId(String customerId);

    List<Gig> findByProviderId(String providerId);

    List<Gig> findByStatusAndIsUrgent(String status, boolean isUrgent);

    List<Gig> findByCategory(String category);

    List<Gig> findByCategoryAndStatus(String category, String status);

    // Find open gigs near location
    @Query("{ 'status': 'OPEN', 'latitude': { $gte: ?0, $lte: ?1 }, 'longitude': { $gte: ?2, $lte: ?3 } }")
    List<Gig> findNearbyOpenGigs(double minLat, double maxLat, double minLng, double maxLng);

    // Find urgent open gigs
    @Query("{ 'status': 'OPEN', 'isUrgent': true }")
    List<Gig> findUrgentOpenGigs();

    long countByProviderIdAndStatus(String providerId, String status);
}
