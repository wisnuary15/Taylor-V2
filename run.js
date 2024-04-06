import {
    spawn
} from 'child_process';
import {
    exec
} from 'child_process';

const start = (cmd) => spawn(cmd, [], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
});

const displayTable = () => console.table([{
    Message: '\x1b[31mTerminal ready to use!\x1b[0m'
}]);

exec('clear');
start('bash');
displayTable();