const { 
	SlashCommandStringOption, SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType,
	ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags
} = require("discord.js");

module.exports = async function (client, modules, waitUntil) {
	const func = {};
	
	const commands = await waitUntil(()=>modules.commands);
	const { искажение, chance, choice, badword } = await waitUntil(()=>modules.autoanswer);
	const { embedColor, embedThumb } = await waitUntil(()=>modules.randomutils);

	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("calc")
			.setDescription("суперпуперкакулятор турба про")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall)
			.addStringOption(
				new SlashCommandStringOption()
					.setName("выраженее")
					.setDescription("брр брр патабим")
					.setRequired(true)
			),
		async execute(interaction, args) {
			function решить(arg) {
				if (chance(5)) return "ИДИ НАХУЙ Я НЕ БУДУ ВЫЧИСЛЯТЬ ТВОЙ ВЫСЕР"
				else if (chance(5)) return "Ошибка вычисления"
				else if (chance(5)) return "ТВОЯ ПАПАША ГНИДА СЛУЖИЛ ВО ВЬЕТНАМЕ?? СЕР ДА СЕР"
				else if (chance(5)) return "Я ТВОЮ МАМАШУ НА ПОВОЗКЕ Катал"
				else if (chance(5)) return "Я чмо"
				else if (chance(5)) return "Лох"
				else if (chance(5)) return "Infinity"
				else if (chance(5)) return "NaN"
				else if (chance(1)) return "ЛИНГАНГУЛИГУЛИГУЛИВАЦАЛИНГАНУГАГИЛИЩШИАЩУЦО"
				else if (chance(1)) return "скибиди туалет"
				else if (chance(5)) return "UwU"
				else if (chance(1)) "ИДИ НАХУЙ ДОЛБАЕБ"
				else if (chance(1)) return искажение.искажение(arg)
				else if (chance(20)) "уащцуарцуаршпу4893а89ай3р9уйгшйрАгшп*ввпцгвцШРввоф "
				else if (chance(5)) return "Булочка с сосискою, чай с бутербродом, и... плюшки, к чаю. И все..."
				else return arg.replaceAll(/[\D]/g, "");
			};
	        function cho(authorr, пример) { 
				let ответ = String(решить(пример));
				if (ответ==="") ответ = "ТВОЙ ВЫСЕР НИЧЕГО НЕ ВЫДАЛ ДОЛБАЕБ!!";
				return {title: пример, description: ответ, color: embedColor, author: {iconUrl: authorr.displayAvatarURL(), name: authorr.tag}};
			};
			
			const retryButton = new ButtonBuilder()
				.setCustomId("_calc_retry")
				.setLabel("Папробовать снова!!")
				.setStyle(ButtonStyle.Primary);
			const row = new ActionRowBuilder()
				.addComponents(retryButton);		
			
			const response = await interaction.reply({embeds: [ cho(interaction.user, args.выраженее) ], components: [row]});
			while (true) {
				// Так как всеравно этот компонент временный, я просто помещу в цикл
				try {
					//const newinteraction = await response.resource.message.awaitMessageComponent({ filter: ()=>true, time: 30000 }); // По какой-то причине в документации указан старый способ, который не рабочий
					const newinteraction = await response.awaitMessageComponent({ time: 30000 });
					await newinteraction.update({ embeds: [ cho(newinteraction.user, args.выраженее) ] });
				} catch {
					await interaction.editReply({components: []});
					break;
				};
			};
		}	
	});
	
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("искажение")
			.setDescription("брр брр искажить текст")
			.setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
			.setIntegrationTypes(ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall)
			.addStringOption(
				new SlashCommandStringOption()
					.setName("выраженее")
					.setDescription("брр брр патабим")
					.setRequired(true)
			),
		async execute(interaction, args) {
			await interaction.reply({content: искажение.искажение(args.выраженее) ?? "Пустое сообщение :<"})
		}
	})
	
	function the8Ball(x) {
		if (x=="" || x==null) x = `8 шар 🚽`;
		const ext = {
			embeds: [{
				color: embedColor,
				title: x,
				description: choice([
					"Обязательно", "Нет", "Да", "Ну и отстой", "Канечна", "ненененеенен",
					"Наверное да", "Наверное не", "Обязательно не", "Не снаю", "Неи",
					"<:piggybruh:882585831875936267>", "КАНЕЧНА!!! <a:hophop:816584547072213012>",
					"Нет 🐷🐷🐷🐷", "Нет 🥴", "Да 🐷🐷🐷🐷", "Да 🥴", "Нет, лузер"
				])
			}]
		};
	
		if (badword.tiBadwordRegExp.test(x)) ext.embeds[0].description = `Сам ты ${x.toLowerCase().match(tiBadwordRegExp)[0].split(" ")[1]}!!!!!!!!`
		else if (chance(5)) ext.embeds[0].description = `🐷 Так точна <:emoji_3:1167835110746362048>`;
		return ext;
	};
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("8шаров")
			.setDescription("рандомни атвет")
			.addStringOption(
				new SlashCommandStringOption()
					.setName("вапросъ")
					.setDescription("ПРАСТОИ ВАПРОС!!")
					.setRequired(false)
			),
		async execute(interaction, args) {
			await interaction.reply(the8Ball(args.вапросъ));
		}
	});
	
	
	
	
	
	
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("echo")
			.setDescription("аставить саабщение ат имене бата АДМНИНИСТАРАТР ОНЛИ")
			.addStringOption(
				new SlashCommandStringOption()
					.setName("кантент")
					.setDescription("атветка типа. кстатеи")
					.setRequired(true)
			)
			.addStringOption(
				new SlashCommandStringOption()
					.setName("референс")
					.setDescription("оставьте айди саабщения, типа если чтобы бот атветил")
					.setRequired(false)
			)
			.setDefaultMemberPermissions(8), // 8 означает администратор, наверное
		async execute(interaction, args) {
			await interaction.deferReply({ flags: MessageFlags.Ephemeral });
			try {
				const channel = interaction.channel;
				
				let body;
				try {
					if (!args.кантент.startsWith("{") || !args.кантент.endsWith("}")) throw false;
					body = { ...JSON.parse(args.кантент), components: [] };
				} catch {
					body = { content: args.кантент };
				};
				if (args.референс) {
					Object.assign(body, {
						reply: {
							failIfNotExists: false,
							messageReference: args.референс
						}
					});
				};
				
				await channel.send(body);
				await interaction.followUp(`КРУтъ!! Вашеи саабщенее атправелос!!! ${choice(["✨", "🥳", "🐷", "🦊", "<a:emoji_3728:1167834864188412004>", "🔥"])}`);
			} catch(e) {
				console.error(e);
				await interaction.followUp("Ох, нет! Не удалосъ атправить саабщенее :<");
			};
		}
	});
	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("edit_my_own_message")
			.setDescription("ридактирует саабщенее аставленнае батом")
			.addStringOption(
				new SlashCommandStringOption()
					.setName("кантент")
					.setDescription("нови кантент")
					.setRequired(true)
			)
			.addStringOption(
				new SlashCommandStringOption()
					.setName("айди")
					.setDescription("ОБЯЗАТИЛЬНОЕ. Вы далжны быть на канале, где оставлено сообщение")
					.setRequired(true)
			)
			.setDefaultMemberPermissions(8), // 8 означает администратор, наверное
		async execute(interaction, args) {
			await interaction.deferReply({ flags: MessageFlags.Ephemeral });
			try {
				const channel = interaction.channel;
				
				let body;
				try {
					if (!args.кантент.startsWith("{") || !args.кантент.endsWith("}")) throw false;
					body = { ...JSON.parse(args.кантент), components: [] };
				} catch {
					body = { content: args.кантент };
				};
				
				//Способа изменить сообщение в классе channel нету, поэтому я делую прямой запрос к API
				await client.rest.patch(`/channels/${channel.id}/messages/${args.айди}`, { body });
				await interaction.followUp("КРУтъ!! Вашеи саабщенее абнавелос!!! ✨");
			} catch(e) {
				console.error(e);
				await interaction.followUp("Ох, нет! Не удалосъ абнавить :<");
			};
		}
	});

	commands.registerNewCommand({
		command: new SlashCommandBuilder()
			.setName("say")
			.setDescription("Повторяит сказанное. Неинтересноя командо")
			.addStringOption(
				new SlashCommandStringOption()
					.setName("кантент")
					.setDescription("атветка типа. кстатеи")
					.setRequired(true)
			),
		async execute(interaction, args) {
			let body;
			try {
				if (!args.кантент.startsWith("{") || !args.кантент.endsWith("}")) throw false;
				body = { ...JSON.parse(args.кантент), components: [] };
			} catch {
				body = { content: args.кантент };
			};
			await interaction.reply(body);
		}
	});


	return func;
};