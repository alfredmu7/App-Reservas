package com.jobix.jobix_Backend;

import com.jobix.jobix_Backend.controller.ReservationController;
import com.jobix.jobix_Backend.service.ReservationService;
import com.jobix.jobix_Backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(controllers = ReservationController.class,excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}) // 1. Solo levantamos el contexto del controlador
public class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReservationService reservationService; // Mock del servicio real

    @MockBean
    private UserService userService;

    @Test
    public void shouldReturnBookedDatesForProduct() throws Exception {
        // Definimos datos de prueba: fechas ocupadas esperadas
        List<LocalDate> busyDate = Arrays.asList(
                LocalDate.of(2025, 7, 1),
                LocalDate.of(2025, 7, 2),
                LocalDate.of(2025, 7, 3)
        );

        // Simulamos que el servicio retorna esas fechas para el producto ID 1
        Mockito.when(reservationService.getUnavailableDates(1L))
                .thenReturn(busyDate);

        // aqui se ejecuta la petición HTTP GET al endpoint correspondiente
        mockMvc.perform(get("/api/reservations/product/1/availability"))
                //  Verificamos que el status de respuesta sea 200 OK
                .andExpect(status().isOk())
                //  Verificamos que el contenido devuelto sea JSON
                .andExpect(content().contentType("application/json"))
                // Verificamos que contenga las fechas esperadas en formato string
                .andExpect(jsonPath("$[0]").value("2025-07-01"))
                .andExpect(jsonPath("$[1]").value("2025-07-02"))
                .andExpect(jsonPath("$[2]").value("2025-07-03"));
    }
}
