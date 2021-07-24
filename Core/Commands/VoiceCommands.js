var value = 1

module.exports = {
  get: [
    {name: "createGeneral", type: "voiceStateUpdate", execute: function(oldState, newState, discord){
      if(newState.channel && newState.channel.name.includes('Crear Canal')){
        newState.channel.clone({
          name: "💬|General-"+value
          }).then( chann => {
          value = value + 1
          newState.member.voice.setChannel(chann).catch(err => console.log(err))
        }).catch(console.error)
      }
    }},
    {name: "removeGeneral", type: "voiceStateUpdate", execute: function(oldState, newState, discord){
      if(oldState.channel && oldState.channel.name.includes("💬|General-") && oldState.channel.members.size == 0){
        newState.guild.channels.cache.find(r => r.name == oldState.channel.name).delete();
        if(value > 1){
          value = value - 1
        }
      }
    }}
  ]
}