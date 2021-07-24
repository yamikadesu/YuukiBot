const CommandsManager = require("./CommandsManager")

module.exports = class Server {
  constructor(guild, serverManager){
    this.serverManager = serverManager
    this.guild = guild;
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
  getCommandsManager(){
    return this.commandsManager
  }
  getPrefix(){
    return this.commandsManager.getPrefix()
  }
  getVariables(type){
    return this.commandsManager.getVariables(type)
  }
  callCommands(type, guild, ...params){
    if(guild && guild.id == this.getId()){
      this.commandsManager.execute(type, ...params)
    }
  }
}