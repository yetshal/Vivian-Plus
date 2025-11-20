const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
require('dotenv').config();

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validación básica
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Formato de email inválido' 
      });
    }

    // Verificar si el usuario ya existe
    const [existingUser] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        message: 'El email ya está registrado' 
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario en la base de datos
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hashedPassword]
    );

    // Generar token
    const token = jwt.sign(
      { id: result.insertId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token: token,
      user: {
        id: result.insertId,
        nombre: nombre,
        email: email
      }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ 
      message: 'Error al registrar usuario',
      error: error.message 
    });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son obligatorios' 
      });
    }

    // Buscar usuario
    const [users] = await pool.query(
      'SELECT id, nombre, email, password FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    const user = users[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token: token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error al iniciar sesión',
      error: error.message 
    });
  }
};

// Obtener información del usuario actual
const getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, nombre, email, fecha_creacion FROM usuarios WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ 
      message: 'Error al obtener perfil',
      error: error.message 
    });
  }
};

module.exports = { register, login, getProfile };