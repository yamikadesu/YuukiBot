const ServerManager = require("./ServerManager")
const CommandsManager = require("./CommandsManager")
const Command = require("./Command")
const MessageCommands = require("./Commands/MessageCommands")
const VoiceCommands = require("./Commands/VoiceCommands")

module.exports = class Discord{
  constructor(prefix = "y!", onReady='¡Estoy listo!'){
    this.api = require("discord.js")
    this.client = new this.api.Client()
    this.prefix = prefix
    this.client.on("ready", () =>{
      console.log(onReady);
      this.client.user.setActivity(`Atiendo a ${this.client.users.size} usuarios, en ${this.client.channels.size} canales de ${this.client.guilds.size} servidores.`); 
    })
    this.servers = new ServerManager(this)
    this.commandsManager = new CommandsManager()

    this.value = 1
  } 
  //Api
  getApi(){
    return this.api
  }
  getClient(){
    return this.client
  }
  //Internal
  getPrefix(){
    return this.prefix
  }
  setPrefix(prefix){
    this.prefix = prefix
  }
  getServers(){
    return this.servers
  }
  createCommand(command, type, execute){
    this.commandsManager.addCommand(new Command(command, this.prefix+command, type, execute))
  }
  callDelegates(type, guild, ...params){
    this.commandsManager.execute(type, ...params)
    if(guild){
      let server = this.servers.getById(guild.id)
      if(server){
        server.callDelegates(type, guild, ...params)
      }
    }
  }
  initCommands(){
    for(var  i = 0; i < MessageCommands.get.length; i++){
      this.createCommand(MessageCommands.get[i].name, MessageCommands.get[i].type, MessageCommands.get[i].execute)
    }
    for(var  i = 0; i < VoiceCommands.get.length; i++){
      this.createCommand(VoiceCommands.get[i].name, VoiceCommands.get[i].type, VoiceCommands.get[i].execute)
    }
  }
  initDelegates(){
    this.getClient().on("message", msg =>{
      this.callDelegates("message", msg.guild, msg, this)
    })
    this.getClient().on("voiceStateUpdate", (oldState, newState) =>{
      if(oldState && oldState.guild){
        this.callDelegates("voiceStateUpdate", oldState.guild, oldState, newState, this)
      }
      else if(newState && newState.guild){
        this.callDelegates("voiceStateUpdate", newState.guild, oldState, newState, this)
      }
    })
  }
  login(){
    this.initCommands()
    this.initDelegates()
    this.getClient().login(process.env['TOKEN'])
  }
}