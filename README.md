# 🧾 Sistema de Gestión de Colaboradores y Empresas

Este proyecto es una API REST construida con **Node.js**, **Express** y **Sequelize**, conectada a una base de datos **MySQL**. Permite gestionar colaboradores, empresas y su ubicación geográfica (país, departamento y municipio).

---

## 🚀 Tecnologías

- Node.js + Express
- Sequelize ORM
- MySQL
- Dotenv
- CORS

---

## 🧠 ¿Qué es Sequelize y por qué lo utilice?

### 🔍 ¿Qué es un ORM?

ORM significa **Object-Relational Mapping** (Mapeo Objeto-Relacional). Es una técnica que permite trabajar con bases de datos relacionales usando objetos en lugar de consultas SQL directas.

En lugar de escribir consultas SQL como:

```sql
SELECT * FROM empresa;
```

Podemos usar código JavaScript como:

```js
await Empresa.findAll();
```

---

### ✅ ¿Por qué utilice Sequelize?

**Sequelize** es un ORM popular para Node.js que nos permite:

- Escribir menos SQL manual.
- Definir modelos como clases en JavaScript.
- Establecer relaciones entre tablas fácilmente (`hasMany`, `belongsTo`, etc.).
- Mantener el código organizado, limpio y escalable.

---

### 🏁 Beneficios

- 🔄 Traduce automáticamente entre objetos JS y registros en la base de datos.
- 🛠 Evita errores comunes en consultas SQL manuales.
- ⚙️ Nos permite trabajar con múltiples bases de datos sin cambiar mucho código.

---

## 🏗 Estructura del Proyecto

```
src/
├── config/
│   └── sequelize.js
├── controllers/
│   ├── colaborador.controller.js
│   ├── empresa.controller.js
│   ├── municipio.controller.js
│   ├── departamento.controller.js
│   └── pais.controller.js
├── models/
│   ├── Colaborador.js
│   ├── Empresa.js
│   ├── Municipio.js
│   ├── Departamento.js
│   ├── Pais.js
│   └── ColaboradorEmpresa.js
├── routes/
│   ├── colaborador.routes.js
│   ├── empresa.routes.js
│   ├── municipio.routes.js
│   ├── departamento.routes.js
│   └── pais.routes.js
├── index.js (relaciones entre modelos)
└── app.js (o server.js)
```

---

## ⚙️ Configuración del Proyecto

### Variables de entorno `.env`
```
DB_NAME=nombre_base_datos
DB_USER=usuario
DB_PASSWORD=clave
DB_HOST=localhost
PORT=3000
```

---

## 🔌 Conexión Sequelize

Archivo `src/config/sequelize.js`:
```js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: true
  }
);

module.exports = sequelize;
```

---

## 📦 Inicialización del Servidor

Archivo principal (por ejemplo `server.js` o `app.js`):
```js
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/sequelize');
require('dotenv').config();
require('./src/models'); // Carga modelos y relaciones

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/paises', require('./src/routes/pais.routes'));
app.use('/api/departamentos', require('./src/routes/departamento.routes'));
app.use('/api/municipios', require('./src/routes/municipio.routes'));
app.use('/api/empresas', require('./src/routes/empresa.routes'));
app.use('/api/colaboradores', require('./src/routes/colaborador.routes'));

// Conexión y sincronización
sequelize.authenticate()
  .then(() => {
    console.log('Conexión Sequelize => MySQL exitosa');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Modelos sincronizados');
  })
  .catch(err => {
    console.error('Error al conectar con Sequelize:', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

---

## 🧩 Modelos Principales

### 📌 Pais
- `nombre` (string, requerido)

### 🗺 Departamento
- `nombre` (string, requerido)
- `id_pais` (FK → País)

### 🏘 Municipio
- `nombre` (string, requerido)
- `id_departamento` (FK → Departamento)

### 🏢 Empresa
- `nombre_comercial`, `razon_social`, `nit` (requeridos)
- `telefono`, `correo`
- `id_municipio` (FK → Municipio)

### 🧍 Colaborador
- `nombre_completo` (requerido)
- `edad`, `telefono`, `correo`

### 🔄 ColaboradorEmpresa (relación N:M)
- `id_colaborador` (FK)
- `id_empresa` (FK)

---

## 🔗 Relaciones

```js
Colaborador.belongsToMany(Empresa, {
  through: ColaboradorEmpresa,
  foreignKey: 'id_colaborador'
});
Empresa.belongsToMany(Colaborador, {
  through: ColaboradorEmpresa,
  foreignKey: 'id_empresa'
});

Empresa.belongsTo(Municipio, { foreignKey: 'id_municipio' });
Municipio.belongsTo(Departamento, { foreignKey: 'id_departamento' });
Departamento.belongsTo(Pais, { foreignKey: 'id_pais' });
```

---

## 📡 Endpoints Principales

| Método | Ruta                        | Descripción                         |
|--------|-----------------------------|-------------------------------------|
| GET    | `/api/paises`               | Listar países                       |
| POST   | `/api/paises`               | Crear país                          |
| PUT    | `/api/paises/:id`           | Actualizar país                     |
| DELETE | `/api/paises/:id`           | Eliminar país                       |
| ...    | `/api/departamentos`        | (mismo CRUD con País incluido)      |
| ...    | `/api/municipios`           | (CRUD con Departamento incluido)    |
| ...    | `/api/empresas`             | (CRUD con Municipio incluido)       |
| ...    | `/api/colaboradores`        | CRUD y asociación con empresas      |

---

## 🔧 Ejemplo de creación de colaborador con empresas

```json
POST /api/colaboradores
{
  "nombre_completo": "Carlos Pérez",
  "edad": 35,
  "telefono": "12345678",
  "correo": "carlos@empresa.com",
  "empresas": [1, 2]
}
```

---

## 📎 Notas

- La API maneja errores básicos (`500`, `404`)
- Las asociaciones se manejan automáticamente por Sequelize
- Las relaciones entre modelos se cargan al importar `index.js` desde `models/`

---

## 🧑‍💻 Autor

Desarrollado por Eduardo Ramirez.

---
---

## 🐘 Base de Datos con XAMPP

Este sistema usa **XAMPP** para montar un servidor MySQL local. Asegúrate de tener Apache y MySQL activos desde el panel de control de XAMPP.

Puedes acceder a **phpMyAdmin** desde:
```
http://localhost/phpmyadmin
```

Allí puedes crear una base de datos (por ejemplo `rrhh`) e importar las siguientes tablas.

---

## 🛠 SQL para crear las tablas

```sql
CREATE TABLE pais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL
);

CREATE TABLE departamento (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  id_pais INT NOT NULL,
  FOREIGN KEY (id_pais) REFERENCES pais(id)
);

CREATE TABLE municipio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  id_departamento INT NOT NULL,
  FOREIGN KEY (id_departamento) REFERENCES departamento(id)
);

CREATE TABLE empresa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_comercial VARCHAR(255) NOT NULL,
  razon_social VARCHAR(255) NOT NULL,
  nit VARCHAR(100) NOT NULL,
  telefono VARCHAR(50),
  correo VARCHAR(100),
  id_municipio INT NOT NULL,
  FOREIGN KEY (id_municipio) REFERENCES municipio(id)
);

CREATE TABLE colaborador (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(255) NOT NULL,
  edad INT,
  telefono VARCHAR(50),
  correo VARCHAR(100)
);

CREATE TABLE colaborador_empresa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_colaborador INT,
  id_empresa INT,
  FOREIGN KEY (id_colaborador) REFERENCES colaborador(id),
  FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);
```

---

## ▶️ Cómo levantar el proyecto

### 🖥 Backend (Node.js + Sequelize)

1. Asegúrate de tener **XAMPP** corriendo con MySQL activo.
2. Crea una base de datos desde phpMyAdmin (por ejemplo: `rrhh`).
3. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
DB_NAME=rrhh
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
PORT=3000
```

4. Instala las dependencias:
```bash
npm install
```

5. Ejecuta el servidor:
```bash
npm run dev
```

> El backend se ejecutará en: `http://localhost:3000`

---

### 🌐 Frontend (React)

> Este paso es opcional si solo estás usando el backend.

1. Navega a la carpeta del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Levanta el proyecto:
```bash
npm run dev
```

> El frontend se ejecutará normalmente en `http://localhost:5173` (el frontend esta creado con Vite + React)

---

🔁 Asegúrate de que tanto el backend como el frontend estén corriendo al mismo tiempo para que la app funcione correctamente.

