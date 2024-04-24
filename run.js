const { spawn } = require('child_process');

const start = (cmd) => spawn(cmd, [], {
  stdio: ['inherit', 'inherit', 'inherit', 'ipc']
});

const displayTable = () => {
  const cyanColor = '\x1b[36m';
  const redColor = '\x1b[31m';
  const resetColor = '\x1b[0m';

  process.stdout.write(`${cyanColor}┌───────────────────────┐\n`);
  process.stdout.write(`${cyanColor}│  ${redColor}Terminal ready to use!${cyanColor}  │\n`);
  process.stdout.write(`${cyanColor}└───────────────────────┘\n${resetColor}`);
};

const startBash = () => {
  const bashProcess = start('bash');
  bashProcess.on('exit', () => {
    const cyanColor = '\x1b[36m';
    const redColor = '\x1b[31m';
    const resetColor = '\x1b[0m';

    process.stdout.write(`${cyanColor}┌───────────────────────┐\n`);
    process.stdout.write(`${cyanColor}│  ${redColor}Terminal session ended.${cyanColor}  │\n`);
    process.stdout.write(`${cyanColor}└───────────────────────┘\n${resetColor}`);
  });
};

console.clear();
startBash();
displayTable();
