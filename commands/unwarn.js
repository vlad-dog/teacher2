const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async (bot, message, args) => {
  message.delete();

  if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You don't have permission to use this command!");
  let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.reply("I can't find the user you are looking for !");
  let reason = args.join(" ").slice(22);
if(!reason) return message.channel.send("Reason for unwarning?")
  if(!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };

  warns[wUser.id].warns--;

  fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });

  let warnEmbed = new Discord.RichEmbed()
  .setTitle("UnWarn")
  .setColor("#fc6400")
  .addField("User", `${wUser.user.tag}`)
  .addField("Moderator", `${message.author.tag}`)
  .addField("Numar de warnuri", warns[wUser.id].warns)
  .addField("Reason", `${reason ? reason : "Niciunul."}`);

  let warnchannel = message.guild.channels.find(`name`, "mod-log");
  if(!warnchannel) return message.channel.send(" **| Nu pot gasi mod-log**");
  warnchannel.send(warnEmbed);
  message.channel.send(" **| Utilizatorului i s a scos 1 warn,traiasca Romania!.**")
  
}

module.exports.help = {
  name: "unwarn"
}