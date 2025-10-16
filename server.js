const express = require('express');
const path = require('path');
const cryptoLogic = require('./modules/crypto-logic'); // Importa sua lógica

const app = express();
const port = 3000;

// Configura o EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para ler dados de formulários
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos (CSS, JS client-side, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal (GET) - Exibe a página inicial
app.get('/', (req, res) => {
  // Renderiza o index.ejs com valores iniciais vazios
  res.render('index', {
    message: '',
    key: '',
    cipher: 'cesar', // Valor padrão
    result: ''
  });
});

// Rota (POST) - Processa a criptografia/decriptografia
app.post('/process', (req, res) => {
  // Pega os dados do formulário
  const { message, key, cipher, action } = req.body;
  let result = "";

  // Determina qual função chamar com base na ação e no algoritmo
  const isDecrypt = (action === 'decrypt'); // true se 'decrypt', false se 'encrypt'

  switch (cipher) {
    case "cesar":
      result = cryptoLogic.cifraCesar(message, key, isDecrypt);
      break;
    case "vigenere":
      result = cryptoLogic.cifraVigenere(message, key, isDecrypt);
      break;
    case "otp":
      // A função OTP é a mesma para os dois
      result = cryptoLogic.oneTimePad(message, key);
      break;
    case "hill":
      result = "A Cifra de Hill ainda não foi implementada.";
      break;
    default:
      result = "Selecione um algoritmo.";
  }

  // Renderiza a página novamente, passando os valores e o resultado
  res.render('index', {
    message: message,
    key: key,
    cipher: cipher,
    result: result
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});