// Requisito 4
module.exports = async function validateEmail(req, res, next) {
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const { email } = req.body;
    if (!email || email === undefined) {
    return res.status(400).json({
    message: 'O campo "email" é obrigatório',
});
    }
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({
  message: 'O "email" deve ter o formato "email@email.com"',
});
    }
    next();
};