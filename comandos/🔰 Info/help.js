const Discord = require('discord.js');
const {readdirSync} = require('fs');
module.exports = {
    name: "help",
    aliases: ["h", "ayuda","bothelp"],
    permisos: ["SEND_MESSAGES"],
    permisos_bot: ["ADMINISTRATOR"],
    desc: "Sirve para ver la información del Bot", 
    run: async(client,message,args,prefix) =>{
        //definimos las categorias del bot leyendo la ruta ./comandos
        const categorias = readdirSync('./comandos');
        if(args[0]){
            const comando = client.commands.get(args[0].toLowerCase()) || client.commands.find(c => c.aliases && c.aliases.includes(args[0].toLowerCase()));
            const categoria = categorias.find(categoria => categoria.toLowerCase().endsWith(args[0].toLowerCase()));
            if(comando){
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Comando \`${comando.name}\``)
                    .setFooter({text: `~ Trazo suavemente la tinta sangrante ~`, iconURL: 'https://animeshelter.com/wp-content/uploads/2020/10/majo-no-tabitabi-episode-3-2555-840x473.jpg'})
                    .setColor(client.color);
                    //condicionales
                    if(comando.desc) embed.addField(`✍ Descripción:`,`\`\`\`${comando.desc}\`\`\``);
                    if(comando.aliases && comando.aliases.length >= 1) embed.addField(`🌠 Alias:`,`${comando.aliases.map(alias =>`\`${alias}\``).join(", ")}`);
                    if(comando.permisos && comando.permisos.length >= 1) embed.addField(`👤 Permisos requeridos:`,`${comando.permisos.map(permiso=>`\`${permiso}\``).join(", ")}`);
                    if(comando.permisos_bot && comando.permisos_bot.length >= 1) embed.addField(`🧹 Permisos de BOT requeridos:`,`${comando.permisos_bot.map( permiso =>`\`${permiso}\``).join(", ")}`);
                    return message.reply({
                        embeds: [embed]
                    })
            }else if(categoria){
                const comandos_de_categoria = readdirSync(`./comandos/${categoria}`).filter(archivo => archivo.endsWith('.js'));
                return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`${categoria.split(" ")[0]} ${categoria.split(" ")[1]} ${categoria.split(" ")[0]}`)
                        .setColor(client.color)
                        .setDescription(comandos_de_categoria.length >= 1 ? `>>> *${comandos_de_categoria.map(comando => `\`${comando.replace(/.js/,"")}\``).join(" - ")}*` : `>>> *Todavia no hay comandos en esta categoria...* `)
                    ]
                })
            }else{
                return message.reply(`💫 **No se ha encontrado el comando que has especificado!**\nUsa \`${prefix}help\` para ver los comandos y categorias!`)
            }
        }else{
            //definimos la selección de categoria
            const seleccion = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu()
                .setCustomId(`SelecciónMenuAyuda`)
                .setMaxValues(5)
                .setMinValues(1)
                .addOptions(categorias.map(categoria=>{
                    //Definimos el objeto que será una opción a elegir
                    let objeto = {
                        label: categoria.split(" ")[1].substring(0,50),
                        value: categoria,
                        description: `Mira los comandos de ${categoria.split(" ")[1].substring(0,50)}`,
                        emoji: categoria.split(" ")[0],
                    }
                    //devolvemos el objeto creado y lo añadimos como una opción mas
                    return objeto;
                }))
            )
            let ayuda_embed = new Discord.MessageEmbed()
                .setTitle(`Ayuda de __${client.user.tag}__`)
                .setColor(client.color)
                .setDescription(`ElinaBot Multifuncional en Desarrollo por \`YoNi1~\`\n\n[\`mensaje\`](https://www.youtube.com/c/DarkGamer134)`)
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setFooter({text: `~ Trazo suavemente la tinta sangrante ~`, iconURL: 'https://animeshelter.com/wp-content/uploads/2020/10/majo-no-tabitabi-episode-3-2555-840x473.jpg'})
            
            let mensaje_ayuda = await message.reply({embeds: [ayuda_embed], components: [seleccion]});
            const collector = mensaje_ayuda.createMessageComponentCollector({filter: (i)=>(i.isSelectMenu()) && i.user && i.message.author.id == client.user.id, time: 180e3});
            collector.on("collect", (interaccion)=>{
                let embeds = [];
                for(const seleccionado of interaccion.values){
                    //definimos los comandos leyendo la ruta del valor seleccionado del menú
                    const comandos_de_categoria = readdirSync(`./comandos/${seleccionado}`).filter(archivo => archivo.endsWith('.js'));
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`${seleccionado.split(" ")[0]} ${seleccionado.split(" ")[1]} ${seleccionado.split(" ")[0]}`)
                    .setColor(client.color)
                    .setDescription(comandos_de_categoria.length >= 1 ? `>>> *${comandos_de_categoria.map(comando => `\`${comando.replace(/.js/,"")}\``).join(" - ")}*` : `>>> *Todavia no hay comandos en esta categoria...* `)
                    
                    embeds.push(embed)
                }
                interaccion.reply({embeds, ephemeral:true})
            });
            collector.on("end", () => {
                mensaje_ayuda.edit({ content: `Tu tiempo ha expirado! Vuelve a escribir \`${prefix}help\` para verlo de nuevo!`, components: [] }).catch(() => { });
            })
        }
    }
}

/*

*/