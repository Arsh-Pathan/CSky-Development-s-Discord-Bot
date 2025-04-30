const fs = require('fs');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');

class TicketSystem {
    constructor(client) {
        this.client = client;
        this.guild = this.client.guilds.cache.get(process.env.GUILD_ID);
        this.dataFilePath = './ticketIDs.json';

        this.embeds = {
            ticket: new EmbedBuilder()
                .setColor(0x4482FF)
                .setTitle('**Ticket**')
                .setDescription(`To create a ticket, simply click on the **Create** button below.\n Our team will get back to you as soon as possible.`)
                .setThumbnail('https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            create: new EmbedBuilder()
                .setColor(0x4482FF)
                .setTitle('**Thank you for creating a ticket.**')
                .setDescription(`**Please wait for our staff to arrive.** They will be with you shortly. In the meantime, please provide any additional information or details in the ticket. If you no longer need assistance and wish to close the ticket, you can click on the **Close** button below.`)
                .setThumbnail('https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            close: new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription(`**Are you sure you want to close this ticket?**\n Please click on **Confirm** to proceed with closing the ticket, or click on **Cancel** to retract your request.`)
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            closeCancel: new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription('**The closure of the ticket has been canceled!**')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' })
        };

        this.buttons = {
            create: new ButtonBuilder()
                .setCustomId('Ticket_Create_Button')
                .setLabel('Create')
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:Ticket:1118483344397705237>')
                .setDisabled(false),
            close: new ButtonBuilder()
                .setCustomId('Ticket_Close_Button')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:TicketClose:1118940954771075174>')
                .setDisabled(false),
            closeConfirm: new ButtonBuilder()
                .setCustomId('Ticket_Close_Confirm_Button')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:CloseConfirm:1118942133517295757>')
                .setDisabled(false),
            closeCancel: new ButtonBuilder()
                .setCustomId('Ticket_Close_Cancel_Button')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:CloseCancel:1118844964273659924>')
                .setDisabled(false),
            delete: new ButtonBuilder()
                .setCustomId('Ticket_Delete_Button')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:Delete:1118844967327113316>')
                .setDisabled(false)
        };

        this.buttonRows = {
            create: new ActionRowBuilder().addComponents(this.buttons.create),
            close: new ActionRowBuilder().addComponents(this.buttons.close),
            closeConfirm: new ActionRowBuilder().addComponents(this.buttons.closeConfirm, this.buttons.closeCancel),
            delete: new ActionRowBuilder().addComponents(this.buttons.delete)
        };
    }

    getTicketEmbed() {
        return this.embeds.ticket;
    }

    getTicketButtonRow() {
        return this.buttonRows.create;
    }

    async handleButton(interaction) {
        const buttonId = interaction.customId;

        if (buttonId === 'Ticket_Create_Button') {
            const category = this.guild.channels.cache.find(channel => channel.id === process.env.TICKET_CATEGORY_ID && channel.type === ChannelType.GuildCategory);
            const member = interaction.member;
            console.log(`[INFO] Creating a ticket channel for ${member.user.username}...`);
            if (!category) {
                console.log(`[ERROR] An error occurred while creating the ticket for ${member.user.username}.\n[ERROR] Ticket channel category not found.`);
                return;
            }

            const ticketID = this.getTicketID();
            try {
                const channel = await this.guild.channels.create({
                    name: `🎫・${ticketID}`,
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        { id: this.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                        { id: member.id, allow: [PermissionsBitField.Flags.ViewChannel] },
                        { id: process.env.SUPPORT_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel] }
                    ],
                });

                console.log(`[INFO] Successfully created a new ticket: ${channel.name}.`);
                const embed = new EmbedBuilder()
                    .setColor(0x4482FF)
                    .setDescription(`Your ticket has been successfully created in ${channel}. We appreciate your patience while we address your request.`)
                    .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
                const reply = await interaction.reply({ embeds: [embed], ephemeral: true });
                channel.send({ embeds: [this.embeds.create], components: [this.buttonRows.close] });
                setTimeout(() => reply.delete(), 10000);
            } catch (error) {
                console.log(`[ERROR] An error occurred while creating a ticket for ${member.user.username}.\n[ERROR] ${error}`);
            }
        } else if (buttonId === 'Ticket_Close_Button') {
            interaction.reply({ embeds: [this.embeds.close], components: [this.buttonRows.closeConfirm], ephemeral: true });
        } else if (buttonId === 'Ticket_Close_Confirm_Button') {
            const channel = interaction.channel;
            const override = [
                { id: this.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.member.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: process.env.SUPPORT_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel] }
            ];
            const embed = new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription(`The ticket has been closed by ${interaction.member}! Please click on the **Delete** button below to delete the ticket permanently.`)
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
            channel.permissionOverwrites.set(override);
            interaction.reply({ embeds: [embed], components: [this.buttonRows.delete], ephemeral: false });
        } else if (buttonId === 'Ticket_Close_Cancel_Button') {
            const intReply = await interaction.reply({ embeds: [this.embeds.closeCancel], ephemeral: true });
            setTimeout(() => intReply.delete(), 10000);
        } else if (buttonId === 'Ticket_Delete_Button') {
            const authorRoles = interaction.member.roles.cache.map((role) => role.id);
            const hasRequiredRole = authorRoles.includes(process.env.TICKET_DELETE_ROLE_ID);
            if (!hasRequiredRole) {
                const noPermissions = new EmbedBuilder()
                    .setColor(0x0090ff)
                    .setTitle('**NO PERMISSIONS**')
                    .setDescription(`**You must be a moderator to do this.**`)
                    .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
                const intReply = await interaction.reply({ embeds: [noPermissions], ephemeral: true });
                setTimeout(() => intReply.delete(), 10000);
                return;
            }
            const channel = interaction.channel;
            try {
                await channel.delete();
                console.log(`[INFO] Closed the ticket: ${channel.name}`);
            } catch (error) {
                console.log(`[ERROR] An error occurred while closing the ticket: ${channel.name}\n[ERROR] ${error}`);
            }
        }
    }

    getTicketID() {
        let ticketData = { ID: 0 };
        if (fs.existsSync(this.dataFilePath)) {
            const jsonData = fs.readFileSync(this.dataFilePath, 'utf8');
            if (jsonData) ticketData = JSON.parse(jsonData);
        }
        let ID = ticketData.ID || 0;
        if (ID === 9999) ID = 0;
        ID++;
        ticketData.ID = ID;
        fs.writeFileSync(this.dataFilePath, JSON.stringify({ ID }), 'utf8');
        return ID.toString().padStart(4, '0');
    }
}

module.exports = TicketSystem;