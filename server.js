const express = require('express');
const path = require('path');
const cryptoLogic = require('./modules/crypto-logic');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    message: '',
    key: '',
    cipher: 'cesar',
    result: ''
  });
});

app.post('/process', (req, res) => {
  const { message, key, cipher, action } = req.body;
  let result = "";
  const isDecrypt = (action === 'decrypt');

  switch (cipher) {
    case "cesar":
      result = cryptoLogic.cifraCesar(message, key, isDecrypt);
      break;
    case "vigenere":
      result = cryptoLogic.cifraVigenere(message, key, isDecrypt);
      break;
    case "otp":
      result = cryptoLogic.oneTimePad(message, key);
      break;
    case "hill":
      result = cryptoLogic.cifraHill(message, key, isDecrypt);
      break;
    default:
      result = "Selecione um algoritmo.";
  }

  res.render('index', {
    message: message,
    key: key,
    cipher: cipher,
    result: result
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});