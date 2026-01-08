# Prueba Técnica Backend - Gestión de Usuarios

Este repositorio contiene la solución a la prueba técnica para el puesto de Backend Developer. El proyecto consiste en una API REST desarrollada con **NestJS** y **MongoDB**, que incluye gestión de usuarios, validaciones estrictas y un sistema de control de acceso basado en roles (RBAC).

## Características Principales

* **CRUD Completo:** Creación, lectura, actualización y eliminación de usuarios.
* **Persistencia Real:** Uso de MongoDB (Mongoose) en lugar de memoria volátil.
* **Seguridad y Roles:** Implementación de permisos diferenciados para `admin` y `user`.
* **Validaciones:** Uso de DTOs, Enums y Sanitización de datos.
* **Docker:** Entorno contenerizado listo para producción.
* **Documentación:** API documentada automáticamente con Swagger/OpenAPI.

### Stack Tecnológico
* **Framework:** NestJS (Node.js)
* **Base de Datos:** MongoDB (Mongoose)
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

## Seguridad y Roles (RBAC)

El sistema implementa un control de acceso mediante Headers HTTP. Existen dos roles permitidos:

1.  **Admin (`admin`):** Acceso total (Crear, Leer, Actualizar, Borrar).
2.  **User (`user`):** Acceso limitado (Solo Leer/Consultar).

### Cómo probar los permisos en Swagger
Para ejecutar operaciones protegidas (`POST`, `PATCH`, `DELETE`), debes enviar el siguiente **Header** en la petición:

* **Key:** `role`
* **Value:** `admin` (o `user` para probar que te deniegue el acceso).

> **Nota:** Si intentas borrar o crear un usuario enviando `role: user`, recibirás un error `403 Forbidden`.

### Validación de Perfiles
Al crear un usuario, el campo `nombre_perfil` está restringido estrictamente a los valores del sistema (Enum):
* `admin`
* `user`

Cualquier otro valor generará un error `400 Bad Request`.

---

## Endpoints Disponibles

La documentación interactiva se encuentra en: [http://localhost:3000/api](http://localhost:3000/api)

| Método | Endpoint | Descripción | Requiere Rol (Header) |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | Listar usuarios (Filtro `?search=`) |Admin o User |
| `GET` | `/users/:id` | Obtener detalle de usuario | Admin o User |
| `POST` | `/users` | Crear nuevo usuario | Admin |
| `PATCH` | `/users/:id` | Actualizar usuario | Admin |
| `DELETE` | `/users/:id` | Eliminar usuario | Admin |

---

## Pruebas Unitarias

El proyecto incluye pruebas unitarias para Controladores y Servicios, utilizando Mocks para aislar la base de datos.

Para ejecutar los tests:
```bash
npm run test