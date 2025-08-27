const { Events, PermissionsBitField } = require('discord.js');

module.exports = async function (client, modules, waitUntil) {
	const func = {};
	func.phrases = require("./phrases.json")
	func.искажение = require("./embeds.js");
	func.badword = require("./badwordRegEx.js");
	
	func.chance = (int) => (Math.random() *100)+int>100;
	func.choice = list => list[Number(Math.floor(list.length*Math.random()))];
	
	func.isIHaveTheseBaseChannelPermissions = function (channel, ...perms) {
		if (!channel.guild) return true; // Вероятно, мы в ЛС канале
		if (channel.guild && channel.guild.members.me && channel.guild.members.me.isCommunicationDisabled()) return false; // Бот не должен реагировать в режиме тайм-аута
		
		const permsForMe = channel.permissionsFor(client.user);
		
		const result = perms.map(x=>permsForMe.has(x));
		
		const iHaveAll = (result.filter(x=>!x)).length === 0;
		return iHaveAll
	};
	
	func.transformBody = function (body, args) {
		if (typeof body == "string") {
			body = {content: body};
		} else {
			body = JSON.parse(JSON.stringify(body)); // Клонируем этот объект на случай всего
		};
		const changeValues = s=>s.replace(/\$\{[a-zA-Z]*\}/g, match=>(args && args[match.slice(2, -1)]) ?? match.slice(2, -1))
		const parse = d=>{
			for (const a in d) {
				if (typeof d[a] == "string") {
					d[a] = changeValues(d[a]);
				} else if (typeof d[a] == "object") {
					parse(d[a]);
				};
			};
		};
		parse(body);
		return body;
	};
	
	func.tryToReplyOrPost = function (message, messageBody) {
		return func.chance(50) ? func.tryToReply(message, messageBody) : func.tryToPost(message, messageBody);
	};
	func.tryToReply = async function (message, messageBody) {
		try {
			await message.channel.sendTyping();		
			// Случайное ожидание
			await new Promise(r=>setTimeout(r, Math.floor(Math.random()*100)));
			return await message.reply(
				func.transformBody(
					messageBody,
					{authorMention: `<@!${message.author.id}>`, authorName: message.author.tag}
				)
			);
		} catch(e) { console.error(e) };
	};
	func.tryToPost = async function (message, messageBody) {
		try {
			await message.channel.sendTyping();		
			// Случайное ожидание
			await new Promise(r=>setTimeout(r, Math.floor(Math.random()*100)));
			return await message.channel.send(
				func.transformBody(
					messageBody,
					{authorMention: `<@!${message.author.id}>`, authorName: message.author.tag}
				)
			);
		} catch(e) { console.error(e) };
	};
	
	client.on(Events.MessageCreate, async message => {
		if (message.author.id == client.user.id) return;
		// Игнорирует свои же сообщения
		
		if (!func.isIHaveTheseBaseChannelPermissions(message.channel, PermissionsBitField.Flags.SendMessages)) return; 
		
		let iAmMentioned = message.mentions.has(client.user); // О, а у Discord.JS хорошо определяется упомянутое
		
		
		if (iAmMentioned) {
			const isQuestion = typeof message == "string" && message.includes("?");
			func.tryToReplyOrPost(message, func.choice(!isQuestion ? func.phrases.isMentioned : func.phrases.isMentionedQuestion));
			return;
		};
		
		if (typeof message.content == "string") {
			const content = message.content.toLowerCase();
			const insulted = func.badword.baad(content) || func.badword.baad1(content) || func.badword.tiBaad(content);
			if (insulted) return func.tryToReplyOrPost(message, func.choice(insulted));
			
			if (content.includes("да")) return func.tryToReplyOrPost(message, func.choice(func.phrases.yes));
			if (content.includes("не")) return func.tryToReplyOrPost(message, func.choice(func.phrases.no));
			
			if (content.includes("ку")) return func.tryToReplyOrPost(message, func.choice(func.phrases.qq));
			if (content.includes("re")) return func.tryToReplyOrPost(message, func.choice(func.phrases.qqweird));
			
			if (content.includes("привет")) return func.tryToReplyOrPost(message, func.choice(func.phrases.hello));
			if (content.includes("пока")) return func.tryToReplyOrPost(message, func.choice(func.phrases.byebye));
			
			if (content.includes("пруф")) return func.tryToReplyOrPost(message, func.choice(func.phrases.proof)); // Раньше бот кидал картинки, как файл, но понял, что это пустая трата траффика
			if (content.includes("росси")||content.includes("русск")) return func.tryToReplyOrPost(message, func.choice(func.phrases.z));
			if (content.includes("манга")||content.includes("аниме")) return func.tryToReplyOrPost(message, func.choice(func.phrases.idkhownamethiscategory));
			if ((content.includes("owo")||content.includes("uwu")) || ((content.includes("(")&&!content.includes(")"))||(!content.includes("(")&&content.includes(")")))) return func.tryToReplyOrPost(message, func.choice(func.phrases.idkhownamethiscategory1));
			
			if (content.includes("кринж")) return func.tryToReplyOrPost(message, func.choice(func.phrases.кренж));
			if (content.includes("чо")) return func.tryToReplyOrPost(message, func.choice(func.phrases.чо));
			
			if (content.includes("https://") || content.includes("http://")) return func.tryToReplyOrPost(message, func.choice(func.phrases.links));
		};
		
		if (func.chance(50)) {
			func.tryToReplyOrPost(message, func.choice(func.phrases.random));
		};
		if (func.chance(40)) {
			if (message.embeds.length > 0) {
				func.tryToReply(message, func.искажение.msgИскажение(message));
			};
		};
	});
	
	client.on(Events.MessageCreate, async message => {
		if (message.author.id == client.user.id) return;
		if (!func.isIHaveTheseBaseChannelPermissions(
			message.channel,
			PermissionsBitField.Flags.ReadMessageHistory,
			PermissionsBitField.Flags.AddReactions,
			PermissionsBitField.Flags.UseExternalEmojis
		)) return; 
		
		try {
			if (func.chance(20)) return await message.react(
				func.choice([
					"😡", "🐷", "🐽", "😹", "😼", "🙀", "🐖", "🐔",
					"🤡", "🥰", "🤩", "😎", "🙄", "😴", "🤬", "👺",
					"💀", "🥴", "😳", "🤔", "💩", "🤬", "🖕",
					":pig:879308098572005406", ":empty:1219703775225315348",
					":emojimix_18:1169353708686020648", ":emoji_50:1217198120363098213"
				])
			);
		} catch {};
	});
	
	client.on(Events.MessageUpdate, async message => {
		if (!message || message.author.id == client.user.id) return;
		if (!func.isIHaveTheseBaseChannelPermissions(
			message.channel,
			PermissionsBitField.Flags.SendMessages,
			PermissionsBitField.Flags.ReadMessageHistory
		)) return; 

		
		if (func.chance(20)) return await func.tryToReply(message, func.choice(func.phrases.edited));
		if (func.chance(20)) func.tryToReply(message, func.искажение.msgИскажение(message));
	});
	client.on(Events.MessageDelete, async message => {
		if (!message) return;
		if (!func.isIHaveTheseBaseChannelPermissions(
			message.channel,
			PermissionsBitField.Flags.ReadMessageHistory,
		)) return; 

		if (func.chance(40)) return await func.tryToPost(message, func.choice(func.phrases.deleted));
	});
	
	client.on(Events.MessageReactionAdd, async reaction => {
		if (!func.isIHaveTheseBaseChannelPermissions(
			reaction.message.channel,
			PermissionsBitField.Flags.ReadMessageHistory,
		)) return; 

		try {
			if (reaction.me===false && func.chance(10)) return await reaction.react();
		} catch {};
	});
	/*client.on(Events.MessageReactionRemove, async reaction => {
		try {
			if (reaction.me) return await reaction.react();
		} catch {};
	}); крч я не понял как удалять реакцию бота. функция удалении почему-то приводит к попытке бота очистить все реакции */
	
	return func;
};