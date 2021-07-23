const ServerManager = require("./ServerManager")
const CommandsManager = require("./CommandsManager")
const Command = require("./Command")
module.exports = class Discord{
  constructor(onReady='¡Estoy listo!', command = "y$"){
    this.api = require("discord.js")
    this.client = new this.api.Client()
    this.command = command
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
  getServers(){
    return this.servers
  }
  createCommand(command, type, execute){
    this.commandsManager.addCommand(new Command(command, this.command+command, type, execute))
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
    this.createCommand("ping", "message", function(msg) {
      msg.reply("pong")
    })
    this.createCommand("createGeneral", "voiceStateUpdate", function(oldState, newState){
      if(newState.channel && newState.channel.name.includes('Crear')){
        newState.channel.clone({
          name: "General"
          }).then( chann => {
          newState.member.voice.setChannel(chann).catch(err => console.log(err))
        }).catch(console.error)
      }
    })
    this.createCommand("removeGeneral", "voiceStateUpdate", function(oldState, newState){
      if(oldState.channel && oldState.channel.name.includes('General') && oldState.channel.members.size == 0){
        newState.guild.channels.cache.find(r => r.name == oldState.channel.name).delete();
      }
    })
  }
  initDelegates(){
    this.getClient().on("message", msg =>{
      this.callDelegates("message", msg.guild, msg)
    })
    this.getClient().on("voiceStateUpdate", (oldState, newState) =>{
      if(oldState && oldState.guild){
        this.callDelegates("voiceStateUpdate", oldState.guild, oldState, newState)
      }
      else if(newState && newState.guild){
        this.callDelegates("voiceStateUpdate", newState.guild, oldState, newState)
      }
    })
  }
  login(){
    this.initCommands()
    this.initDelegates()
    this.getClient().login(process.env['TOKEN'])
  }
}