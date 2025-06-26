
# DOCUMENTACIÓN DEL PROYECTO:

## App de reservas - Backend

### Nombre proyecto: JobixApp

Este es el backend del proyecto **Jobix**, una plataforma de reservas de servicios técnicos (electricistas, plomeros, mecánicos, etc.) desarrollada con **Spring Boot**. Este servicio se encarga de gestionar la lógica de negocio, seguridad, acceso a datos y comunicación con el frontend de la aplicación.

---

##  Link del repositorio Frontend & backend

[App-Reservas - Desafío final DH - Frontend (React)](https://github.com/alfredmu7/App-Reservas/tree/frontend)

[App-Reservas - Desafío final DH - Backend (Java Spring Boot)](https://github.com/alfredmu7/App-Reservas/tree/master)

---

## Tecnologías utilizadas

- Java 17
- Spring Boot
- Spring Data JPA (Hibernate)
- Spring Security
- MySQL / H2
- Maven
- SendGrid (para notificaciones por email)

---

## Arquitectura general

El proyecto sigue una estructura de capas limpia y organizada:

- **Controller**: recibe y responde las solicitudes HTTP.
- **Service**: contiene la lógica de negocio.
- **Repository**: maneja la persistencia de datos con JPA.
- **Model/Entity**: define las entidades que representan las tablas en la base de datos.
- **Config**: manejo de configuraciones, permisos, accesos y seguridad.

---
## Cuenta establecida con rol: ADMIN

**Email**: admin@jobix.com

**Password sugerido**: Ahhhh123!!

---

## Bitácora de desarrollo del Backend

### Sprint 1 – Configuración inicial y gestión de productos

- Se configuró el entorno base de Spring Boot.
- Se definieron las entidades principales como `Product`, `User` y `Image`.
- Se creó el panel de administración, accesible solo para usuarios con rol `ADMIN`, con endpoints protegidos.
- Se implementó el registro de productos desde el backend, incluyendo nombre, descripción e imágenes.
- Se construyó el servicio para listar y consultar productos.
- Se aplicaron validaciones para datos requeridos.

---

### Sprint 2 – Seguridad y gestión de categorías

- Se implementó el sistema de autenticación y autorización con gestión de sesión con **HttpSession**, asignando un identificador "JSESSIONID" y guardando el ID como una cookie en el navegador.
- Se estableció el control de acceso a rutas según roles (`USER`, `ADMIN`).
- Se creó el servicio de registro e inicio de sesión de usuarios.
- Se integró la funcionalidad para que el administrador gestione productos (editar, eliminar).
- Se añadieron **categorías** y **features/características**, asociadas a los productos.
- Los endpoints permiten obtener categorías activas y asignarlas al crear o editar un producto.

---

### Sprint 3 – Reservas, favoritos y reseñas

- Se desarrolló el sistema de **reservas**, con validación de disponibilidad de fechas.
- Se evitó la creación de reservas en días previamente ocupados.
- Se implementó el endpoint para agregar productos a favoritos por parte de los usuarios.
- Se crearon los servicios para que el usuario pueda **puntuar y comentar** los servicios una vez finalizados.
- Se añadieron políticas asociadas a los productos para su visualización desde el frontend.
- Se implementaron endpoints para búsquedas y filtrados de productos.

---

### Sprint 4 – Flujo completo de reserva

- Se completó el flujo de reservas: búsqueda por fechas, selección de producto y confirmación.
- Solo los usuarios autenticados pueden hacer una reserva.
- Se creó el endpoint para obtener el **historial de reservas** del usuario.
- Se habilitó una funcionalidad de comunicación directa entre el usuario y el técnico (estructura preparada).
- Se integró el servicio de envío de **correo de confirmación** tras una reserva, utilizando SendGrid.
- Se aplicaron mejoras en el control de errores, seguridad y limpieza del código.

---

## Endpoints principales

| Recurso    | Método | Ruta                     | Descripción                   |
|------------|--------|--------------------------|-------------------------------|
| Auth       | POST   | `/auth/register`         | Registro de usuario           |
| Auth       | POST   | `/auth/login`            | Inicio de sesión              |
| Productos  | GET    | `/product`               | Listar productos              |
| Productos  | POST   | `/products`              | Crear producto (solo admin)   |
| Categorías | GET    | `/categories`            | Listar categorías             |
| Reservas   | POST   | `/reservations`          | Crear reserva                 |
| Favoritos  | POST   | `/favorites/{productId}` | Agregar producto a favoritos  |
| Reseñas    | POST   | `/reviews`               | Calificar y comentar producto |
| User       | GET    | `/users`                 | Usuarios                      |



## Tests

Se utilizó JUnit y Mockito para el testeo de servicios y controladores.

### Inicio de sesion

En esta clase de pruebas `AuthControllerSessionTest` se aplicaron tests de integración para la autenticación de usuarios usando sesiones **(HttpSession)** en una aplicación Spring Boot. Se realizaron dos pruebas principales: la primera valída que un nuevo usuario puede registrarse exitosamente mediante una solicitud **POST** al endpoint /api/auth/register, esperando una respuesta satisfactoria (200 OK). 

La segunda prueba simula el flujo completo de autenticación: registra un usuario, luego realiza el inicio de sesión con sus credenciales mediante **POST** a `/api/auth/login`, y finalmente verifica que se haya creado correctamente una sesión de usuario comprobando que existe el atributo SPRING_SECURITY_CONTEXT en la sesión **(HttpSession)**. Estas pruebas garantizan que el mecanismo de login con sesión funcione correctamente de extremo a extremo.

---

### Realizar reserva con éxito

En la clase `ConfirmReservationDetailsTest` se aplicó una prueba unitaria con Mockito enfocada en el servicio de reservas. El test simula el comportamiento de los repositorios (`UserRepository` y `ProductRepository`) para verificar que el método `prepareReservationForm` del `ReservationService` construya correctamente una reserva temporal con los datos del usuario autenticado, el producto seleccionado y el rango de fechas.

Se usaron objetos `@Mock` para evitar dependencias reales de base de datos, y se utilizaron `when(...).thenReturn(...)` para simular las respuestas de los métodos `findById`. Finalmente, con varias aserciones (`assertEquals`), se validó que los atributos del objeto `Reservation` devuelto coincidan con los datos simulados, asegurando que la lógica del servicio funcione como se espera.

---

### Eliminación de productos

En la clase `ProductControllerTest` se implementó una prueba de integración para verificar la eliminación de productos desde el controlador. Usando `@SpringBootTest` y `@AutoConfigureMockMvc`, se simula una petición HTTP DELETE al endpoint `/api/product/{id}` como un usuario con rol `ADMIN` (mediante `@WithMockUser`).

Primero, se crea y guarda una categoría en la base de datos, luego se crea un producto asociado a dicha categoría y también se guarda. La prueba realiza la solicitud de eliminación mediante `mockMvc.perform(delete(...))` y valída que la respuesta tenga un estado `200 OK`. Finalmente, se comprueba que el producto ya no exista en la base de datos con `assertFalse(deleted.isPresent())`, asegurando así que la operación fue exitosa.

---

### Creación de productos 

En la clase `ProductCreationTest` se llevó a cabo una prueba de integración para validar la creación de productos asociados a una categoría. Usando `@SpringBootTest` y `@AutoConfigureMockMvc`, junto con `@WithMockUser(roles = "ADMIN")`, se simula una petición **POST** al endpoint `/api/product` enviando un producto en formato JSON con nombre, descripción y una categoría previamente guardada.

Antes de cada test, se limpia la base de datos y se crea una categoría simulada en el método `@BeforeEach`. Luego, en la prueba principal, se realiza la petición de creación y se espera un estado `201 Created`. Finalmente, se recuperan todos los productos guardados para verificar que se haya creado uno solo, y se comprueba que el nombre y la categoría del producto coincidan con los valores enviados.

---

### Disponibilidad de fechas

En la clase `ReservationControllerTest` se implementó una prueba unitaria enfocada en el endpoint de disponibilidad de fechas. Utilizando `@WebMvcTest` con exclusión de configuraciones de seguridad (`SecurityAutoConfiguration` y `SecurityFilterAutoConfiguration`), se simuló el comportamiento del controlador `ReservationController` aislado del resto de la aplicación. Se usaron mocks de `ReservationService` y `UserService` para evitar llamadas reales a la lógica de negocio.

La prueba `shouldReturnBookedDatesForProduct` verifica que el endpoint `/api/reservations/product/1/availability` responda correctamente con un listado de fechas ocupadas. Se simula el retorno de fechas desde el servicio, y luego se comprueba que la respuesta HTTP sea `200 OK`, que el contenido sea JSON y que contenga exactamente las fechas esperadas. Esta prueba asegura que la lógica del controlador funcione correctamente y que los datos se devuelvan en el formato previsto.

---

### Lógica de validación de fechas superpuestas

En la clase `ReservationOverlappingTest` se implementó una prueba unitaria utilizando Mockito para verificar la lógica de validación de fechas en el servicio de reservas. El objetivo fue asegurar que el sistema impida crear una nueva reserva cuando las fechas se superponen con una ya existente. Se simularon los repositorios (`ReservationRepository`, `ProductRepository`, `UserRepository`) y se inyectaron en `ReservationService`.

La prueba `shouldNotAllowReservationIfDatesOverlap` crea un producto y simula una reserva existente. Luego intenta realizar una nueva reserva para el mismo producto, generando un conflicto de fechas. Gracias al uso de `when(...).thenReturn(...)`, el mock del repositorio devuelve la reserva en conflicto, y el test valída que el método `createReservation` lanza una excepción `IllegalArgumentException` con el mensaje esperado. Esta prueba garantiza que la lógica de prevención de solapamiento de fechas funcione correctamente.









