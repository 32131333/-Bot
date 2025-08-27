const insult = require("./module.js"); // <-- Ядро всей функциональности. index.js отвечает уже за функицональность бота

const { 
	SlashCommandStringOption, SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType,
	ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags
} = require("discord.js");

module.exports = async function (client, modules, waitUntil) {
	const func = {};
	func.module = insult;
	
	const commands = await waitUntil(()=>modules.commands);
	const { embedColor, embedThumb } = await waitUntil(()=>modules.randomutils);
	
	
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("аскарбить")
			.setDescription("гиниратар аскарбленее")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall),
		async execute(interaction, args) {
			function createAnswer() {
				return {
					embeds: [
						{
							title: func.module.оскорбить().full,
							color: embedColor
						}
					]
				}
			};

			const retryButton = new ButtonBuilder()
				.setCustomId("_insult_retry")
				.setLabel("Папробовать снова!!")
				.setStyle(ButtonStyle.Primary);
			const row = new ActionRowBuilder()
				.addComponents(retryButton);		

			const response = await interaction.reply({...createAnswer(), components: [row]});
			while (true) {
				// Так как всеравно этот компонент временный, я просто помещу в цикл
				try {
					//const newinteraction = await response.resource.message.awaitMessageComponent({ filter: ()=>true, time: 30000 }); // По какой-то причине в документации указан старый способ, который не рабочий
					const newinteraction = await response.awaitMessageComponent({ time: 30000 });
					await newinteraction.update(createAnswer());
				} catch {
					await interaction.editReply({components: []});
					break;
				};
			};
		}	
	});

	
	return func;
};
