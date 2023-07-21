### Discord level bot, written in Typescript

Simple Discord level bot, written in **Typescript** with the help of **Discord.js v14**. Utilizes **MongoDB** for storing users' levels. Each user gets their unique level profile for every guild they join with bot active. You can opt-out of this behavior by removing every occurence of `GuildID: message.guild.id, ` from `level.ts` file, so the program does not care about message's guild, and instead saves levels globally.

Before doing anything, make sure you've compiled the Typescript code with a compiler, such as `tsc`. You can then insert your data into `env.json` file, most importantly bot's token, MongoDB URI, database and collection names.

*Before running it*, you need to install all the required modules. Use `npm install discord.js` to install newest version of Discord.js v14. Use `npm install mongodb` to install MongoDB driver. Use `npm install @types/mongodb` to install Typescript types for mongodb. Congratulations, your own copy of the bot can be run. Navigate to bot's directory and use `node .` command. <br>
*Let me know if I forgot any of the modules or it doesn't work*

The bot is highly customizable out of the box. For more information, refer to comments in individual files.