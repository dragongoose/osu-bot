module.exports = {
    name: "info",
    description: "displays bot info",

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
        channel.sendMessage("I am a auto host rotate bot. [https://github.com/dragongoose/osu-bot View me here]");
    }
};