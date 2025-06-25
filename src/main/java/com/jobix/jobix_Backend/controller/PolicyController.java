package com.jobix.jobix_Backend.controller;

import com.jobix.jobix_Backend.model.Policy;
import com.jobix.jobix_Backend.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "*")
public class PolicyController {
    @Autowired
    private PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

  @GetMapping
   public List<Policy> getAllPolicies(){
       return policyService.getAllPolicies();
  }

  @PostMapping
    public Policy createPolicy(@RequestBody Policy policy){
        return policyService.savePolicy(policy);
  }

  @PutMapping("/{id}")
    public Policy updatePolicy(@PathVariable Long id, @RequestBody Policy policy){
        return policyService.updatePolicy(id, policy);
  }

  @DeleteMapping("/{id}")
    public void deletePolicy(@PathVariable Long id){
        policyService.deletePolicy(id);
  }
}
