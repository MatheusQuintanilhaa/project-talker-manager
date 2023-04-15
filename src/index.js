const express = require('express');
const fs = require('fs/promises');
const cryptoToken = require('./middlewares/token');
const password = require('./middlewares/password');
const emails = require('./middlewares/email');
const {
  authorizationRouter,
    invalidToken,
    tokenName,
    createUser,
    validateTalkPresence,
    validateTalkFormat,
  validateRate,

} = require('./routes/Authorization');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

const fileReader = async () => {
  const reader = await fs.readFile('src/talker.json', 'utf-8');
  return JSON.parse(reader);
};

const writeFile = async (talkerArray) => {
  await fs.writeFile('src/talker.json', JSON.stringify(talkerArray));
};

// Requisito 1
app.get('/talker', async (req, res) => {
  const talkers = await fileReader();
  return res.status(200).json(talkers);
});

// Requisito 2
app.get('/talker/:id', async (req, res) => {
  const talkerId = await fileReader();
  const findId = talkerId.find(
    (find) => find.id === Number(req.params.id),
  );
  if (!findId) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  return res.status(200).json(findId);
});

// Requisito 3 e 4

app.post('/login', emails, password, (req, res) => {
  const saveToken = cryptoToken();
  return res.status(200).json({ token: saveToken });
});

// Requisito 5
app.post('/talker', authorizationRouter, invalidToken, tokenName, createUser, validateTalkPresence,
  validateTalkFormat, validateRate, async (req, res) => {
    const writeNote = await fileReader();
    const lastElement = writeNote[writeNote.length - 1].id;
    const newElement = { id: lastElement + 1, ...req.body };
    writeNote.push(newElement);
     await writeFile(writeNote);
    return res.status(201).json(newElement);
});
  
// Requisito 6
app.put('/talker/:id', authorizationRouter, invalidToken, tokenName, createUser,
  validateTalkPresence, validateTalkFormat, validateRate, async (req, res) => {
    const writeNote = await fileReader();
    const { id } = req.params;
    const findId = writeNote.find((find) => find.id === Number(id));
    if (!findId) {
      return res.status(404).json({
  message: 'Pessoa palestrante não encontrada',
});
    }
    const index = writeNote.indexOf(findId);
    const newElement = { id: Number(id), ...req.body };
    writeNote[index] = newElement;
    await writeFile(writeNote);
    return res.status(200).json(newElement);
});

// Requisito 7
app.delete('/talker/:id', authorizationRouter, invalidToken, async (req, res) => {
  const writeNote = await fileReader();
  const { id } = req.params;
  const findId = writeNote.find((find) => find.id === Number(id));
  const index = writeNote.indexOf(findId);
  writeNote.splice(index, 1, '');
      await writeFile(writeNote);
  return res.status(204).json(writeNote);
});

app.listen(PORT, () => {
  console.log('Online');
});
//
