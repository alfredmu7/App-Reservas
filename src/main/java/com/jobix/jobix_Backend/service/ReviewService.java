package com.jobix.jobix_Backend.service;

import com.jobix.jobix_Backend.model.Product;
import com.jobix.jobix_Backend.model.Review;
import com.jobix.jobix_Backend.model.User;
import com.jobix.jobix_Backend.repository.ProductRepository;
import com.jobix.jobix_Backend.repository.ReviewRepository;
import com.jobix.jobix_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Review saveReview(Review review){
        review.setDate(LocalDate.now());

        Long userId = review.getUser().getId();
        Long productId= review.getProduct().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("Usuario no encontrado"));

        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new RuntimeException("Producto no encontrado"));

        review.setUser(user);
        review.setProduct(product);

        return reviewRepository.save(review);
    }

    public List<Review> getReviewByProduct(Long productId){
        return reviewRepository.findByProductId(productId);
    }

    public Double getAverageRating(Long productId){
        return reviewRepository.findAverageRatingByProductId(productId);
    }

    public Long getTotalReview(Long productId){
        return reviewRepository.countByProductId(productId);
    }
}
