const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");

// Show all scans
db.all("SELECT * FROM scans", [], (err, rows) => {
  if (err) {
    console.error("Error:", err.message);
    return;
  }
  console.log("Scans table data:");
  console.table(rows);
  db.close();
});
