/* eslint-disable no-undef */
const Bancho = require("bancho.js");
require("dotenv").config();
const chalk = require("chalk");
const { autoHostRotate } = require("./modes/autoHostRotate.js");

let message = chalk.cyan("[*]");
let success = chalk.green("[!]");
let warn = chalk.yellow("[!]");
let danger = chalk.red("[!]");

console.log(process.env.osuname, process.env.osupass);

const client = new Bancho.BanchoClient({ 
    username: process.env.osuname, 
    password: process.env.osupass,
    apiKey: process.env.apiKey,
});

const lobbies = [];

try{
    console.log(`${message} Connecting to Bancho.`);
    client.connect()
        .then(() => {
            console.log(`${message} Connected to Bancho!`);

            lobbies.push(new autoHostRotate(client, "bot test", false, [4, 5]));
            //lobbies.push(new autoHostRotate(client, "bot test 2", true));

            client.on("disconnected", () => {
                console.log(`${warn} Disconnected from bancho.`);
            });
        
            client.on("error", (err) => {
                console.log(`${danger} socket error!`);
                console.log(err);
            });
        
        });
} catch (e) {
    console.log("Closing lobbies and disconnecting...");

    for(let i = 0; i < lobbies.length; i++) {
        lobbies[i].close()
            .then(() => {
                console.log(`${warn} lobby ${i + 1} closed.`);
            });

        if(i == lobbies.length) {
            console.log(`${success} See you next time!`);
        }
    }

    client.disconnect();
    console.log(`${success} See you next time!`);
}

process.on("SIGINT", async () => {
    console.log("Closing lobbies and disconnecting...");

    for(let i = 0; i < lobbies.length; i++) {
        lobbies[i].close()
            .then(() => {
                console.log(`${warn} lobby ${i + 1} closed.`);
            });

        if(i == lobbies.length) {
            console.log(`${success} See you next time!`);
        }
    }

    await client.disconnect();
});
