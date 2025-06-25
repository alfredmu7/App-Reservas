package com.jobix.jobix_Backend.controller;
import com.jobix.jobix_Backend.model.Product;
import com.jobix.jobix_Backend.service.FavoriteService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")

@RequiredArgsConstructor
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

//añadir un producto a fav
    @PostMapping("/{productId}")
    public ResponseEntity<Void> addFavorite(HttpSession session,
                                            @PathVariable Long productId){
        String email = (String) session.getAttribute("userEmail");
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        favoriteService.addFavorite(email, productId);
        return ResponseEntity.ok().build();
    }

    //eliminar producto de fav
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteFavorite(HttpSession session,
                                               @PathVariable Long productId){
        String email = (String) session.getAttribute("userEmail");
        if (email == null) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        favoriteService.deleteFavorite(email, productId);
        return ResponseEntity.ok().build();
    }

    //obtener lista de producto fav
    @GetMapping("")
    public ResponseEntity<List<Product>> getFavorite(HttpSession session) {
        String email = (String) session.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Product> favorites = favoriteService.getFavoriteProductIds(email);
        return ResponseEntity.ok(favorites);
    }


}
