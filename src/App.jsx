import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RequestsPage from "./pages/RequestsPage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

  if (user) {
    if (user.role_code === "admin") {
      return <AdminPage onLogout={handleLogout} />;
    }
    return <RequestsPage user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="app">
      <div className="app-title">💅 Записываемся на ноготочки</div>
      {page === "login" ? (
        <LoginPage
          onLogin={handleLogin}
          goRegister={() => setPage("register")}
        />
      ) : (
        <RegisterPage onLogin={handleLogin} goLogin={() => setPage("login")} />
      )}
    </div>
  );
}
