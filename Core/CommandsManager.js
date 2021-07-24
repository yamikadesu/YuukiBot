const Command = require("./Command")
module.exports = class CommandsManager {
  constructor(server){
    this.server = server
    this.commands = []
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
    return this.getCommands().find(r => r.getId() == id)
  }
  getByName(name){
    return this.getCommands().find(r => r.getName() == name)
  }
  addCommand(command){
    this.commands.push(command)
  }
  removeCommand(name){
    return getByName(name).delete()
  }
  execute(type, ...args){
    this.getCommands().forEach(function (command) {
      if(command.getType() == type){
        command.exec(...args) 
      }
    })
  }
}