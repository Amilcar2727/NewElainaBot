const {DisTube, Queue} = require('distube');
const {SpotifyPlugin} = require('@distube/spotify');
const {SoundCloudPlugin} = require('@distube/soundcloud');

module.exports = (client, Discord) =>{
    console.log(`Modulo de MÚSICA Cargado!`.red)

    client.distube = new DisTube(client,{
        emitNewSongOnly: false, //para q no ponga solo canciones nuevas
        leaveOnEmpty: true, // cola vacia -> sale el bot
        leaveOnFinish: true, // termina cancion y no hay mas reproducir -> sale
        leaveOnStop: true, // Error Cancion -> sale
        savePreviousSongs: true, // Guardar canciones anteriores
        emitAddSongWhenCreatingQueue: false, //Para q se emita una cola
        searchSongs: 0, //activo(te deja escoger las canciones)
        nsfw: false, //+18
        emptyCooldown: 25, //Tiempo en irse si no hay canciones
        ytdlOptions:{
            highWaterMark: 1024 * 1024 * 64,
            quality: "highestaudio",
            format: "audioonly",
            liveBuffer: 60000,
            dlChunkSize: 1024 * 1024 * 4,
        },
        youtubeDL: false,
        plugins: [
            new SpotifyPlugin({
                parallel: true,
                emitEventsAfterFetching: true,                
            }),
            new SoundCloudPlugin()
        ],
    });

    //escuchamos los eventos de Distube
    client.distube.on("playSong",(queue, song)=>{
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`🎼 Reproduciendo: \`${song.name}\` - \`${song.formattedDuration}\``)
                .setThumbnail(song.thumbnail)
                .setURL(song.url)
                .setColor('#808080')
                .setFooter({text: `Añadida por ${song.user.tag}`, iconURL: song.user.displayAvatarURL({dynamic: true})})
            ]
        });
    })

    client.distube.on("addSong",(queue, song)=>{
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`🎆 Añadido: \`${song.name}\` - \`${song.formattedDuration}\``)
                .setThumbnail(song.thumbnail)
                .setURL(song.url)
                .setColor('#808080')
                .setFooter({text: `Añadida por ${song.user.tag}`, iconURL: song.user.displayAvatarURL({dynamic: true})})
            ]
        });
    })

    client.distube.on("initQueue",(queue)=>{
        queue.autoplay = true;
    })
}