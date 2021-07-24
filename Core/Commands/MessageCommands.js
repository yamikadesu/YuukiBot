const fetch = require("node-fetch");
const Discord = require('discord.js');

module.exports = {
  variables: {
    ACTIVITIES : {
        "poker": {
            id: "755827207812677713",
            name: "Poker Night"
        },
        "betrayal": {
            id: "773336526917861400",
            name: "Betrayal.io"
        },
        "yt": {
            id: "755600276941176913",
            name: "YouTube Together"
        },
        "fishington": {
            id: "814288819477020702",
            name: "Fishington.io"
        }
    }
  },
  get: [
    {name: "ping", type: "message", description:"",
      options: {
        requiredParams: 0,
        autoDelete:true
      },
      execute: function(text, message, discord) {
        return `✅ | ¡Pong! \`${discord.getClient().ws.ping}ms\``
      }
    },
    {name: "prefix", type: "message", description:"Permite modificar el \`prefijo\` del bot por el que indiques a continuación", 
      options:{
        requiredParams: 1,
        autoDelete:true
      },
      execute: function(text, message, discord) {
        discord.setPrefix(text[0])
        return `✅ | ¡Hecho! El nuevo prefijo será: \`${text[0]}\``
      }
    },
    {name: "autoVoice", type: "message", description:"Tienes que especificar el nombre del canal de \`creación[obligatorio]\` y/o el nombre del canal \`creado[opcional]\`", 
      options:{
        requiredParams: 1,
        autoDelete:true
      },
      execute: function(text, message, discord) {
        if(text.length > 1){
          discord.getVariables("voiceStateUpdate").createdChannelName = text[1]
        }
        discord.getVariables("voiceStateUpdate").creationChannelName = text[0]
        return `✅ | ¡Hecho! El nuevo canal de creación automática de canales será: \`${discord.getVariables("voiceStateUpdate").creationChannelName}\` y los canales creados se llamarán\`${discord.getVariables("voiceStateUpdate").createdChannelName}X\`donde X es el número del canal`
      }
    },
    {name: "act", type: "message", description:"", 
      options: {
        requiredParams: 0,
        autoDelete:true
      },
      execute: async function(text, message, discord) {
        let channel = undefined;
        if(message.member){
          channel = message.member.voice.channel;
        }
        if (!channel || channel.type !== "voice") return "❌ | ¡Canal inválido! Entra en algún canal de voz";
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return "❌ | Necesito el permiso de `CREATE_INSTANT_INVITE`";
        let activity = discord.getVariables("voiceStateUpdate").ACTIVITIES[text[0] ? text[0].toLowerCase() : null];
        if (!activity){
          if(text[0] == "help" || text[0] == "" || !text[0]){
            let actVar = ""
            let activ = Object.keys(discord.getVariables("voiceStateUpdate").ACTIVITIES)
            activ.forEach( x=>{
              if(actVar == ""){
                actVar = x
              }
              else{
                actVar += ", "+x
              }
            })
            return "✅ | Las actividades posibles son: "+actVar;
          }
          else{
            activity = { 
              id: text[0], 
              name: "Custom"
            }
          }
        } 
        //return `❌ | Actividad no encontrada`;
        return fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: activity.id,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${discord.getClient().token}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(invite => {
          if (invite.error || !invite.code){
            return "❌ | No se puede empezar la actividad **"+activity.name+"**!";
          }
          else{
            return "✅ | Pulsa para empezar la actividad **"+activity.name+"** en **"+channel.name+"**: <https://discord.gg/"+invite.code+">";
          }
        })
        .catch(e => {
            return "❌ | No se puede empezar la actividad **"+activity.name+"**!";
        })
      }
    },
    {name: "help", type: "message", description:"", 
      options: {
        requiredParams: 0,
        autoDelete:true
      },
      execute: function(text, message, discord) {
        let messageCommands = ""
        discord.getCommands().forEach(x =>{
          if(x.type == "message"){
            if(messageCommands == ""){
              messageCommands = discord.getPrefix()+x.name
            }
            else{
              messageCommands += ", "+discord.getPrefix()+x.name
            }
          }
        })
        const exampleEmbed = new Discord.MessageEmbed()
          .setColor('#f7c1d9')
          .setTitle('Comandos')
          .setDescription('Estos son los comandos del bot:')
          .addFields(
            { name: 'Texto', value: messageCommands },
            { name: 'Voz', value: 'También puedo crear nuevos canales de voz si alguien entra a algún canal llamado \"Crear Canal\"' },
          )
          .setTimestamp()
        return exampleEmbed
      }
    }
  ]
}