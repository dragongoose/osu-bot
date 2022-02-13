/* eslint-disable no-undef */
const { glob } = require("glob");
const { promisify } = require("util");

const globPromise = promisify(glob);

let commands = new Map();
let plugins = new Map();

const main = async () => {
    const commandFiles = await globPromise(`${process.cwd()}/src/commands/**/*.js`);
    const pluginFiles = await globPromise(`${process.cwd()}/src/plugins/**/*.js`);

    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            commands.set(file.name, properties);
        }
    });

    pluginFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            plugins.set(file.name, properties);
        }
    });

    const mainScript = require("./src/");
    mainScript.run();
    
};

main();

module.exports.commands = commands;
module.exports.plugins = plugins;