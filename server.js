const express = require("express");
const app = express();
const port = 3000;
const db = require("better-sqlite3")("db/mug.db");

// On sert les fichiers statiques du dossier 'public'.
app.use(express.static("public"));

// On traite la requête pour récupérer les scores dans la base de données.
app.get("/getScores", (req, res) => {
  // Requête à la base de données avec un tri
  const rows = db.prepare("SELECT player_name, time, try FROM scores ORDER BY try ASC, time ASC").all();
  //On retourne les scores
  res.send(rows);
});

// On traite la requête pour enregistrer le nouveau score dans la base de données.
app.get("/postScore", (req, res) => {
  res.send("RES");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
