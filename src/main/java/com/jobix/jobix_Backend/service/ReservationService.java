package com.jobix.jobix_Backend.service;

import com.jobix.jobix_Backend.model.Product;
import com.jobix.jobix_Backend.model.Reservation;
import com.jobix.jobix_Backend.model.User;
import com.jobix.jobix_Backend.repository.ProductRepository;
import com.jobix.jobix_Backend.repository.ReservationRepository;
import com.jobix.jobix_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;

    // Verifica si un rango está libre para un producto
    public Boolean isDateRangeAvailable(Long productId, LocalDate startDate, LocalDate endDate) {
        List<Reservation> overlaps = reservationRepository.findOverlappingReservation(productId, startDate, endDate);
        return overlaps.isEmpty();// Si no hay fechas superpuestas, está disponible.
    }

    // Crea una nueva reserva si el rango está disponible
    public Reservation createReservation(Long productId, String userEmail, LocalDate start, LocalDate end) {
        if (!isDateRangeAvailable(productId, start, end)) {
            throw new IllegalArgumentException("El rango de fechas no está disponible");
        }
        Product product = productRepository.findById(productId).orElseThrow(
                () -> new RuntimeException("Producto no encontrado"));

        User user = userRepository.findByEmail(userEmail).orElseThrow(
                ()-> new RuntimeException("Usuario no encontrado"));

        Reservation reservation= new Reservation();
        reservation.setStartDate(start);
        reservation.setEndDate(end);
        reservation.setProduct(product);
        reservation.setUser(user);


        Reservation savedReservation = reservationRepository.save(reservation);

        // Construimos el mensaje
        String subject = "Confirmación de tu reserva en Jobix";
        String message = "Hola " + user.getName() + ",\n\n" +
                "Tu reserva para el servicio '" + product.getName() + "' ha sido confirmada.\n" +
                "Fecha: " + start + " hasta " + end + "\n\n" +
                "¡Gracias por usar Jobix!";


        try {
            emailService.sendReservationConfirmationEmail(user.getEmail(), subject, message);
        } catch (IOException e) {
            System.out.println("Error al enviar email: " + e.getMessage());
            // No lanzamos excepción, solo registramos el error
        }


        return savedReservation;

    }

    // Devolver todas las reservas de un producto (para mostrar en calendario)

    public List<Reservation> getReservationForProduct(Long productId){
        return reservationRepository.findByProductId(productId);
    }

    //Devuelve una lista de fechas ocupadas (LocalDate) para un producto
    public List<LocalDate> getUnavailableDates(Long productId) {
        List<Reservation> reservations = reservationRepository.findByProductId(productId);

        List<LocalDate> unavailableDates = new ArrayList<>();

        for (Reservation reservation : reservations) {
            // Obtener el rango de fechas desde start hasta end
            LocalDate start = reservation.getStartDate();
            LocalDate end = reservation.getEndDate();

            // Iterar día por día y agregarlo a la lista
            while (!start.isAfter(end)) {
                unavailableDates.add(start);
                start = start.plusDays(1);
            }
        }

        return unavailableDates;
    }

    // se devuelven los productos disponibles entre dos fechas
    public List<Product> getAvailableProducts(LocalDate startDate, LocalDate endDate) {
        // id product ocupados
        List<Long> reservedIds = reservationRepository.findProductIdsWithOverlappingReservations(startDate, endDate);

        // se devuelven los productos que no están en la lista de ocupados
        if (reservedIds.isEmpty()) {
            return productRepository.findAll();
        }
        return productRepository.findByIdNotIn(reservedIds);
    }

    // Retorna la lista de reservas de un usuario, ordenadas por fecha de inicio
    public List<Reservation> getReservationByUser(User user){
        return reservationRepository.findByUserOrderByStartDateDesc(user);
    }


//------------------------------------------------------------------------------------------------------------------
    //se crea metodo para simular el test ConfirmReservationDetailsTest
    public Reservation prepareReservationForm(long userId, long productId, LocalDate startDate, LocalDate endDate) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setProduct(product);
        reservation.setStartDate(startDate);
        reservation.setEndDate(endDate);

        return reservation;
    }
//-------------------------------------------------------------------------------------------------------------
}
