import express from 'express';
import {
    createServer
} from 'http';
import fetch from 'node-fetch';

function connect(conn, PORT, opts) {
    const app = express();
    const server = createServer(app);
    let _qr = 'invalid';
    conn.ev.on('connection.update', ({
        qr
    }) => qr && (_qr = qr));
    app.use(async (req, res) => {
        res.setHeader('content-type', 'image/png');
        res.end(await toBuffer(_qr));
    });
    server.listen(PORT, () => {
        console.log('App listened on port', PORT);
        opts.keepalive && keepAlive();
    });
}

function pipeEmit(event, event2, prefix = '') {
    const oldEmit = event.emit;
    event.emit = (event, ...args) => {
        oldEmit(event, ...args);
        event2.emit(prefix + event, ...args);
    };
    return {
        unpipeEmit() {
            event.emit = oldEmit;
        }
    };
}

function keepAlive() {
    const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
    if (/(\/\/|\.)undefined\./.test(url)) return;
    setInterval(() => fetch(url).catch(console.error), 5 * 1000 * 60);
}
export default connect;
