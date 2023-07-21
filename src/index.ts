import discord from "discord.js";
import fs from "fs";
import levels from "./level";

const env: any = JSON.parse(fs.readFileSync("./env.json", "utf-8"));
const client = new discord.Client({ intents: env.bot.intents });

// Event for message creation
// Multiple better ways of event handling exist, such
// as dedicated event handler and separate directory for
// all the events, but nothing like that is needed in our small project
client.on("messageCreate", (message) => {

    // We don't want to give bots XP, but we'd like to
    // give it to every person, no matter if they started
    // their message with or without prefix
    if (message.author.bot) return;
    levels.give(message);
    if (!message.content.startsWith(env.bot.prefix)) return;

    // Message gets chopped into an array of arguments
    // Command gets separated from args, then separated from prefix
    const args: Array<string> = message.content.replace(/\n+|\r+|\s+/g, " ").split(" "); 
    let command: string = args.shift() || "";
    command = command.slice(env.bot.prefix.length, command.length).toLowerCase();

    // If-else chain, validating commands
    // Additional `else ifs` can be added if needed
    if (command === "level") levels.check(message, args);
    return;
});

client.once("ready", () => console.log(`${client.user?.tag} ready`));
client.login(env.bot.token);