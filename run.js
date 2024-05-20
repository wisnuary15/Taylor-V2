import {
    spawn
} from 'child_process';

const start = (cmd) => spawn(cmd, [], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
});

const displayWelcomeMessage = () => {
    const cyanColor = '\x1b[36m';
    const greenColor = '\x1b[32m';
    const resetColor = '\x1b[0m';

    process.stdout.write(`${cyanColor}───────────────────────────────────────────────────────\n`);
    process.stdout.write(`${cyanColor}   ${greenColor}Welcome to Taylor-V2 Terminal${cyanColor}                                \n`);
    process.stdout.write(`${cyanColor}╰───────────────────────────────────────────────────────╯\n${resetColor}`);
};

const displayTable = () => {
    const cyanColor = '\x1b[36m';
    const redColor = '\x1b[31m';
    const resetColor = '\x1b[0m';

    process.stdout.write(`${cyanColor}───────────────────────────────────────────────────────\n`);
    process.stdout.write(`${cyanColor}   ${redColor}Informasi Terminal yang Berjalan${cyanColor}                         \n`);
    process.stdout.write(`${cyanColor}╰───────────────────────────────────────────────────────╯\n${resetColor}`);
};

const startBash = () => {
    const bashProcess = start(`bash`);
    bashProcess.on('exit', () => {
        const cyanColor = '\x1b[36m';
        const redColor = '\x1b[31m';
        const resetColor = '\x1b[0m';

        process.stdout.write(`${cyanColor}───────────────────────────────────────────────────────\n`);
        process.stdout.write(`${cyanColor}   ${redColor}Informasi Terminal telah Ditutup${cyanColor}                             \n`);
        process.stdout.write(`${cyanColor}╰───────────────────────────────────────────────────────╯\n${resetColor}`);
    });
};

const displaySystemInfo = () => {
    const cyanColor = '\x1b[36m';
    const greenColor = '\x1b[32m';
    const yellowColor = '\x1b[33m';
    const resetColor = '\x1b[0m';

    const platform = process.platform;
    const nodeVersion = process.version;
    const runtime = process.env.RUNTIME || 'Node.js';
    const currentDate = new Date().toLocaleDateString('en-US', {
        timeZone: 'Asia/Jakarta'
    });
    const currentTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta'
    });
    const currentDay = new Date().toLocaleDateString('en-US', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long'
    });
    const author = 'Taylor-V2';

    process.stdout.write(`${cyanColor}Sistem Platform: ${greenColor}${platform}\n`);
    process.stdout.write(`Versi ${runtime}: ${greenColor}${nodeVersion}\n`);
    process.stdout.write(`Tanggal: ${yellowColor}${currentDate}\n`);
    process.stdout.write(`Jam: ${yellowColor}${currentTime}\n`);
    process.stdout.write(`Hari: ${yellowColor}${currentDay}\n`);
    process.stdout.write(`Author: ${greenColor}${author}\n${resetColor}`);
};

console.clear();
displayWelcomeMessage();
startBash();
displayTable();
displaySystemInfo();