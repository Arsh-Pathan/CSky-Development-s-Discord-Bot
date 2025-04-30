const { ChannelType } = require('discord.js');

class MemberCountSystem {
    constructor(client) {
        this.client = client;
        this.guild = this.client.guilds.cache.get(process.env.GUILD_ID);
        this.memberCountChannelId = process.env.MEMBER_COUNT_CHANNEL_ID;
    }

    updateMemberCount() {
        const channel = this.guild.channels.cache.get(this.memberCountChannelId);
        if (channel) {
            const count = this.guild.memberCount;
            channel.setName(`😎・Members: ${count}`)
                .then(() => console.log(`[INFO] Successfully updated member count to ${count} members.`))
                .catch(console.error);
        } else {
            console.log('[ERROR] Member count channel not found.');
        }
    }

    handleMemberAdd(member) {
        console.log(`[INFO] ${member.user.username} just hopped into the server.`);
        this.updateMemberCount();
    }

    handleMemberRemove(member) {
        console.log(`[INFO] ${member.user.username} has left the server.`);
        this.updateMemberCount();
    }
}

module.exports = MemberCountSystem;