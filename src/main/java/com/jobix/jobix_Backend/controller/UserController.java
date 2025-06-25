package com.jobix.jobix_Backend.controller;

import com.jobix.jobix_Backend.model.User;
import com.jobix.jobix_Backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Obtener todos los usuarios (visible solo para admins)
    @GetMapping

    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUser(HttpServletRequest request){
        //se devuelve el authUser usando autenticacion por sesion
        String email= request.getUserPrincipal().getName();
        Optional<User> user = userService.findByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
        }
    }



    // cambio de rol
    @PutMapping("/{id}/toggle-admin")

    public ResponseEntity<?> toggleAdminRole(@PathVariable Long id){
        User updateUser =  userService.toggleAdminRole(id);
       return ResponseEntity.ok(updateUser);
    }


}
