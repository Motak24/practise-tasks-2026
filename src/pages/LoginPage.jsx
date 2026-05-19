import { useState } from "react";
import { api } from "../api";

export default function LoginPage({ onLogin, goRegister }) {
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.login || !form.password) {
      setError("Заполните все поля");
      return;
    }
    try {
      const user = await api.login(form);
      onLogin(user);
    } catch (err) {
      setError(err.error || "Ошибка входа");
    }
  };

  return (
    <div className="auth-wrap">
      <h2>Вход</h2>
      <form onSubmit={submit}>
        <input
          name="login"
          placeholder="Логин"
          value={form.login}
          onChange={handle}
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handle}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Войти</button>
      </form>
      <p>
        Нет аккаунта?{" "}
        <span className="link" onClick={goRegister}>
          Зарегистрироваться
        </span>
      </p>
    </div>
  );
}
