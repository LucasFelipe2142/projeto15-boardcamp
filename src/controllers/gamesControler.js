import connection from "../server/server.js";

export async function postgames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  const verifyCategory = await connection.query(
    `SELECT * FROM games WHERE name LIKE $1;`,
    [req.body.name]
  );
  if (verifyCategory.rows.length > 0) return res.sendStatus(409);

  const categoryBd = await connection.query(
    `INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5);`,
    [name, image, stockTotal, categoryId, pricePerDay]
  );

  res.sendStatus(200);
}

export async function getGames(req, res) {
  const Category = await connection.query(`SELECT * FROM games`);
  if (Category.rows.length === 0) return res.sendStatus(404);

  res.send(Category.rows);
}
