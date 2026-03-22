package com.shearn.repository;

import com.shearn.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(String role);

    List<User> findByRoleAndCity(String role, String city);

    // Find verified women providers
    List<User> findByRoleAndIsVerified(String role, boolean isVerified);

    // Find by skill
    @Query("{ 'skills': { $in: [?0] }, 'role': 'WOMAN' }")
    List<User> findBySkill(String skill);

    // Find nearby providers (approximate - within ~10km using lat/lng range)
    @Query("{ 'role': 'WOMAN', 'latitude': { $gte: ?0, $lte: ?1 }, 'longitude': { $gte: ?2, $lte: ?3 } }")
    List<User> findNearbyProviders(double minLat, double maxLat, double minLng, double maxLng);
}
