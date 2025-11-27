# 🚀 Vivian+ | Sistema de Organización Avanzada de Actividades

[cite_start]El proyecto **Vivian+** es una aplicación web de gestión de tareas diseñada para ir más allá de los gestores básicos, ofreciendo **funcionalidades avanzadas** para la organización individual y colaborativa[cite: 346, 347].

## ✨ Características Principales

[cite_start]Vivian+ está diseñado para mejorar la **productividad** y la **organización**[cite: 383]. Sus características clave incluyen:

* [cite_start]**Gestión Enriquecida de Tareas:** Permite crear, editar, eliminar y marcar tareas, con soporte para adjuntar **imágenes, documentos y enlaces**[cite: 404, 405].
* [cite_start]**Personalización y Seguimiento:** Habilidad para establecer **prioridades, etiquetas y recordatorios** en cada tarea[cite: 406].
* [cite_start]**Colaboración:** Permite **compartir tareas** con otros usuarios y **gestionar actividades en equipo**[cite: 408].
* [cite_start]**Seguridad:** Uso de **JWT** para autenticación segura y cifrado de datos "en tránsito y en reposo"[cite: 407, 411, 472, 473].

---

## 🛠️ Tecnologías Utilizadas

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | Angular 18 con Tailwind CSS | [cite_start]Interfaz gráfica moderna, rápida y responsiva[cite: 368, 375, 414]. |
| **Backend** | Node.js con Express | [cite_start]Servidor escalable y con buena integración[cite: 369, 376]. |
| **Base de Datos** | MySQL | [cite_start]Almacenamiento flexible de tareas y archivos[cite: 370, 377]. |
| **Autenticación** | JWT (JSON Web Tokens) | [cite_start]Gestión segura y sencilla de usuarios[cite: 371, 378]. |
| **Almacenamiento** | Cloud Storage | [cite_start]Gestión de archivos multimedia (ej. AWS S3 o Firebase Storage)[cite: 372, 379]. |

---

## ⚙️ Requisitos Previos

[cite_start]Antes de comenzar la instalación, asegúrese de tener instaladas las siguientes tecnologías[cite: 527, 528]:

* **Node.js** (Obligatorio)
* **MySQL** (Recomendado, junto con una herramienta de administración como MySQL Workbench)
* **Git** (Recomendado, para la clonación del repositorio)

---

## 💻 Guía de Ejecución

Siga estos pasos para instalar y ejecutar la aplicación web **Vivian+**.

### 1. Obtener el Código Fuente

1.  Abra su terminal y navegue al directorio donde desea guardar el proyecto.
2.  [cite_start]Clone el repositorio oficial de Vivian+[cite: 535, 538]:
    ```bash
    git clone [https://github.com/yetshal/vivian-plus.git](https://github.com/yetshal/vivian-plus.git)
    cd vivian-plus
    ```

### 2. Instalación de Dependencias

1.  [cite_start]Instale la **Angular CLI versión 18** de forma global[cite: 544, 545, 546]:
    ```bash
    npm install -g @angular/cli@18
    ```
2.  [cite_start]Instale las dependencias del **Backend** (Node.js/Express)[cite: 549, 552]:
    ```bash
    cd backend
    npm install
    ```
3.  [cite_start]Instale las dependencias del **Frontend** (Angular)[cite: 557, 560]:
    ```bash
    cd ../frontend
    npm install
    ```

### 3. Configuración de la Base de Datos

1.  Abra su herramienta de administración de MySQL (ej. MySQL Workbench).
2.  [cite_start]Cree una nueva base de datos con el nombre exacto: `vivian_plus_db`[cite: 566].
3.  [cite_start]Localice la carpeta `sql_scripts` dentro del directorio del proyecto[cite: 567].
4.  [cite_start]Ejecute el contenido de los scripts SQL dentro de esa carpeta en la base de datos `vivian_plus_db` para crear las tablas (usuario, tarea, equipo, etc.)[cite: 569, 570].

### 4. Iniciar la Aplicación

Para ejecutar la aplicación, debe iniciar el backend y el frontend por separado, cada uno en una terminal distinta.

#### **A. Iniciar el Backend**

1.  [cite_start]Abra una terminal y navegue a la carpeta del backend[cite: 577, 578]:
    ```bash
    cd <ruta_proyecto>/backend
    ```
2.  [cite_start]Inicie el servidor[cite: 581, 583]:
    ```bash
    npm run dev
    ```

#### **B. Iniciar el Frontend**

1.  [cite_start]Abra una **nueva terminal** y navegue a la carpeta del frontend[cite: 587, 589, 590]:
    ```bash
    cd <ruta_proyecto>/frontend
    ```
2.  [cite_start]Inicie la aplicación web de Angular[cite: 591, 592]:
    ```bash
    ng serve -o
    ```
    [cite_start]*(La opción `-o` abre la aplicación automáticamente en su navegador predeterminado)*[cite: 593].

¡Felicidades! [cite_start]Ya puedes comenzar a usar **Vivian+**[cite: 595].