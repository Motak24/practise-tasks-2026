const BASE = "http://localhost:3002/api";

export const api = {
  login: (data) => post("/login", data),
  register: (data) => post("/register", data),
  getMasters: () => get("/masters"),
  getStatuses: () => get("/statuses"),
  getMyRequests: (userId) => get(`/requests/${userId}`),
  getAllRequests: () => get("/requests"),
  createRequest: (data) => post("/requests", data),
  updateStatus: (id, id_status) =>
    patch(`/requests/${id}/status`, { id_status }),
};

async function get(path) {
  const r = await fetch(BASE + path);
  if (!r.ok) throw await r.json();
  return r.json();
}

async function post(path, body) {
  const r = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw data;
  return data;
}

async function patch(path, body) {
  const r = await fetch(BASE + path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw data;
  return data;
}
