const fs = require('fs');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');

class StaffApplicationSystem {
    constructor(client) {
        this.client = client;
        this.guild = this.client.guilds.cache.get(process.env.GUILD_ID);
        this.dataFilePath = './applicationIDs.json';

        this.embeds = {
            staffApplications: new EmbedBuilder()
                .setColor(0x0094FF)
                .setTitle('**Staff・Applications**')
                .setDescription(`**Thank you for considering a position at CSky Developments, your premier destination for Minecraft server solutions. We are currently looking for talented individuals to join our team in the following roles:**\n\n1. **Developer:** As a Developer at CSky Developments, you will be responsible for creating and maintaining plugins, texture packs, custom builds, and server setups. You should have a strong understanding of Java and Minecraft server architecture. Experience with plugin development frameworks, such as Bukkit or Spigot, is highly desirable.\n\n2. **Moderator:** In the role of Moderator, you will be entrusted with maintaining a positive and welcoming community environment on our servers. Your responsibilities will include enforcing server rules, resolving conflicts, and assisting players with any issues they may encounter. Good communication and problem-solving skills are essential for this role.\n\n3. **Supporter:** As a Supporter, you will provide prompt and efficient assistance to our players, addressing their inquiries, troubleshooting technical problems, and guiding them through gameplay-related challenges. You should have excellent communication skills, a friendly demeanor, and a passion for helping others.\n\n**To apply for a role, please select the field you are interested in and click on the respective button below. We will review your application and contact you for further steps in the hiring process.**`)
                .setThumbnail('https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            create: new EmbedBuilder()
                .setColor(0x4482FF)
                .setTitle('**Thank you for considering a position at CSky Developments.**')
                .setDescription(`**Please wait for the owner to arrive.** They will be with you shortly. In the meantime, we kindly request you to answer the following questions and provide any additional information or details. If you no longer wish to proceed with the application and would like to cancel it, you can simply click on the **Close** button below.`)
                .setThumbnail('https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            close: new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription(`**Are you sure you want to cancel this application?** Please click on **Confirm** to proceed with cancellation or click on **Cancel** to retract your request.`)
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' }),
            closeCancel: new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription('**The closure of the application has been canceled!**')
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' })
        };

        this.buttons = {
            developer: new ButtonBuilder()
                .setCustomId('Developer_Button')
                .setLabel('Developer')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:Developer:1117845118154711112>')
                .setDisabled(false),
            moderator: new ButtonBuilder()
                .setCustomId('Moderator_Button')
                .setLabel('Moderator')
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:Moderator:1117846138935066738>')
                .setDisabled(false),
            supporter: new ButtonBuilder()
                .setCustomId('Supporter_Button')
                .setLabel('Supporter')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('<:Supporter:1117847120565776444>')
                .setDisabled(false),
            developerClose: new ButtonBuilder()
                .setCustomId('Developer_Close_Button')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:Developer_Cancle:1123522806815129680>')
                .setDisabled(false),
            moderatorClose: new ButtonBuilder()
                .setCustomId('Moderator_Close_Button')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:Moderator_Cancle:1123522816780800001>')
                .setDisabled(false),
            supporterClose: new ButtonBuilder()
                .setCustomId('Supporter_Close_Button')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:Supporter_Cancle:1123522822313087046>')
                .setDisabled(false),
            closeConfirm: new ButtonBuilder()
                .setCustomId('App_Close_Confirm_Button')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:CloseConfirm:1118942133517295757>')
                .setDisabled(false),
            closeCancel: new ButtonBuilder()
                .setCustomId('App_Close_Cancel_Button')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:CloseCancel:1118844964273659924>')
                .setDisabled(false),
            delete: new ButtonBuilder()
                .setCustomId('App_Delete_Button')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:Delete:1118844967327113316>')
                .setDisabled(false)
        };

        this.buttonRows = {
            create: new ActionRowBuilder().addComponents(this.buttons.developer, this.buttons.moderator, this.buttons.supporter),
            developerClose: new ActionRowBuilder().addComponents(this.buttons.developerClose),
            moderatorClose: new ActionRowBuilder().addComponents(this.buttons.moderatorClose),
            supporterClose: new ActionRowBuilder().addComponents(this.buttons.supporterClose),
            closeConfirm: new ActionRowBuilder().addComponents(this.buttons.closeConfirm, this.buttons.closeCancel),
            delete: new ActionRowBuilder().addComponents(this.buttons.delete)
        };
    }

    getStaffApplicationEmbed() {
        return this.embeds.staffApplications;
    }

    getStaffApplicationButtonRow() {
        return this.buttonRows.create;
    }

    async handleButton(interaction) {
        const buttonId = interaction.customId;

        if (buttonId === 'Developer_Button' || buttonId === 'Moderator_Button' || buttonId === 'Supporter_Button') {
            const category = this.guild.channels.cache.find(channel => channel.id === process.env.STAFF_APP_CATEGORY_ID && channel.type === ChannelType.GuildCategory);
            const member = interaction.member;
            console.log(`[INFO] Creating a staff application channel for ${member.user.username}...`);
            if (!category) {
                console.log(`[ERROR] An error occurred while creating the staff application for ${member.user.username}.\n[ERROR] Staff application channel category not found.`);
                return;
            }

            const applicationID = this.getApplicationID();
            try {
                const channel = await this.guild.channels.create({
                    name: `🎓・${applicationID}`,
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        { id: this.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                        { id: member.id, allow: [PermissionsBitField.Flags.ViewChannel] },
                        { id: process.env.STAFF_APP_SUPPORT_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel] }
                    ],
                });

                console.log(`[INFO] Successfully created a new staff application: ${channel.name}.`);
                const embed = new EmbedBuilder()
                    .setColor(0x4482FF)
                    .setDescription(`Your application has been successfully created in ${channel}. We sincerely appreciate your interest in pursuing a position at CSky Developments.`)
                    .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
                const reply = await interaction.reply({ embeds: [embed], ephemeral: true });

                if (buttonId === 'Developer_Button') {
                    channel.send({ embeds: [this.embeds.create], components: [this.buttonRows.developerClose] });
                    const questions = new EmbedBuilder()
                        .setColor(0x4482FF)
                        .setTitle('**Answer the following.**')
                        .setDescription(`**1.** Do you have experience in Java programming?\n**2.** Are you familiar with plugin development frameworks like Bukkit or Spigot?\n**3.** Have you ever collaborated with other developers on a project? If yes, please explain your role and contribution.\n**4.** How do you ensure compatibility and performance optimization when developing plugins?\n**5.** Can you provide examples of plugins or texture packs you have created or worked on?\n**6.** What is your experience with custom builds and server setups?\n**7.** Can you describe your experience with server optimization and configuration?\n**8.** How do you stay updated on the latest trends and developments in the Minecraft modding community?\n**9.** Can you provide a portfolio or code samples to showcase your programming skills?\n**10.** Are you comfortable working in a team environment?`)
                        .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
                    channel.send({ embeds: [questions] });
                } else if (buttonId === 'Moderator_Button') {
                    channel.send({ embeds: [this.embeds.create], components: [this.buttonRows.moderatorClose] });
                    const questions = new EmbedBuilder()
                        .setColor(0x4482FF)
                        .setTitle('**Answer the following.**')
                        .setDescription(`**1.** Have you ever worked as a moderator before? If yes, please describe your experience.\n**2.** How would you handle a situation where two players are engaged in a heated argument?\n**3.** What steps would you take to enforce server rules in a fair and consistent manner?\n**4.** Can you provide an example of a conflict resolution you successfully managed in a gaming community?\n**5.** How would you handle a player who repeatedly violates the rules despite warnings?\n**6.** Are you comfortable communicating with players through written channels, such as chat or forums?\n**7.** How would you respond to a player who reports a bug or technical issue on the server?\n**8.** Can you describe your approach to maintaining a positive and welcoming community environment?\n**9.** Have you ever encountered a situation where you had to ban a player? If yes, please explain the circumstances.\n**10.** How do you handle stressful situations or conflicts between players in an impartial manner?`)
                        .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
                    channel.send({ embeds: [questions] });
                } else if (buttonId === 'Supporter_Button') {
                    channel.send({ embeds: [this.embeds.create], components: [this.buttonRows.supporterClose] });
                    const questions = new EmbedBuilder()
                        .setColor(0x4482FF)
                        .setTitle('**Answer the following.**')
                        .setDescription(`**1.** Do you have previous experience in providing customer support or assistance?\n**2.** Can you describe a situation where you successfully resolved a technical problem for a player?\n**3.** How do you prioritize and manage multiple player inquiries or issues simultaneously?\n**4.** How would you guide a new player through the basic gameplay mechanics and features?\n**5.** Have you ever encountered a situation where a player was engaging in toxic behavior? How did you handle it?\n**6.** What steps would you take to ensure a positive and helpful interaction with players?\n**7.** How do you handle situations where you do not have an immediate solution to a player's problem?\n**8.** How would you prioritize and respond to player inquiries and support tickets?\n**9.** Are you comfortable troubleshooting technical problems related to the game client or server?\n**10.** How do you stay up-to-date with the latest updates, patches, and changes in the game?`)
                        .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
                    channel.send({ embeds: [questions] });
                }
                setTimeout(() => reply.delete(), 10000);
            } catch (error) {
                console.log(`[ERROR] An error occurred while creating the staff application for ${member.user.username}.\n[ERROR] ${error}`);
            }
        } else if (buttonId === 'Developer_Close_Button' || buttonId === 'Moderator_Close_Button' || buttonId === 'Supporter_Close_Button') {
            interaction.reply({ embeds: [this.embeds.close], components: [this.buttonRows.closeConfirm], ephemeral: true });
        } else if (buttonId === 'App_Close_Confirm_Button') {
            const channel = interaction.channel;
            const override = [
                { id: this.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.member.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: process.env.STAFF_APP_SUPPORT_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel] }
            ];
            const embed = new EmbedBuilder()
                .setColor(0x4482FF)
                .setDescription(`The application has been closed by ${interaction.member}! Please click on the **Delete** button below to delete the application permanently.`)
                .setFooter({ text: '・CSky Developments', iconURL: 'https://cdn.discordapp.com/attachments/1112390125276631080/1112442565766168808/CSkyDevelopements.png' });
            channel.permissionOverwrites.set(override);
            interaction.reply({ embeds: [embed], components: [this.buttonRows.delete], ephemeral: false });
        } else if (buttonId === 'App_Close_Cancel_Button') {
            const intReply = await interaction.reply({ embeds: [this.embeds.closeCancel], ephemeral: true });
            setTimeout(() => intReply.delete(), 10000);
        } else if (buttonId === 'App_Delete_Button') {
            const authorRoles = interaction.member.roles.cache.map((role) => role.id);
            const hasRequiredRole = authorRoles.includes(process.env.STAFF_APP_DELETE_ROLE_ID);
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
                console.log(`[INFO] Closed the application: ${channel.name}`);
            } catch (error) {
                console.log(`[ERROR] An error occurred while closing the application: ${channel.name}\n[ERROR] ${error}`);
            }
        }
    }

    getApplicationID() {
        let applicationData = { ID: 0 };
        if (fs.existsSync(this.dataFilePath)) {
            const jsonData = fs.readFileSync(this.dataFilePath, 'utf8');
            if (jsonData) applicationData = JSON.parse(jsonData);
        }
        let ID = applicationData.ID || 0;
        if (ID === 9999) ID = 0;
        ID++;
        applicationData.ID = ID;
        fs.writeFileSync(this.dataFilePath, JSON.stringify({ ID }), 'utf8');
        return ID.toString().padStart(4, '0');
    }
}

module.exports = StaffApplicationSystem;