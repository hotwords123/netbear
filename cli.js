
'use strict';

const fs   = require('fs');
const Path = require('path');
const net  = require('net');

const { printEx } = require('./printex');

let logger = {
    log(str) {
        printEx(str, { fg: 'green' });
    },
    error(str) {
        printEx(str, { fg: 'red' });
    },
    data(str) {
        printEx(str, { fg: 'cyan', new_line: false });
    }
};

let hostname, port;

try {
    let arr = process.argv.slice(2);
    if (arr.length !== 2 || isNaN(parseInt(arr[1]))) throw new Error('Options: <hostname> <port>');
    hostname = arr[0];
    port = parseInt(arr[1]);
} catch (err) {
    logger.error(err.message);
    process.exit(0);
}

logger.log(`Connecting to ${hostname}:${port}...`);

let client;

try {
    client = net.connect(port, hostname === '*' ? '' : hostname);
} catch (err) {
    logger.error(err.stack);
    process.exit(0);
}

let sentStream = fs.createWriteStream(Path.join(__dirname, 'sent.txt'), {
    encoding: "utf-8"
});
let receivedStream = fs.createWriteStream(Path.join(__dirname, 'received.txt'), {
    encoding: "utf-8"
});

client.on('connect', () => {
    logger.log("Connection established!");
});

client.on('data', (chunk) => {
    logger.data(chunk.toString('utf-8'));
    receivedStream.write(chunk);
});

client.on('close', () => {
    logger.log('\nConnection Closed.');
    saveExit(0);
});

client.on('error', (err) => {
    logger.error(err.stack);
    saveExit(0);
});

process.stdin.on('data', (chunk) => {
    client.write(chunk);
    sentStream.write(chunk);
    //logger.log('Sent: ' + chunk.toString().trimRight());
});

process.on('uncaughtException', (err) => {
    logger.error("Uncaught exception!");
    logger.error(err.stack);
    process.exit(0);
});

function saveExit(code) {
    sentStream.close();
    receivedStream.close();
    process.exit(code);
}
