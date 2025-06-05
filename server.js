const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./db');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.sendStatus(500);
    if (results.length > 0 && password === 'admin123') {
      const token = jwt.sign({ user: username }, 'secretkey');
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Employees
app.get('/api/employees', authenticateToken, (req, res) => {
  connection.query('SELECT * FROM employees', (err, results) => {
    if (err) return res.sendStatus(500);
    res.json(results);
  });
});

app.post('/api/employees', authenticateToken, (req, res) => {
  const { name, email, position } = req.body;
  connection.query('INSERT INTO employees (name, email, position) VALUES (?, ?, ?)',
    [name, email, position],
    err => {
      if (err) return res.sendStatus(500);
      res.sendStatus(201);
    }
  );
});

app.delete('/api/employees/:id', authenticateToken, (req, res) => {
  connection.query('DELETE FROM employees WHERE id = ?', [req.params.id], err => {
    if (err) return res.sendStatus(500);
    res.sendStatus(200);
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));