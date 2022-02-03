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
     * @param {Object} plugins
     */
    run: async (client, message, args, channel, lobby, plugins) => {
        channel.sendMessage(`Current queue; ${lobby.players.join(", ")}`);
    }
};