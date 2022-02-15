module.exports = {
    name: "vote",
    description: "A class that represents a vote handler",

    vote: /**
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
               this.id = (Math.random() + 1).toString(36).substring(7);
   
               channel.on("message", async (msg) => {
                   if(msg.message === voteCommand) {
                       if(this.usersVoted.indexOf(msg.user.username) === -1) {
                           this.usersVoted.push(msg.user.username);
                           this.emitter.emit("vote", {
                               user: msg.user.username,
                               totalVotes: this.usersVoted.length,
                               votesLeft: this.usersVoted.length - totalVotesPossible,
                               id: this.id
                           });

                           channel.sendMessage(`${msg.user.username} voted! ${this.usersVoted.length - totalVotesPossible}/${this.usersVoted.length}`);
                       } else {
                           channel.sendMessage(`${msg.user.username}, you already voted!`);
                       }

                       if(this.usersVoted.length >= requiredVotes) {
                           return this.emitter.emit("completed", {
                               id: this.id
                           });
                       }
                   }
               });
   
   
   
           };
           run();
       }
   }
};

