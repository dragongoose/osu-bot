module.exports = {
    name: "r",
    description: "displays regulations",

    /**
     * 
     * @param {BanchoClient} client 
     * @param {BanchoMessage} message
     * @param {Array} args 
     * @param {BanchoChannel} channel 
     * @param {BanchoLobby} lobby 
     * @param {Object} plugins
     */
    run: async (client, mesage, args, channel, lobby, plugins) => {
        let regulations = lobby.regulations;
        let regtext = [];

        console.log(regulations);

        regtext.push(`Star range: ${regulations.starRating[0]}* - ${regulations.starRating[1]}*`);

        channel.sendMessage(regtext.join(" "));
    }
};