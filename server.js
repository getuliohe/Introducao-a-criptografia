const express = require('express');
const path = require('path');
const cryptoLogic = require('./modules/crypto-logic'); // Importa sua lógica

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
    resultString: '', // Variável para resultados de string
    hillResult: null  // Variável para resultado de Hill
  });
});

app.post('/process', (req, res) => {
  const { message, key, cipher, action } = req.body;
  const isDecrypt = (action === 'decrypt');
  
  let resultString = '';
  let hillResult = null;

  switch (cipher) {
    case "cesar":
      resultString = cryptoLogic.cifraCesar(message, key, isDecrypt);
      break;
    case "vigenere":
      resultString = cryptoLogic.cifraVigenere(message, key, isDecrypt);
      break;
    case "otp":
      const otpResult = cryptoLogic.oneTimePad(message, key);
      if (typeof otpResult === 'string') {
        resultString = otpResult;
      } else {
        resultString = `Decimal: ${otpResult.decimal}  (Binário: ${otpResult.binary})`;
      }
      break;
    case "hill":
      const hillResponse = cryptoLogic.cifraHill(message, key, isDecrypt);
      // Verifica se o retorno é um objeto de sucesso ou uma string de erro
      if (typeof hillResponse === 'object' && hillResponse.type === 'hill') {
        hillResult = hillResponse; // Passa o objeto de matriz
      } else {
        resultString = hillResponse; // Passa a string de erro
      }
      break;
    default:
      resultString = "Selecione um algoritmo.";
  }

  res.render('index', {
    message: message,
    key: key,
    cipher: cipher,
    resultString: resultString,
    hillResult: hillResult
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});