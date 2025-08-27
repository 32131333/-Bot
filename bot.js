const { Client, GatewayIntentBits } = require("discord.js");

module.exports = function (config) {
	const fs = require("fs");

	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.DirectMessageReactions,
			GatewayIntentBits.GuildMessageReactions
		]
	});;
	client.configs = {...config, modules: {}};

	async function waitUntil(check) {
		while (!check()) { await new Promise(r=>setTimeout(()=>r(), 100)) };
		return check();
	};

	client.once("clientReady", async () => {
		console.log(`hellOwOrld!! Йа, если что, ${client.user.tag}!`);
		
		const modules = fs.readdirSync("./modules");
		let waiting = []; // {moduleName, callback}
		const waitUntilModule = (moduleName) => {
			if (client.configs.modules[moduleName]) return client.configs.modules[moduleName];
			
			return new Promise(r=>{
				waiting.push({moduleName, r});
			});
		};
		
		const initModules = () => {
			return new Promise(r=>{
				let count = 0;
				let length = modules.length;
				
				modules.forEach(async (a)=>{
					let moduleName = a;
					if (a.endsWith(".js")) moduleName = a.split(".").slice(0, -1).join("");
					
					require(`./modules/${a}`)(client, client.configs.modules, waitUntil)
						.then((x) => {
							client.configs.modules[moduleName] = x;
						})
						.catch((err) => {
							console.error(`${a} не был инициализован, т.к. выдал ошибку`,"\n", err);
							client.configs.modules[moduleName] = {};
						})
						.finally(()=>{
							count++;
							if (count==length) r();
						})
				});
			});
		};
		initModules().finally(() => {
			console.log("Все модули были инициализированы ✨");
			for (const a in client.configs.modules) {
				if (client.configs.modules[a]!=null) {
					if (client.configs.modules[a].afterInit) client.configs.modules[a].afterInit();
				};
			};
		});
	});
	
	client.isOwner = userId => {
		let applicationOwner = client.application && client.application.owner;
		if (applicationOwner && applicationOwner.members) {
			applicationOwner = applicationOwner.members.map((x,k)=>k);
		} else if (applicationOwner) {
			applicationOwner = [applicationOwner]; // Владельцем является один пользователь, но его переменная будет использоваться как массив
		} else {
			applicationOwner = []; // Скорее, бот еще не запущен
		};
		
		if (client.configs.owners) applicationOwner.splice(0, 0, ...client.configs.owners);
		
		return applicationOwner.includes(userId);
	};
	
	return client;
};