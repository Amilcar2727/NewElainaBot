const Discord = require("discord.js");

module.exports = {
    name: "kick",
    aliases: ["kickear", "expulsar"],
    desc: "Sirve para expulsar a un usuario del servidor",
    permisos: ["ADMINISTRATOR", "KICK_MEMBERS"],
    permisos_bot: ["ADMINISTRATOR", "KICK_MEMBERS"],
    run: async (client, message, args, prefix) => {
        //Definimos la persona a banear 
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(`💫 **No se ha encontrado al usuario que has especificado!**`);
        let razon = args.slice(1).join(" ");
        if(!razon) razon = "No se ha especificado ninguna razón!";
        //Comprobar que el bot está por encima del usuario a banear
        if (message.guild.me.roles.highest.position > usuario.roles.highest.position) {
            //Comprobar que la posición del rol del usuario que ejecuta el comando sea mayor a la persona que vaya a banear
            if (message.member.roles.highest.position > usuario.roles.highest.position) {
                //enviamos al usuario por privado que ha sido baneado
                usuario.send({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(`Has sido expulsado de __${message.guild.name}__`)
                        .setDescription(`**Razon:**\n\`\`\`yml\n${razon}\`\`\``)
                        .setColor(client.color)
                        .setTimestamp()
                    ]
                }).catch(()=>{message.reply(`No se le ha podido enviar el DM al usuario`)});
                //enviamos en el canal que el usuario ha sido baneado exitosamente
                message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(`🚨 **Usuario expulsado**`)
                        .setDescription(`Se ha expulsado exitosamente a \`${usuario.user.tag}\`*(\`${usuario.id}\`)* del servidor!`)
                        .addField(`Razón:`,`\n\`\`\`yml\n${razon}\`\`\``)
                        .setColor(client.color)
                        .setTimestamp()
                    ]
                })
                usuario.kick([razon])
            } else {
                return message.reply(`💫 **Tu rol está por __debajo__ del usuario que quieres banear!**`);
            }
        } else {
            return message.reply(`💫 **Mi rol está por __debajo__ del usuario que quieres banear!**`);
        }
    }
}