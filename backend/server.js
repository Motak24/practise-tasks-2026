import express from "express";
import cors from "cors";
import { db } from "./connectDB.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
  const { login, password } = req.body;
  db.query(
    "SELECT u.*, r.code as role_code FROM user u JOIN role r ON u.id_role = r.id WHERE u.login = ? AND u.password = ?",
    [login, password],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0)
        return res.status(401).json({ error: "Неверный логин или пароль" });
      const user = rows[0];
      delete user.password;
      res.json(user);
    },
  );
});

app.post("/api/register", (req, res) => {
  const { login, password, full_name, phone } = req.body;
  db.query("SELECT id FROM user WHERE login = ?", [login], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length > 0)
      return res.status(400).json({ error: "Логин уже занят" });
    db.query(
      "INSERT INTO user (id_role, login, password, full_name, phone) VALUES (1, ?, ?, ?, ?)",
      [login, password, full_name, phone],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          id: result.insertId,
          login,
          full_name,
          phone,
          role_code: "user",
        });
      },
    );
  });
});

app.get("/api/masters", (req, res) => {
  db.query("SELECT * FROM master", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/requests/:userId", (req, res) => {
  db.query(
    `SELECT r.*, u.full_name, u.phone, m.name as master_name, s.name as status_name, s.code as status_code
     FROM request r
     JOIN user u ON r.id_user = u.id
     JOIN master m ON r.id_master = m.id
     JOIN status s ON r.id_status = s.id
     WHERE r.id_user = ?
     ORDER BY r.booking_datetime DESC`,
    [req.params.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

app.get("/api/requests", (req, res) => {
  db.query(
    `SELECT r.*, u.full_name, u.phone, m.name as master_name, s.name as status_name, s.code as status_code
     FROM request r
     JOIN user u ON r.id_user = u.id
     JOIN master m ON r.id_master = m.id
     JOIN status s ON r.id_status = s.id
     ORDER BY r.booking_datetime DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

app.post("/api/requests", (req, res) => {
  const { id_user, id_master, booking_datetime } = req.body;
  db.query(
    "INSERT INTO request (id_user, id_master, id_status, booking_datetime) VALUES (?, ?, 1, ?)",
    [id_user, id_master, booking_datetime],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    },
  );
});

app.patch("/api/requests/:id/status", (req, res) => {
  const { id_status } = req.body;
  db.query(
    "UPDATE request SET id_status = ? WHERE id = ?",
    [id_status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    },
  );
});

app.get("/api/statuses", (req, res) => {
  db.query("SELECT * FROM status", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(3002, () => console.log("Server running on http://localhost:3002"));
