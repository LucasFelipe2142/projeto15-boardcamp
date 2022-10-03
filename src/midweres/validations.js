import Joi from "joi";

export async function validaPostName(req, res, next) {
  const validation = schemaPostName.validate(req.body, {
    abortEarly: true,
  });

  if (validation.error) {
    return res.sendStatus(400);
  }

  next();
}

const schemaPostName = Joi.object().keys({
  name: Joi.string().min(1).required(),
});

export async function validatePostGame(req, res, next) {
  const validation = schemaPostGame.validate(req.body, {
    abortEarly: true,
  });

  if (validation.error) {
    return res.send(validation.error);
  }

  next();
}

const schemaPostGame = Joi.object().keys({
  name: Joi.string().min(1).required(),
  image: Joi.string().uri().required(),
  stockTotal: Joi.number().min(1).required(),
  categoryId: Joi.any().required(),
  pricePerDay: Joi.number().min(1).required(),
});

export async function validatePostClient(req, res, next) {
  const validation = schemaPostClient.validate(req.body, {
    abortEarly: true,
  });

  if (validation.error) {
    return res.send(validation.error);
  }

  next();
}

const schemaPostClient = Joi.object().keys({
  name: Joi.string().min(1).required(),
  phone: Joi.string().min(10).max(11).required(),
  cpf: Joi.string().min(11).max(11).required(),
  birthday: Joi.date().required(),
});

export async function validatePostRental(req, res, next) {
  const validation = schemaPostRental.validate(req.body, {
    abortEarly: true,
  });

  if (validation.error) {
    return res.send(validation.error);
  }

  next();
}

const schemaPostRental = Joi.object().keys({
  customerId: Joi.number().required(),
  gameId: Joi.number().required(),
  daysRented: Joi.number().min(1).required(),
});
