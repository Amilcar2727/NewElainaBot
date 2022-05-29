const {asegurar_todo} = require(`${process.cwd()}/handlers/funciones.js`);
const ecoSchema = require(`${process.cwd()}/modelos/economia.js`);
module.exports = {
    name: "bet",
    aliases: ["apostar"],
    desc: "Sirve para apostar una cantidad de dinero", 
    run: async(client,message,args,prefix) =>{
        //aseguramos la economia del usuario
        await asegurar_todo(null,message.author.id);
        //leemos la economia del usuario
        let data = await ecoSchema.findOne({userID: message.author.id});
        let cantidad = args[0];
        //comprobaciones previas
        if(["todo","all-in","all"].includes(args[0])){
            cantidad = data.dinero;
        }else{
            if(isNaN(cantidad) || cantidad <= 0 || cantidad %1!=0) return message.reply(`💫 **No has especificado una cantidad valida para apostar!**`)
            if(cantidad > data.dinero) return message.reply(`💫 **No tienes tanto dinero para apostar!**`);
        }
        //creamos las posibilidades
        let posibilidades = ["ganar","perder"];
        //definimos el resultado de las posibilidades
        let resultado = posibilidades[Math.floor(Math.random()*posibilidades.length)];
        //si el resultado es ganar, la persona gana lo que apueste, caso contrario pierde lo apostado
        if(resultado === "ganar"){
            await ecoSchema.findOneAndUpdate({userID: message.author.id},{
                $inc:{
                    dinero: cantidad
                }
            })
            return message.reply(`**Has ganado \`${cantidad} monedas\`**`)
        }else{
            await ecoSchema.findOneAndUpdate({userID: message.author.id},{
                $inc:{
                    dinero: -cantidad
                }
            })
            return message.reply(`**Has perdido \`${cantidad} monedas\`**`)
        }

    }
}