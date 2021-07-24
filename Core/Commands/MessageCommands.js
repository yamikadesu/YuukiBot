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
        autoDelete:true,
        isAdmin: false,
        isNSFW: false
      },
      execute: function(command, text, message, discord) {
        return `✅ | ¡Pong! \`${discord.getClient().ws.ping}ms\``
      }
    },
    {name: "prefix", type: "message", description:"Permite modificar el \`prefijo\` del bot por el que indiques a continuación", 
      options:{
        requiredParams: 1,
        autoDelete:true,
        isAdmin: true,
        isNSFW: false
      },
      execute: function(command, text, message, discord) {
        command.getManager().setPrefix(text[0])
        return `✅ | ¡Hecho! El nuevo prefijo será: \`${text[0]}\``
      }
    },
    {name: "autovoice", type: "message", description:"Tienes que especificar el nombre del canal de \`creación[obligatorio]\` y/o el nombre del canal \`creado[opcional]\`", 
      options:{
        requiredParams: 1,
        autoDelete:true,
        isAdmin: true,
        isNSFW: false
      },
      execute: function(command, text, message, discord) {
        if(text.length > 1){
          command.getManager().getVariables("voiceStateUpdate").createdChannelName = text[1]
        }
        command.getManager().getVariables("voiceStateUpdate").creationChannelName = text[0]
        return `✅ | ¡Hecho! El nuevo canal de creación automática de canales será: \`${command.getManager().getVariables("voiceStateUpdate").creationChannelName}\` y los canales creados se llamarán\`${command.getManager().getVariables("voiceStateUpdate").createdChannelName}X\`donde X es el número del canal`
      }
    },
    {name: "invite", type: "message", description:"Devuelve el enlace de invitación del bot a otros servidores", 
      options:{
        requiredParams: 0,
        autoDelete:true,
        isAdmin: false,
        isNSFW: false
      },
      execute: function(command, text, message, discord) {
        return "✅ | Para meterme en otros servidores necesitas abrir este enlace: <https://discord.com/api/oauth2/authorize?client_id=867503156249231361&permissions=2181033585&scope=bot>"
      }
    },
    {name: "act", type: "message", description:"", 
      options: {
        requiredParams: 0,
        autoDelete:true,
        isAdmin: false,
        isNSFW: false
      },
      execute: async function(command, text, message, discord) {
        let channel = undefined;
        if(message.member){
          channel = message.member.voice.channel;
        }
        if (!channel || channel.type !== "voice") return "❌ | ¡Canal inválido! Entra en algún canal de voz";
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return "❌ | Necesito el permiso de `CREATE_INSTANT_INVITE`";
        let activity = undefined
        if(text.length > 0 && text[0] != "" && text[0] != "help"){
          activity = command.getManager().getVariables("message").ACTIVITIES[text[0].toLowerCase()];
          if (!activity){
            activity = { 
              id: text[0], 
              name: "Custom"
            }
          } 
        }
        else{
          let actVar = ""
          let activ = Object.keys(command.getManager().getVariables("message").ACTIVITIES)
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
        autoDelete:true,
        isAdmin: false,
        isNSFW: false
      },
      execute: function(command, text, message, discord) {
        let messageCommands = ""
        command.getManager().getCommands().forEach(x =>{
          if(x.type == "message"){
            if(messageCommands == ""){
              messageCommands = command.getManager().getPrefix()+x.name
            }
            else{
              messageCommands += ", "+command.getManager().getPrefix()+x.name
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