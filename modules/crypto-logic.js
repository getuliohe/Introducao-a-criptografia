// 1. Cifra de César
function cifraCesar(str, key, decrypt) {
  const k = parseInt(key, 10);
  if (isNaN(k)) {
    return "A chave para a Cifra de César deve ser um número.";
  }
  const shift = decrypt ? 26 - (k % 26) : k % 26;
  if (shift === 0) return str;
  return str
    .split("")
    .map((char) => {
      const charCode = char.charCodeAt(0);
      if (char >= "A" && char <= "Z") {
        return String.fromCharCode(((charCode - 65 + shift) % 26) + 65);
      }
      if (char >= "a" && char <= "z") {
        return String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join("");
}

// 2. Cifra de Vigenère
function cifraVigenere(str, key, decrypt) {
  if (!key || !/^[a-zA-Z]+$/.test(key)) {
    return "A chave para Vigenère deve ser uma palavra contendo apenas letras.";
  }
  let keyIndex = 0;
  const keyUpper = key.toUpperCase();
  return str
    .split("")
    .map((char) => {
      const charCode = char.charCodeAt(0);
      if (char >= "A" && char <= "Z") {
        const keyChar = keyUpper[keyIndex % keyUpper.length];
        const keyShift = keyChar.charCodeAt(0) - 65;
        const shift = decrypt ? 26 - keyShift : keyShift;
        keyIndex++;
        return String.fromCharCode(((charCode - 65 + shift) % 26) + 65);
      }
      if (char >= "a" && char <= "z") {
        const keyChar = keyUpper[keyIndex % keyUpper.length];
        const keyShift = keyChar.charCodeAt(0) - 65;
        const shift = decrypt ? 26 - keyShift : keyShift;
        keyIndex++;
        return String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join("");
}

// 3. One-Time Pad (OTP) - Retorna Objeto ou String de Erro
function oneTimePad(messageDecimalStr, keyDecimalStr) {
    if (!/^\d+$/.test(messageDecimalStr) || !/^\d+$/.test(keyDecimalStr)) {
        return "A mensagem e a chave para OTP devem ser números decimais.";
    }
    try {
        let messageBinary = BigInt(messageDecimalStr).toString(2);
        let keyBinary = BigInt(keyDecimalStr).toString(2);
        const maxLength = Math.max(messageBinary.length, keyBinary.length);
        messageBinary = messageBinary.padStart(maxLength, '0');
        keyBinary = keyBinary.padStart(maxLength, '0');
        let resultBinary = '';
        for (let i = 0; i < maxLength; i++) {
            if (messageBinary[i] === keyBinary[i]) {
                resultBinary += '0';
            } else {
                resultBinary += '1';
            }
        }
        const cleanBinary = resultBinary.replace(/^0+/, '') || '0';
        const resultBigInt = BigInt('0b' + resultBinary);
        return {
            decimal: resultBigInt.toString(),
            binary: cleanBinary
        };
    } catch (e) {
        return "Erro ao processar o OTP. Verifique os números decimais.";
    }
}

// 4. Cifra de Hill - Retorna Objeto de Matriz ou String de Erro
function cifraHill(message, key, decrypt) {
    const mod = (n, m) => ((n % m) + m) % m;
    const findModInverse = (n, modulus) => {
        n = mod(n, modulus);
        for (let x = 1; x < modulus; x++) {
            if (mod(n * x, modulus) == 1) return x;
        }
        return null;
    };
    let text = message.toUpperCase().replace(/[^A-Z]/g, '');
    if (text.length % 2 !== 0) {
        text += 'X';
    }
    const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (keyUpper.length !== 4) {
        return "A chave para a Cifra de Hill (2x2) deve ter 4 letras.";
    }
    const k = [
        [keyUpper.charCodeAt(0) - 65, keyUpper.charCodeAt(1) - 65],
        [keyUpper.charCodeAt(2) - 65, keyUpper.charCodeAt(3) - 65]
    ];
    let matrix = k;
    if (decrypt) {
        const det = mod(k[0][0] * k[1][1] - k[0][1] * k[1][0], 26);
        const detInverse = findModInverse(det, 26);
        if (detInverse === null) {
            return "A chave não é invertível (determinante não tem inverso modular 26). Não é possível decriptografar.";
        }
        const adjugate = [
            [k[1][1], mod(-k[0][1], 26)],
            [mod(-k[1][0], 26), k[0][0]]
        ];
        matrix = [
            [mod(adjugate[0][0] * detInverse, 26), mod(adjugate[0][1] * detInverse, 26)],
            [mod(adjugate[1][0] * detInverse, 26), mod(adjugate[1][1] * detInverse, 26)]
        ];
    }
    let resultText = '';
    let steps = [];
    for (let i = 0; i < text.length; i += 2) {
        const p1 = text.charCodeAt(i) - 65;
        const p2 = text.charCodeAt(i + 1) - 65;
        const c1 = mod(matrix[0][0] * p1 + matrix[0][1] * p2, 26);
        const c2 = mod(matrix[1][0] * p1 + matrix[1][1] * p2, 26);
        const outputBlock = String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65);
        resultText += outputBlock;
        steps.push({
            inputBlock: text.substring(i, i + 2),
            inputVector: [p1, p2],
            outputVector: [c1, c2],
            outputBlock: outputBlock
        });
    }
    // Retorna o objeto de sucesso da Cifra de Hill
    return {
        type: 'hill', // Adiciona um tipo para verificação
        resultText: resultText,
        keyMatrix: matrix,
        steps: steps
    };
}

// Exporta as funções
module.exports = {
  cifraCesar,
  cifraVigenere,
  oneTimePad,
  cifraHill
};