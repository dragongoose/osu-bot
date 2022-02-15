/** Class representing a osu lobby that automatically rotates host */
class autoHostRotate {
    /**
     * Create the lobby
     * @param {BanchoClient} client Bancho.js Client 
     * @param {string} name Name of the lobby
     * @param {boolean} pass Generates a random password if true, unlocked if false
     * @param {Object} regulations beatmap regulations.
     */
    constructor(client, name, pass, regulations) {
        const run = async () => {
            const chalk = require("chalk");

            let message = chalk.hex("#" + ((1 << 24) * Math.random() | 0).toString(16))(`[*]  ${name} >`);
            //let success = chalk.green(`[!]  ${name} >`);
            let warn = chalk.yellow(`[!]  ${name} >`);
            //let danger = chalk.red(`[!] ${name} >`);

            const exec = require("child_process").exec;
            const os = require("os");
            const platform = os.platform();

            const { commands, plugins } = require("../../index.js");

            console.log(`${message} Making a Auto Host Rotate lobby`);

            this.channel = await client.createLobby(name);
            this.lobby = this.channel.lobby;
            // Array is used to keep track of every user in the lobby. Gets shifted for queue.
            this.lobby.players = [];
            // Every beapmap the has been selected in the lobby is logged here. Saved when lobby is closed.
            this.lobby.usedBeatmaps = [];
            // Beatmap regualtions are stored here
            this.lobby.regulations = regulations || {};
            // Store votes for later
            this.lobby.votes = new Map();

            for (const reg in regulations) {
                if (reg === "starRating") {
                    console.log(`${message} Star rating regulation is ${this.lobby.regulations[reg][0]}* - ${this.lobby.regulations[reg][1]}*`);
                } else {
                    console.log(`${message} ${reg} reglation is ${this.lobby.regulations[reg]}`);
                }
            }

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
                const fs = require("fs");

                // remove duplicates
                let lobbyBeatmaps = [...new Set(this.lobby.usedBeatmaps)];

                // eslint-disable-next-line no-undef
                fs.writeFile(`${__dirname}/../logs/beatmap_exports_${Math.floor(Math.random() * 90 + 10)}`, String(lobbyBeatmaps), { flag: "wx" }, (err) => {

                    // In case of a error throw err.
                    if (err) console.log(`${warn} Couldnt save used beatmaps!`);
                });

                return this.lobby.closeLobby();
            };

            /**
             * Reverts to the previous beatmap if possible. 
             * @returns {Boolean} true or false
             */
            this.revert = async () => {
                // Check if there is a valid map before the current
                if (typeof this.lobby.usedBeatmaps[this.lobby.usedBeatmaps.length - 2] != "number") {
                    return false;
                } else {
                    // Revert to last map
                    this.lobby.setMap(this.lobby.usedBeatmaps[this.lobby.usedBeatmaps.length - 2]);
                    return true;
                }
            };

            /**
             * Checks a beatmap to see if it is within the regulations.
             */
            this.checkBeatmap = async (oppai, map) => {
                let brokenRegulations = [];
                let id = oppai.id;
                let successMessage = `[https://osu.ppy.sh/osu/${id} ${oppai.artist} - ${oppai.title}], MAX COMBO: ${oppai.max_combo} | ${oppai.pp.toFixed(0)}PP | ${oppai.stars.toFixed(2)}* AR${oppai.ar.toFixed(1)} CS${oppai.cs.toFixed(1)} HP${oppai.hp.toFixed(1)} OD${oppai.od.toFixed(1)} | Alternitave [https://beatconnect.io/b/${id} beatconnect.io]`;
                let outOfStarRangeMessage = `${this.lobby.getHost().user.username}, that map is out of the star range! This lobbies star range is ${this.lobby.regulations.starRating[0].toFixed(2)}*-${this.lobby.regulations.starRating[1].toFixed(2)}*`;
                let mapTooLongMessage = `${this.lobby.getHost().user.username}, that map is too long! This lobby's max length is ${this.lobby.regulations.maxLength}. | Run -r`;
                let mapTooShortMessage = `${this.lobby.getHost().user.username}, that map is too short! This lobby's min length is ${this.lobby.regulations.minLength}. | Run -r`;

                //check if map is within star rating.
                if (oppai.stars >= this.lobby.regulations.starRating[0] && oppai.stars <= this.lobby.regulations.starRating[1]) {
                    //do nothing
                } else {
                    this.revert();
                    this.channel.sendMessage(outOfStarRangeMessage);
                    brokenRegulations.push("starRating");
                }

                // check beatmap length
                if(this.lobby.regulations.maxLength){
                    if(map.totalLength > this.lobby.regulations.maxLength){
                        this.channel.sendMessage(mapTooLongMessage);
                        brokenRegulations.push("maxLength");
                    } else if(map.totalLength < map.totalLength > this.lobby.regulations.minLength) {
                        this.channel.sendMessage(mapTooShortMessage);
                        brokenRegulations.push("minLength");
                    }
                }

                if(brokenRegulations.length === 0){
                    return this.channel.sendMessage(successMessage);
                } else {
                    return brokenRegulations;
                }

            };


            //events
            this.lobby.on("playerJoined", (obj) => {
                if (obj.player.user.isClient())
                    this.lobby.setHost("#" + obj.player.user.id);
                this.lobby.players.push(obj.player.user.username);
                console.log(`${message} Made ${obj.player.user.username} host`);
                console.log(`${message} ${obj.player.user.username} joined!`);
            });

            this.lobby.on("playerLeft", (obj) => {
                const index = this.lobby.players.indexOf(obj.user.username);
                if (index > -1) {
                    this.lobby.players.splice(index, 1);
                }
                console.log(`${message} ${obj.user.username} left!`);
            });

            this.lobby.on("matchFinished", () => {
                this.lobby.players.push(this.lobby.players.shift());
                this.lobby.setHost(this.lobby.players[0]);
                console.log(`${message} Made ${this.lobby.players[0]} host`);
                this.channel.sendMessage(`Current host order; ${this.lobby.players.join(", ")}`);
            });

            this.lobby.on("beatmap", async (map) => {
                if (map == null) return;
                let id = map.id;

                console.log(`${message} Beatmap changed to ${id}`);
                if (platform === "linux") {
                    exec(`curl https://osu.ppy.sh/osu/${id} | oppai - -ojson`, (error, stdout, stderr) => {
                        if (!stdout) {
                            return console.log(stderr);
                        }
                        const mapinfo = JSON.parse(stdout);

                        // Check if map is within star rating
                        if (mapinfo.stars >= this.lobby.regulations.starRating[0] && mapinfo.stars <= this.lobby.regulations.starRating[1]) {
                            this.channel.sendMessage(`[https://osu.ppy.sh/osu/${id} ${mapinfo.artist} - ${mapinfo.title}], MAX COMBO: ${mapinfo.max_combo} | ${mapinfo.pp.toFixed(0)}PP | ${mapinfo.stars.toFixed(2)}* AR${mapinfo.ar.toFixed(1)} CS${mapinfo.cs.toFixed(1)} HP${mapinfo.hp.toFixed(1)} OD${mapinfo.od.toFixed(1)} | Alternitave [https://beatconnect.io/b/${id} beatconnect.io]`);
                        } else {
                            // Check if there is a valid map before the current
                            if (typeof this.lobby.usedBeatmaps[this.lobby.usedBeatmaps.length - 2] != "number") {
                                this.channel.sendMessage(`${this.lobby.getHost().user.username}, that map is out of the star range! This lobbies star range is ${this.lobby.regulations.starRating[0].toFixed(2)}*-${this.lobby.regulations.starRating[1].toFixed(2)}*`);
                            } else {
                                // Revert to last map
                                this.lobby.setMap(this.lobby.usedBeatmaps[this.lobby.usedBeatmaps.length - 2]);
                                this.channel.sendMessage(`${this.lobby.getHost().user.username}, that map is out of the star range! This lobbies star range is ${this.lobby.regulations.starRating[0].toFixed(2)}*-${this.lobby.regulations.starRating[1].toFixed(2)}*`);
                            }
                        }


                    });
                }

                if (platform === "win32") {
                    exec(`powershell -command "(New-Object System.Net.WebClient).DownloadString('https://osu.ppy.sh/osu/${id}') | ./oppai - -ojson"`, (error, stdout, stderr) => {
                        if (!stdout) {
                            return console.log(stderr);
                        }
                        const oppai = JSON.parse(stdout);

                        this.checkBeatmap(oppai, map);

                    });
                }

                this.lobby.usedBeatmaps.push(id);

            });

            this.lobby.on("allPlayersReady", async () => {
                this.channel.sendMessage("Starting game. Good luck!");
                this.lobby.startMatch();
            });



            this.channel.on("message", async (msg) => {
                if (msg.message[0] != "-") return;
                const args = msg.message.split(" ");
                args.shift();
                const split = msg.message.split(" ");

                if (!commands.get(split[0].replace("-", ""))) return;
                commands.get(split[0].replace("-", ""))
                    .run(client, msg, args, this.channel, this.lobby, plugins);

                console.log(`${message} Command ${chalk.red(split[0].replace("-", ""))} was ran by ${msg.user.username}`);

            });
        };
        run();
    }
}

module.exports.autoHostRotate = autoHostRotate;