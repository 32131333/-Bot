const { Collection, MessageFlags, Events, REST, Routes } = require('discord.js');

module.exports = async function (client) {
	const func = {};	
	func.onError = async (message, err)=>{
		// Стандартный onError калбэк. Другие модули могут его заменить
		await message.reply({ content: "Ошибка при выполнении команды :<" });
	};
	
	func.prefixes = [];
	if (client.configs && client.configs.prefix) {
		if (typeof client.configs.prefix == "object") func.prefixes.splice(0, 0, ...client.configs.prefix)
		else func.prefixes.push(client.configs.prefix);
	} else {
		func.prefixes.push("!");
	};
	
	client.textCommands = new Collection();
	
	client.registerTextCommand = (data = {name, execute}) => {
		client.textCommands.set(data.name, data.execute);
	};
	
	client.on(Events.MessageCreate, async message => {
		if (!message.content || message.author.bot) return;
		
		for (const prefix of func.prefixes) {
			if (message.content.startsWith(prefix)) {
				console.log("Найден префикс!!", prefix);
				for (const name of client.textCommands.map((v,k)=>k)) {
					console.log(name);
					if (message.content.toLowerCase().startsWith((prefix+name).toLowerCase())) {
						console.log("Обнаружин ", (prefix+name).toLowerCase(), "!!");
						const execute = client.textCommands.get(name);
						try {
							let arg = message.content.slice((prefix+name).length);
							if (arg.startsWith(" ")) arg = arg.slice(1);
							
							console.log("Вызываем");
							await execute(message, arg);
						} catch {
							await func.onError(message, error);
						} finally {
							return;
						};
					};
				};
			};
		};
	});
	
	return func;
};