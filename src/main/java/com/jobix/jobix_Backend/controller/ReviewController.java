package com.jobix.jobix_Backend.controller;

import com.jobix.jobix_Backend.model.Review;
import com.jobix.jobix_Backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review){
        Review saved = reviewService.saveReview(review);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getByProduct(@PathVariable Long productId){
        return ResponseEntity.ok(reviewService.getReviewByProduct(productId));
    }

    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Double> getAverage(@PathVariable Long productId){
        return ResponseEntity.ok(reviewService.getAverageRating(productId));
    }

    @GetMapping("/product/{productId}/count")
    public ResponseEntity<Long> getCount(@PathVariable Long productId){
        return ResponseEntity.ok(reviewService.getTotalReview(productId));
    }

}
