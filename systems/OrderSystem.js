const fs = require('fs');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');

class OrderSystem {
    constructor(client) {
        this.client = client;
        this.guild = this.client.guilds.cache.get(process.env.GUILD_ID);
        this.dataFilePath = './orderIDs.json';

        this.embeds = {
            order: new EmbedBuilder()
                .setColor(0x4482FF)
                .setTitle('**Order Service**')
                .setDescription(`To place an order, simply click on the **Place Order** button below.\n Our team will review your request and get back to you as soon as possible.`)
                .setThumbnail('https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            create: new EmbedBuilder()
                .setColor(0x4482FF)
                .setTitle('**Thank you for placing an order.**')
                .setDescription(`**Please wait for our staff to review your request.** They will get back to you shortly with further details. If you need to provide any additional information or have any questions, please mention it here. To cancel your order, simply click on the **Cancel** button below.`)
                .setThumbnail('https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            close: new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription(`**Are you sure you want to cancel this order?**\n Please click on **Confirm** to proceed with canceling the order, or click on **Cancel** to retain your request.`)
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            closeCancel: new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription('**Order cancellation has been canceled!**')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' })
        };

        this.buttons = {
            create: new ButtonBuilder()
                .setCustomId('Order_Create_Button')
                .setLabel('Place Order')
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:Order:1118978541871181915>')
                .setDisabled(false),
            close: new ButtonBuilder()
                .setCustomId('Order_Cancel_Button')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:OrderClose:1118978536557006948>')
                .setDisabled(false),
            closeConfirm: new ButtonBuilder()
                .setCustomId('Order_Cancel_Confirm_Button')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:CloseConfirm:1118942133517295757>')
                .setDisabled(false),
            closeCancel: new ButtonBuilder()
                .setCustomId('Order_Cancel_Cancel_Button')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:CloseCancel:1118844964273659924>')
                .setDisabled(false),
            delete: new ButtonBuilder()
                .setCustomId('Order_Delete_Button')
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

    getOrderEmbed() {
        return this.embeds.order;
    }

    getOrderButtonRow() {
        return this.buttonRows.create;
    }

    async handleButton(interaction) {
        const buttonId = interaction.customId;

        if (buttonId === 'Order_Create_Button') {
            const category = this.guild.channels.cache.find(channel => channel.id === process.env.SERVICE_ORDER_CATEGORY_ID && channel.type === ChannelType.GuildCategory);
            const member = interaction.member;
            console.log(`[INFO] Creating an order channel for ${member.user.username}...`);
            if (!category) {
                console.log(`[ERROR] An error occurred while creating the order channel for ${member.user.username}.\n[ERROR] Order channel category not found.`);
                return;
            }

            const orderID = this.getOrderID();
            try {
                const channel = await this.guild.channels.create({
                    name: `🛒・${orderID}`,
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        { id: this.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                        { id: member.id, allow: [PermissionsBitField.Flags.ViewChannel] },
                        { id: process.env.SERVICE_ORDER_SUPPORT_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel] }
                    ],
                });

                console.log(`[INFO] Successfully created a new order channel: ${channel.name}.`);
                const embed = new EmbedBuilder()
                    .setColor(0x4482FF)
                    .setDescription(`Your order has been successfully placed in ${channel}. We appreciate your patience while our team reviews your request.`)
                    .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
                const reply = await interaction.reply({ embeds: [embed], ephemeral: true });
                channel.send({ embeds: [this.embeds.create], components: [this.buttonRows.close] });
                setTimeout(() => reply.delete(), 10000);
            } catch (error) {
                console.log(`[ERROR] An error occurred while creating an order channel for ${member.user.username}.\n[ERROR] ${error}`);
            }
        } else if (buttonId === 'Order_Cancel_Button') {
            interaction.reply({ embeds: [this.embeds.close], components: [this.buttonRows.closeConfirm], ephemeral: true });
        } else if (buttonId === 'Order_Cancel_Confirm_Button') {
            const channel = interaction.channel;
            const override = [
                { id: this.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.member.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: process.env.SERVICE_ORDER_SUPPORT_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel] }
            ];
            const embed = new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription(`The order has been canceled by ${interaction.member}! Please click on the **Delete** button below to remove the order permanently.`)
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
            channel.permissionOverwrites.set(override);
            interaction.reply({ embeds: [embed], components: [this.buttonRows.delete], ephemeral: false });
        } else if (buttonId === 'Order_Cancel_Cancel_Button') {
            const intReply = await interaction.reply({ embeds: [this.embeds.closeCancel], ephemeral: true });
            setTimeout(() => intReply.delete(), 10000);
        } else if (buttonId === 'Order_Delete_Button') {
            const authorRoles = interaction.member.roles.cache.map((role) => role.id);
            const hasRequiredRole = authorRoles.includes(process.env.SERVICE_ORDER_DELETE_ROLE_ID);
            if (!hasRequiredRole) {
                const noPermissions = new EmbedBuilder()
                    .setColor(0x0090ff)
                    .setTitle('**NO PERMISSIONS**')
                    .setDescription(`**You must be a moderator to perform this action.**`)
                    .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
                const intReply = await interaction.reply({ embeds: [noPermissions], ephemeral: true });
                setTimeout(() => intReply.delete(), 10000);
                return;
            }
            const channel = interaction.channel;
            try {
                await channel.delete();
                console.log(`[INFO] Canceled the order: ${channel.name}`);
            } catch (error) {
                console.log(`[ERROR] An error occurred while canceling the order: ${channel.name}\n[ERROR] ${error}`);
            }
        }
    }

    getOrderID() {
        let orderData = { ID: 0 };
        if (fs.existsSync(this.dataFilePath)) {
            const jsonData = fs.readFileSync(this.dataFilePath, 'utf8');
            if (jsonData) orderData = JSON.parse(jsonData);
        }
        let ID = orderData.ID || 0;
        if (ID === 9999) ID = 0;
        ID++;
        orderData.ID = ID;
        fs.writeFileSync(this.dataFilePath, JSON.stringify({ ID }), 'utf8');
        return ID.toString().padStart(4, '0');
    }
}

module.exports = OrderSystem;