package com.jobix.jobix_Backend;
import com.jobix.jobix_Backend.model.Category;
import com.jobix.jobix_Backend.model.Product;
import com.jobix.jobix_Backend.repository.CategoryRepository;
import com.jobix.jobix_Backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/*vamos a crear el test de creación de un producto que incluye:
Asignar una categoría existente.
*/
@SpringBootTest
@AutoConfigureMockMvc
public class ProductCreationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;

    private Long categoryId;


    @BeforeEach
    public void cleanPreviusProduct(){
        productRepository.deleteAll();

        //se crea categoria simulada
        Category category = new Category();
        category.setName("Electricista");
        category = categoryRepository.save(category);
        categoryId = category.getId();

    }
    @Test
    @WithMockUser(roles = "ADMIN")
    public void shouldCreateProductWithCategory() throws Exception{

        String newProduct = String.format(
        """
                {
                "name": "Electricista Nivel II",
                "description": "Instalaciones y mantenimiento",
                "category": { "id": %d }
                }
                """, categoryId);

        mockMvc.perform(post("/api/product")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newProduct))
                .andExpect(status().isCreated());

        //hacemos verificacion

        List<Product> products = productRepository.findAll();
        assertEquals(1, products.size());

        Product p= products.get(0);
        assertEquals("Electricista Nivel II", p.getName());
        assertEquals(categoryId, p.getCategory().getId());

    }
}
