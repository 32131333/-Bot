module.exports = async function (client) {
	const func = {};
	func.choice = list => list[Number(Math.floor(list.length*Math.random()))];
	
	func.embedColor = 0xe4c11c;
	func.embedThumb = function () {
		return {
			url: func.choice([
				client.user.displayAvatarURL(),
				"https://cdn.discordapp.com/attachments/1159858598260772935/1201073949367349278/emoji.png",
				client.user.displayAvatarURL(),
				"https://cdn.discordapp.com/attachments/1159858598260772935/1201073949367349278/emoji.png",
				client.user.displayAvatarURL(),
				"https://cdn.discordapp.com/attachments/1159858598260772935/1201073949367349278/emoji.png",
				client.user.displayAvatarURL(),
				"https://cdn.discordapp.com/attachments/1159858598260772935/1201073949367349278/emoji.png",
				client.user.displayAvatarURL(),
				"https://cdn.discordapp.com/attachments/1159858598260772935/1201073949367349278/emoji.png",
				client.user.displayAvatarURL(),
				"https://cdn.discordapp.com/attachments/1159858598260772935/1201073949367349278/emoji.png",
				"https://cdn.discordapp.com/emojis/1167834864188412004.gif"
			])
		};
	};
	
	return func;
};