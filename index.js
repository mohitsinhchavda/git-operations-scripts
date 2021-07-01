const simpleGit = require('simple-git');
const path = require('path');
const debug = require('debug');
const emoji = require('node-emoji')
require('dotenv').config();

const directoryPath = path.join(__dirname, "/");

debug.debug('Debug:*')

const git = simpleGit(directoryPath, { binary: 'git' });

const GIT_USER = process.env.GIT_USER;

const PASSWORD = process.env.PASSWORD;

let remote;

function errorCallback(e){
    console.error(e);
    console.log(`-----! Please try again ${emoji.get(':disappointed_relieved:')} !-----`)
}


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
        const pushedResponse = await git
            .silent(true)
            .push(remote)
            .catch(errorCallback);
        if (pushedResponse && pushedResponse.pushed && Array.isArray(pushedResponse.pushed) && pushedResponse.pushed[0]) {
            if (pushedResponse.pushed[0].alreadyUpdated) {
                console.log(`Already Updated! Go Have some ${emoji.get(':coffee:')} ${emoji.get(':smiley:')} !`);
            }
            else {
                console.log(`Pushed the changes! Now, You can enjoy your pizza now ${emoji.get(':pizza:')}!`);
            }
        }
    }
    gitPush();
}
catch (e) {
    errorCallback(e);
}