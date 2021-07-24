
module.exports = class Command {
  constructor(manager, command){
    this.manager = manager
    this.name = command.name
    this.id = this.name+Date.now()
    this.type = command.type
    this.description = command.description
    this.options = command.options
    this.execute = command.execute
  }
  //Internal
  getManager(){
    return this.manager
  }
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
        if(args[0] && args[0].content.indexOf(this.manager.getPrefix()+this.name) === 0){
          let text = args[0].content.slice((this.manager.getPrefix()+this.name).length).trim().split(" ").filter(x=>{ if(x!='')return x})
          let msg = undefined
          if(this.options.isAdmin && (!args[0].member || (args[0].member && !args[0].member.permissions.has("ADMINISTRATOR")))){
            msg = "❌ | Necesitas tener ser \`Administrador\` para poder ejecutar este comando"
          }else if(this.options.isNSFW && args[0].channel.nsfw){
            msg = "❌ | Necesitas estar en un canal \`NSFW\` para poder ejecutar este comando"
          }else if(this.options.requiredParams > text.length || (text.length > 0 && text[0] == "help")){
            msg = this.description
          }else{
            msg = await this.execute(this, text,...args)
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
      }else if(this.type == "voiceStateUpdate") {
        this.execute(this, ...args);
      }
    }
    catch(error){
      console.error(error);
    }
  }
}