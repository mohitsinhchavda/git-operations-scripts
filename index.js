const simpleGit = require('simple-git');
const express = require('express');
const path = require('path');
const debug = require('debug');
require('dotenv').config();

const app = express();

const directoryPath = path.join(__dirname, "/");

const git = simpleGit(directoryPath, { binary: 'git' });

const GIT_USER = process.env.GIT_USER;

const PASSWORD = process.env.PASSWORD;

let remote;

debug.enable('debug:*');

try {
    async function gitPush() {
        const remotes = await git.getRemotes(true);
        if (remotes.length) {
            remote = remotes[0].name;
            // credentials aren't in the remote ref
            if (remotes[0].refs.push.indexOf("@") < 0) {
                remote = remotes[0].refs.push.replace("://", `://${GIT_USER}:${PASSWORD}@`);
            }
        }
        const pushRes = await git.silent(true).push(remote);
        console.log(pushRes);
    }
    gitPush();
}
catch (e) {
    console.error(r);
}

const server = app.listen(3000);

server.close(() => {
    console.log('Http server closed.');
});