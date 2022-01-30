class autoHostRotate {
    constructor(client, name, pass, chalk) {
        const run = async () => {

            const color = ['red', 'green', 'blue', 'magenta', 'cyan', 'gray', 'orange'];
            const randomnum = Math.floor(Math.random() * color.length);

            let message = chalk[color[randomnum]](`[*]  ${name} >`)
            let success = chalk.green(`[!]  ${name} >`)
            let warn = chalk.yellow(`[!]  ${name} >`)
            let danger = chalk.red(`[!] ${name} >`)

            const exec = require('child_process').exec
            const os = require("os");
            const platform = os.platform();

            this.players = [];

            console.log(`${message} Making a Auto Host Rotate lobby`)

            //Create a lobbu!
            this.channel = await client.createLobby(name);
            this.lobby = this.channel.lobby;

            if (pass) {
                //generate random password
                this.password = Math.random().toString(36).substring(8);
                await this.lobby.setPassword(this.password)
                console.log(`${message} Name is ${this.lobby.name}`)
                console.log(`${message} Password is ${this.password}`)
            } 

            await this.lobby.setPassword("")
            console.log(`${message} Name is ${this.lobby.name}`)

            //events
            this.lobby.on("playerJoined", (obj) => {
                if (obj.player.user.isClient())
                this.lobby.setHost("#" + obj.player.user.id);
                this.players.push(obj.player.user.username)
                console.log(`${message} Made ${obj.player.user.username} host`)
                console.log(`${message} ${obj.player.user.username} joined!`)
            });

            this.lobby.on("playerLeft", (obj) => {
                const index = this.players.indexOf(obj.user.username);
                if (index > -1) {
                    this.players.splice(index, 1);
                }
                console.log(`${message} ${obj.user.username} left!`)
            })

            this.lobby.on("matchFinished", () => {
                this.players.push(this.players.shift());
                this.lobby.setHost(this.players[0])
                console.log(`${message} Made ${this.players[0]} host`)
                this.channel.sendMessage(`Current host order; ${this.players.join(", ")}`)
            });

            this.lobby.on("beatmapId", async (id) => {
                if (platform === 'linux') {
                    exec(`curl https://osu.ppy.sh/osu/${id} | ./oppai - -ojson`, (error, stdout, stderr) => {
                        if (!stdout) {
                            return console.log(stderr)
                        }
                        const mapinfo = JSON.parse(stdout)

                        this.channel.sendMessage(`[https://osu.ppy.sh/osu/${id} ${mapinfo.artist} - ${mapinfo.title}], MAX COMBO: ${mapinfo.max_combo} | ${mapinfo.pp.toFixed(0)}PP | ${mapinfo.stars.toFixed(2)}* AR${mapinfo.ar.toFixed(1)} CS${mapinfo.cs.toFixed(1)} HP${mapinfo.hp.toFixed(1)} OD${mapinfo.od.toFixed(1)} | Alternitave [https://beatconnect.io/b/${id} beatconnect.io]`)
                    })
                }

                if (platform === 'win32') {
                    exec(`powershell -command "(New-Object System.Net.WebClient).DownloadString('https://osu.ppy.sh/osu/${id}') | ./oppai - -ojson"`, (error, stdout, stderr) => {
                        if (!stdout) {
                            return console.log(stderr)
                        }
                        const mapinfo = JSON.parse(stdout)

                        this.channel.sendMessage(`[https://osu.ppy.sh/osu/${id} ${mapinfo.artist} - ${mapinfo.title}], MAX COMBO: ${mapinfo.max_combo} | ${mapinfo.pp.toFixed(0)}PP | ${mapinfo.stars.toFixed(2)}* AR${mapinfo.ar.toFixed(1)} CS${mapinfo.cs.toFixed(1)} HP${mapinfo.hp.toFixed(1)} OD${mapinfo.od.toFixed(1)} | Alternitave [https://beatconnect.io/b/${id} beatconnect.io]`)
                    })
                }
            })

            this.lobby.on("allPlayersReady", async () => {
                this.channel.sendMessage('Starting game. Good luck!')
                this.lobby.startMatch();
            })



            this.channel.on("message", async (msg) => {
                if (msg.message === '-info') {
                    this.channel.sendMessage('I am a auto host rotate bot. [https://github.com/dragongoose/osu-bot View me here]')
                }

                if (msg.message === '-queue') {
                    this.channel.sendMessage(`Current queue; ${players.join(", ")}`)
                }

                if (msg.message.split(" ")[0] === '-start') {
                    let split = msg.message.split(" ")
                    
                    if(parseInt(split[1]) != NaN && parseInt(split[1]) > 0) {
                        await this.lobby.startMatch(parseInt(split[1]));
                    }

                    if(!split[1]) {
                        if(msg.user.username != this.lobby.getHost().user.username){
                            this.channel.sendMessage('Starting round in 30 seconds. Ready up to start faster.')
                            await this.lobby.startMatch(30);
                        } else {
                            this.channel.sendMessage('Starting round, Enjoy!');
                            await this.lobby.startMatch();
                        }

                    }
                }
            })

        }
        run()
    }
}

module.exports.autoHostRotate = autoHostRotate;