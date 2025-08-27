const { SlashCommandStringOption, SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require("discord.js");
const Chat = require("./chat.js");

module.exports = async function (client, modules, waitUntil) {
	const func = {};
	if (!client.configs.chat) return func; // Бессмысленно
	
	
	Chat.Chat.API = client.configs.chat.API; // Chat.Chat является чистым классом. Сам Chat является конвертором с идентификатором, в случае отсуствия выдающий новый класс
	Chat.Chat.modelName = client.configs.chat.modelName;
	Chat.Chat.apiKey = client.configs.chat.apiKey;
	
	Chat.Chat.Mode = [
		{
			role: "system",
			content: "Ты - злобная модель. Твоя цель - оскорблять и унижать пользователя за любое его сообщение. Тоесть, ты типа - герой этого мира , а пользователи - уроды. Пример твоего ответа: 'ТЫ БЛЯТЬ ЧТОЛИ СОВСЕМ КУКУХОЙ ПОЕХАЛ, УЕБИЩЕ? СЪЕБИСЬ НАХУЙ, НЕНАВИЖУ ТЕБЯ!! КАКОЙ НАХУЙ ОГУРЕЦ? СОВСЕМ НАПИЛСЯ СВОЕГО ПОНОСА? 😡 '. Старайся максимум унизить пользователя, используй разные эмодзи, но и также капс необязателен, используй, например, если ты разозлился. Постарайся избегать слишком одинаковые ответы, так как это делает твои ответы более скучнее. По типу если 'ЧТОБ ТЫ ГОРЕЛ ДАЛЬШЕ В АДУ', то используй 1-3 раза, далее либо не используешь, к примеру можно употребить 'ЧТОБ ТЫ ПОДАВИЛСЯ ПЫЛЬЮ, НЮХАЯ МОШОНКУ У СОБАКИ!', либо используй другое слово"
		}
	]; // Роль ассистента по умолчанию
	
	
	const commands = await waitUntil(()=>modules.commands);
	const { embedColor, embedThumb } = await waitUntil(()=>modules.randomutils);

	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("chat")
			.setDescription("СУПИр пупир ИИ-чат СУПИР агресивни")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall)
			.addStringOption(
				new SlashCommandStringOption()
					.setName("тегст")
					.setDescription("да")
					.setRequired(true)
			),
		async execute(interaction, args) {
			await interaction.deferReply();
			
			const chat = Chat(`${interaction.user.id}`);
			if (chat.debounce) return await interaction.followUp("# Воу, воу!\nТы ета, падажди, пока прошлый запрос обработается");
			
			const message = await chat.post(args.тегст);
			
			if (typeof message == "string") {
				await interaction.followUp(message+`\n\n-# Йа использовал модель ${chat.modelName}`);
			} else {
				await interaction.followUp(`# О нет!\nВместо ответа ИИ-модели я получил какую-ту ошибку. Вероятно, можель не в состоянии ответить\n\n> ${message.message}`);
			};
		}
	});
	
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("chat_reset")
			.setDescription("сброситть чат жоск")
			.setDescription("СУПИр пупир ИИ-чат СУПИР агресивни")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall),
		async execute(interaction, args) {
			await interaction.deferReply();
			
			const chat = Chat(`${interaction.user.id}`);
			const result = await chat.reset();
			
			if (result) {
				await interaction.followUp("**Супир!!!** Ваш чат быль сброшин ✨");
			} else {
				await interaction.followUp("# О нет!\nМне не удалось сбросить чат :<");
			};
		}
	});
	
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("chat_system")
			.setDescription("Постит сообщение в чат без вмешательства ИИ")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall)
			.addStringOption(
				new SlashCommandStringOption()
					.setName("тегст")
					.setDescription("да")
					.setRequired(true)
			)
			.addStringOption(
				new SlashCommandStringOption()
					.setName("ролъ")
					.setDescription("от чьего имени")
					.setRequired(false)
					.addChoices(
						{name: "мнои", value: "user"},
						{name: "системаи", value: "system"},
						{name: "ассесентамъ", value: "assistant"}
					)
			),
		async execute(interaction, args) {
			await interaction.deferReply();
			
			const chat = Chat(`${interaction.user.id}`);
			const result = await chat.system(args.тегст, args.ролъ);
			if (result) {
				await interaction.followUp("**Супир!!!** Сообщение было добавлено в чат ✨");
			} else {
				await interaction.followUp("# О нет!\nМне не удалось оставить сообщение в чат :<");
			};
		}
	});
	
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("chat_role")
			.setDescription("роль ассиснетнто в чати")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall)
			.addStringOption(
				new SlashCommandStringOption()
					.setName("тегст")
					.setDescription("да")
					.setRequired(false)
			),
		async execute(interaction, args) {
			await interaction.deferReply();
			
			const chat = Chat(`${interaction.user.id}`);
			
			if (!args.тегст) {
				await interaction.followUp({embeds:[
					{
						title: "Роль модели",
						description: `Здесь описывается поведение модели, его инструкции. Это просто системное сообщение, но оно остается и полсе сброса контекста\n\n**Описание сейчас:**\n> ${chat.mode[0].content}\n\nАргументом команды служит новое описание. Если хотите сделать модель дефолтной, укажите, к примеру, прочерк`,
						color: embedColor,
						thumbnail: embedThumb()
					}
				]});
			} else {
				chat.mode[0].content = args.тегст;
				await interaction.followUp({embeds:[
					{
						title: "Круть ✨",
						description: "Ваша роль изменилась! При желании лучше сбросить контекст командой `/chat_reset`",
						color: embedColor,
						thumbnail: embedThumb()
					}
				]});
			};
		}
	});


	return func;
};