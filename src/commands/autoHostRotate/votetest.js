module.exports = {
    name: "votetest",
    description: "test for vote command",

    /**
     * 
     * @param {BanchoClient} client 
     * @param {BanchoMessage} message
     * @param {Array} args 
     * @param {BanchoChannel} channel 
     * @param {BanchoLobby} lobby 
     * @param {Object} plugins
     */
    run: async (client, message, args, channel, lobby, plugins) => {
        const slotsLeft = lobby.size - lobby.players.length + 1;
        const totalPeople = lobby.size - slotsLeft;
        const votePlugin = plugins.get("vote");
        let vote;
        console.log(lobby.votes.get("votetest"));
        // Check if a vote already exitsts
        if(lobby.votes.get("votetest") === undefined ) {
            lobby.votes.set("votetest", new votePlugin.vote(totalPeople, totalPeople, channel, "-votetest"));
        }
        vote = lobby.votes.get("votetest");
        console.log(vote);
        vote.emitter.on("vote", (data) => {
            console.log("vote", data);
        });

        vote.emitter.on("completed", (data) => {
            console.log(data);
            lobby.votes.delete("votetest");
            channel.sendMessage("Vote completed!");
        });
    }
};