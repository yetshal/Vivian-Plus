# 🚀 Vivian+ | Sistema de Organización Avanzada de Actividades

El proyecto **Vivian+** es una aplicación web de gestión de tareas diseñada para ir más allá de los gestores básicos, ofreciendo **funcionalidades avanzadas** para la organización individual y colaborativa.

## ✨ Características Principales

Vivian+ está diseñado para mejorar la **productividad** y la **organización**. Sus características clave incluyen:

* **Gestión Enriquecida de Tareas:** Permite crear, editar, eliminar y marcar tareas, con soporte para adjuntar **imágenes, documentos y enlaces**.
* **Personalización y Seguimiento:** Habilidad para establecer **prioridades, etiquetas y recordatorios** en cada tarea.
* **Colaboración:** Permite **compartir tareas** con otros usuarios y **gestionar actividades en equipo**.
* **Seguridad:** Uso de **JWT** para autenticación segura y cifrado de datos "en tránsito y en reposo".

---

## 🛠️ Tecnologías Utilizadas

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | Angular 18 con Tailwind CSS | Interfaz gráfica moderna, rápida y responsiva. |
| **Backend** | Node.js con Express | Servidor escalable y con buena integración. |
| **Base de Datos** | MySQL | Almacenamiento flexible de tareas y archivos. |
| **Autenticación** | JWT (JSON Web Tokens) | Gestión segura y sencilla de usuarios. |
| **Almacenamiento** | Cloud Storage | Gestión de archivos multimedia (ej. AWS S3 o Firebase Storage). |

---

## ⚙️ Requisitos Previos

Antes de comenzar la instalación, asegúrese de tener instaladas las siguientes tecnologías:

* **Node.js** (Obligatorio)
* **MySQL** (Recomendado, junto con una herramienta de administración como MySQL Workbench)
* **Git** (Recomendado, para la clonación del repositorio)

---

## 💻 Guía de Ejecución

Siga estos pasos para instalar y ejecutar la aplicación web **Vivian+**.

### 1. Obtener el Código Fuente

1.  Abra su terminal y navegue al directorio donde desea guardar el proyecto.
2.  Clone el repositorio oficial de Vivian+:
    ```bash
    git clone [https://github.com/yetshal/vivian-plus.git](https://github.com/yetshal/vivian-plus.git)
    cd vivian-plus
    ```

### 2. Instalación de Dependencias

1.  Instale la **Angular CLI versión 18** de forma global:
    ```bash
    npm install -g @angular/cli@18
    ```
2.  Instale las dependencias del **Backend** (Node.js/Express):
    ```bash
    cd backend
    npm install
    ```
3.  Instale las dependencias del **Frontend** (Angular):
    ```bash
    cd ../frontend
    npm install
    ```

### 3. Configuración de la Base de Datos

1.  Abra su herramienta de administración de MySQL (ej. MySQL Workbench).
2.  Cree una nueva base de datos con el nombre exacto: `vivian_plus_db`.
3.  Localice la carpeta `sql_scripts` dentro del directorio del proyecto.
4.  Ejecute el contenido de los scripts SQL dentro de esa carpeta en la base de datos `vivian_plus_db` para crear las tablas (usuario, tarea, equipo, etc.).

### 4. Iniciar la Aplicación

Para ejecutar la aplicación, debe iniciar el backend y el frontend por separado, cada uno en una terminal distinta.

#### **A. Iniciar el Backend**

1.  Abra una terminal y navegue a la carpeta del backend:
    ```bash
    cd <ruta_proyecto>/backend
    ```
2.  Inicie el servidor:
    ```bash
    npm run dev
    ```

#### **B. Iniciar el Frontend**

1.  Abra una **nueva terminal** y mantenga el backend en ejecución.
2.  Navegue a la carpeta del frontend:
    ```bash
    cd <ruta_proyecto>/frontend
    ```
3.  Inicie la aplicación web de Angular:
    ```bash
    ng serve -o
    ```
    *(La opción `-o` abre la aplicación automáticamente en su navegador predeterminado)*.

¡Felicidades! Ya puedes comenzar a usar **Vivian+**.