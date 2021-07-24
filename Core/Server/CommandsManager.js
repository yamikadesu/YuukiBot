const Command = require("./Command")
const MessageCommands = require("./../Commands/MessageCommands")
const VoiceCommands = require("./../Commands/VoiceCommands")
var cloneDeep = require('lodash.clonedeep');

module.exports = class CommandsManager {
  constructor(server){
    this.server = server
    this.prefix = "y!"
    this.deleteTimeout = 10000
    this.variables = {
      "message": cloneDeep(MessageCommands.variables),
      "voiceStateUpdate": cloneDeep(VoiceCommands.variables)
    }
    let protoCommands = [...MessageCommands.get, ...VoiceCommands.get]
    this.commands = []
    for(let i = 0; i < protoCommands.length; i++){
      this.commands.push(new Command(this, cloneDeep(protoCommands[i])))
    }
  }
  //Internal
  getServer(){
    return this.server
  }
  getCommands(type = ''){
    if(type == ''){
      return this.commands
    }
    else{
      return this.commands.map(function (command, index, array) { if(command.getType() == type){return command;}})
    }
  }
  getById(id){
    return this.commands.find(r => r.getId() == id)
  }
  getByName(name){
    return this.commands.find(r => r.getName() == name)
  }
  getPrefix(){
    return this.prefix;
  }
  setPrefix(prefix){
    this.prefix = prefix;
  }
  getDeleteTimeout(){
    return this.deleteTimeout
  }
  setDeteleTimeout(deleteTimeout){
    this.deleteTimeout = deleteTimeout
  }
  getVariables(type){
    return this.variables[type]
  }
  removeCommand(name){
    return this.getByName(name).delete()
  }
  execute(type, ...args){
    this.getCommands().forEach(function (command) {
      if(command.getType() == type){
        command.exec(...args) 
      }
    })
  }
}