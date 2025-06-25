package com.jobix.jobix_Backend;

import com.jobix.jobix_Backend.model.Product;
import com.jobix.jobix_Backend.model.Reservation;
import com.jobix.jobix_Backend.model.User;
import com.jobix.jobix_Backend.repository.ProductRepository;
import com.jobix.jobix_Backend.repository.UserRepository;
import com.jobix.jobix_Backend.service.ReservationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ConfirmReservationDetailsTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private ReservationService reservationService;

    @Test
    public void shouldPrepareReservationFormWithUserAndProductData(){
        //simulamos el usuario autenticado
        User user = new User();
        user.setName("Alfred");
        user.setLastName("Tester");
        user.setEmail("alfred@tester.com");

        //simulamos el producto a reservar
        Product product = new Product();
        product.setId(100L);
        product.setName("Electricista");

        //las fechas seleccionadas por el usuario
        LocalDate startDate = LocalDate.of(2025, 8, 5);
        LocalDate endDate = LocalDate.of(2025, 8, 10);

        //mocks para devolver usuario y producto al buscarlos por ID
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));

        //ejecutamos el metodo del servicio para construir la reserva temporal
        Reservation reservationPreview = reservationService.prepareReservationForm(1L, 100L,startDate, endDate);

        //verificamos que los datos de la reserva se hayan asignado correctamente
        assertEquals(user, reservationPreview.getUser());
        assertEquals(product, reservationPreview.getProduct());
        assertEquals(startDate, reservationPreview.getStartDate());
        assertEquals(endDate, reservationPreview.getEndDate());
    }
}
