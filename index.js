const Discord = require("discord.js")
const client = new Discord.Client()
let value = 0

client.on("ready", () =>{
  console.log('I am ready!');
})

client.on("message", msg =>{
  if(msg.content === "ping"){
    msg.reply("pong")
  }
})

//client.on('message', message => {
//  if(message.content.includes('<#')){
//    checkChannel = message.content.replace(/\D/g,'');
 //   message.reply('Ok. I\'ll send my reminders to <#' + checkChannel + '>.');
 // }
//});

//async function getChannel(server, name) 
//{
//    return server.channels.cache.find(r => r.name == name)
//}

client.on("voiceStateUpdate", (oldState, newState) =>{
  if(newState.channel && newState.channel.name.includes('Crear')){
    value = value+1
    newState.guild.channels.create('General-'+value, {
        type: "voice", //This create a text channel, you can make a voice one too, by changing "text" to "voice"
        permissionOverwrites: [
           {
             id: newState.guild.roles.everyone, //To make it be seen by a certain role, user an ID instead
             allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'], //Allow permissions
             deny: [] //Deny permissions
		        }
        ],
    })
    setTimeout(function(){ 
      let chann = newState.guild.channels.cache.find(r => r.name == 'General-'+value)
      newState.member.voice.setChannel(chann).catch(err => console.log(err));
    }, 500)
  }
})

client.on("voiceStateUpdate", (oldState, newState) =>{
  if(oldState.channel && !oldState.channel.name.includes('Crear') && oldState.channel.members.size == 0){
    newState.guild.channels.cache.find(r => r.name == oldState.channel.name).delete();
    value = value - 1
  }
})

client.login(process.env['TOKEN'])