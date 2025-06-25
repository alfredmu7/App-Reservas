package com.jobix.jobix_Backend.service;

import com.jobix.jobix_Backend.model.Policy;
import com.jobix.jobix_Backend.repository.PolicyRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PolicyService {

    @Autowired
    private PolicyRespository policyRespository;

    public PolicyService(PolicyRespository policyRespository) {
        this.policyRespository = policyRespository;
    }

    public List<Policy> getAllPolicies(){
        return policyRespository.findAll();
    }

    public Policy savePolicy(Policy policy){
        return policyRespository.save(policy);
    }

    public Policy updatePolicy(Long id, Policy updatePolicy){
        return policyRespository.findById(id).map(policy -> {
            policy.setTitle(updatePolicy.getTitle());
            policy.setDescription(updatePolicy.getDescription());
            return policyRespository.save(policy);
        }).orElseThrow(() -> new RuntimeException("Política no encontrada"));
    }

    public void deletePolicy(Long id){
        policyRespository.deleteById(id);
    }
}
