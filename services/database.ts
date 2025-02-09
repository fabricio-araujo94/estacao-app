import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabaseSync("estacao");

type State = {
  id: number,
  timestampe: Date,
  temperature: number,
  humidity: number,
  pressure: number,
  rain: number
}

const initializeDB = () => {
    db.execSync(`CREATE TABLE IF NOT EXISTS estacao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        temperature REAL,
        humidity REAL,
        pressure REAL,
        rain REAL
      );`);

    console.log("DB ok")
  };

const saveDataDB = async (temperature: string, humidity: string, pressure: string, rain: string) => {
    const result = await db.runAsync(
        "INSERT INTO estacao (temperature, humidity, pressure, rain) VALUES (?, ?, ?, ?)",
        [temperature, humidity, pressure, rain]
    );

    console.log(result)
};

const getDataDB = async () => {
    const allRows = await db.getAllAsync(`SELECT * FROM estacao`);

    return allRows
}

export { initializeDB, saveDataDB, getDataDB, State }