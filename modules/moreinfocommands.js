const { 
	SlashCommandStringOption, SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType,
	ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags
} = require("discord.js");

module.exports = async function (client, modules, waitUntil) {
	const func = {};
	
	const commands = await waitUntil(()=>modules.commands);
	const textCommands = await waitUntil(()=>modules.textcommands);
	
	const { embedColor, embedThumb } = await waitUntil(()=>modules.randomutils);
	
	const inviteActionRow = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setLabel("Добавь меня :3")
				.setStyle(ButtonStyle.Link)
				.setURL(`https://discord.com/oauth2/authorize?client_id=${client.application.id}`)
	);
	if (client.configs.hasTopGG) {
		inviteActionRow.addComponents(
			new ButtonBuilder()
				.setLabel("top.gg")
				.setStyle(ButtonStyle.Link)
				.setURL(`https://top.gg/bot/${client.application.id}`)
		);
	};
	if (client.configs.discordGuildUrl) {
		inviteActionRow.addComponents(
			new ButtonBuilder()
				.setLabel("Недосервер бота 🔥")
				.setStyle(ButtonStyle.Link)
				.setURL(client.configs.discordGuildUrl)
		);
	};
	
	func.inviteActionRow = inviteActionRow;


	func.renderError = function (err) {
		return {
			embeds: [
				{
					title: "Бот грохнулся🥴",
					description: "Кароч праизашло чтота, что не должно было праизойти"+"\n"+"```js\n"+String(err.stack)+"\n```",
					fields: [
						{name: "Что вы можете сделать?", value: "- Обратиться к разработчику\n- Ознакомиться с ошибкой, проанализировать повод, и пытаться исправить его\n- Ждать (к примеру если это ошибка с кодом 403), вдруг уйдет само"}
					],
					thumbnail: embedThumb(),
					color: embedColor
				}
			],
			components: [inviteActionRow],
			flags: MessageFlags.Ephemeral
		};
	};
	commands.onError = async (interaction, err)=>{
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(func.renderError(err));
		} else {
			await interaction.reply(func.renderError(err));
		};
		// Заменяем ту функцию на более лучший и инициализованный вариант
	};
	textCommands.onError = async (message, err)=>{
		await message.reply(func.renderError(err));
	};

	func.afterInit = async function () {
		if (client.configs.runAuditChannelId) {
			const runnedAt = Math.round(client.readyTimestamp/1000);
			await client.rest.post(`/channels/${client.configs.runAuditChannelId}/messages`, { body: {
				embeds: [
					{
						title: `${client.user.tag}: Я был запущин :3`,
						description: `Дата включения: <t:${runnedAt}>`,
						color: embedColor,
						thumbnail: embedThumb
					}
				]
			}});
		};
	};
	
	// Предотвращаем любые ошибки, приводящие к закрытии процесса
	process.on("unhandledRejection", async err => {
		if (client.configs.errorAuditChannelId) {
			try { await client.rest.post(`/channels/${client.configs.runAuditChannelId}/messages`, { body: func.renderError(err) }) } catch { console.error(err) };
		} else {
			console.error(err);
		};
	});
	client.on("error", async err => {
		if (client.configs.errorAuditChannelId) {
			try { await client.rest.post(`/channels/${client.configs.runAuditChannelId}/messages`, { body: func.renderError(err) }) } catch { console.error(err) };
		} else {
			console.error(err);
		};
	});


	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("инвайт")
			.setDescription("инвайт на бота")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall),
		async execute(interaction, args) {
			await interaction.reply({embeds: [{
				title: "Инвайт",
				description: "Стоти, ты правдо хочишь меня добаветь?? Супир!! Готов спамить и на твоем сервере!! Смотри по кнопкам ниже",
				color: embedColor,
				thumbnail: embedThumb()
			}], components: [ inviteActionRow ]})
		}
	});
	
	
	func.getInfoBody = () => {
		return {
			embeds: [{
				color: embedColor,
				title: "Преве, ето корочи йа, свенеябот",
				description: "Очень бесполезный бот, как и сам создатель\nЕсли вы не понимаете смысл моего существования, то короче, вы не одни",
				thumbnail: embedThumb(),
				fields: [
					{name: 'О боте', value: `Я бот, написанный на Node.js ${process.version}. Использую библиотеку discord.js. Я был создан <t:${Math.floor(bot.user.createdTimestamp/1000)}:R>`, inline: false},
					{name: 'Моя работа', value: `Моя цель это отвечать короче каму попало, даже ботам. Также есть какие-никакие команды`, inline: false},
					{name: 'Меня можно программно заткнуть', value: `Нет. Не рекомендую давать боту права администратора на нормальном сервере`, inline: false},
					{name: 'Я ИИ?', value: `Ох, нет. Но кстати, есть команда "/chat", но в стабильности не до конца уверен.`, inline: false},
					{name: 'Есть опенсорс', value: `Может быть да, может быть нет. https://github.com/32131333/-Bot`, inline: false}
				]
			}],
			components: [inviteActionRow]
		};
	};
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("инфо")
			.setDescription("...")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall),
		async execute(interaction, args) {
			await interaction.reply(func.getInfoBody());
		}
	});
	
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("stats")
			.setDescription("усторевшоя командо")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall),
		async execute(interaction, args) {
			const runnedAt = Math.round(client.readyTimestamp/1000);
			await interaction.reply({
				embeds: [
					{
						title: `Статистика ${bot.user.tag}`,
						description: `<:nodejs:924554212891824159> Node.js ${process.version}\nМой пинг: ${client.ws.ping}ms\nЗапущен <t:${runnedAt}> (<t:${runnedAt}:R>)\n\nБольше никакой информации неиту :<`,
						thumbnail: embedThumb(),
						color: embedColor
					}
				],
				components: [inviteActionRow]
			})
		}
	});


	return func;
};