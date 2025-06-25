package com.jobix.jobix_Backend;

import com.jobix.jobix_Backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerSessionTest {

    @Autowired
    private MockMvc mockMvc;//simular las peticiones

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void cleanPreviousUsers() {
        userRepository.deleteAll();//Limpiar usuarios previos antes de cada test
        }

        //Crear un usuario con email y contraseña para simular inicio de sesión
        @Test
        @Order(1)
        public void shouldRegisterUserSuccessfully () throws Exception {
            String newUser = """
                    {
                    "nombre":"Alfred",
                    "apellido": "Tester",
                    "email": "alfred@test.com",
                    "password": "123456"
                    }
                """;

            //post a registro
            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(newUser))
                    .andExpect(status().isOk());//esperamos el 201 al crear
    }

    @Test
    @Order(2)
    public void shouldLoginAndCreateSessionCookie() throws Exception{

        String newUser = """
                    {
                    "nombre":"Alfred",
                    "apellido": "Tester",
                    "email": "alfred@test.com",
                    "password": "123456"
                    }
                """;

        //post a registro
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newUser))
                .andExpect(status().isOk());//esperamos el 200 al crear


        String loginJson = """
            {
                "email": "alfred@test.com",
                "password": "123456"
            }
        """;

        MockHttpSession session = new MockHttpSession();

        //post al login
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())//login 200
                .andReturn();

        //verificar que se creó la sesión
        Object auth= session.getAttribute("SPRING_SECURITY_CONTEXT");
        assertNotNull(auth);//debe existir la cookie


    }

}
