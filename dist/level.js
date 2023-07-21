"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const formula_1 = __importDefault(require("./formula"));
const fs_1 = __importDefault(require("fs"));
const env = JSON.parse(fs_1.default.readFileSync("./env.json", "utf-8"));
/**
 * Class used for creation of the new user.
 * Default (starting) level and XP values can be customized
 */
class User {
    GuildID;
    UserID;
    Level;
    XP;
    constructor(GuildID, UserID) {
        this.GuildID = GuildID;
        this.UserID = UserID;
        this.Level = 0; // Starting level
        this.XP = 0; // Starting XP
    }
}
/**
 * Function calculating user's new level and XP using after sending a message.
 * By default, it uses customizable `formula()` function found in `formula.ts` file.
 * If specified GuildID + UserID isn't found, creates new user with said GuildID and UserID.
 * @param message Discord's message object. Only important parameters are really just message author's ID and message guild's ID.
 */
async function give(message) {
    if (!message.inGuild())
        return;
    try {
        const client = await mongodb_1.MongoClient.connect(env.mongo.uri);
        const coll = client.db(env.mongo.database).collection(env.mongo.collection);
        let user = await coll.findOne({ GuildID: message.guild.id, UserID: message.author.id });
        // If you'd like to save levels globally, get rid of the `GuildID: message.guild.id, ` above.
        // Do the same in lines 47 (creating a profile), 53 (updating) and 78 (fetching information)
        if (!user) {
            user = new User(message.guild.id, message.author.id);
            await coll.insertOne(user);
        }
        const newLevel = (0, formula_1.default)(user.Level, user.XP);
        await coll.updateOne({ GuildID: message.guild.id, UserID: message.author.id }, { $set: { Level: newLevel.level, XP: newLevel.xp } });
        client.close();
        return;
    }
    catch (error) {
        console.error(error);
        return;
    }
}
/**
 * Function used by default in bot's `level` command. Useful for fetching someone's XP and level.
 * Any user mention, no matter where, overrides any previous arguments containing User's Discord ID.
 * If no mentions or IDs are provided, it returns level information about calling user.
 * @param message Discord's message object. Only really useful for getting message guild's ID and sending few messages.
 * @param args Arguments processed from original message. Useful for getting user's ID if nobody is mentioned in the message.
 */
async function check(message, args) {
    const mentionedID = message.mentions.users.first()?.id || args[0] || message.author.id;
    if (!message.inGuild())
        return;
    try {
        const client = await mongodb_1.MongoClient.connect(env.mongo.uri);
        const coll = client.db(env.mongo.database).collection(env.mongo.collection);
        const user = await coll.findOne({ GuildID: message.guild.id, UserID: mentionedID });
        client.close();
        if (!user) {
            message.channel.send(`User does not exist.`);
            return;
        } // Both of these messages can be customized. When modifying anything, ensure level and XP are displayed correctly
        else {
            message.channel.send(`<@${mentionedID}>'s current level is **${user.Level}**!\nTheir current XP is **${user.XP}** (${((user.Level + 1) * 100) - user.XP} to level up)\n\nChat with others to gain XP!`);
            return;
        }
    }
    catch (error) {
        console.error(error);
        return;
    }
}
exports.default = { give, check };
