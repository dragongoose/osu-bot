/**
 * A class that represents a vote handler
 * @param {Number} totalVotesPossible The maximum ammount of votes that can be recorded
 * @param {Number} requiredVotes The required ammount of votes for the vote to be sucessful
 * @param {BanchoChannel} channel The channel of the multiplayer lobby 
 * @param {String} voteCommand The command to listen for votes on (Such as -start or -skip)
 */
class vote {
    constructor(totalVotesPossible, requiredVotes, channel, voteCommand){
        const run = async () => {
            const EventEmitter = require("events");
            this.emitter = new EventEmitter();

            this.usersVoted = [];

            this.channel.on("message", async (msg) => {
                if(msg.message === voteCommand) {
                    if(this.usersVoted.indexOf(msg.user.username) != 1) {
                        this.emitter.emit("vote", {
                            user: msg.user.username,
    
                        });
    
                        this.usersVoted.push(msg.user.username);
                    } else {
                        channel.sendMessage(`${msg.user.username}, you already voted!`);
                    }
                }

                if(this.usersVoted.length >= requiredVotes) {
                    this.emit("completed", "finished");
                }
            });



        };
    }
}