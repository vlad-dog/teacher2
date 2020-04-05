const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
const ms = require("ms");

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();


fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }
  

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => { 
      bot.aliases.set(alias, props.help.name);
  
  });
});
})
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  bot.user.setActivity(`In Development`);
  bot.user.setStatus('online');
  
  //MUSICCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
  
  const { Client, Util } = require("discord.js");
const { GOOGLE_API_KEY , PREFIX } = require("./confings.js");
const YouTube = require("simple-youtube-api");
const client = new Client({ disableEveryone: true });
const youtube = new YouTube(GOOGLE_API_KEY);
const ytdl = require("ytdl-core")
const queue = new Map();
  const http = require("http");
http
  .createServer(function(request, responce) {
    responce.writeHead(200, { "Content-Type": "text/plain" });
  })
  .listen(3000);
  
  
  
  bot.on("message", async msg => {
  if (msg.author.bot) return undefined;
  if (!msg.content.startsWith(PREFIX)) return undefined;

  const args = msg.content.split(" ");
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(msg.guild.id);

  let command = msg.content.toLowerCase().split(" ")[0];
  command = command.slice(PREFIX.length);

  if (command === "play") {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel)
      return msg.channel.send(
        "I'm sorry but you need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT")) {
      return msg.channel.send(
        "I cannot connect to your voice channel, make sure I have the proper permissions!"
      );
    }
    if (!permissions.has("SPEAK")) {
      return msg.channel.send(
        "I cannot speak in this voice channel, make sure I have the proper permissions!"
      );
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      var embed = new Discord.RichEmbed()
        .setTitle("Song Selection")
        .setDescription(
          `✅ Playlist: **${playlist.title}** has been added to the queue!`
        )
        .setColor("RANDOM");
      return msg.channel.send(embed);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 10);
          let index = 0;
          var embed = new Discord.RichEmbed()
            .setTitle("🎺 Song Selection ✔️")
            .setDescription(
              `${videos
                .map(video2 => `**${++index}** \`${video2.title}\` `)
                .join("\n")}`
            )
            .setColor("#ff2052")
            .setFooter(
              "Please provide a value to select one of the search results ranging from 1-10."
            );

          msg.channel.send(embed);
          // eslint-disable-next-line max-depth
          try {
            var response = await msg.channel.awaitMessages(
              msg2 => msg2.content > 0 && msg2.content < 11,
              {
                maxMatches: 1,
                time: 10000,
                errors: ["time"]
              }
            );
          } catch (err) {
            console.error(err);
            return msg.channel.send(
              "No or invalid value entered, cancelling video selection."
            );
          }
          const videoIndex = parseInt(response.first().content);
          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
          console.error(err);
          return msg.channel.send("🆘 I could not obtain any search results.");
        }
      }
      return handleVideo(video, msg, voiceChannel);
    }
  } else if (command === "skipppppp") {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      return msg.reply("YOU DIDENT HAVE ADMINISTRATOR PERMISSIONS!");
    }

    if (!msg.member.voiceChannel)
      return msg.channel.send("You are not in a voice channel!");
    if (!serverQueue)
      return msg.channel.send(
        "There is nothing playing that I could skip for you."
      );
    const embed = new Discord.RichEmbed()
      .setTitle("Song")
      .setColor("#ff2052")
      .setDescription("✅ Successfully skipped the song");
    msg.channel.send(embed);
    
    serverQueue.connection.dispatcher.end("");

    return undefined;
  } else if (command === "stop") {
    if (!msg.member.voiceChannel)
      return msg.channel.send("You are not in a voice channel!");
    if (!serverQueue)
      return msg.channel.send(
        "There is nothing playing that I could stop for you."
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Stop command has been used!");
    msg.reply("**bot has been stopped !**");
    return undefined;
  } else if (command === "volumeeee") {
    if (!msg.member.voiceChannel)
      return msg.channel.send("You are not in a voice channel!");
    if (!serverQueue) return msg.channel.send("There is nothing playing.");
    if (!args[1])
      return msg.channel.send(
        `The current volume is: **${serverQueue.volume}**`
      );
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 4);
    return msg.channel.send(`I set the volume to: **${args[1]}**`);
  } else if (command === "np") {
    var embed = new Discord.RichEmbed()
      .setTitle("Song Detail")
      .setDescription(`🎶 \`Now playing:\` **${serverQueue.songs[0].title}**`)
      .setColor("#ff2052");
    if (!serverQueue) return msg.channel.send("There is nothing playing.");
    return msg.channel.send(embed);
  } else if (command === "queue") {
    if (!serverQueue) return msg.channel.send("There is nothing playing.");
    var embed = new Discord.RichEmbed()
      .setTitle("Song Queue")
      .setDescription(
        `${serverQueue.songs.map(song => `**• ** ${song.title}`).join("\n")}

🎵 \`Now playing:\` **${serverQueue.songs[0].title}**`
      )
      .setColor("#ff2052");
    return msg.channel.send(embed);
  } else if (command === "pause") {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      var embed = new Discord.RichEmbed()
        .setTitle("Song")
        .setDescription(`⏸ Paused the music for you!`)
        .setColor("#ff2052");
      msg.channel.send(embed);
    }
  } else if (command === "resume") {
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      var embed = new Discord.RichEmbed()
        .setTitle("Song")
        .setDescription(`▶ Resumed the music for you!`)
        .setColor("#ff2052");
      msg.channel.send(embed);
    }
  }
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
  const serverQueue = queue.get(msg.guild.id);
  console.log(video);
  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`
  };
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 10,
      playing: true
    };
    queue.set(msg.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(msg.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(`I could not join the voice channel: ${error}`);
      queue.delete(msg.guild.id);
      return msg.channel.send(`I could not join the voice channel: ${error}`);
    }
  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    if (playlist) return undefined;
    var embed = new Discord.RichEmbed()
      .setTitle("Song Selection")
      .setDescription(
        `✅ Playlist: **${playlist.title}** has been added to the queue!`
      )
      .setColor("#ff2052");
    return msg.channel.send(embed);
  }
  return undefined;
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  console.log(serverQueue.songs);

    const dispatcher = serverQueue.connection
    .playStream(ytdl(song.url))
    .on("end", reason => {
      if (reason === "Stream is not generating quickly enough.")
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 10); 
  
  var embed = new Discord.RichEmbed()
    .setTitle("Song Selection")
    .setDescription(`🎵 \`Start playing:\` **${song.title}**`)
    .setColor("#ff2052");
  serverQueue.textChannel.send(embed);
}


  
  //ENDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD

  bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let prefix = botconfig.prefix
    let messageArray = message.content.split(" ");
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let commandfile;

    if (bot.commands.has(cmd)) {
      commandfile = bot.commands.get(cmd);
  } else if (bot.aliases.has(cmd)) {
    commandfile = bot.commands.get(bot.aliases.get(cmd));
  }
  
      if (!message.content.startsWith(prefix)) return;

          
  try {
    commandfile.run(bot, message, args);
  
  } catch (e) {
  }}
  )})