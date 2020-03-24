require('dotenv').config({ path: 'safety.env' });
const teamQuery = require('./getTeamData.js');
const eventQuery = require('./getEventData');
const Discord = require('discord.js')
const magneBot = new Discord.Client();
const TOKEN = process.env.TOKEN;

magneBot.login(TOKEN).catch(e => console.error(e));

magneBot.on('ready', () => {
  console.info(`Logged in as ${magneBot.user.tag}!`);
});

magneBot.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if (!channel) return;
  channel.send(`Welcome to Team 3340, ${member}`);
});

magneBot.on('message', msg => {
  if(msg.author.bot) return;
  var args = msg.content.split(' ');
  var cmd = args[0].toLowerCase();
  console.log(cmd);
  console.log(args);
  try {
    switch (true) {
      case /!ti|!teaminfo/.test(cmd):
        console.log('teaminfo');
        teamQuery.teamInfo.teamData(msg, args[1]);
        break;
      case /!simpeventinfo|!event(info)?|!ei/.test(cmd):
        console.log("eventinfo");
        eventQuery.eventInfo["event-simple"](msg, args[1], args[2]);
        break;
      case /^!rankings?$|^!rankeventinfo$|^!rankinfo$|^!ri$/.test(cmd):
        console.log("eventsimp");
        eventQuery.eventInfo["event-rankings"](msg, args[1], args[2]);
        break;
      case /^!team[s]?$|^!teamevent$/.test(cmd):
        console.log("teamevent");
        eventQuery.eventInfo["event-teams"](msg, args[1], args[2]);
        break;
      case /^!robots?$|^!r$/.test(cmd):
        console.log("robot");
        if(args.length===3){ 
          teamQuery.teamInfo.teamRobots(msg, args[1], args[2])
        }
        else if (args.length==2){
          teamQuery.teamInfo.teamRobots(msg, args[1])
        }
        break;
      case /^!playoffdata$|^!pd$/.test(cmd):
        if(args.length>=2){ 
          teamQuery.teamInfo.playoffRecord(msg, args[1], args[2], args[3])
        }
      break;
      case /^!qualdata$|^!qd$/.test(cmd):
        if(args.length>=2){ 
          teamQuery.teamInfo.qualRecord(msg, args[1], args[2], args[3])
        }
      break;
      case /^!eventlist$|^!el$/.test(cmd):
          if(args.length>=2){
            teamQuery.teamInfo.eventList(msg, args[1], args[2])
          }
      break;
      case /^!teamawards$|^!awards$/.test(cmd):
        if(args.length>=2){
          teamQuery.teamInfo.teamAwards(msg, args[1], args[2])
        }
        break;
      case /^!teammatches$|^!tm$/.test(cmd):
        if(args.length>=2){
          teamQuery.teamInfo.teamMatches(msg, args[1], args[2]);
        }
        break;
      case /^!matchkeys$|^!mk$/.test(cmd):
        if(args.length>=2){
          teamQuery.teamInfo.matchKeys(msg, args[1], args[2])
        }
        break;
    }
  }
  catch (err) {
    console.log(err)
    throw err;
  }
});