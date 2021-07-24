
module.exports = class Command {
  constructor(discord, command){
    this.discord = discord
    this.name = command.name
    this.id = this.name+Date.now()
    this.type = command.type
    this.description = command.description
    this.options = command.options
    this.execute = command.execute
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
  getType(){
    return this.type
  }
  getOptions(){
    return this.options
  }
  getDescription(){
    return this.description
  }
  setDescription(description){
    this.description = description
  }
  setExecute(execute){
    this.execute = execute
  }
  async exec(...args){
    try{
      if(this.type == "message"){
        if(args[0] && args[0].content.indexOf(this.discord.getPrefix()+this.name) === 0){
          let text = args[0].content.slice((this.discord.getPrefix()+this.name).length).trim().split(" ").filter(x=>{ if(x!='')return x})
          let msg = undefined
          if(this.options.requiredParams > text.length || (text.length > 0 && text[0] == "help")){
            msg = this.description
          }else{
            msg = await this.execute(text,...args)
          }
          if(msg){
            args[0].channel.send(msg).then(msg => {
              args[0].delete({timeout: 100})
              if(this.options.autoDelete){
                msg.delete({timeout: 10000})
              }
            })
          }
        }
      }else{
        this.execute(...args);
      }
    }
    catch(error){
      console.error(error);
    }
  }
}