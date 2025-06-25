package com.jobix.jobix_Backend.service;

import com.jobix.jobix_Backend.model.Category;
import com.jobix.jobix_Backend.model.Product;
import com.jobix.jobix_Backend.repository.CategoryRepository;
import com.jobix.jobix_Backend.repository.ProductRepository;
import com.jobix.jobix_Backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
public class ProductService {


    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ReservationRepository reservationRepository;


    // se guarda un producto, lanzando excepción si nombre existe
    public Product SaveProduct(Product product) {
        boolean exists = productRepository.existsByName(product.getName());
        if (exists) {
            throw new RuntimeException("Ya existe un producto con el nombre: " + product.getName());
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, String name, String description, Long categoryId, MultipartFile[] images) throws IOException {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        if (name != null && !name.isBlank()) {
            existingProduct.setName(name);
        }

        if (description != null && !description.isBlank()) {
            existingProduct.setDescription(description);
        }

        if (images != null && images.length > 0) {
            List<String> imageNames = new ArrayList<>();

            // Carpeta donde se guardarán las imágenes
            Path uploadDir = Paths.get("img_uploads/");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            for (MultipartFile image : images) {
                // Nombre único para evitar conflictos
                String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = uploadDir.resolve(filename);


                Files.copy(image.getInputStream(), filePath);

                // Guardar nombre para la base de datos
                imageNames.add(filename);
            }

            existingProduct.setImage(imageNames);
        }

        if (categoryId != null){
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + categoryId));
            existingProduct.setCategory(category);
        }


        return productRepository.save(existingProduct);
    }

    public List<Product> getAvailableProducts(LocalDate startDate, LocalDate endDate){
        // se obtienen los ids de productos ocupados en ese rango
        List<Long> reservedProductIds = reservationRepository.findProductIdsWithOverlappingReservations(startDate, endDate);
        // se retorna todos los productos que no están reservados
        if (reservedProductIds.isEmpty()) {
            return productRepository.findAll(); // ninguno ocupado
        } else {
            return productRepository.findByIdNotIn(reservedProductIds);
        }
    }

    public void deleteProduct(Long id){
        productRepository.deleteById(id);
    }


    public List<Product> productList(){
        return productRepository.findAll();
    }


    public List<Product> findByCategoryIds(List<Long> categoryIds){
        return productRepository.findByCategoryIdIn(categoryIds);
    }

    public List<Product> findAll(){
        return productRepository.findAll();
    }

}
