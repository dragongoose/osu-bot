module.exports = {
    name: "queue",
    description: "displays the queue",

    /**
     * 
     * @param {BanchoClient} client 
     * @param {BanchoMessage} message
     * @param {Array} args 
     * @param {BanchoChannel} channel 
     * @param {BanchoLobby} lobby 
     */
    run: async (client, message, args, channel, lobby) => {
        channel.sendMessage(`Current queue; ${lobby.players.join(", ")}`);
    }
};