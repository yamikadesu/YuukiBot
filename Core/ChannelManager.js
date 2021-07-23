const Server = require("./Channel")
module.exports = class ChannelManager{
  constructor(server){
    this.server = server
  }
  //Api
  get(){
    return this.server.get().channels;
  }
  getServer(){
    return this.server
  }
  getAll(){
    return get().cache
  }
  //Internal
  getChannels(){
    return get().cache.map(function (channel, index, array) { return new Channel(channel, this); })
  }
  getById(id){
    return new Channel(this.getAll().find(r => r.id == id), this)
  }
  getByName(name){
    return new Channel(this.getAll().find(r => r.name == name), this)
  }
  async create(name, [options]){
    return new Promise(get().create(name, options).then(guild => new Channel(guild, this)))
  }
  delete(name){
    return this.getByName(name).delete()
  }
}