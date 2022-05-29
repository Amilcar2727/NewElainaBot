const Discord = require('discord.js');
const config = require('./config/config.json');
const Enmap = require('enmap');

require('colors');

const client = new Discord.Client({ //permisos
    restTimeOffset: 0,
    partials: ['MESSAGE','CHANNEL','REACTION','GUILD_MEMBER','USER'],
    intents:[
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    ],
})

client.commands = new Discord.Collection();
client.aliases= new Discord.Collection();
client.color = config.color;

client.login(config.token) //logeo

client.setups = new Enmap({ //base de datos
    name: "setups",
    dataDir: "./databases"
})

client.on("ready", () => {//PLAYING, STREAMING, LISTENING, WATCHING, COMPETING       //online, dnd, idle, invisible  
    client.user.setPresence({activities: [{name: `como recibo ayuda owo`, type: `WATCHING`}],status: `idle`});
})

//Mensaje de bienvenida (hasta que entienda bien lo de crear un modelo en mongoose)
client.on("messageCreate",async(message)=>{ //sistema set-bienvenida
    if(message.author.bot || !message.guild || !message.channel) return;
    client.setups.ensure(message.guild.id,{
        welcomechannel: "",
        welcomemessage: "",
    });
    const args = message.content.slice(config.prefix.length).trim().split(" ");
    const command = args.shift()?.toLowerCase();

    if(command == `setup-welcome`){ //sistema mismo de set-welcome
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if(!channel) return message.reply(`El canal que has mencionado NO EXISTE!\n**Uso:** \`${config.prefix}setup-welcome <#CANAL O ID> <MENSAJE DE BIENVENIDA>\``);
        if(!args.slice(1).join(" ")) return message.reply(`No has especificado el MENSAJE DE BIENVENIDA!\n**Uso:** \`${config.prefix}setup-welcome <#CANAL O ID> <MENSAJE DE BIENVENIDA>\``);
        let obj = {
            welcomechannel: channel.id,
            welcomemessage: args.slice(1).join(" "),
        }
        client.setups.set(message.guild.id,obj);
        return message.reply(`🎆 Se ha configurado correctamente el canal de bienvenida\n**Canal:** ${channel}\n**Mensaje de Bienvenida:** ${args.slice(1).join(" ")}`);
    }
})

client.on("guildMemberAdd", async (member) =>{ //mensaje de bienvenida
    client.setups.ensure(member.guild.id,{
        welcomechannel: "",
        welcomemessage: "",
    });
    try{
        const data = client.setups.get(member.guild.id);
        if(data){
            if(member.guild.channels.cache.get(data.welcomechannel)){
                const channel = member.guild.channels.cache.get(data.welcomechannel)
                const attachment = new Discord.MessageAttachment('https://i.pinimg.com/originals/5f/12/07/5f12077a8e9c7fbb92f6cb7f1dd047b0.jpg');
                channel.send({content: data.welcomemessage.replace(/{usuario}/,member), files: [attachment]});
            }
        }
    }catch(e){console.log(e)}
})


//Handler:
function requerirHandlers(){
    ["command","events","distube","reaccion_roles","tickets"].forEach(handler =>{
        try{
            require(`./handlers/${handler}`)(client, Discord);
        }catch(e){
            console.warn(e);
        }
    })
}
requerirHandlers();
