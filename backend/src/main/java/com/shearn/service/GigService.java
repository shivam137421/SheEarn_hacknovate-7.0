package com.shearn.service;

import com.shearn.dto.GigDto.*;
import com.shearn.model.Gig;
import com.shearn.model.Review;
import com.shearn.model.User;
import com.shearn.repository.GigRepository;
import com.shearn.repository.ReviewRepository;
import com.shearn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Gig Service - core marketplace logic
 */
@Service
public class GigService {

    @Autowired private GigRepository gigRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ReviewRepository reviewRepository;

    /** Post a new gig (customer only) */
    public GigResponse createGig(CreateGigRequest request, String customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Gig gig = new Gig();
        gig.setTitle(request.getTitle());
        gig.setDescription(request.getDescription());
        gig.setCategory(request.getCategory());
        gig.setPrice(request.getPrice());
        gig.setPriceType(request.getPriceType());
        gig.setEstimatedHours(request.getEstimatedHours());
        gig.setLocation(request.getLocation());
        gig.setCity(request.getCity());
        gig.setLatitude(request.getLatitude());
        gig.setLongitude(request.getLongitude());
        gig.setUrgent(request.isUrgent());
        gig.setRequiredSkill(request.getRequiredSkill());
        gig.setRequiredSkillLevel(request.getRequiredSkillLevel());
        gig.setDeadline(request.getDeadline());
        gig.setCustomerId(customerId);
        gig.setCustomerName(customer.getName());
        gig.setStatus("OPEN");

        Gig saved = gigRepository.save(gig);
        return toResponse(saved);
    }

    /** Get all open gigs (public browse) */
    public List<GigResponse> getOpenGigs() {
        return gigRepository.findByStatus("OPEN")
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Get urgent/quick gigs */
    public List<GigResponse> getUrgentGigs() {
        return gigRepository.findByStatusAndIsUrgent("OPEN", true)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Get gigs by category */
    public List<GigResponse> getGigsByCategory(String category) {
        return gigRepository.findByCategoryAndStatus(category, "OPEN")
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Get gigs near a location (±0.15 degrees ≈ ~15km radius) */
    public List<GigResponse> getNearbyGigs(double lat, double lng) {
        double delta = 0.15;
        return gigRepository.findNearbyOpenGigs(lat - delta, lat + delta, lng - delta, lng + delta)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** A woman accepts/applies to a gig */
    public GigResponse acceptGig(String gigId, String providerId) {
        Gig gig = gigRepository.findById(gigId)
                .orElseThrow(() -> new RuntimeException("Gig not found"));

        if (!"OPEN".equals(gig.getStatus())) {
            throw new RuntimeException("Gig is not available");
        }

        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        gig.setProviderId(providerId);
        gig.setProviderName(provider.getName());
        gig.setStatus("ASSIGNED");
        gig.setAssignedAt(LocalDateTime.now());

        return toResponse(gigRepository.save(gig));
    }

    /** Mark gig as in-progress */
    public GigResponse startGig(String gigId, String userId) {
        Gig gig = getGigAndValidateOwner(gigId, userId);
        gig.setStatus("IN_PROGRESS");
        return toResponse(gigRepository.save(gig));
    }

    /** Mark gig as completed */
    public GigResponse completeGig(String gigId, String userId) {
        Gig gig = gigRepository.findById(gigId)
                .orElseThrow(() -> new RuntimeException("Gig not found"));

        gig.setStatus("COMPLETED");
        gig.setCompletedAt(LocalDateTime.now());
        Gig saved = gigRepository.save(gig);

        // Update provider earnings and job count
        if (gig.getProviderId() != null) {
            userRepository.findById(gig.getProviderId()).ifPresent(provider -> {
                provider.setTotalEarnings(provider.getTotalEarnings() + gig.getPrice());
                provider.setCompletedJobs(provider.getCompletedJobs() + 1);
                userRepository.save(provider);
            });
        }

        return toResponse(saved);
    }

    /** Leave a review for a completed gig */
    public GigResponse reviewGig(String gigId, ReviewRequest request, String reviewerId) {
        Gig gig = gigRepository.findById(gigId)
                .orElseThrow(() -> new RuntimeException("Gig not found"));

        if (!"COMPLETED".equals(gig.getStatus())) {
            throw new RuntimeException("Can only review completed gigs");
        }
        if (gig.isReviewGiven()) {
            throw new RuntimeException("Review already submitted");
        }

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        // Save review document
        Review review = new Review();
        review.setGigId(gigId);
        review.setReviewerId(reviewerId);
        review.setReviewerName(reviewer.getName());
        review.setProviderId(gig.getProviderId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewRepository.save(review);

        // Update gig
        gig.setRating(request.getRating());
        gig.setReview(request.getComment());
        gig.setReviewGiven(true);

        // Recalculate provider's average rating
        if (gig.getProviderId() != null) {
            List<Review> providerReviews = reviewRepository.findByProviderId(gig.getProviderId());
            double avgRating = providerReviews.stream()
                    .mapToDouble(Review::getRating).average().orElse(0.0);

            userRepository.findById(gig.getProviderId()).ifPresent(provider -> {
                provider.setRating(Math.round(avgRating * 10.0) / 10.0);
                provider.setTotalReviews(providerReviews.size());
                userRepository.save(provider);
            });
        }

        return toResponse(gigRepository.save(gig));
    }

    /** Get gigs posted by a customer */
    public List<GigResponse> getCustomerGigs(String customerId) {
        return gigRepository.findByCustomerId(customerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Get gigs assigned to a provider (woman) */
    public List<GigResponse> getProviderGigs(String providerId) {
        return gigRepository.findByProviderId(providerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Get a single gig by ID */
    public GigResponse getGigById(String gigId) {
        Gig gig = gigRepository.findById(gigId)
                .orElseThrow(() -> new RuntimeException("Gig not found"));
        return toResponse(gig);
    }

    // ---- Private helpers ----

    private Gig getGigAndValidateOwner(String gigId, String userId) {
        Gig gig = gigRepository.findById(gigId)
                .orElseThrow(() -> new RuntimeException("Gig not found"));
        if (!userId.equals(gig.getProviderId()) && !userId.equals(gig.getCustomerId())) {
            throw new RuntimeException("Not authorized for this gig");
        }
        return gig;
    }

    private GigResponse toResponse(Gig gig) {
        GigResponse r = new GigResponse();
        r.setId(gig.getId());
        r.setTitle(gig.getTitle());
        r.setDescription(gig.getDescription());
        r.setCategory(gig.getCategory());
        r.setPrice(gig.getPrice());
        r.setPriceType(gig.getPriceType());
        r.setEstimatedHours(gig.getEstimatedHours());
        r.setStatus(gig.getStatus());
        r.setUrgent(gig.isUrgent());
        r.setLocation(gig.getLocation());
        r.setCity(gig.getCity());
        r.setCustomerId(gig.getCustomerId());
        r.setCustomerName(gig.getCustomerName());
        r.setProviderId(gig.getProviderId());
        r.setProviderName(gig.getProviderName());
        r.setRequiredSkill(gig.getRequiredSkill());
        r.setRequiredSkillLevel(gig.getRequiredSkillLevel());
        r.setPostedAt(gig.getPostedAt());
        r.setDeadline(gig.getDeadline());
        r.setRating(gig.getRating());
        r.setReview(gig.getReview());
        return r;
    }
}
