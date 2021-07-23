
module.exports = class Channel {
  constructor(channel, channelManager){
    this.channelManager = channelManager
    this.channel = channel;
  }
  //Api
  get(){
    return this.channel
  }
  //Internal
  getManager(){
    return this.channelManager
  }
  getId(){
    return get().id
  }
  getName(){
    return get().name
  }
  getType(){
    return get().type
  }
}