require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
});

const MemberCountSystem = require('./systems/MemberCountSystem');
const CountingSystem = require('./systems/CountingSystem');
const CSkyCountingSystem = require('./systems/CSkyCountingSystem');
const TicketSystem = require('./systems/TicketSystem');
const OrderSystem = require('./systems/OrderSystem');
const RewardSystem = require('./systems/RewardSystem');
const StaffApplicationSystem = require('./systems/StaffApplicationSystem');
const CommandSystem = require('./systems/CommandSystem');

client.on('ready', () => {
    console.log('[INFO] Starting CSky Development Bot...');
    console.log('[INFO] Setting up bot status...');
    client.user.setStatus('available');
    console.log('[INFO] Status setuped!');
    console.log('[INFO] Setting up bot presence...');
    client.user.setPresence({ activities: [{ name: `CSky Developments`, type: 3 }], status: 'dnd' });
    console.log('[INFO] Presence setuped!');
    console.log('[INFO] Accessing CSky Developments server...');

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
        console.log('[ERROR] Failed to access the server!');
        console.log('[WARN] Shutting down...');
        console.log('[WARN] Shutdown completed!');
        return;
    }
    console.log('[INFO] Successfully accessed CSky Developments server.');
    console.log('[INFO] CSky Development is online!');

    // Initialize all systems
    const memberCountSystem = new MemberCountSystem(client);
    const cskyCountingSystem = new CSkyCountingSystem(client);
    const countingSystem = new CountingSystem(client);
    const ticketSystem = new TicketSystem(client);
    const orderSystem = new OrderSystem(client);
    const rewardSystem = new RewardSystem(client);
    const staffApplicationSystem = new StaffApplicationSystem(client);
    const commandSystem = new CommandSystem(client, ticketSystem, orderSystem, rewardSystem, staffApplicationSystem);

    // Initial member count update
    memberCountSystem.updateMemberCount();

    // Event handlers
    client.on('messageCreate', (message) => {
        if (message.author.bot) return;
        
        if (message.channel.id === process.env.CSKY_COUNTING_CHANNEL_ID) {
            cskyCountingSystem.handleMessage(message);
        } else if (message.channel.id === process.env.COUNTING_CHANNEL_ID) {
            countingSystem.handleMessage(message);
        } else if (message.content.startsWith('c!')) {
            commandSystem.handleCommand(message);
        }
    });

    client.on('interactionCreate', (interaction) => {
        if (interaction.isButton()) {
            const customId = interaction.customId;
            if (customId.startsWith('Ticket_')) {
                ticketSystem.handleButton(interaction);
            } else if (customId.startsWith('Order_')) {
                orderSystem.handleButton(interaction);
            } else if (customId.startsWith('Reward_')) {
                rewardSystem.handleButton(interaction);
            } else if (customId.startsWith('App_') || customId === 'Developer_Button' || 
                     customId === 'Moderator_Button' || customId === 'Supporter_Button') {
                staffApplicationSystem.handleButton(interaction);
            }
        }
    });

    client.on('guildMemberAdd', (member) => {
        member.roles.add(process.env.MEMBER_ROLE_ID) 
        memberCountSystem.handleMemberAdd(member);
    });

    client.on('guildMemberRemove', (member) => {
        memberCountSystem.handleMemberRemove(member);
    });
});

client.login(process.env.TOKEN);