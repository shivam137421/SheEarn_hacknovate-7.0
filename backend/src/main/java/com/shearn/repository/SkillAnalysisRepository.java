package com.shearn.repository;

import com.shearn.model.SkillAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SkillAnalysisRepository extends MongoRepository<SkillAnalysis, String> {
    List<SkillAnalysis> findByUserId(String userId);
    List<SkillAnalysis> findByUserIdOrderByAnalyzedAtDesc(String userId);
}
