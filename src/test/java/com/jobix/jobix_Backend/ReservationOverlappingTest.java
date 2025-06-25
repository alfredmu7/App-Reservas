package com.jobix.jobix_Backend;

import com.jobix.jobix_Backend.model.Product;
import com.jobix.jobix_Backend.model.Reservation;
import com.jobix.jobix_Backend.model.User;
import com.jobix.jobix_Backend.repository.ProductRepository;
import com.jobix.jobix_Backend.repository.ReservationRepository;
import com.jobix.jobix_Backend.repository.UserRepository;
import com.jobix.jobix_Backend.service.ReservationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ReservationOverlappingTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReservationService reservationService;


    @Test
    void shouldNotAllowReservationIfDatesOverlap() {

        //creamos el producto a reservar
        Product product = new Product();
        product.setId(1L);

        // Usuario de prueba
        User user = new User();
        user.setEmail("reservation@test.com");

        //Simulamos una reserva ya existente para ese producto
        Reservation existingReservation = new Reservation();
        existingReservation.setStartDate(LocalDate.of(2025, 7, 10));
        existingReservation.setEndDate(LocalDate.of(2025, 7, 15));
        existingReservation.setProduct(product);

        //Simulamos una nueva reserva del 12 al 18 de julio para que se cruce la fecha
        Reservation newReservation = new Reservation();
        newReservation.setStartDate(LocalDate.of(2025,7,12));
        newReservation.setEndDate(LocalDate.of(2025,7,18));
        newReservation.setProduct(product);

        //Configuramos el mock para devolver la reserva existente si hay cruce de fechas
        when(reservationRepository.findOverlappingReservation(
                eq(product.getId()),
                eq(newReservation.getStartDate()),
                eq(newReservation.getEndDate())
        )).thenReturn(List.of(existingReservation));

        //Ejecutamos el metodo y esperamos una excepción
        Exception exception = assertThrows(IllegalArgumentException.class, () ->{
            reservationService.createReservation(product.getId(),
                    "reservation@test.com",
                    newReservation.getStartDate(),
                    newReservation.getEndDate());
        });

        //Verificamos que el mensaje sea el esperado
        assertEquals("El rango de fechas no está disponible", exception.getMessage());
    }
}
