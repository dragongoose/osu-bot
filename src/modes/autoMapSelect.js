/**
 * A class that represents a osu! autoMapSelect lobby.
 * @param {BanchoClient} client BanchoClient
 * @param {string} name The lobbie's name
 * @param {Boolean} pass Generates a random password if true.
 * @param {Array} mapList Array containing map id's to use
 */
class autoMapSelect {
    constructor(client, name, pass, mapList) {
        const run = async () => {
            const chalk = require("chalk");

            let message = chalk.hex("#" + ((1<<24)*Math.random() | 0).toString(16))(`[*]  ${name} >`);
            //let success = chalk.green(`[!]  ${name} >`);
            //let warn = chalk.yellow(`[!]  ${name} >`);
            //let danger = chalk.red(`[!] ${name} >`);

            const exec = require("child_process").exec;
            const os = require("os");
            const platform = os.platform();


            console.log(`${message} Making a Auto Map Rotate lobby`);

            this.channel = await client.createLobby(name);
            this.lobby = this.channel.lobby;

            

            if (pass) {
                //generate random password
                this.password = Math.random().toString(36).substring(8);
                await this.lobby.setPassword(this.password);

                console.log(`${message} Name is ${this.lobby.name}`);
                console.log(`${message} Password is ${this.password}`);
            } else {
                await this.lobby.setPassword("");
                console.log(`${message} Name is ${this.lobby.name}`);
            }

            console.log(`${message} Setup complete! Lobby is ready.`);

            /**
            * Saves beatmap ids to a file and closes the lobby.
            * @function
            * @returns {closeLobby} Returns Bancho.js closeLobby promise
            */
            this.close = async function close() {
                this.channel.sendMessage("Closing Lobby.");
                return this.lobby.closeLobby();
            };


            //events
            this.lobby.on("playerJoined", (obj) => {
                console.log(`${message} ${obj.player.user.username} joined!`);
            });

            this.lobby.on("playerLeft", (obj) => {
                const index = this.players.indexOf(obj.user.username);
                if (index > -1) {
                    this.players.splice(index, 1);
                }
                console.log(`${message} ${obj.user.username} left!`);
            });

            this.lobby.on("matchFinished", () => {
                // Shift array to go through songs
                mapList.push(mapList.shift());
                this.lobby.setMap(mapList[0]);  
            });

            this.lobby.on("beatmapId", async (id) => {
                if(id == null) return;

                console.log(`${message} Beatmap changed to ${id}`);
                if (platform === "linux") {
                    exec(`curl https://osu.ppy.sh/osu/${id} | oppai - -ojson`, (error, stdout, stderr) => {
                        if (!stdout) {
                            return console.log(stderr);
                        }
                        const mapinfo = JSON.parse(stdout);

                        this.channel.sendMessage(`[https://osu.ppy.sh/osu/${id} ${mapinfo.artist} - ${mapinfo.title}], MAX COMBO: ${mapinfo.max_combo} | ${mapinfo.pp.toFixed(0)}PP | ${mapinfo.stars.toFixed(2)}* AR${mapinfo.ar.toFixed(1)} CS${mapinfo.cs.toFixed(1)} HP${mapinfo.hp.toFixed(1)} OD${mapinfo.od.toFixed(1)} | Alternitave [https://beatconnect.io/b/${id} beatconnect.io]`);
                    });
                }

                if (platform === "win32") {
                    exec(`powershell -command "(New-Object System.Net.WebClient).DownloadString('https://osu.ppy.sh/osu/${id}') | ./oppai - -ojson"`, (error, stdout, stderr) => {
                        if (!stdout) {
                            return console.log(stderr);
                        }
                        const mapinfo = JSON.parse(stdout);

                        //check if map is within star rating.
                        if(mapinfo.stars >= this.starRating[0] && mapinfo.stars <= this.starRating[1]){
                            this.channel.sendMessage(`[https://osu.ppy.sh/osu/${id} ${mapinfo.artist} - ${mapinfo.title}], MAX COMBO: ${mapinfo.max_combo} | ${mapinfo.pp.toFixed(0)}PP | ${mapinfo.stars.toFixed(2)}* AR${mapinfo.ar.toFixed(1)} CS${mapinfo.cs.toFixed(1)} HP${mapinfo.hp.toFixed(1)} OD${mapinfo.od.toFixed(1)} | Alternitave [https://beatconnect.io/b/${id} beatconnect.io]`);
                        } else {
                            // Check if there is a valid map before the current
                            if(typeof this.usedBeatmaps[this.usedBeatmaps.length - 2] != "number"){
                                this.channel.sendMessage(`${this.lobby.getHost().user.username}, that map is out of the star range! This lobbies star range is ${this.starRating[0].toFixed(2)}*-${this.starRating[1].toFixed(2)}*`);
                            } else {
                                // Revert to last map
                                this.lobby.setMap(this.usedBeatmaps[this.usedBeatmaps.length - 2]);
                                this.channel.sendMessage(`${this.lobby.getHost().user.username}, that map is out of the star range! This lobbies star range is ${this.starRating[0].toFixed(2)}*-${this.starRating[1].toFixed(2)}*`);
                            }
                        }

                        
                    });
                }

                this.usedBeatmaps.push(id);

            });

            this.lobby.on("allPlayersReady", async () => {
                this.channel.sendMessage("Starting game. Good luck!");
                this.lobby.startMatch();
            });



            this.channel.on("message", async (msg) => {
                if (msg.message === "-info") {
                    this.channel.sendMessage("I am a auto host rotate bot. [https://github.com/dragongoose/osu-bot View me here]");
                }

                if (msg.message === "-queue") {
                    this.channel.sendMessage(`Current queue; ${this.players.join(", ")}`);
                }

                if (msg.message.split(" ")[0] === "-start") {
                    let split = msg.message.split(" ");

                    if (!isNaN(parseInt(split[1])) && parseInt(split[1]) > 0) {
                        await this.lobby.startMatch(parseInt(split[1]));
                    }

                    if (!split[1]) {
                        if (msg.user.username != this.lobby.getHost().user.username) {
                            this.channel.sendMessage("Starting round in 30 seconds. Ready up to start faster.");
                            await this.lobby.startMatch(30);
                        } else {
                            this.channel.sendMessage("Starting round, Enjoy!");
                            await this.lobby.startMatch();
                        }

                    }
                }
            });
        };
        run();
    }
}

module.exports.autoMapSelect = autoMapSelect;