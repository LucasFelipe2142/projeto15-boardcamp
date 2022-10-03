import dotenv from "dotenv";
import pg from "pg";

const { Pool } = pg;
dotenv.config();

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function postRental(req, res) {
  const date = new Date();
  const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
  const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();

  const { customerId, gameId, daysRented } = req.body;

  const verifyGame = await connection.query(
    `SELECT * FROM games WHERE id = $1;`,
    [req.body.gameId]
  );
  if (verifyGame.rows.length === 0) return res.sendStatus(409);

  const verifyCostumer = await connection.query(
    `SELECT * FROM customers WHERE id = $1;`,
    [req.body.customerId]
  );
  if (verifyCostumer.rows.length === 0) return res.sendStatus(409);

  const verifyRentals = await connection.query(
    `SELECT * FROM rentals WHERE "gameId" = $1;`,
    [gameId]
  );
  console.log(verifyRentals.rows.length);
  console.log(verifyGame.rows[0].stockTotal);
  if (verifyRentals.rows.length >= verifyGame.rows[0].stockTotal)
    return res.sendStatus(409);

  const originalPrice = verifyGame.rows[0].pricePerDay * daysRented;

  const returnDate = null;
  const delayFee = null;

  const ClientsBd = await connection.query(
    `INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES ($1,$2,$3,$4,$5,$6,$7);`,
    [
      customerId,
      gameId,
      `${date.getFullYear()}-${month}-${day}`,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
    ]
  );

  res.sendStatus(200);
}

export async function getRentals(req, res) {
  if (req.query.customerId) {
    const Clients = await connection.query(
      `SELECT rentals.*, 
        JSON_BUILD_OBJECT('id',customers.id,'name',customers.name) AS customer,
        JSON_BUILD_OBJECT('id',games.id,'name',games.name,'categoryId',games."categoryId",'categoryName',categories.name) AS game  
        FROM rentals
      JOIN games ON rentals."gameId"=games.id
      JOIN customers ON rentals."customerId"=customers.id
      JOIN categories ON games."categoryId"=categories.id
      WHERE rentals."customerId" = $1;`,
      [req.query.customerId]
    );
    if (Clients.rows.length === 0) return res.sendStatus(404);

    res.send(Clients.rows);
  } else if (req.query.gameId) {
    const Clients = await connection.query(
      `SELECT rentals.*, 
        JSON_BUILD_OBJECT('id',customers.id,'name',customers.name) AS customer,
        JSON_BUILD_OBJECT('id',games.id,'name',games.name,'categoryId',games."categoryId",'categoryName',categories.name) AS game  
        FROM rentals
      JOIN games ON rentals."gameId"=games.id
      JOIN customers ON rentals."customerId"=customers.id
      JOIN categories ON games."categoryId"=categories.id
      WHERE rentals."gameId" = $1;`,
      [req.query.gameId]
    );
    if (Clients.rows.length === 0) return res.sendStatus(404);

    res.send(Clients.rows);
  } else {
    const Clients = await connection.query(
      `SELECT rentals.*, 
      JSON_BUILD_OBJECT('id',customers.id,'name',customers.name) AS customer,
      JSON_BUILD_OBJECT('id',games.id,'name',games.name,'categoryId',games."categoryId",'categoryName',categories.name) AS game  
      FROM rentals 
    JOIN games ON rentals."gameId"=games.id
    JOIN customers ON rentals."customerId"=customers.id
    JOIN categories ON games."categoryId"=categories.id;`
    );
    if (Clients.rows.length === 0) return res.sendStatus(404);

    res.send(Clients.rows);
  }
}