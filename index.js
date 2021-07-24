const Discord = require("./Core/Discord")

let discord = new Discord()

//client.on('message', message => {
//  if(message.content.includes('<#')){
//    checkChannel = message.content.replace(/\D/g,'');
 //   message.reply('Ok. I\'ll send my reminders to <#' + checkChannel + '>.');
 // }
//});

discord.getInstance().login()

