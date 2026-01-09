## Características Principales

* **CRUD Completo:** Gestión integral del ciclo de vida de los usuarios.
* **Abstracción de Perfiles:** Lógica de negocio encapsulada para la creación de perfiles mediante códigos (`C01`, `C02`).
* **Persistencia Real:** Base de datos **MongoDB** (con Mongoose ODM).
* **Seguridad Avanzada:**
    * Autenticación mediante **Tokens JWT**.
    * Hashing de contraseñas con **Bcrypt**.
    * Guards para protección de rutas.
* **Calidad de Código:**
    * Validación de datos con DTOs (`class-validator`).
    * Manejo de errores centralizado (ej: correos duplicados).
    * **Testing Unitario** con Jest y Mocking.
* **Infraestructura:** Contenerización con **Docker** y Docker Compose.
* **Documentación:** API documentada automáticamente con **Swagger**.

### Stack Tecnológico

| Categoría | Tecnología |
| :--- | :--- |
| **Framework** | NestJS (Node.js) |
| **Base de Datos** | MongoDB (Mongoose) |
| **Seguridad** | Passport, JWT, Bcrypt |
| **Testing** | Jest, Supertest |
| **Documentación** | Swagger / OpenAPI |

---

## Instrucciones de Instalación y Ejecución

### Requisitos Previos
* **Docker & Docker Compose** (Recomendado)
* O bien: Node.js (v18+) y una instancia de MongoDB corriendo localmente.

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
2.  **Configurar entorno:** Asegúrate de tener MongoDB corriendo en `localhost:27017` o configura tu `.env`.
3.  **Iniciar servidor:**
    ```bash
    npm run start:dev
    ```

---

## Seguridad y Lógica de Negocio

### 1. Gestión de Perfiles (Business Logic)
El sistema utiliza códigos de perfil para abstraer la creación de roles. Al crear o editar un usuario, no se envían objetos complejos, sino un código simple:

| Código | Rol Generado | Permisos |
| :--- | :--- | :--- |
| **`C01`** | **Admin** | Acceso total (Crear, Leer, Editar, Borrar). |
| **`C02`** | **User** | Acceso limitado (Solo lectura). |

### 2. Autenticación (RBAC con JWT)
El sistema implementa control de acceso basado en roles.
* **Rutas Públicas:** Login.
* **Rutas Privadas:** Gestión de usuarios (Requiere Header `Authorization: Bearer <token>`).

### Cómo probar en Swagger
1.  Ve al endpoint `POST /auth/login` e ingresa credenciales válidas.
2.  Copia el `access_token` de la respuesta.
3.  Sube al botón verde **Authorize** (arriba a la derecha).
4.  Pega el token en el campo `Value`, haz clic en **Authorize** y luego **Close**.
5.  Ahora puedes ejecutar las rutas protegidas (candado cerrado).

---

## Endpoints Disponibles

La documentación interactiva completa se encuentra en: [http://localhost:3000/api](http://localhost:3000/api)

| Método | Endpoint | Descripción | Auth | Nota |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Login y obtención de Token | 🔓 No | Retorna JWT |
| `GET` | `/users` | Listar usuarios | 🔒 Sí | Filtros opcionales |
| `GET` | `/users/:id` | Obtener usuario por ID | 🔒 Sí | Valida MongoID |
| `POST` | `/users` | Crear usuario | 🔒 Sí | Usar `codigoPerfil`: "C01" o "C02" |
| `PATCH` | `/users/:id` | Actualizar usuario | 🔒 Sí | Actualiza perfil por código |
| `DELETE` | `/users/:id` | Eliminar usuario | 🔒 Sí | Soft o Hard delete según config |

---

## Pruebas Unitarias (Testing)

Este proyecto cuenta con una suite robusta de pruebas unitarias implementadas con **Jest**. Se utiliza la técnica de **Mocking** para aislar dependencias y garantizar la fiabilidad del código sin requerir conexión real a la base de datos durante los tests.

### Comandos de Testing

```bash
# Ejecutar todas las pruebas unitarias
npm run test

# Ejecutar pruebas en modo "reloj" (Watch Mode)
# Ideal para desarrollo, re-ejecuta tests al guardar cambios
npm run test:watch

# Ver reporte de Cobertura de Código (Code Coverage)
# Genera un reporte detallado del % de código probado
npm run test:cov
```

### Alcance de las Pruebas (Coverage Scope)
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