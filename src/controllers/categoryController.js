import connection from "../server/server.js";

export async function postCategory(req, res) {
  const verifyCategory = await connection.query(
    `SELECT * FROM categories WHERE name LIKE $1;`,
    [req.body.name]
  );
  if (verifyCategory.rows.length > 0) return res.sendStatus(409);

  const categoryBd = await connection.query(
    `INSERT INTO categories (name) VALUES ($1);`,
    [req.body.name]
  );

  res.sendStatus(200);
}

export async function getCategory(req, res) {
  const Category = await connection.query(`SELECT * FROM categories`);
  if (Category.rows.length === 0) return res.sendStatus(404);

  res.send(Category.rows);
}
