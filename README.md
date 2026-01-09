# Prueba Técnica Backend - Gestión de Usuarios

Este repositorio contiene la solución a la prueba técnica para el puesto de Backend Developer. El proyecto consiste en una API REST desarrollada con **NestJS** y **MongoDB**, que incluye gestión de usuarios, autenticación segura vía **JWT**, validaciones estrictas y un sistema de control de acceso basado en roles (RBAC).

## Características Principales

* **CRUD Completo:** Creación, lectura, actualización y eliminación de usuarios.
* **Persistencia Real:** Uso de MongoDB (Mongoose) en lugar de memoria volátil.
* **Seguridad Avanzada:** Autenticación mediante **Tokens JWT** y contraseñas encriptadas con **Bcrypt**.
* **Roles y Permisos:** Implementación de guards para proteger rutas según rol (`admin` o `user`).
* **Validaciones:** Uso de DTOs, Enums y manejo de errores de base de datos (ej: emails duplicados).
* **Docker:** Entorno contenerizado listo para producción.
* **Documentación:** API documentada automáticamente con Swagger/OpenAPI.

### Stack Tecnológico
* **Framework:** NestJS (Node.js)
* **Base de Datos:** MongoDB (Mongoose)
* **Seguridad:** Passport, JWT, Bcrypt
* **Validación:** Class-Validator & Class-Transformer
* **Documentación:** Swagger
* **Testing:** Jest

---

## Instrucciones de Instalación y Ejecución

### Requisitos Previos
* Docker & Docker Compose (Recomendado)
* O bien: Node.js (v18+) y MongoDB local.

### Opción 1: Ejecución con Docker (Recomendada)
Levanta la API y la Base de Datos automáticamente en un entorno aislado.

1.  **Construir y levantar los servicios:**
    ```bash
    docker-compose up --build
    ```
2.  La API estará disponible en: `http://localhost:3000/api`

### Opción 2: Ejecución Local (Desarrollo)

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```
2.  **Configurar entorno:** Asegúrate de tener MongoDB corriendo en `localhost:27017`.
3.  **Iniciar servidor:**
    ```bash
    npm run start:dev
    ```

---

## Seguridad y Roles (RBAC con JWT)

El sistema implementa un control de acceso mediante **JSON Web Tokens (Bearer Token)**. Existen dos roles permitidos:

1.  **Admin (`admin`):** Acceso total (Crear, Leer, Actualizar, Borrar).
2.  **User (`user`):** Acceso limitado (Solo lectura y actualización propia).

### Cómo probar los permisos en Swagger

1.  **Obtener Token:**
    * Ve al endpoint `POST /auth/login`.
    * Ingresa credenciales válidas.
    * Copia el `access_token` de la respuesta.
2.  **Autorizar:**
    * Sube al botón verde **Authorize** (arriba a la derecha).
    * Pega el token en el campo `Value`.
    * Haz clic en **Authorize** y luego **Close**.
3.  **Probar:**
    * Ahora ejecuta operaciones protegidas como `GET /users`. El token se enviará automáticamente.

> **Nota Importante:** Si intentas acceder a una ruta protegida sin token, recibirás un `401 Unauthorized`. Si tienes token pero no el rol adecuado, recibirás un `403 Forbidden`.

### Validación de Datos
* **Emails Duplicados:** Si intentas crear o actualizar un usuario con un email ya existente, recibirás un error `409 Conflict`.
* **Perfiles:** El campo `nombre_perfil` sigue restringido estrictamente a `admin` o `user`.

---

## Endpoints Disponibles

La documentación interactiva se encuentra en: [http://localhost:3000/api](http://localhost:3000/api)

| Método | Endpoint | Descripción | Requiere Autenticación |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Iniciar sesión y obtener Token JWT | No (Público) |
| `GET` | `/users` | Listar usuarios (Filtro `?role=`) | Sí (Admin/User) |
| `GET` | `/users/:id` | Obtener detalle de usuario | Sí (Admin/User) |
| `POST` | `/users` | Crear nuevo usuario | Sí (Solo Admin) |
| `PATCH` | `/users/:id` | Actualizar usuario | Sí (Solo Admin) |
| `DELETE` | `/users/:id` | Eliminar usuario | Sí (Solo Admin) |

---

## Pruebas Unitarias

Este proyecto cuenta con una suite robusta de pruebas unitarias implementadas con Jest. Se utiliza la técnica de Mocking para aislar las dependencias (Base de datos, servicios externos, librerías de encriptación) y garantizar pruebas rápidas y fiables.

# Ejecutar todas las pruebas unitarias
npm run test

# Ejecutar pruebas en modo "reloj" (Watch Mode)
# Ideal mientras estás programando, se re-ejecuta al guardar cambios
npm run test:watch

# Ver reporte de Cobertura de Código (Code Coverage)
# Muestra qué porcentaje del código está cubierto por tests
npm run test:cov

## Alcance de las Pruebas (Coverage Scope)
Actualmente, el sistema cuenta con cobertura en los módulos críticos de negocio:

Módulo de Usuarios (UsersModule)
Service (UsersService):

✅ Creación de usuarios Admin (C01) y User (C02) con expansión automática de perfiles.

✅ Lógica de encriptación de contraseñas antes de guardar.

✅ Manejo de errores (Emails duplicados, IDs inválidos).

✅ Mocking completo de Mongoose (MongoDB).

Controller (UsersController):

✅ Verificación de rutas y códigos de estado HTTP.

✅ Comunicación correcta con el servicio mediante DTOs.

Módulo de Autenticación (AuthModule)
Service (AuthService):

✅ Flujo completo de Login.

✅ Mocking de Bcrypt para validación de contraseñas.

✅ Mocking de JwtService para la firma y generación de Tokens.

✅ Validación de payload en el Token (incluyendo Roles).

Controller (AuthController):

✅ Validación del endpoint POST /auth/login.

✅ Recepción correcta de LoginDto.