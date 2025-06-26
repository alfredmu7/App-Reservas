
# DOCUMENTACIÓN DEL PROYECTO:

# App de reservas - Frontend

### Nombre proyecto: JobixApp

Aplicación web para la reserva de servicios de técnicos (plomeros, electricistas, limpieza, mecánicos, etc.). Este frontend está construido en **React** y se comunica con un backend hecho en Spring Boot.

---

##  Link del repositorio Frontend & backend

[App-Reservas - Desafio final DH - Frontend (React)](https://github.com/alfredmu7/App-Reservas/tree/frontend)

[App-Reservas - Desafio final DH - Backend (Java Spring Boot)](https://github.com/alfredmu7/App-Reservas/tree/master)

---

## Cuenta establecida desde el backend con rol: ADMIN

**Email**: admin@jobix.com

**Password sugerido**: Ahhhh123!!

---

## Paleta de colores

**Orange**: #eb571c
**white-gray**: #EFEEEA
**dark-blue**: #273F4F
**low-black**: #1e1e1e

### colores adicionales:
**dark-red**: #833030
**red**: #d1122c

---

##  Tecnologías utilizadas

- React + Vite
- React Router DOM
- CSS / Bootstrap
- Fetch API
- FormData para envío de formularios con imágenes


##  Estructura general

-  Componentes reutilizables (Header, Footer, ProductCard, etc.)
-  Vistas de páginas completas
-  Funciones para llamadas a API
-  Uso de hooks 
-  Imágenes y recursos estáticos

---
##  Funcionalidades implementadas

###  Autenticación
- Registro y login de usuarios
- Visualización de nombre y avatar con iniciales
- Control de sesión (localStorage)

###  Productos y reservas
- Visualización dinámica de productos desde el backend
- Detalles de producto con galería, características y calendario
- Sistema de reservas con validación de fechas ocupadas
- Comentarios y puntuaciones para usuarios autenticados

###  Panel de administración
- Crear y editar productos (nombre, descripción, imágenes, políticas, features, etc.)
- Gestión de categorías
- Validaciones en formularios

---
##  Bitácora de desarrollo


###  Sprint 1
- Inicio del proyecto con Vite
- Header a la medida de lo solicitado, navegación y landing page
- Renderizado dinámico de productos, registro de los mismos
- Página de detalle de productos 
- Visualización de imagenes
- Creación panel administrador, solo la página
- Gestión de productos y listado de los mismos
- Footer

Estas funcionalidades representan la primera versión usable del sistema, permitiendo 
visualizar y gestionar servicios desde una interfaz moderna, sentando las bases para 
los siguientes sprints centrados en autenticación, reservas y comentarios.

---

###  Sprint 2
- Registro e inicio de sesión
- Acceso al panel del administrador solo para usuario autorizado(**ADMIN**)
- Gestión de productos por parte del admin
- Implementación de categorías y features desde el backend

En este sprint se enfocó el desarrollo en implementar la autenticación de usuarios, 
permitiendo el registro y el inicio de sesión con validaciones. Se reforzó la seguridad
del sistema al restringir el acceso al panel de administración exclusivamente para 
usuarios con rol ADMIN. Además, se fortaleció la gestión del catálogo de servicios al
permitir que el administrador pueda crear, editar y eliminar productos, integrando 
también la asignación de categorías y la gestión de features (características) 
directamente desde el backend, ampliando así la capacidad de personalización y 
organización de los productos.

---

###  Sprint 3
- Realizar busquedas de productos desde el navbar del main
- Calendario para seleccionar fechas disponibles
- Guardar productos o servicios como favoritos y listarlos
- Prevención de reservas en fechas ocupadas
- Reseñas y puntuaciones al reservar
- Visualización de politicas de los servicios a reservar
- Acceso al usuario para compartir en redes el producto de su preferencia
- Capacidad de calificar y comentar el servicio o producto 

Durante este sprint se priorizó mejorar la experiencia del usuario 
final en la plataforma. Se incorporó un buscador funcional en el navbar, 
permitiendo filtrar productos por nombre o características. Se integró un 
calendario interactivo para que el usuario seleccione fechas disponibles 
y se evitó la duplicación de reservas en días ya ocupados. Se añadió la 
posibilidad de guardar productos como favoritos, así como visualizarlos 
desde el perfil del usuario. Además, se implementó un sistema de reseñas 
y puntuaciones, permitiendo al usuario calificar y comentar los servicios 
una vez reservados. También se mostraron claramente las políticas de cada 
servicio, y se habilitó una opción para compartir productos en redes sociales, 
fomentando la interacción y difusión de los servicios disponibles.

---

###  Sprint 4
- Encontrar productos o servicios por fechas disponibles
- Se muestra al usuario una página de confirmacion con los detalles de la reserva
- Capacidad para realizar reserva, solo para usuarios autenticados
- Acceso a historial de reservas realizadas por el usuario
- Comunicación directa con el servicio o técnico
- Confirmación por correo post-reserva

En este sprint se enfocó en cerrar el flujo completo de reserva de servicios, 
consolidando la interacción entre usuarios y técnicos. Se habilitó la búsqueda 
de productos por fechas disponibles, facilitando la planificación según la agenda 
del usuario. Al completar una reserva, el sistema muestra una página de confirmación 
detallada, y se restringió esta funcionalidad solo a usuarios autenticados, 
asegurando la trazabilidad y seguridad del proceso. Además, se implementó una 
sección de historial de reservas, donde los usuarios pueden consultar sus 
solicitudes anteriores. Para mejorar la comunicación, se habilitó un canal directo 
entre el usuario y el proveedor del servicio. Finalmente, tras confirmar una reserva, 
el sistema envía una notificación por correo electrónico con todos los detalles, 
brindando confianza y profesionalismo en la experiencia de uso.

---

## Test Aplicados en el proyecto

### Registro de productos

En este test se validó el correcto funcionamiento del componente `AddProductForm` 
mediante pruebas de interfaz usando Vitest, Testing Library y mocks de `fetch`. 
Se simuló exitosamente el registro de un producto al completar todos los campos 
del formulario: nombre, descripción, selección de categoría, selección de 
características (`features`), carga de una imagen y envío del formulario. 
Las peticiones `fetch` a `/api/categories` y `/api/features` fueron interceptadas 
para devolver datos simulados, permitiendo así testear el comportamiento del 
componente en aislamiento. Finalmente, se verificó que tras hacer clic en "guardar", 
aparezca en pantalla el mensaje de éxito correspondiente, validando que la experiencia 
de registro de productos se comporta como se espera desde el frontend.

---

### Registro de usuario

Esta prueba automatizada valida el correcto funcionamiento del formulario de 
registro `RegisterForm` en el frontend. Utilizando Testing Library y `vi.fn()` 
de Vitest para simular la función `fetch`, se interceptó la petición de 
registro para retornar una respuesta exitosa sin depender del backend real. 
El test llena todos los campos obligatorios del formulario (nombre, apellidos, 
correo electrónico y contraseña) con datos válidos, luego simula el envío del 
formulario. Se espera que la función `fetch` sea llamada exactamente una vez, 
lo cual confirma que el formulario se envía correctamente cuando los datos son válidos. 
Esta prueba asegura que la lógica de validación y la integración con la API se ejecutan 
como se espera en la interfaz de usuario.

---

### Búsqueda con autocompletado y selección de fechas

Esta prueba valida la funcionalidad completa del componente `SearchBlock`, 
el cual permite a los usuarios buscar productos usando autocompletado y seleccionar un 
rango de fechas. Se simulan dos peticiones `fetch`: una para sugerencias 
de productos mientras el usuario escribe, y otra para ejecutar la búsqueda final. 
El test verifica que se rendericen las sugerencias tras escribir un término como "Electricista", 
que el usuario pueda seleccionar una sugerencia, definir un rango de fechas con dos 
inputs y hacer clic en el botón de búsqueda. Finalmente, se espera que aparezca 
un resultado relacionado en pantalla. Esta prueba asegura que la experiencia de 
búsqueda en la interfaz esté completamente funcional y conectada correctamente con 
las respuestas simuladas del backend.


