package com.shearn.repository;

import com.shearn.model.SosAlert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SosAlertRepository extends MongoRepository<SosAlert, String> {
    List<SosAlert> findByUserId(String userId);
    List<SosAlert> findByStatus(String status);
}
