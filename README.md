# Prueba Técnica Backend - Gestión de Usuarios

Este repositorio contiene la solución a la prueba técnica para el puesto de Backend Developer. El proyecto consiste en una API REST desarrollada con **NestJS** y **MongoDB**, dockerizada y documentada.

## 📋 Descripción del Proyecto

El objetivo es gestionar usuarios y perfiles mediante operaciones CRUD, implementando validaciones, manejo de errores y filtros de búsqueda.

### Stack Tecnológico
* **Framework:** NestJS (Node.js)
* **Base de Datos:** MongoDB (Mongoose)
* **Validación:** Class-Validator & Class-Transformer
* **Documentación:** Swagger (OpenAPI)
* **Contenerización:** Docker

---

## 🚀 Instrucciones de Instalación y Ejecución

### Requisitos Previos
* Node.js (v18+)
* Docker & Docker Compose (Opcional, pero recomendado)
* Una instancia de MongoDB corriendo localmente (si no usas Docker)

### Opción 1: Ejecución con Docker (Recomendada)
Esta es la forma más rápida de probar la aplicación, ya que levanta tanto la API como la base de datos automáticamente.

1.  **Construir y levantar el contenedor:**
    ```bash
    docker build -t prueba-backend-global-think .
    docker run -p 3000:3000 prueba-backend-global-think
    ```
    *(Nota: Si tuvieras un `docker-compose.yml` que incluya Mongo, sería: `docker-compose up --build`)*

2.  La API estará disponible en: `http://localhost:3000`

### Opción 2: Ejecución Local (Desarrollo)

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Configurar variables de entorno:**
    Asegúrate de tener una instancia de MongoDB corriendo en `mongodb://localhost:27017/prueba-tecnica` o configura un archivo `.env`.

3.  **Levantar el servidor en modo desarrollo:**
    ```bash
    npm run start:dev
    ```

---

## 📚 Documentación de la API (Swagger)

La documentación interactiva de los endpoints está disponible en la ruta `/api`.
* **URL:** [http://localhost:3000/api](http://localhost:3000/api)

Aquí podrás probar directamente los endpoints:
* `GET /users`: Listar usuarios (acepta query param `?search=texto` para filtrar).
* `POST /users`: Crear usuario (valida email único).
* `DELETE /users/:id`: Eliminar usuario (requiere header `role: admin`).

---

## 🧪 Pruebas Unitarias

El proyecto incluye pruebas unitarias utilizando **Jest**.

Para ejecutar los tests:
```bash
npm run test