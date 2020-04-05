const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  
  let xdemb = new Discord.RichEmbed()
        .setColor("#00ff00")
        .setTitle("ERROR commands")
        .addField("Admin Commands -----> 👊🏻", 'Ban, unban, kick, clear, say, addrole, removerole, mute, unmute, warn, lockdown, lockdown release, warns')                                                                                                                                                                                                                                                         
        .addField("Fun Commands -----> 🥂", '  8ball, cat, dog, clap, joke, kill, morse, reverse, gay, meme, burn, hug')                    
        .addField("Utility Commands -----> 💡", `avatar, botinfo, userinfo, invite, support, serverinfo, weather`)
        .addField("NSFW Commands -----> 🔒", '4k, anal, ass, hentai, holo, pussy, thigh, boobs')
        .addField("Welcome Manager <BETA> -----> 📥", 'Use >setwlc #chanel for set welcome message')
        .addField("Moderation Logs -----> 📌", 'Use >setlogs Pentru a face automat un canal pentru logs.')
        .addField("Music -----> 🎵", 'play , stop , np (now play), queue , pause, resume.')
        .addField("SUPPORT", 'Daca ceva nu merge dm la Munteanu.')
  
  message.channel.send(xdemb);
  
      }
      module.exports.help = {
        name: "help"
      }
  
