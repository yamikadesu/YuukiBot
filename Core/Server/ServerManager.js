const Server = require("./Server")
module.exports = class ServerManager {
  constructor(client){
    this.discord = client
    this.client = client.getClient();
    this.servers = []
    let apiServers = this.client.guilds.cache
    for(let i = 0; i < apiServers.size; i++){
      this.servers.push(new Server(apiServers[i], this))
    }
  }
  //Api
  get(){
    return this.client.guilds
  }
  getClient(){
    return this.client
  }
  getAll(){
    return this.get().cache
  }
  //Internal
  getDiscord(){
    return this.discord
  }
  getServers(){
    return this.servers
  }
  getById(id){
    let res = this.servers.find(r => r.getId() == id)
    if(res){
      return res
    }
    else{
      res = new Server(this.getAll().find(r => r.id == id), this)
      this.servers.push(res)
      return res
    }
  }
  getByName(name){
    let res = this.servers.find(r => r.getName() == name)
    if(res){
      return res
    }
    else{
      res = new Server(this.getAll().find(r => r.name == name), this)
      this.servers.push(res)
      return res
    }
  }
  async create(name, [options]){
    return new Promise(get().create(name, options).then(guild => {
      let server = new Server(guild, this)
      this.servers.push(server)
      return server
    }))
  }
  delete(name){
    return this.getByName(name).delete()
  }
}