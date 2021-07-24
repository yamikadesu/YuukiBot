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
      execute: function(oldState, newState, discord){
        if(newState.channel && newState.channel.name === discord.getVariables("voiceStateUpdate").creationChannelName){
          newState.channel.clone({
            name: discord.getVariables("voiceStateUpdate").createdChannelName+(discord.getVariables("voiceStateUpdate").channels.length+1)
          }).then( chann => {
            newState.member.voice.setChannel(chann).catch(err => console.log(err))
            discord.getVariables("voiceStateUpdate").channels.push(chann.id)
          }).catch(console.error)
        }
      }
    },
    {name: "removeGeneral", type: "voiceStateUpdate", description: "",
      options:{
      },
      execute: function(oldState, newState, discord){
        if(oldState.channel && oldState.channel.members.size == 0){
          let i = discord.getVariables("voiceStateUpdate").channels.indexOf(oldState.channel.id)
          if(i >= 0){
            discord.getVariables("voiceStateUpdate").channels.splice(i,1)
            newState.guild.channels.cache.find(r => r.id == oldState.channel.id).delete();
          }
        }
      }
    }
  ]
}