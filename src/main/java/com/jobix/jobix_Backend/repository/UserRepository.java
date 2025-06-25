package com.jobix.jobix_Backend.repository;

import com.jobix.jobix_Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail (String email);// para buscar por email

        boolean existsByEmail(String email);//para verificar si ya existe el email

    List<User> findAll();



}

