package com.jobix.jobix_Backend.repository;

import com.jobix.jobix_Backend.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, Long> {



}
