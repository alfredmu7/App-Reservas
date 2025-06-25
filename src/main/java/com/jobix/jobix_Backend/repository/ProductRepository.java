package com.jobix.jobix_Backend.repository;

import com.jobix.jobix_Backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository <Product, Long> {
    Optional<Product> findByName(String name);
    Boolean existsByName(String name);//Métudo para buscar producto por nombre y validar existencia.

    @Query(value = "SELECT * FROM product ORDER BY RAND() LIMIT 10", nativeQuery = true)//para 10 productos aleatorios
    List<Product> findRandomProduct();


    List<Product> findByCategoryIdIn(List<Long> categoryIds);//busca una lista de productos (List<Product>) cuya categoría (categoryId)
    // esté contenida en una lista de IDs de categoría (List<Long> categoryIds).


    // Busca productos cuyo ID NO esté en la lista de ocupados
    List<Product> findByIdNotIn(List<Long> ids);


}


