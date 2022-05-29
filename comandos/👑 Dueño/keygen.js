const ms = require('ms');
const Discord = require('discord.js');
const keySchema = require(`${process.cwd()}/modelos/clave.js`);
module.exports = {
    name: "keygen",
    aliases: ["generar-clave", "generarclave"],
    desc: "Sirve para generar una clave premium para un servidor", 
    owner: true,
    run: async(client,message,args,prefix) =>{
        if(!args.length) return message.reply('💫 **Tienes que especificar la duración Premium de la clave!**\n**Ejemplo:**\`30d\`');
        const tiempo = ms(args[0]) // pasar el tiempo que ha especificado el usuario a milisegundos 
        if(tiempo){
            let clave = generar_clave();
            message.author.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(`🔑 Nueva Clave!`)
                    .setDescription("```"+clave+"```")
                    .addField(`Generada por`,`\`${message.author.tag}\` \`${message.author.id}\``)
                    .addField(`Suscripción`,`\`${args[0]}\``)
                    .addField(`Estado`,`\`SIN USAR\``)
                    .setColor(client.color)
                ]
            }).catch(()=>{
                message.react("💫")
                return message.reply(`💫 **No te he podido enviar el DM de los detalles de la clave!\nClave eliminada!**`)
            });
            let data = new keySchema({
                clave,
                duracion: tiempo,
                activado: false,
            });
            data.save();
            message.react("✅");
            return message.reply("🎆 **Nueva clave generada en la Base de Datos\nSe ha enviado la información de la clave en tus DM's**")
        }else{
            return message.reply(`💫 **El tiempo de duración Premium que has especificado no es valido!**`)
        }
    }
}

function generar_clave(){
    //CLAVE: XXXX-XXXX-XXXX-XXXX
    let posibilidades = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let parte1 = "";
    let parte2 = "";
    let parte3 = "";
    let parte4 = "";
    for(let i=0; i<4; i++){
        parte1 += posibilidades.charAt(Math.floor(Math.random()*posibilidades.length));
        parte2 += posibilidades.charAt(Math.floor(Math.random()*posibilidades.length));
        parte3 += posibilidades.charAt(Math.floor(Math.random()*posibilidades.length));
        parte4 += posibilidades.charAt(Math.floor(Math.random()*posibilidades.length));
    }
    //devolvemos la clave generada, por ej: AB4S-JG35-SF4G-23J5
    return `${parte1}-${parte2}-${parte3}-${parte4}`
}