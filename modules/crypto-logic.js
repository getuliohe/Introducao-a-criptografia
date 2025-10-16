// 1. Cifra de César
function cifraCesar(str, key, decrypt) {
  const k = parseInt(key, 10);
  if (isNaN(k)) {
    // Trocado alert por return
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
     // Trocado alert por return
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

// 3. One-Time Pad (OTP) - VERSÃO CORRIGIDA
function oneTimePad(messageDecimalStr, keyDecimalStr) {
    // Validação para garantir que a entrada contém apenas dígitos
    if (!/^\d+$/.test(messageDecimalStr) || !/^\d+$/.test(keyDecimalStr)) {
        // Trocado alert por return
        return "A mensagem e a chave para OTP devem ser números decimais.";
    }

    // Converte os números decimais (em formato string) para binário (em formato string)
    let messageBinary = parseInt(messageDecimalStr, 10).toString(2);
    let keyBinary = parseInt(keyDecimalStr, 10).toString(2);

    // Encontra o comprimento máximo entre as duas strings binárias
    const maxLength = Math.max(messageBinary.length, keyBinary.length);

    // Garante que ambas as strings binárias tenham o mesmo comprimento,
    // adicionando zeros à esquerda na menor. Isso é crucial para o XOR.
    messageBinary = messageBinary.padStart(maxLength, '0');
    keyBinary = keyBinary.padStart(maxLength, '0');

    let resultBinary = '';
    // Itera por cada bit das strings
    for (let i = 0; i < maxLength; i++) {
        // Realiza a operação XOR bit a bit
        if (messageBinary[i] === keyBinary[i]) {
            resultBinary += '0';
        } else {
            resultBinary += '1';
        }
    }

    // Converte a string binária resultante de volta para um número decimal
    const resultDecimal = parseInt(resultBinary, 2);

    // Retorna o resultado decimal como uma string
    return resultDecimal.toString();
}

// Exporta as funções para serem usadas no server.js
module.exports = {
  cifraCesar,
  cifraVigenere,
  oneTimePad,
};