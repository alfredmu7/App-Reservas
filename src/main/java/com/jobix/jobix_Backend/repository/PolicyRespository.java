package com.jobix.jobix_Backend.repository;

import com.jobix.jobix_Backend.model.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PolicyRespository  extends JpaRepository<Policy, Long> {


}
