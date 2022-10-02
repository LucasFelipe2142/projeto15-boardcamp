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
