const { BanchoMessage } = require("bancho.js");

module.exports = {
    name: "start",
    description: "starts the round",

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
        console.log(args);
        if (!isNaN(parseInt(args[0])) && parseInt(args[0]) > 0) {
            await lobby.startMatch(parseInt(args[0]));
        }

        if (!args[0]) {
            if (message.user.username != lobby.getHost().user.username) {
                channel.sendMessage("Starting round in 30 seconds. Ready up to start faster.");
                await lobby.startMatch(30);
            } else {
                channel.sendMessage("Starting round, Enjoy!");
                await lobby.startMatch();
            }

        }
    }
};