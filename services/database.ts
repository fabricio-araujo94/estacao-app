import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabaseSync("estacao");

type State = {
  id: number;
  timestampe: Date;
  temperature: number;
  humidity: number;
  pressure: number;
  rain: number;
};

const initializeDB = () => {
  db.execSync(`CREATE TABLE IF NOT EXISTS estacao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME,
        temperature REAL,
        humidity REAL,
        rain REAL
      );`);

  console.log("DB ok");
};

const saveDataDB = async (
  temperature: string,
  humidity: string,
  rain: string,
  timestamp: string
) => {
  const date = new Date(timestamp);

  const result = await db.runAsync(
    "INSERT INTO estacao (temperature, humidity, rain, timestamp) VALUES (?, ?, ?, ?)",
    [
      temperature,
      humidity,
      rain,
      date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        hourCycle: "h23",
      }),
    ]
  );

  console.log(result.changes);
};

const deleteDataDB = async () => {
  const result = await db.runAsync("DELETE FROM estacao");

  console.log("dados deletados");
};

const getDataDB = async () => {
  const allRows = await db.getAllAsync(`SELECT * FROM estacao`);

  return allRows;
};

export { initializeDB, saveDataDB, getDataDB, deleteDataDB, State };
