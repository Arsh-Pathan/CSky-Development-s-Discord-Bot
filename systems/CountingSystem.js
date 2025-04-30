const fs = require('fs');

class CountingSystem {
    constructor(client) {
        this.client = client;
        this.dataFilePath = './countingData.json';
        this.countingGoals = [10, 50, 100, 200, 300, 400, 500, 1000];
        this.countingMessages = {
            wrongCount: (expectedNumber) => `**Sike!** That's the wrong number. Number should be ${expectedNumber}.`,
            consecutiveCount: (user) => `**Uh-oh!** ${user}, you can't count two numbers in a row. The count has been reset.`,
            goalReached: (number, user) => {
                const goalMessages = {
                    10: `🎉 **Hooray!** ${user} helped us reach the goal of ${number}! Keep up the good work!`,
                    50: `🎊 **Amazing!** ${user} contributed to the goal of ${number}! Let's keep counting!`,
                    100: `🎈 **Congratulations,** ${user}! We've hit the big ${number}! Keep the count going!`,
                    200: `🥳 **Woohoo!** ${user} has helped us achieve the milestone of ${number}! Great work!`,
                    300: `🌟 **Incredible!** ${user} pushed us to the goal of ${number}! Let's keep counting higher!`,
                    400: `🔥 **Astonishing progress,** ${user}! We've reached ${number}! Keep up the great work!`,
                    500: `🎇 **Spectacular!** ${user} has helped us reach the grand ${number} milestone! Keep counting!`,
                    1000: `🚀 **Unbelievable!** ${user} propelled us to the epic goal of ${number}! Thank you for being a part of it!`,
                };
                return goalMessages[number] || `🎉 **Goal reached!** ${user} helped us reach ${number}! Keep it up!`;
            },
        };
        this.loadData();
    }

    loadData() {
        if (fs.existsSync(this.dataFilePath)) {
            const jsonData = fs.readFileSync(this.dataFilePath, 'utf8');
            const data = JSON.parse(jsonData);
            this.countingCurrentNumber = data.countingCurrentNumber || 1;
            this.lastUserCounter = data.lastUserCounter || null;
        } else {
            this.countingCurrentNumber = 1;
            this.lastUserCounter = null;
        }
    }

    saveData() {
        const dataToSave = {
            countingCurrentNumber: this.countingCurrentNumber,
            lastUserCounter: this.lastUserCounter,
        };
        const jsonData = JSON.stringify(dataToSave);
        fs.writeFileSync(this.dataFilePath, jsonData, 'utf8');
    }

    handleMessage(message) {
        if (message.author.bot) return;
        const content = message.content.trim();
        const user = message.author;
        if (isNaN(content)) return;

        const number = parseInt(content);
        if (number <= 0 || number !== this.countingCurrentNumber) {
            message.reply(this.countingMessages.wrongCount(this.countingCurrentNumber));
            message.react('<:XMark:1120422570773184685>');
            this.resetCount();
            return;
        }

        if (user.id === this.lastUserCounter?.id) {
            message.reply(this.countingMessages.consecutiveCount(user));
            message.react('<:XMark:1120422570773184685>');
            this.resetCount();
            return;
        }

        if (this.countingGoals.includes(this.countingCurrentNumber)) {
            const goalMessage = this.countingMessages.goalReached(this.countingCurrentNumber, user);
            const reactions = this.getGoalReactions(this.countingCurrentNumber);
            reactions.forEach((reaction) => message.react(reaction));
            message.reply(goalMessage);
        } else {
            message.react('<:OMark:1120422566725701692>');
        }

        this.countingCurrentNumber++;
        this.lastUserCounter = user;
        this.saveData();
    }

    resetCount() {
        this.countingCurrentNumber = 1;
        this.lastUserCounter = null;
        this.saveData();
    }

    getGoalReactions(number) {
        const goalReactions = {
            10: ['🎉'],
            50: ['🎊'],
            100: ['🎈'],
            200: ['🥳'],
            300: ['🌟'],
            400: ['🔥'],
            500: ['🎇'],
            1000: ['🚀'],
        };
        return goalReactions[number] || ['🎉'];
    }
}

module.exports = CountingSystem;