const Server = require("./Server")
module.exports = class ServerManager {
  constructor(client){
    this.client = client.getClient();
  }
  //Api
  get(){
    return this.client.guilds
  }
  getDiscord(){
    return this.client
  }
  getAll(){
    return this.get().cache
  }
  //Internal
  getServers(){
    return this.get().cache.map(function (guild, index, array) { return new Server(guild, this); })
  }
  getById(id){
    return new Server(this.getAll().find(r => r.id == id), this)
  }
  getByName(name){
    return new Server(this.getAll().find(r => r.name == name), this)
  }
  async create(name, [options]){
    return new Promise(get().create(name, options).then(guild => new Server(guild, this)))
  }
  delete(name){
    return this.getByName(name).delete()
  }
}