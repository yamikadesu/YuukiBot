const ChannelManager = require("./ChannelManager")
const CommandsManager = require("./CommandsManager")
module.exports = class Server {
  constructor(guild, serverManager){
    this.serverManager = serverManager
    this.guild = guild;
    this.channelManager = new ChannelManager(this)
    this.messageDelegates = []
    this.commandsManager = new CommandsManager(this)
  }
  //Api
  get(){
    return this.guild
  }
  //Internal
  getManager(){
    return this.serverManager
  }
  getId(){
    return this.get().id
  }
  getName(){
    return this.get().name
  }
  getChannels(){
    return this.channelManager
  }
  getCommandsManager(){
    return this.commandsManager
  }
  callDelegates(type, guild, ...params){
    if(guild && guild.id == this.getId()){
      this.getCommandsManager().execute(type, ...params)
    }
  }
}