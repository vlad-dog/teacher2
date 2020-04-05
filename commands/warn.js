const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warns.json", "utf8"));

module.exports.run = async (bot, message, args) => {
  message.delete();

  if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("**You dont have permission to use this command!**");
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(wUser === message.author) return message.channel.send("You can't warn youself silly!")
  if(!wUser) return message.reply("I can't find the user you are looking for!");
  let reason = args.join(" ").slice(22);
if(!reason) return message.channel.send("For what reason?")
  if(!warns[wUser.id]) warns[wUser.id] = {
   
  };

  warns[wUser.id].warns+

  fs.writeFile("./warns.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });

  let warnEmbed = new Discord.RichEmbed()
  .setTitle("Warn")
  .setColor("#fc6400")
  .addField("User", `${wUser.user.tag}`)
  .addField("Moderator", `${message.author.tag}`)
  .addField("Number of warns", warns[wUser.id].warns)
  .addField("Reason", `${reason ? reason : "Niciunul."}`);

  let warnchannel = message.guild.channels.find(`name`, "log");
  if(!warnchannel) return message.channel.send(" **| Nu pot gasi mod-log**");
  warnchannel.send(warnEmbed);
  message.channel.send(`${wUser.user.tag} has been warned by ${message.author.tag} for **${reason}**`)

  
}

module.exports.help = {
  name: "warn"
}