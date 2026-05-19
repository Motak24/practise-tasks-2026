import { useEffect, useState } from "react";
import { api } from "../api";

const STATUS_COLOR = {
  new: "#f0ad4e",
  confirmed: "#5cb85c",
  canceled: "#d9534f",
};

export default function AdminPage({ onLogout }) {
  const [requests, setRequests] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const load = () => api.getAllRequests().then(setRequests);

  useEffect(() => {
    load();
    api.getStatuses().then(setStatuses);
  }, []);

  const changeStatus = async (id, id_status) => {
    await api.updateStatus(id, id_status);
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Панель администратора</h2>
        <button className="btn-outline" onClick={onLogout}>
          Выйти
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="empty">Заявок нет</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Мастер</th>
              <th>Дата и время</th>
              <th>Статус</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.full_name}</td>
                <td>{r.phone}</td>
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
                <td>
                  <select
                    value={r.id_status}
                    onChange={(e) => changeStatus(r.id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
