const ServerManager = require("./Server/ServerManager")

var Discord = (function(){
  class DiscordClass{
    constructor(){
      this.api = require("discord.js")
      this.client = new this.api.Client()
      this.servers = new ServerManager(this)
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
    getOnReady(){
      return this.onReady
    }
    setOnReady(onReady){
      this.onReady = onReady
    }
    getServers(){
      return this.servers
    }
    callCommands(type, guild, ...params){
      //this.commandsManager.execute(type, ...params)
      if(guild){
        let server = this.servers.getById(guild.id)
        if(server){
          server.callCommands(type, guild, ...params)
        }
      }
    }
    initCommands(){
      this.getClient().on("message", msg =>{
        this.callCommands("message", msg.guild, msg, this)
      })
      this.getClient().on("voiceStateUpdate", (oldState, newState) =>{
        if(oldState && oldState.guild){
          this.callCommands("voiceStateUpdate", oldState.guild, oldState, newState, this)
        }
        else if(newState && newState.guild){
          this.callCommands("voiceStateUpdate", newState.guild, oldState, newState, this)
        }
      })
    }
    login(){
      this.client.on("ready", () =>{
        console.log(this.onReady);
        this.client.user.setActivity(`Atiendo a ${this.client.users.cache.size} usuarios, en ${this.client.channels.cache.size} canales de ${this.client.guilds.cache.size} servidores.`); 
      })
      this.initCommands()
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