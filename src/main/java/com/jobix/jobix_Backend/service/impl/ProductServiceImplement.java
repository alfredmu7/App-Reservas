package com.jobix.jobix_Backend.service.impl;

import com.jobix.jobix_Backend.model.Product;
import com.jobix.jobix_Backend.repository.ProductRepository;
import com.jobix.jobix_Backend.repository.ProductServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImplement implements ProductServiceInterface {

    @Autowired
    private ProductRepository productRepository;


    @Override
    public List<Product> getRandomProduct() {
        return productRepository.findRandomProduct();
    }

    @Override
    public Optional<Product> getById(Long id) {
        return productRepository.findById(id);
    }
}
