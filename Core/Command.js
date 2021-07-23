
module.exports = class Command {
  constructor(name, command, type, exec, description = ''){
    this.id = name+Date.now()
    this.name = name
    this.command = command
    this.type = type
    this.description = description
    this.exec = exec
  }
  //Internal
  getId(){
    return this.id
  }
  getName(){
    return this.name
  }
  setName(name){
    this.name = name
  }
  getCommand(){
    return this.command
  }
  setCommand(command){
    this.command = command
  }
  getType(){
    return this.type
  }
  getDescription(){
    return this.description
  }
  setDescription(description){
    this.description = description
  }
  setExecute(exec){
    this.exec = exec
  }
  execute(...args){
    if(this.type == "message"){
      if(args[0] && args[0].content == this.getCommand()){
        this.exec(...args);
      }
    }else{
      this.exec(...args);
    }
  }
}