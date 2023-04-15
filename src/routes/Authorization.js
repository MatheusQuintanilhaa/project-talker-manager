// requesito 5
const Joi = require('joi');

const authorizationRouter = (req, res, next) => {
    const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({
      message: 'Token não encontrado',
        });
      }
    return next();
};

const invalidToken = (req, res, next) => {
        const { authorization } = req.headers;
     if (!(authorization.length === 16 && typeof authorization === 'string')) {
    return res.status(401).json({
  message: 'Token inválido',
});
     }
    next();
};

const tokenName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'O campo "name" é obrigatório',
    });
  }

  if (name.length < 3) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }

  next();
};

const createUser = (req, res, next) => {
    const { age } = req.body;

    if (!age) {
        return res.status(400).json({ message: 'O campo "age" é obrigatório' });
    }

    const schema = Joi.number().integer().min(18).required();

    const { error } = schema.validate(age);

    if (error) {
        return res.status(400).json({
            message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
        });
    }
    return next();
};

function validateTalkPresence(req, res, next) {
  const { talk } = req.body;

  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }

  if (!talk.watchedAt || talk.watchedAt.trim() === '') {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  const watchedAtRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!watchedAtRegex.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
}

const validateRate = (req, res, next) => {
    const { talk } = req.body;
    if (talk.rate === undefined) {
        return res.status(400).json({
  message: 'O campo "rate" é obrigatório',
});
    }
 if (!Number.isInteger(talk.rate)) {
     return res.status(400).json(
         { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' },
);
 }
    if (talk.rate < 1 || talk.rate > 5) {
     return res.status(400).json(
         { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' },
);
 }
    next();
};

function validateTalkFormat(req, res, next) {
  const { talk } = req.body;

  if (talk && talk.watchedAt) {
    const watchedAtRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!watchedAtRegex.test(talk.watchedAt)) {
        return res.status(400).json(
            { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' },
);
    }
  }

  next();
}

module.exports = {
    authorizationRouter,
    invalidToken,
    tokenName,
    createUser,
    validateTalkPresence,
    validateTalkFormat,
  validateRate,
    
};