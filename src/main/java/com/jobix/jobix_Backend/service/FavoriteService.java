package com.jobix.jobix_Backend.service;

import com.jobix.jobix_Backend.model.Product;
import com.jobix.jobix_Backend.model.User;
import com.jobix.jobix_Backend.repository.ProductRepository;
import com.jobix.jobix_Backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {


    private final UserRepository userRepository;
    private final ProductRepository productRepository;


    //agregar producto a los fav del usuario
    public  void addFavorite(String username, Long productId){
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new RuntimeException("Producto no encontrado"));

        

        // evitar duplicados
        if (!user.getFavorites().contains(product)) {
            user.getFavorites().add(product);
            userRepository.save(user); // se guarda automáticamente la relación en 'user_favorites'
        }
    }
    //elimina un producto de los favoritos del usuario
    @Transactional
    public void deleteFavorite(String username, Long productId){
        User user = userRepository.findByEmail(username)
                .orElseThrow(()-> new RuntimeException("Usuario no encontrado"));

        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new RuntimeException("Producto no encontrado"));


        user.getFavorites().remove(product);
        userRepository.save(user); // se actualiza el delete en 'user_favorites'
    }

    //retornar la lista de favoritos
    public List<Product> getFavoriteProductIds (String  username){
        User user = userRepository.findByEmail(username)
                .orElseThrow(()-> new RuntimeException("Usuario no encontrado"));

        return new ArrayList<>(user.getFavorites());

    }
}
