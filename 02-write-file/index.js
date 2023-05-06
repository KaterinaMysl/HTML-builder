const fs = require('fs');
const path = require('path');
const FilePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(FilePath);
process.stdout.write('Привет. У тебя все получится! Напиши какой ты молодец ↓\n');

process.stdin.on('data', (text) => {
  let stringText = text.toString().trim();
  if (stringText  === 'exit') {
    process.stdout.write('Пока. Удачи тебе :)');
    process.exit();
  } else {
    writeStream.write(text);
  }
});

process.on('SIGINT', () => {
  process.stdout.write('Пока. Удачи тебе :)');
  process.exit();
});