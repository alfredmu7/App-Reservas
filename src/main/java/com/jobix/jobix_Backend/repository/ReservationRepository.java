package com.jobix.jobix_Backend.repository;

import com.jobix.jobix_Backend.model.Reservation;
import com.jobix.jobix_Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Devuelve todas las reservas de un producto específico que se superpongan con un rango dado
    @Query("SELECT r FROM Reservation r WHERE r.product.id = :productId AND " +
    "(r.startDate <= :endDate AND r.endDate >= :startDate)")
    List<Reservation> findOverlappingReservation(@Param("productId")Long productId,
                                              @Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);

    //devolver las reservas asociadas  a un producto
    List<Reservation> findByProductId(Long productId);

    // Buscamos reservas que se superponen con un rango dado
    @Query("SELECT r.product.id FROM Reservation r " +
            "WHERE r.startDate <= :endDate AND r.endDate >= :startDate")
    List<Long> findProductIdsWithOverlappingReservations(@Param("startDate") LocalDate startDate,
                                                         @Param("endDate") LocalDate endDate);

    // Buscar reservas por usuario ordenadas por fecha descendente
    List<Reservation> findByUserOrderByStartDateDesc(User user);
}


//____________
//Evita que el usuario seleccione un rango de fechas ya ocupadas.
//
//También se usa para bloquear fechas en el frontend.