const express = require('express');
const fs = require('fs/promises');

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

// Requisito 3

app.listen(PORT, () => {
  console.log('Online');
});
//