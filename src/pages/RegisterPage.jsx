import { useState } from "react";
import { api } from "../api";

export default function RegisterPage({ onLogin, goLogin }) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    login: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.full_name || !form.phone || !form.login || !form.password) {
      setError("Заполните все поля");
      return;
    }
    try {
      const user = await api.register(form);
      onLogin(user);
    } catch (err) {
      setError(err.error || "Ошибка регистрации");
    }
  };

  return (
    <div className="auth-wrap">
      <h2>Регистрация</h2>
      <form onSubmit={submit}>
        <input
          name="full_name"
          placeholder="ФИО"
          value={form.full_name}
          onChange={handle}
        />
        <input
          name="phone"
          placeholder="Телефон"
          value={form.phone}
          onChange={handle}
        />
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
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт?{" "}
        <span className="link" onClick={goLogin}>
          Войти
        </span>
      </p>
    </div>
  );
}
