module.exports = async function (client, modules, waitUntil) {
	const { choice, chance } = await waitUntil(()=>modules.autoanswer);
	
	const statuses = () => ([
		{ activities: [{ name: "with discord.js" }], status: "idle" },
		{ activities: [{ type: 4, state: "🌟 @упомяни меня", name: "fox" }], status: "online" },
		{ activities: [{ type: 4, state: "🌟 Я отстойный бот", name: "fox" }], status: "online" },
		{ activities: [{ type: 4, state: "брр брр патабим", name: "fox" }], status: "online" },
		{ activities: [{ type: 4, state: "скибиди", name: "fox" }], status: "dnd" },
		{ activities: [{ type: 4, state: "OPEN THE DOOR", name: "squid" }], status: "online" },
		{ activities: [{ type: 4, state: "Я забыл", name: "fox" }], status: "online" },
		{ activities: [{ type: 4, state: `🌟 ${client.guilds.cache.map(x=>x).length} серверов!`, name: "fox" }], status: "online" },
		{ activities: [{ type: 4, state: "хрю" }], status: "dnd" },
		{ activities: [], status: "offline" }
	]);
	
	const change = ()=>{
		client.user.setPresence(choice(statuses()));
	};
	
	change()
	setInterval(change, 6*1000*60*60);
};
