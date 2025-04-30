const { EmbedBuilder } = require('discord.js');

class CommandSystem {
    constructor(client, ticketSystem, orderSystem, rewardSystem, staffApplicationSystem) {
        this.client = client;
        this.ticketSystem = ticketSystem;
        this.orderSystem = orderSystem;
        this.rewardSystem = rewardSystem;
        this.staffApplicationSystem = staffApplicationSystem;

        this.embeds = {
            help: new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('CSky Developments - Help Menu')
                .setDescription('Below is a list of all available commands for the CSky Developments bot. Use the prefix `c!` to execute these commands.')
                .addFields(
                    { name: 'General Commands', value: '**c!help** or **c!?** - Displays this help menu.\n**c!not available** - Shows information about unavailable services.', inline: false },
                    { name: 'Support & Applications', value: '**c!ticket** or **c!tickets** - Opens a support ticket.\n**c!staff application** or **c!staff app** - Information about staff applications.', inline: false },
                    { name: 'Orders & Services', value: '**c!order** - Places a new order.\n**c!plugin development** - Information about custom plugin development.', inline: false },
                    { name: 'Server Optimizations', value: '**c!optimization** - Lists all server optimization services.\n**c!bukkit optimization** - Bukkit server optimization.\n**c!spigot optimization** - Spigot server optimization.\n**c!paper optimization** - Paper server optimization.\n**c!purple optimization** - Purpur server optimization.\n**c!bungeecode optimization** - BungeeCord server optimization.\n**c!waterfall optimization** - Waterfall server optimization.\n**c!velocity optimization** - Velocity server optimization.\n**c!forge optimization** - Forge server optimization.\n**c!fabric optimization** - Fabric server optimization.', inline: false },
                    { name: 'Rewards', value: '**c!reward** or **c!rewards** - View available rewards.\n**c!invite reward** or **c!invite rewards** - Claim invite-based rewards.\n**c!booster reward** or **c!booster rewards** - Claim server booster rewards.', inline: false }
                )
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' })
                .setTimestamp(),
            notAvailable: new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription(`**This service is currently not available.**`)
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            bukkit: new EmbedBuilder()
                .setColor(0xFFD800)
                .setTitle('**Server・Bukkit**')
                .setDescription('**Software:** Bukkit\n**Accepted Versions:** `1.8`, `1.16`, `1.17`, `1.18`, `1.19`, `1.20`\n\n**Optimization includes:** *(Not limited to)*\n ● Unwanted files will be deleted.\n ● Plugins will be updated to the latest version.\n ● Errors and bugs will be fixed.\n ● More... \n\n **Minimum Price:** 0.3$/srv')
                .setThumbnail('https://cdn.discordapp.com/emojis/1113746835396374618.webp?size=96&quality=lossless')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            spigot: new EmbedBuilder()
                .setColor(0xFFD800)
                .setTitle('**Server・Spigot**')
                .setDescription('**Software:** Spigot\n**Accepted Versions:** `1.8`, `1.16`, `1.17`, `1.18`, `1.19`, `1.20`\n\n**Optimization includes:** *(Not limited to)*\n ● Unwanted files will be deleted.\n ● Plugins will be updated to the latest version.\n ● Errors and bugs will be fixed.\n ● Optimization of Configuration Files.\n ● More... \n\n **Minimum Price:** 0.5$/srv')
                .setThumbnail('https://cdn.discordapp.com/emojis/1113746870771122196.webp?size=96&quality=lossless')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            paper: new EmbedBuilder()
                .setColor(0xFFD800)
                .setTitle('**Server・Paper**')
                .setDescription('**Software:** Paper\n**Accepted Versions:** `1.8`, `1.16`, `1.17`, `1.18`, `1.19`, `1.20`\n\n**Optimization includes:** *(Not limited to)*\n ● Unwanted files will be deleted.\n ● Plugins will be updated to the latest version.\n ● Errors and bugs will be fixed.\n ● Optimization of Configuration Files.\n ● World Optimization\n ● More... \n\n **Minimum Price:** 0.8$/srv')
                .setThumbnail('https://cdn.discordapp.com/emojis/1113746859626868786.webp?size=96&quality=lossless')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            purple: new EmbedBuilder()
                .setColor(0xFFD800)
                .setTitle('**Server・Purple**')
                .setDescription('**Software:** Purple\n**Accepted Versions:** `1.8`, `1.16`, `1.17`, `1.18`, `1.19`, `1.20`\n\n**Optimization includes:** *(Not limited to)*\n ● Unwanted files will be deleted.\n ● Plugins will be updated to the latest version.\n ● Errors and bugs will be fixed.\n ● Optimization of Configuration Files.\n ● World Optimization\n ● More... \n\n **Minimum Price:** 0.8$/srv')
                .setThumbnail('https://cdn.discordapp.com/emojis/1113746865100423238.webp?size=96&quality=lossless')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            bungeecode: new EmbedBuilder()
                .setColor(0x0083FF)
                .setTitle('**Proxy・BungeeCode**')
                .setDescription('**Software:** BungeeCode\n**Accepted Versions:** `1.18`, `1.19`, `1.20`\n\n**Optimization includes:** *(Not limited to)*\n ● Plugins will be updated to the latest version.\n ● Errors and bugs will be fixed.\n ● Optimization of Configuration Files.\n ● Connection Optimization\n ● More... \n\n **Minimum Price:** 0.2$/srv')
                .setThumbnail('https://cdn.discordapp.com/emojis/1113746843118075904.webp?size=96&quality=lossless')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            waterfall: new EmbedBuilder()
                .setColor(0x0083FF)
                .setTitle('**Proxy・Waterfall**')
                .setDescription('**Software:** Waterfall\n**Accepted Versions:** `1.18`, `1.19`, `1.20`\n\n**Optimization includes:** *(Not limited to)*\n ● Unwanted files will be deleted.\n ● Plugins will be updated to the latest version.\n ● Errors and bugs will be fixed.\n ● Optimization of Configuration Files.\n ● Connection Optimization\n ● More... \n\n **Minimum Price:** 0.5$/srv')
                .setThumbnail('https://cdn.discordapp.com/emojis/1113746882062209085.webp?size=96&quality=lossless')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            velocity: new EmbedBuilder()
                .setColor(0x0083FF)
                .setTitle('**Proxy・Velocity**')
                .setDescription('**Software:** Velocity\n**Accepted Versions:** `latest`\n\n**Optimization includes:** *(Not limited to)*\n ● Unwanted files will be deleted.\n ● Plugins will be updated to the latest version.\n ● Errors and bugs will be fixed.\n ● Optimization of Configuration Files.\n ● Connection Optimization\n ● More... \n\n **Minimum Price:** 1.0$/srv')
                .setThumbnail('https://cdn.discordapp.com/emojis/1113746876370518047.webp?size=96&quality=lossless')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            forge: new EmbedBuilder()
                .setColor(0x44FF82)
                .setTitle('**Modded・Forge**')
                .setDescription('**Software:** Forge\n**Accepted Versions:** `1.17`, `1.18`, `1.19`, `1.20`\n\n**Optimization includes:** *(Not limited to)*\n ● Unwanted files will be deleted.\n ● Mods will be updated to the latest version.\n ● Errors and bugs will be fixed.\n ● Optimization of Configuration Files.\n ● More... \n\n **Minimum Price:** 1.0$/srv')
                .setThumbnail('https://cdn.discordapp.com/emojis/1113746848717475840.webp?size=96&quality=lossless')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            fabric: new EmbedBuilder()
                .setColor(0x44FF82)
                .setTitle('**Modded・Fabric**')
                .setDescription('**Software:** Fabric\n**Accepted Versions:** `1.17`, `1.18`, `1.19`, `1.20`\n\n**Optimization includes:** *(Not limited to)*\n ● Unwanted files will be deleted.\n ● Mods will be updated to the latest version.\n ● Mods compatibility issue fix.\n ● Errors and bugs will be fixed.\n ● Optimization of Configuration Files.\n ● More... \n\n **Minimum Price:** 1.3$/srv')
                .setThumbnail('https://cdn.discordapp.com/emojis/1113746854279135262.webp?size=96&quality=lossless')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            pluginDevelopment: new EmbedBuilder()
                .setColor(0xFFCC00)
                .setTitle('Plugin・Development')
                .setDescription('**Accepted Softwares:** `Bukkit`, `Spigot`, `Paper`\n**Accepted Versions:** `1.8`, `1.16`, `1.17`, `1.18`, `1.19`, `1.20`\n\n**Plugin pricing depends on:** *(Not limited to)*\n ● **Complexity:** The level of complexity involved in developing the plugin.\n ● **Time Consumption:** The amount of time required to develop the plugin.\n ● **Compatibility:** The compatibility of the plugin with different server software and versions.\n ● **Software Type:** The type of software the plugin is designed for (e.g., server-side or proxy plugins).\n ● More...\n\n**Minimum Price:** 1$/plugin')
                .setThumbnail('https://cdn.discordapp.com/emojis/1114841716323782656.gif?size=96&quality=lossless')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            invite: new EmbedBuilder()
                .setColor(0x00FFFF)
                .setTitle('**Invite・Rewards**')
                .setDescription('**● 2-Inv** = Priority access to free resources\n**● 5-Inv** = Third-tier support after boosters\n**● 7-Inv** = Access to a dedicated support channel with enhanced assistance\n**● 10-Inv** = Free server optimization\n**● 15-Inv** = Choose any one paid service for free\n\n**Invite now!**')
                .setThumbnail('https://cdn-icons-png.flaticon.com/512/166/166260.png')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            booster: new EmbedBuilder()
                .setColor(0xFF70FF)
                .setTitle('**Boost・Rewards**')
                .setDescription('**1x Boost Rewards includes:**\n ● Free server optimization\n ● Priority access to free resources\n ● Exclusive booster role\n ● Second-tier support after premium users\n ● Access to a dedicated support channel with enhanced assistance\n\n**2x Boost Rewards includes:** *(Not limited to)*\n ● Free server optimization\n ● Priority access to free resources\n ● Exclusive booster role\n ● Second-tier support after premium users\n ● Access to a dedicated support channel with enhanced assistance\n ● Choose any one paid service for free\n ● More...\n\n**Boost the server now!**')
                .setThumbnail('https://cdn.discordapp.com/emojis/1114515644969386004.webp?size=96&quality=lossless')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
        };
    }

    handleCommand(message) {
        const content = message.content.toLowerCase();

        if (content.startsWith('c!help') || content.startsWith('c!?')) {
            message.channel.send({ embeds: [this.embeds.help] });
        } else if (content.startsWith('c!not available')) {
            message.channel.send({ embeds: [this.embeds.notAvailable] });
        } else if (content.startsWith('c!ticket') || content.startsWith('c!tickets')) {
            message.channel.send({ embeds: [this.ticketSystem.getTicketEmbed()], components: [this.ticketSystem.getTicketButtonRow()] });
        } else if (content.startsWith('c!order')) {
            message.channel.send({ embeds: [this.orderSystem.getOrderEmbed()], components: [this.orderSystem.getOrderButtonRow()] });
        } else if (content.startsWith('c!reward') || content.startsWith('c!rewards')) {
            message.channel.send({ embeds: [this.rewardSystem.getRewardEmbed()], components: [this.rewardSystem.getRewardButtonRow()] });
        } else if (content.startsWith('c!staff application') || content.startsWith('c!staff applications') || content.startsWith('c!staff app')) {
            message.channel.send({ embeds: [this.staffApplicationSystem.getStaffApplicationEmbed()], components: [this.staffApplicationSystem.getStaffApplicationButtonRow()] });
        } else if (content.startsWith('c!bukkit optimization')) {
            message.channel.send({ embeds: [this.embeds.bukkit, this.orderSystem.getOrderEmbed()], components: [this.orderSystem.getOrderButtonRow()] });
        } else if (content.startsWith('c!spigot optimization')) {
            message.channel.send({ embeds: [this.embeds.spigot, this.orderSystem.getOrderEmbed()], components: [this.orderSystem.getOrderButtonRow()] });
        } else if (content.startsWith('c!paper optimization')) {
            message.channel.send({ embeds: [this.embeds.paper, this.orderSystem.getOrderEmbed()], components: [this.orderSystem.getOrderButtonRow()] });
        } else if (content.startsWith('c!purple optimization')) {
            message.channel.send({ embeds: [this.embeds.purple, this.orderSystem.getOrderEmbed()], components: [this.orderSystem.getOrderButtonRow()] });
        } else if (content.startsWith('c!bungeecode optimization')) {
            message.channel.send({ embeds: [this.embeds.bungeecode, this.orderSystem.getOrderEmbed()], components: [this.orderSystem.getOrderButtonRow()] });
        } else if (content.startsWith('c!waterfall optimization')) {
            message.channel.send({ embeds: [this.embeds.waterfall, this.orderSystem.getOrderEmbed()], components: [this.orderSystem.getOrderButtonRow()] });
        } else if (content.startsWith('c!velocity optimization')) {
            message.channel.send({ embeds: [this.embeds.velocity, this.orderSystem.getOrderEmbed()], components: [this.orderSystem.getOrderButtonRow()] });
        } else if (content.startsWith('c!forge optimization')) {
            message.channel.send({ embeds: [this.embeds.forge, this.orderSystem.getOrderEmbed()], components: [this.orderSystem.getOrderButtonRow()] });
        } else if (content.startsWith('c!fabric optimization')) {
            message.channel.send({ embeds: [this.embeds.fabric, this.orderSystem.getOrderEmbed()], components: [this.orderSystem.getOrderButtonRow()] });
        } else if (content.startsWith('c!optimization')) {
            message.channel.send({
                embeds: [
                    this.embeds.bukkit,
                    this.embeds.spigot,
                    this.embeds.paper,
                    this.embeds.purple,
                    this.embeds.bungeecode,
                    this.embeds.waterfall,
                    this.embeds.velocity,
                    this.embeds.forge,
                    this.embeds.fabric,
                    this.orderSystem.getOrderEmbed()
                ],
                components: [this.orderSystem.getOrderButtonRow()]
            });
        } else if (content.startsWith('c!plugin development')) {
            message.channel.send({ embeds: [this.embeds.pluginDevelopment, this.orderSystem.getOrderEmbed()], components: [this.orderSystem.getOrderButtonRow()] });
        } else if (content.startsWith('c!invite reward') || content.startsWith('c!invite rewards')) {
            message.channel.send({ embeds: [this.embeds.invite, this.rewardSystem.getRewardEmbed()], components: [this.rewardSystem.getRewardButtonRow()] });
        } else if (content.startsWith('c!booster reward') || content.startsWith('c!booster rewards')) {
            message.channel.send({ embeds: [this.embeds.booster, this.rewardSystem.getRewardEmbed()], components: [this.rewardSystem.getRewardButtonRow()] });
        }
    }
}

module.exports = CommandSystem;