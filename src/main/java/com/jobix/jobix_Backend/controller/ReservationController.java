package com.jobix.jobix_Backend.controller;

import com.jobix.jobix_Backend.model.Reservation;
import com.jobix.jobix_Backend.model.User;
import com.jobix.jobix_Backend.service.ReservationService;
import com.jobix.jobix_Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;
    @Autowired
    private UserService userService;

    // Endpoint para obtener fechas ocupadas de un producto
    @GetMapping("/product/{productId}")
    public List<Reservation> getReservations(@PathVariable Long productId){
        return reservationService.getReservationForProduct(productId);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserReservations(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
        }

        String email = principal.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Reservation> reservations = reservationService.getReservationByUser(user);
        return ResponseEntity.ok(reservations);
    }


    @GetMapping("/product/{productId}/availability")
    public List<LocalDate> getReservedDates(@PathVariable Long productId) {
        return reservationService.getUnavailableDates(productId);
    }

    // Endpoint para crear una reserva
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestParam Long productId,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate startDate,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                               Principal principal){



        if (principal == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Debes iniciar sesión para reservar");
        }

        if(!reservationService.isDateRangeAvailable(productId, startDate, endDate)){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El producto ya esta reservado para este rango de fechas.");
        }

        String userEmail = principal.getName();

        Reservation reservation =reservationService.createReservation(productId, userEmail, startDate, endDate);
        return ResponseEntity.ok(reservation);
    }


}
