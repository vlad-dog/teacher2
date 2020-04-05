const Discord = require("discord.js");
const fs = require("fs");
let warns = JSON.parse(fs.readFileSync("./warns.json", "utf8"));

module.exports.run = async (bot, message, args) => {

   if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("**| You dont have permission to use this command!**");
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.reply(`I can't find the user you are looking for !`);
  let warnlevel = warns[wUser.id].warns;
  

  let embed = new Discord.RichEmbed()
  .setTitle("Warns")
  .addField("User", wUser.user.tag)
  .addField("Moderator", message.author.tag)
  .addField("Number of warns", `${warnlevel}`)
  .setColor("#f4b342")
  message.channel.send(embed);

}

module.exports.help = {
  name: "warnlvl"
}