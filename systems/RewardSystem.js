const fs = require('fs');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');

class RewardSystem {
    constructor(client) {
        this.client = client;
        this.guild = this.client.guilds.cache.get(process.env.GUILD_ID);
        this.dataFilePath = './rewardIDs.json';

        this.embeds = {
            ticket: new EmbedBuilder()
                .setColor(0x4482FF)
                .setTitle('**Reward Claim**')
                .setDescription(`To claim a reward, simply click on the **Claim** button below.\nOur team will process your request and provide you with the reward as soon as possible.`)
                .setThumbnail('https://example.com/reward-system.png')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            create: new EmbedBuilder()
                .setColor(0x4482FF)
                .setTitle('**Thank you for creating a reward claim ticket.**')
                .setDescription(`**Please wait for our team to process your request.** They will be with you shortly. In the meantime, please provide any additional information or details in the ticket. If you change your mind and no longer wish to claim the reward, you can click on the **Cancel** button below.`)
                .setThumbnail('https://example.com/reward-system.png')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            close: new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription(`**Are you sure you want to close this reward claim ticket?**\nPlease click on **Confirm** to proceed with closing the ticket, or click on **Cancel** to keep the ticket open.`)
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            closeCancel: new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription('**The closure of the reward claim ticket has been canceled!**')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' })
        };

        this.buttons = {
            claim: new ButtonBuilder()
                .setCustomId('Reward_Claim_Button')
                .setLabel('Claim')
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:Gift:1118971206515818568>')
                .setDisabled(false),
            close: new ButtonBuilder()
                .setCustomId('Reward_Close_Button')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:GiftClose:1118971201818202213>')
                .setDisabled(false),
            closeConfirm: new ButtonBuilder()
                .setCustomId('Reward_Close_Confirm_Button')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:CloseConfirm:1118942133517295757>')
                .setDisabled(false),
            closeCancel: new ButtonBuilder()
                .setCustomId('Reward_Close_Cancel_Button')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:CloseCancel:1118844964273659924>')
                .setDisabled(false),
            delete: new ButtonBuilder()
                .setCustomId('Reward_Delete_Button')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:Delete:1118844967327113316>')
                .setDisabled(false)
        };

        this.buttonRows = {
            claim: new ActionRowBuilder().addComponents(this.buttons.claim),
            close: new ActionRowBuilder().addComponents(this.buttons.close),
            closeConfirm: new ActionRowBuilder().addComponents(this.buttons.closeConfirm, this.buttons.closeCancel),
            delete: new ActionRowBuilder().addComponents(this.buttons.delete)
        };
    }

    getRewardEmbed() {
        return this.embeds.ticket;
    }

    getRewardButtonRow() {
        return this.buttonRows.claim;
    }

    async handleButton(interaction) {
        const buttonId = interaction.customId;

        if (buttonId === 'Reward_Claim_Button') {
            const category = this.guild.channels.cache.find(channel => channel.id === process.env.REWARD_CATEGORY_ID && channel.type === ChannelType.GuildCategory);
            const member = interaction.member;
            console.log(`[INFO] Creating a reward claim channel for ${member.user.username}...`);
            if (!category) {
                console.log(`[ERROR] An error occurred while creating the reward claim ticket for ${member.user.username}.\n[ERROR] Reward claim channel category not found.`);
                return;
            }

            const rewardID = this.getRewardID();
            try {
                const channel = await this.guild.channels.create({
                    name: `🎁・${rewardID}`,
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        { id: this.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                        { id: member.id, allow: [PermissionsBitField.Flags.ViewChannel] },
                        { id: process.env.REWARD_SUPPORT_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel] }
                    ],
                });

                console.log(`[INFO] Successfully created a new reward claim ticket: ${channel.name}.`);
                const embed = new EmbedBuilder()
                    .setColor(0x4482FF)
                    .setDescription(`Your reward claim ticket has been successfully created in ${channel}. Please wait for our team to process your request.`)
                    .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
                const reply = await interaction.reply({ embeds: [embed], ephemeral: true });
                channel.send({ embeds: [this.embeds.create], components: [this.buttonRows.close] });
                setTimeout(() => reply.delete(), 10000);
            } catch (error) {
                console.log(`[ERROR] An error occurred while creating a reward claim ticket for ${member.user.username}.\n[ERROR] ${error}`);
            }
        } else if (buttonId === 'Reward_Close_Button') {
            interaction.reply({ embeds: [this.embeds.close], components: [this.buttonRows.closeConfirm], ephemeral: true });
        } else if (buttonId === 'Reward_Close_Confirm_Button') {
            const channel = interaction.channel;
            const override = [
                { id: this.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.member.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: process.env.REWARD_SUPPORT_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel] }
            ];
            const embed = new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription(`The reward claim ticket has been closed by ${interaction.member}! Click on the **Delete** button below to delete the ticket permanently.`)
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
            channel.permissionOverwrites.set(override);
            interaction.reply({ embeds: [embed], components: [this.buttonRows.delete], ephemeral: false });
        } else if (buttonId === 'Reward_Close_Cancel_Button') {
            const intReply = await interaction.reply({ embeds: [this.embeds.closeCancel], ephemeral: true });
            setTimeout(() => intReply.delete(), 10000);
        } else if (buttonId === 'Reward_Delete_Button') {
            const authorRoles = interaction.member.roles.cache.map((role) => role.id);
            const hasRequiredRole = authorRoles.includes(process.env.REWARD_DELETE_ROLE_ID);
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
                console.log(`[INFO] Closed the reward claim ticket: ${channel.name}`);
            } catch (error) {
                console.log(`[ERROR] An error occurred while closing the reward claim ticket: ${channel.name}\n[ERROR] ${error}`);
            }
        }
    }

    getRewardID() {
        let rewardData = { ID: 0 };
        if (fs.existsSync(this.dataFilePath)) {
            const jsonData = fs.readFileSync(this.dataFilePath, 'utf8');
            if (jsonData) rewardData = JSON.parse(jsonData);
        }
        let ID = rewardData.ID || 0;
        if (ID === 9999) ID = 0;
        ID++;
        rewardData.ID = ID;
        fs.writeFileSync(this.dataFilePath, JSON.stringify({ ID }), 'utf8');
        return ID.toString().padStart(4, '0');
    }
}

module.exports = RewardSystem;