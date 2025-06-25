package com.jobix.jobix_Backend;

import com.jobix.jobix_Backend.model.Category;
import com.jobix.jobix_Backend.model.Product;
import com.jobix.jobix_Backend.repository.CategoryRepository;
import com.jobix.jobix_Backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @WithMockUser(roles = "ADMIN")
    @Test
    void shouldDeleteProductById() throws Exception{

        //  Crear categoría y guardarla en la BD
        Category category = new Category();
        category.setName("Categoría de prueba");
        Category savedCategory = categoryRepository.save(category);


        //creacion producto prueba en la BD
        Product product = new Product();
        product.setName("Producto de prueba");

        product.setDescription("Descripción");
        product.setCategory(savedCategory);
        Product saved = productRepository.save(product);

        //peticion delete y que se ejecute
        mockMvc.perform(delete("/api/product/" + saved.getId()))
                .andExpect(status().isOk());

        // Vemos que el producto ya no exista
        Optional<Product> deleted = productRepository.findById(saved.getId());
        assertFalse(deleted.isPresent());

    }
}
