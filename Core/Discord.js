const ServerManager = require("./ServerManager")
const CommandsManager = require("./CommandsManager")
const Command = require("./Command")
const MessageCommands = require("./Commands/MessageCommands")
const VoiceCommands = require("./Commands/VoiceCommands")

var Discord = (function(){
  class DiscordClass{
    constructor(){
      this.api = require("discord.js")
      this.client = new this.api.Client()
      this.prefix = "y!"
      this.servers = new ServerManager(this)
      this.commandsManager = new CommandsManager()
      this.onReady = '¡Estoy listo!'
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
    getOnReady(){
      return this.onReady
    }
    setOnReady(onReady){
      this.onReady = onReady
    }
    getServers(){
      return this.servers
    }
    getCommands(type){
      if(type == "message"){
        return MessageCommands.get
      }
      else if(type == "voiceStateUpdate"){
        return VoiceCommands.get
      }
      else{
        var values = [...MessageCommands.get, ...VoiceCommands.get]
        return values
      }
    }
    getVariables(type){
      if(type == "message"){
        return MessageCommands.variables
      }
      else if(type == "voiceStateUpdate"){
        return VoiceCommands.variables
      }
    }
    createCommand(command){
      this.commandsManager.addCommand(new Command(this, command))
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
      for(var  i = 0; i < this.getCommands().length; i++){
        this.createCommand(this.getCommands()[i])
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
      this.client.on("ready", () =>{
        console.log(this.onReady);
        this.client.user.setActivity(`Atiendo a ${this.client.users.cache.size} usuarios, en ${this.client.channels.cache.size} canales de ${this.client.guilds.cache.size} servidores.`); 
      })
      this.initCommands()
      this.initDelegates()
      this.getClient().login(process.env['TOKEN'])
    }
  }
  var instance;
  return {
      getInstance(){
          if (instance == null) {
              instance = new DiscordClass();
              // Hide the constructor so the returned object can't be new'd...
              instance.constructor = null;
          }
          return instance;
      }
  };
})

module.exports = Discord