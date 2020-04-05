const Discord = require ('discord.js');
module.exports.run = async (bot, message, args) => {
    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setColor("#00ff00")
    .setThumbnail(bicon)
    .addField("Hystant now has a site! Come check it out!!", `https://odd-groovy-zenobia.glitch.me/`)
    .addField("Bugs?", "Use the command h?contact to report the problem!")
    
    message.channel.send(botembed);

}

module.exports.help = {
  name:"site"
}