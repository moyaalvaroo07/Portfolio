import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const { Client } = pkg;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de la conexión a PostgreSQL
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',   // Cambia esto con tu usuario de PostgreSQL
  password: 'admin',  // Cambia esto con tu contraseña de PostgreSQL
  database: 'ecommerce'  // Asegúrate de que este sea el nombre correcto de la base de datos
});

client.connect()
  .then(() => console.log("Conexión exitosa a la base de datos"))
  .catch(err => console.error("Error en la conexión a la base de datos:", err));

// Ruta para manejar el login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.status(200).json({ message: 'Login exitoso' });
      } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
      }
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (err) {
    console.error("Error en la consulta de login:", err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para manejar el registro de nuevos usuarios
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const result = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await client.query('INSERT INTO usuarios (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error("Error en el registro:", err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
