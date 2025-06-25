package com.jobix.jobix_Backend.service;

import com.jobix.jobix_Backend.model.User;
import com.jobix.jobix_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    private static final Set<String> ADMIN_EMAILS = Set.of("admin@jobix.com");


    public String registerUser(User user) {
        // se valida que el email no esté en uso
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Error: El correo electrónico ya está registrado.";
        }
        // Cifrar la contraseña antes de guardar
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRoles() == null) {
            user.setRoles(new HashSet<>());
        }

        if (ADMIN_EMAILS.contains(user.getEmail())) {
            user.getRoles().add("ADMIN");
        }

        if (user.getRoles().isEmpty()) {
            user.getRoles().add("USER");
        }

        userRepository.save(user);
        return "Registro exitoso.";
    }


    public User login(String email, String password){
        //buscar usuario por correo
        Optional<User> anyUser = userRepository.findByEmail(email);
        if (anyUser.isEmpty()){
            throw  new RuntimeException("Correo no registrado.");
        }

        User user = anyUser.get();

       //verificar constraseña con BCrypt
        if (!passwordEncoder.matches(password, user.getPassword())){
            throw new RuntimeException("Contraseña incorrecta.");
        }

        //verificar que solo se manejen esos dos roles
        if(!user.getRoles().contains("USER") && !user.getRoles().contains("ADMIN")){
            throw new RuntimeException("Rol inválido");
        }


        return  user;
    }


    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    //obtenemos la lista de usuarios:
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    //aquí se asigna o no, el rol de admin
    public  User toggleAdminRole( Long userId){

        User user = userRepository.findById(userId)

                .orElseThrow(()-> new RuntimeException("Usuario no encontrado"));

        Set<String> roles = user.getRoles();

        //si ya es admin lo cambiamos:
        if (roles.contains("ADMIN")){
            roles.remove("ADMIN");
            roles.add("USER");// si se quiere que siempre tenga al menos el rol USER
        }else{
            roles.add("ADMIN");
            roles.remove("USER");// si se quiere quitar USER cuando es admin
        }

        user.setRoles(roles);

        return userRepository.save(user);
    }


}
