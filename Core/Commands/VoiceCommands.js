module.exports = {
  variables: {
    creationChannelName: "Crear Canal",
    createdChannelName: "💬|General-",
    channels: []
  },
  get: [
    {name: "createGeneral", type: "voiceStateUpdate", description: "",
      options:{
      },
      execute: function(command, oldState, newState, discord){
        if(newState.channel && newState.channel.name === command.getManager().getVariables("voiceStateUpdate").creationChannelName){
          newState.channel.clone({
            name: command.getManager().getVariables("voiceStateUpdate").createdChannelName+(command.getManager().getVariables("voiceStateUpdate").channels.length+1)
          }).then( chann => {
            newState.member.voice.setChannel(chann).catch(err => console.log(err))
            command.getManager().getVariables("voiceStateUpdate").channels.push(chann.id)
          }).catch(console.error)
        }
      }
    },
    {name: "removeGeneral", type: "voiceStateUpdate", description: "",
      options:{
      },
      execute: function(command, oldState, newState, discord){
        if(oldState.channel && oldState.channel.members.size == 0){
          let i = command.getManager().getVariables("voiceStateUpdate").channels.indexOf(oldState.channel.id)
          if(i >= 0){
            command.getManager().getVariables("voiceStateUpdate").channels.splice(i,1)
            newState.guild.channels.cache.find(r => r.id == oldState.channel.id).delete();
          }
        }
      }
    }
  ]
}