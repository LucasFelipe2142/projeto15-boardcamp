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
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

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

export async function postCompleteRental(req, res) {
  const now = new Date();
  console.log("aoba");

  const verifyRentals = await connection.query(
    `SELECT * FROM rentals WHERE id = $1;`,
    [req.params.id]
  );

  if (verifyRentals.rows.length === 0) return res.sendStatus(409);

  if (verifyRentals.rows[0].returnDate !== null) return res.sendStatus(404);

  const verifyGame = await connection.query(
    `SELECT * FROM games WHERE id = $1;`,
    [verifyRentals.rows[0].gameId]
  );

  if (verifyGame.rows.length === 0) return res.sendStatus(409);

  let dia_certo = new Date(verifyRentals.rows[0].rentDate);
  dia_certo = dia_certo.getTime();
  console.log(dia_certo);

  const dia_entregou = now.getTime();

  const mili_dia = 1.15741e-8;

  let atraso = (dia_entregou - dia_certo) * mili_dia;
  atraso = parseInt(atraso);
  atraso = atraso * verifyGame.rows[0].pricePerDay;
  console.log(atraso);

  const updateDate = await connection.query(
    `UPDATE rentals SET "returnDate"= $1 WHERE id = $2;`,
    [now, req.params.id]
  );
  const updateDate2 = await connection.query(
    `UPDATE rentals SET "delayFee"= $1 WHERE id = $2;;`,
    [atraso, req.params.id]
  );
  res.sendStatus(201);
}

export async function deleteRentals(req, res) {
  const verifyRentals = await connection.query(
    `SELECT * FROM rentals WHERE id = $1;`,
    [req.params.id]
  );

  if (verifyRentals.rows.length === 0) return res.sendStatus(404);
  if (verifyRentals.rows[0].returnDate === null) return res.sendStatus(400);

  const deleteRentals = await connection.query(
    `DELETE FROM rentals WHERE id = $1;`,
    [req.params.id]
  );
  res.sendStatus(201);
}
