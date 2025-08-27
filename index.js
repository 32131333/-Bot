const client = require("./bot.js");


let clientsOptions = JSON.parse(process.env.options);
/*

[
	{
		prefix: "!",
		hasTopGG: false,
		discordGuildUrl: "https://discord.gg/...", <-- Необязательно
		runAuditChannelId: "...", <-- Необязательно
		errorAuditChannelId: "...", <-- Необязательно
		chat: {
			API: "...",
			modelName: "...",
			apiKey: "..."
		}, <-- Необязательно. API должен быть схож с completions
		owners: ["893088844763775016"], <-- Необязательно
		token: "Bot ..." <-- "Bot " перед токеном бота обязательно, иначе он опознается, как токен пользователя (а бот как селф-бот не очень то и рассчитан)
	}
]


*/


globalThis.clients = {};

console.log(`Всего клиентов должно быть запущено: ${clientsOptions.length}`);
clientsOptions.forEach(opt=>{
	const bot = client(opt);
	bot.once("clientReady", ()=>{ globalThis.clients[bot.user.id] = bot });

	console.log(`Ранним бота по токену ${opt.token} :3`);
	bot.login(opt.token);
});


if (process.env.PORT) require("./uptimeserver.js")(process.env.PORT);
