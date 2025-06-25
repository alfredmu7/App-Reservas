package com.jobix.jobix_Backend.repository;

import com.jobix.jobix_Backend.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductServiceInterface {
    List<Product> getRandomProduct();

    Optional<Product> getById(Long id);
}
