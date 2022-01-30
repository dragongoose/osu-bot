const Bancho = require("bancho.js");
require('dotenv').config()
const chalk = require("chalk");
const { autoHostRotate } = require("./modes/autoHostRotate.js")

let message = chalk.cyan('[*]')
let success = chalk.green('[!]')
let warn = chalk.yellow('[!]')
let danger = chalk.red('[!]')

const exec = require('child_process').exec
const os = require("os");
const platform = os.platform();

console.log(process.env.osuname, process.env.osupass)

const client = new Bancho.BanchoClient({ 
    username: process.env.osuname, 
    password: process.env.osupass,
    apiKey: process.env.apiKey,
});

const lobbies = []

client.connect()
    .then(() => {
        lobbies.push(new autoHostRotate(client, "bot test 1", true, chalk));
        lobbies.push(new autoHostRotate(client, "bot test 2", false, chalk));
    })

client.on("disconnected", () => {
    console.log(`${warn} disconnected from bancho.`)
})

client.on("error", (err) => {
    console.log(`${danger} socket error!`)
    console.log(err)
})



process.on("SIGINT", async () => {
	console.log("Closing lobbies and disconnecting...");

    for(let i = 0; i < lobbies.length; i++) {
        lobbies[i].lobby.closeLobby();
        console.log(lobbies[i].usedBeatmaps)
        console.log(`${warn} lobby ${i + 1} closed.`)
    }

	await client.disconnect();
    console.log(`${success} See you next time!`)
});
