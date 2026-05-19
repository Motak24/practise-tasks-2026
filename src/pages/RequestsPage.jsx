import { useEffect, useState } from "react";
import { api } from "../api";

const STATUS_COLOR = {
  new: "#f0ad4e",
  confirmed: "#5cb85c",
  canceled: "#d9534f",
};

export default function RequestsPage({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [masters, setMasters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id_master: "", date: "", time: "08" });
  const [error, setError] = useState("");

  const load = () => api.getMyRequests(user.id).then(setRequests);

  useEffect(() => {
    load();
    api.getMasters().then(setMasters);
  }, []);

  const hours = [];
  for (let i = 8; i <= 18; i++) hours.push(String(i).padStart(2, "0"));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.id_master || !form.date) {
      setError("Выберите мастера и дату");
      return;
    }
    const booking_datetime = `${form.date} ${form.time}:00:00`;
    try {
      await api.createRequest({
        id_user: user.id,
        id_master: form.id_master,
        booking_datetime,
      });
      setShowForm(false);
      setForm({ id_master: "", date: "", time: "08" });
      load();
    } catch (err) {
      setError(err.error || "Ошибка");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Мои заявки</h2>
        <div>
          <button onClick={() => setShowForm(!showForm)}>+ Новая заявка</button>
          <button className="btn-outline" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </div>

      {showForm && (
        <form className="booking-form" onSubmit={submit}>
          <h3>Новая заявка</h3>
          <select
            value={form.id_master}
            onChange={(e) => setForm({ ...form, id_master: e.target.value })}
          >
            <option value="">— Выберите мастера —</option>
            {masters.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <select
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}:00
              </option>
            ))}
          </select>
          {error && <p className="error">{error}</p>}
          <div className="form-btns">
            <button type="submit">Подать заявку</button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setShowForm(false)}
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {requests.length === 0 ? (
        <p className="empty">Заявок пока нет</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Мастер</th>
              <th>Дата и время</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.master_name}</td>
                <td>{new Date(r.booking_datetime).toLocaleString("ru-RU")}</td>
                <td>
                  <span
                    className="badge"
                    style={{ background: STATUS_COLOR[r.status_code] }}
                  >
                    {r.status_name}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
