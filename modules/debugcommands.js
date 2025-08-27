// Отладочные команды. Исключительно текстовые

module.exports = async function (client, modules, waitUntil) {
	const func = {};
	
	const textCommands = await waitUntil(()=>modules.textcommands);
	
	client.registerTextCommand({
		name: "test",
		async execute(message, arg) {
			let finalText = "Вау! Команда работает то 🙀🙀🙀";
			if (arg) finalText += "\n\nАргумент: `"+arg+"`";
			
			await message.reply(finalText);
		} 
	});
	
	client.registerTextCommand({
		name: "return",
		async execute(message, arg) {
			if (client.isOwner(message.author.id)) {
				//const response = await message.reply("Выпалняу...");
				
				let command;

				// Определение лямбда-фукнции или обычной(под видом лямбды-функции)
				if (arg.split("\n").length<2 && arg.includes(";") == false) command = "(async () => " + arg + ")"
				else command = "(async () => {\n " + arg + "\n})";
				
				try {
					var result = await eval(command)();

					let returnTheResult;
					if (typeof result == "object") returnTheResult = JSON.stringify(result)
					else returnTheResult = String(result);
				
					if (result!==undefined) await message.reply({embeds: [{description: "```js\n"+returnTheResult+"\n```"}]})
					else await await message.reply({embeds: [{description: "Карочи, каманда не вернула значение"}]});
				} catch(e) {
					return await textCommands.onError(message, e);
				};
			} else {
				await message.reply("ПАШОЛЬ пашоль пашоль 👿");
			};
		}
	});
	
	return func;
};