const fetch = require("node-fetch");

const ACTIVITIES = {
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
};

module.exports = {
  get: [
    {name: "ping", type: "message", execute: function(msg, discord) {
      msg.channel.send(`Pong! \`${discord.getClient().ws.ping}ms\``).then(msg => 
          msg.delete({timeout: 10000}).then(message.delete()));
    }},
    {name: "act", type: "message", execute: function(message, discord) {
      const args = message.content.slice(discord.getPrefix().length).trim().split(" ");
      const cmd = args.shift().toLowerCase();
      let channel = undefined;
      if(message.member){
        channel = message.member.voice.channel;
      }
      if (!channel || channel.type !== "voice") return message.channel.send("❌ | ¡Canal inválido! Entra en algún canal de voz");
      if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | Necesito el permiso de `CREATE_INSTANT_INVITE`").then(msg => 
          msg.delete({timeout: 10000}).then(message.delete()));
      let activity = ACTIVITIES[args[0] ? args[0].toLowerCase() : null];
      if (!activity){
        if(args[0] == "help" || args[0] == ""){
          let actVar = "poker, betrayal, yt, fishington"
          return message.channel.send("✅ | Las actividades posibles son: "+actVar)      .then(msg => 
                msg.delete({timeout: 10000}).then(message.delete()));
        }
        activity = { 
          id: args[0], 
          name: "Custom"
        }
      } 
      //return message.channel.send(`❌ | Actividad no encontrada`);

      fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
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
          if (invite.error || !invite.code) return message.channel.send(`❌ | No se puede empezar la actividad **${activity.name}**!`);
          message.channel.send(`✅ | Pulsa para empezar la actividad **${activity.name}** en **${channel.name}**: <https://discord.gg/${invite.code}>`).then(msg => 
            msg.delete({timeout: 10000}).then(message.delete())
          );
      })
      .catch(e => {
          message.channel.send(`❌ | No se puede empezar la actividad **${activity.name}**!`).then(msg => 
            msg.delete({timeout: 10000}).then(message.delete()));
      })
    }}
  ]
}