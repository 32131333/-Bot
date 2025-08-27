const { Collection, MessageFlags, Events, REST, Routes } = require('discord.js');

module.exports = async function (client) {
	const func = {};	
	func.onError = async (interaction, err)=>{
		// Стандартный onError калбэк. Другие модули могут его заменить
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: "Ошибка при выполнении команды :<", flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: "Ошибка :<", flags: MessageFlags.Ephemeral });
		};
	};
	
	client.commands = new Collection();
	
	client.refreshCommands = async function () {
		const body = client.commands.map(x=>x.command.toJSON());
		await client.rest.put(Routes.applicationCommands(client.application.id), { body });
	};
	
	client.registerNewCommand = async function (data={command, execute}) {
		client.commands.set(data.command.name, data);
	};
	
	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) return;
		
		const command = client.commands.get(interaction.commandName);
		
		let options = {};
		interaction.options.data.forEach(x=>{
			options[x.name] = x.value;
		});
		
		if (!command) {
			await interaction.reply({ content: "Неизвестная команда :<", flags: MessageFlags.Ephemeral });
		} else {
			try {
				await command.execute(interaction, options);
			} catch(e) {
				return await func.onError(interaction, e);
			};
		};
	});
	
	
	func.afterInit = async function () {
		if (client.configs.syncCommands === false) {
			console.log("Синхронизация команды отключина!!");
			return;
		};
		await new Promise(r=>setTimeout(r, 5000));
		client.refreshCommands();
		console.log("Обновляем список команд!!");
	};
	Object.assign(func, {
		commands: client.commands,
		refreshCommands: client.refreshCommands,
		registerNewCommand: client.registerNewCommand
	});
	return func;
};