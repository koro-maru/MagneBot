const Discord = require('discord.js')
const fetch = require('node-fetch');
module.exports = {
    teamInfo: teamInfo = {
        "help": help,
        "teamData": getTeamInfo,
        "teamRobots":getTeamRobots,
        "qualRecord": getQualRecord,
        "playoffRecord": getPlayoffRecord,
        "eventList": eventList,
        "teamAwards": getTeamAwards,
       /* "teamMatches": getTeamMatchList,
        "matchKeys": matchKeys*/
    }
}


const headers = {
    'X-TBA-Auth-Key': process.env.AUTH_KEY,
    'content-type': 'application/json'
}
async function getTeamData(team) {
    try {
        const response = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}`, { headers: headers })
        const teamInfo = await response.json();
        if (await teamInfo.key === undefined) {
            throw new Error("Team does not exist")
        }
        return teamInfo;
    } catch (error) {
        throw error;
    }
}

function getTeamInfo(msg, team) {
    getTeamData(team).then(res => {
        return objFormatter(res);
    }).then((res => {
        console.log(res)

        msg.channel.send(
            `${res.nickname}
            ==================
            School: ${res.school_name}
            Team Number: ${res.team_number}
            City: ${res.city}
            State: ${res.state_prov}
            Postal Code: ${res.postal_code}
            Website: ${res.website}`);
    })).catch(() => {
        msg.channel.send("That team does not exist.")
    })
}

function getTeamRobots(msg, team, year) {
    fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}/robots`, { headers: headers })
        .then(res => res.json())
        .then(robots => {
            if (!year) {
                let initial = `${team}'s Robots\n========================`
                reactionMenu(msg, initial, robots,  initial, 3, (robot)=>{ 
                    objFormatter(robot);
                    return `Robot: ${robot.robot_name}
                            Year: ${robot.year}\n========================\n`
                })
            }
            else {
                for (const robot in robots) {
                    //To be improved with more efficient searching.
                    if (robot.year === year) {
                        message.channel.send("TBI");
                    }
                }
            }    
        })
}

async function getTeamStatus(team, year, event) {
    if(!event){
            data = await getTeamEvents(team, year)
            event = await data[0].key;
            let x = `https://www.thebluealliance.com/api/v3/team/frc${team}/event/${event}/status`
            console.log(x)
    }
     const status = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}/event/${event}/status`, {headers : headers })
     if(!status){
         console.log(error)
         throw new Error("Something went wrong.");
     }
     let stat = await status.json();
     return await stat;
}


function getTeamAwards(msg, team, event) {
    fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}/event/${event}/awards`, {headers: headers}).then(awards =>{
        let msgString = '';
        for(award in awards){
            msgString+= award.name + '\n';
        }
        msg.channel.send(msgString)
    })
}

/*
function getTeamMatchList(msg, team, event){
    if(!event){
         getTeamEvents(team).then(res => {event = res[0]});
    }
    getMatchInfo(team, event)
    .then(res => res.json())
    .then(matches => {
            let initial = `${team}'s Matches\n========================`
            reactionMenu(msg, initial, matches,  initial, 1, (match)=>{ 
                console.log(match)
                objFormatter(match);
                return `Match Number: ${match.match_number}
                
                        Red Alliance:
                        >${match.alliances.red.team_keys[0]}
                        >${match.alliances.red.team_keys[1]}
                        >${match.alliances.red.team_keys[2]}

                        Score: ${match.alliances.red.score}

                        Blue Alliance: ${robot.year}\n========================\n
                        >${match.alliances.blue.team_keys[0]}
                        >${match.alliances.blue.team_keys[1]}
                        >${match.alliances.blue.team_keys[2]}

                        Score: ${match.alliances.blue.score}
                        
                        Winner: ${match.winning_alliance}`
            })
    }).catch(error=>{
        console.log(error)
        msg.channel.send("Something went wrong.")
    })
}

function matchKeys(msg, team, event) {
    getMatchInfo(team, event).then(matches =>{
        let matchList = '';
        for(let i = 0; i < matches.length; i++){
             matchList+= `${matches[i].match_number}: ${matches[i].key} \n`;
         }
        msg.channel.send(`${team}'s Matches & Keys(${year})\n==========================
        --Use these keys to query for specific matches--\n==========================
                         ${matchList}
                         ` )
        }).catch(error=> {
         console.log(error)
         msg.channel.send("Something went wrong.")
        })
}

async function getMatchInfo(team, event, year) {
    if(!event){
        let data = await getTeamEvents(team, year)
        event = await data[1];
    }

     let data = await fetch(`https://www.thebluealliance.com/api/v3​/team​/frc${team}​/event​/${event.key}/matches​/simple`, { headers: headers })
     if(!data){
        Throw(new Error("Something went wrong."));
    }
     let res = await data.json();
     return await res;
}*/

function help(msg){

}

function getQualRecord(msg, team, year, event){
    getTeamStatus(team, year, event).then(res => {
           let matchPerformance = '';
           for(let i = 0; i < res.qual.sort_order_info.length; i++){
            matchPerformance += `${res.qual.sort_order_info[i].name} : ${res.qual.sort_order_info[i].precision}\n`
           }
           msg.channel.send(
           `${team}'s Qual. Match Data
           ==================
           Status: ${res.qual.status}
           Rank: ${res.qual.ranking.rank}/${res.qual.num_teams}
           Matches Played: ${res.qual.ranking.matches_played}
           Match Avg: ${res.qual.ranking.qual_average}
           ==================
           Record
           ==================
           Losses: ${res.qual.ranking.record.losses}
           Ties: ${res.qual.ranking.record.ties}
           Wins: ${res.qual.ranking.record.wins}
           Violations: ${res.qual.ranking.dq}
           ==================
           Match Scores
           ==================
           ${matchPerformance}
           `)
   }).catch(error =>{
       console.log(error);
       msg.channel.send("Something went wrong");
   });
}

function getPlayoffRecord(msg, team, year, event){
    getTeamStatus(team, year, event)
    .then(res =>{
        if(res.alliance){
        objFormatter(res)
        msg.channel.send(
        `${team}'s Playoff Data
        =======================
        Status: ${res.playoff.status}
        Alliance: ${res.alliance.name}
        Playoff Average: ${res.playoff.playoff_average}
        Wins: ${res.playoff.current_level_record.wins}
        Losses: ${res.playoff.current_level_record.losses}
        Ties: ${res.playoff.current_level_record.ties}`
    )}
    else{   
        msg.channel.send("That team is not in playoffs or was not in playoffs in their latest event.")
    }
}).catch(error => {
        console.log(error)
        msg.channel.send("That team/event does not exist.")
    })
}

function eventList(msg, team, year){
   getTeamEvents(team, year).then(events =>{
   let eventList = '';
   for(let i = 1; i <= events.length; i++){
        eventList+= `${i}: ${events[i-1].name} => ${events[i-1].key}\n`;
    }
   msg.channel.send(`${team}'s Events & Keys (${year})\n==========================
   --Use these keys to query for specific events--\n==========================
                    ${eventList}
                    ` )
   }).catch(error=> {
    console.log(error)
    msg.channel.send("Something went wrong.")
   })
}
async function getTeamEvents(team, year) {
    if (!year) {
        year = new Date().getFullYear();
    }
     let data = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}/events/${year}/simple`, { headers: headers })
     if(!data){
        Throw(new Error("Something went wrong."));
    }
     let res = await data.json();
     return await res;
}

 //Displays information from an array in a menu
 //Must be fixed, if a team has a lesser amount of robots than 
async function reactionMenu(msg, initialMsg, arr, heading, numPerPage, format) {
    var msgString = `${heading}\n`;
    if(arr.length < numPerPage){
        if(arr.length==0 || !arr){
            msgString+="None";
        }
        for(element in arr){
            msgString+=format(element);
        }
        msg.channel.send(msgString)
    }
    else{
    msg.channel.send(initialMsg).then(
        async function (message) {
                await message.react('◀')
                await message.react('▶')
                await message.react('❌')
                
                const leftOver = arr.length % 3 === 0 ? 0 : Math.floor(arr.length % numPerPage);
                const pages = leftOver === 0 ? Math.floor(arr.length / numPerPage) : Math.floor(arr.length / numPerPage + 1);
                var currPage = 0;
                let index = 0;
                const filter = (reaction, user) => {
                    return reaction.emoji.name === "◀" || reaction.emoji.name === "▶" || reaction.emoji.name === "❌" && user.id != message.author.id || (user.id==message.author.id && reaction.emoji.name === '✔️');
                }
                await message.react('✔️')
                message.reactions.cache.get('✔️')
                            .remove()
                            .catch(error => console.error('Failed to remove reactions: ', error));

            const collector = message.createReactionCollector(filter, { time: 50000 });
            collector.on("collect", (reaction) => {
                console.log(`collected ${reaction.emoji.name} something.`)
                console.log(pages)
                console.log(currPage)
                const chosen = reaction.emoji.name;
                msgString = `${heading}\n`;
                if (chosen === "◀") {
                    if (currPage > 0) {
                        currPage--;
                        index -= numPerPage;
                    }
                }
                else if (chosen === "▶") {
                    if (currPage < pages - 1) {
                        currPage++;
                        index += numPerPage;
                    }
                }
                else if (chosen === "❌") {
                    message.channel.send("Terminating menu...")
                    collector.stop();
                }
                if (currPage === pages - 1) {
                    for (let i = index; i < arr.length; i++) {
                        msgString += format(arr[i])
                    }
                }
                else {
                    for (let i = index; i < index + numPerPage; i++) {
                        msgString += format(arr[i]);
                    }
                }
                message.edit(msgString);
            })
        }).catch(error => {
            console.log(error);
            msg.channel.send("Something went wrong.")
        })
    }
}

//currently only functions with simple objects, will be modified later.
async function objFormatter(object) {
    let entries = Object.entries(object);
    for (const [key, value] of entries) {
        if (value === null) {
            object[key] = "N/A";
        }
    }
    return object;
}
