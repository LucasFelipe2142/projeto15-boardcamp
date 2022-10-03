import dotenv from "dotenv";
import pg from "pg";

const { Pool } = pg;
dotenv.config();

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function postClient(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const verifyCpf = await connection.query(
    `SELECT * FROM customers WHERE cpf LIKE $1;`,
    [req.body.cpf]
  );
  if (verifyCpf.rows.length > 0) return res.sendStatus(409);

  const ClientsBd = await connection.query(
    `INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4);`,
    [name, phone, cpf, birthday]
  );

  res.sendStatus(200);
}

export async function getClients(req, res) {
  if (req.query.cpf) {
    const Clients = await connection.query(
      `SELECT * FROM customers WHERE cpf LIKE $1;`,
      [`${req.query.cpf}%`]
    );
    if (Clients.rows.length === 0) return res.sendStatus(404);

    res.send(Clients.rows);
  } else {
    const Clients = await connection.query(`SELECT * FROM customers;`);
    if (Clients.rows.length === 0) return res.sendStatus(404);

    res.send(Clients.rows);
  }
}

export async function getId(req, res) {
  console.log(req.params.id);
  const Clients = await connection.query(
    `SELECT * FROM customers WHERE id = $1;`,
    [req.params.id]
  );
  if (Clients.rows.length === 0) return res.sendStatus(404);

  res.send(Clients.rows);
}
