module.exports = {
    name: "premium",
    aliases: [],
    desc: "Sirve para comprobar si eres premium",
    premium: true, 
    run: async(client,message,args,prefix) =>{
        message.reply(`Si ves este mensaje, significa que eres un usuario premium`);
    }
}