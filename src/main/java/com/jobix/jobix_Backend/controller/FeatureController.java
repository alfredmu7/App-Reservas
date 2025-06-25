package com.jobix.jobix_Backend.controller;

import com.jobix.jobix_Backend.model.Feature;
import com.jobix.jobix_Backend.service.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/features")
@CrossOrigin(origins = "http://localhost:5173")
public class FeatureController {

    @Autowired
    private FeatureService featureService;


    @GetMapping
    public ResponseEntity<List<Feature>> getAllFeature() {
        List<Feature> features = featureService.getAllFeature();
        return ResponseEntity.ok(features != null ? features : new ArrayList<>());
    }


    @PostMapping
    public Feature createFeature(@RequestBody Feature feature){
        return featureService.createFeature(feature);
    }
    @PutMapping("/{id}")
    public Feature updateFeature(@PathVariable Long id,@RequestBody Feature updateFeature){
        return featureService.updateFeature(id,updateFeature);
    }

    @DeleteMapping("/{id}")
    public void deleteFeature(@PathVariable Long id){
        featureService.deleteFeature(id);
    }

}
