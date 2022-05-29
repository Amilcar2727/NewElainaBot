const Discord = require('discord.js');
const setupSchema = require(`${process.cwd()}/modelos/setups.js`);

module.exports = {
    name: "setup-ticket",
    aliases: ["ticket-setup", "setupticket", "ticketsetup"],
    desc: "Sirve para crear un sistema de Tickets", 
    run: async(client,message,args,prefix) =>{
        var objeto = {
            canal: "",
            mensaje: "",

        };
        const quecanal = await message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`¿Que canal quieres usar para el sistema de tickets?`)
                .setDescription(`*Simplemente menciona el canal o envia su ID!*`)
                .setColor(client.color)
            ]
        });
        await quecanal.channel.awaitMessages({
            filter: m=>m.author.id === message.author.id,
            max: 1,
            errors: ["time"],
            time: 180e3
        }).then(async collected =>{
            var message = collected.first();
            const channel = message.guild.channels.cache.get(message.content) || message.mentions.channels.first();
            if(channel){
                objeto.canal = channel.id;
                const quemensaje = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(`¿Que mensaje quieres usar para el sistema de tickets?`)
                        .setDescription(`*Simplemente envia el mensaje!*`)
                        .setColor(client.color)
                    ]
                });
                await quemensaje.channel.awaitMessages({
                    filter: m=>m.author.id === message.author.id,
                    max: 1,
                    errors: ["time"],
                    time: 180e3
                }).then(async collected=>{
                    var message = collected.first();
                    const msg = await message.guild.channels.cache.get(objeto.canal).send({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(`📩 Crea un ticket`)
                            .setDescription(`${message.content.substring(0,2048)}`)
                            .setColor(client.color)
                        ],
                        components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setLabel("Crea un ticket").setEmoji("📨").setCustomId("crear_ticket").setStyle("SUCCESS"))]
                    })
                    objeto.mensaje = msg.id;
                    await setupSchema.findOneAndUpdate({guildID: message.guild.id},{
                        sistema_tickets: objeto
                    });
                    return message.reply(`🎆 **Configurado correctamente en <#${objeto.canal}>**`)
                }).catch(()=>{
                    return message.reply("💫 **El tiempo ha expirado!**")
                })
            }else{
                return message.reply("💫 **No se ha encontrado el canal que has especificado!**")
            }
        }).catch(()=>{
            return message.reply("💫 **El tiempo ha expirado!**")
        })
    }
}