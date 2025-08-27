const { 
	SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType,
	ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags
} = require('discord.js');

module.exports = async function (client, modules, waitUntil) {
	const func = {};
	const choice = list => list[Number(Math.floor(list.length*Math.random()))];
	
	const commands = await waitUntil(()=>modules.commands);
	
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("ping")
			.setDescription("Пингпнг")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall),
		async execute(interaction) {
			await interaction.reply("# ПОНГ !!!");
		}
	});
	
	
	// В целом, команда `/test` забавная, поээтому я воссоздам его
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("test")
			.setDescription("Просто проверить, что бот жив")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall),
		async execute(interaction) {
			const btn1 = new ButtonBuilder()
				.setCustomId("_rnduser_retry")
				.setLabel("чо")
				.setStyle(ButtonStyle.Primary);
			const btn2 = new ButtonBuilder()
				.setCustomId("_rnduser_retry1")
				.setLabel("Повезёт?")
				.setStyle(ButtonStyle.Primary);
				
			const row = new ActionRowBuilder()
				.addComponents(btn1, btn2);		

			
			const response = await interaction.reply({content: "Понг хотя это не понг но ладно", components: [row]});
			
			function rndUserMessageBody(i) {
				let users = client.users.cache.filter(x=>x.bot).map(x=>x); // Фильтруем, и обращаем через map, который возвращает массив
				let user = choice(users);
				return {
					content: `Интеракцию выполнил <@!${i.user.id}>`,
					embeds: [
						{
							title: user.tag,
							description: user.id,
							thumbnail: {url: user.displayAvatarURL()}
						}
					]
				};
			};
			while (true) {
				try {
					const newinteraction = await response.awaitMessageComponent({ time: 30000 });
					let body = rndUserMessageBody(newinteraction);
					if (newinteraction.customId == "_rnduser_retry1") {
						Object.assign(body, { components: [] });
					};
					
					await newinteraction.update(body);
					
					if (newinteraction.customId == "_rnduser_retry1") {
						break;
					};
				} catch(e) {
					console.log(e);
					await interaction.editReply({components: []});
					break;
				};
			};
		}
	});
	
	
	
	return func;
};