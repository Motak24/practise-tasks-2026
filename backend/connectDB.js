import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "v4",
});

db.connect((err) => {
  if (err) {
    console.error("Ошибка: ", err);
    return;
  }
  console.log("Подключение к серверу MySQL успешно установлено!");
});
