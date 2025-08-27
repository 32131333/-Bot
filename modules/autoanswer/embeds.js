const chance = (int) => (Math.random() *100)+int>100;
const choice = list => list[Number(Math.floor(list.length*Math.random()))];
const randint = (min, max) => min + Math.random() * (max - min);

function искажение (str) {
	if (typeof str=="string") return str.split("").map(s =>choice([s,s,choice([s.toLowerCase(), "**", "||", "```", "`", "*", "_", "~~", "НЫААААААА", "БЛЯТЬ", s, "молыж", s, s, s, s, s, "😱", "🤡", "⚠", "☢", "cho", "0123", 'ыыыы', s, s, '🐖', s, '💩', "ти", "", " ", "😭", s, s, "ЧО", "чо", Math.round(randint(0,9)), "🐓", "ы", "😢", s, s, "чо", "лох", "fuck", "говно", "пораша", " ", s, s, s, s, s, "ХРЮХРЮ", s, s, s, "ХУЙ", "z", s.toUpperCase(), "х", s.toString()])])).join("")
	else return "";
};
function eискажение(data, message, bot) {
    let фразы = [
	    "НЫААААААААААААА",
	    "Хрю-Хрю", "Oink Oink!",
	    'Ти кокажка',
	    "ПЕТУХ", "🥰",
	    "СУКА БЛЯТЬ ПИЗДА",
	    "Ыыахахыхаыхаыхыаххыхыхыхыхыаааыа",
	    "ЫАЫЫАЫАЫЫАЫАЫЫЫАЫЫАЫЫЫЫЫЫ",
	    "Блять", "🐷🐷🐷🐷",
	    "молыжог", "♿",
	    null,
	    "ЕБАТИ", "🥰🥰🥰🥰", "😻",
	    "ДОЛБАЕБ",
	    "Я ПОТЯНУ ТЕБЯ ЗА ПИ.. И ОТОРВУ И ТВОЕМУ БАТЕ Я НРАВЛЮСЬ ПОМОЕМУ"
    ];
    let urls = [
	    'https://i.kym-cdn.com/entries/icons/mobile/000/024/207/brainlettttt.jpg',
	    'https://i.pinimg.com/originals/83/7f/8c/837f8cf1fe7ef5a54a690a1e8c5b797a.png',
	    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0c7ce72e-af95-4d01-8325-c1cbae09b2b8/dcwqvmf-25435143-ad7a-4132-98b2-6c767526da8b.png/v1/fill/w_531,h_350,q_70,strp/drooling_neanderthal_brainlet_by_bubychub_dcwqvmf-350t.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjM2IiwicGF0aCI6IlwvZlwvMGM3Y2U3MmUtYWY5NS00ZDAxLTgzMjUtYzFjYmFlMDliMmI4XC9kY3dxdm1mLTI1NDM1MTQzLWFkN2EtNDEzMi05OGIyLTZjNzY3NTI2ZGE4Yi5wbmciLCJ3aWR0aCI6Ijw9OTY1In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Jcl37EfHm-nl-vwzL6a9-zd2jqY2OgXLRlwPuJGzSo8',
	    'https://cdn.discordapp.com/attachments/871740122440302654/1006915798473920533/e6ebc6b8518fce4d.jpg',
	    'https://tenor.com/view/flipping-off-flip-off-middle-finger-smile-happy-gif-4746862', 'https://tenor.com/view/bike-head-ding-ding-gif-14702293'
    ];
    let avatars = [bot.user.displayAvatarURL(), message.guild.iconURL(), message.author.displayAvatarURL()];//[bot.user.avatar, message.guild.icon, message.author.avatar];
    let randomavatars = bot.users.cache.filter(u => u.bot).map(u=>u.displayAvatarURL());//bot.users.filter(u => u.bot).map(u=>u.avatar);
    let randomu = bot.users.cache.filter(u => u.bot).map(u=>u.tag);



    try { data['title'] = искажение(data['title']).slice(0, 256) } catch { data['title'] = null; if (chance(50)) data['title'] = choice(фразы) };
    try { data['description'] = искажение(data['description']).slice(0, 4096) } catch { data['description'] = null; if (chance(50)) data['description'] = choice(фразы) };
    data['image'] = choice([null, data['image'], data['image']]);
    if (chance(65)) data['image'] = {url: choice([choice(urls), choice(avatars), choice(randomavatars)])};
    data['thumbnail'] = choice([null, data['thumbnail'], data['thumbnail']]);
    if (true) data['thumbnail'] = {url: choice([choice(avatars), choice(randomavatars)])};

    //var timestamp = Date.now();
    //if (true) data['timestamp'] = timestamp
    if (chance(60)) data['author'] = {name: искажение(choice([message.author.tag, message.guild.name, bot.user.tag, choice(randomu)])).slice(0, 256), iconUrl: choice([choice(avatars), choice(randomavatars)])}
    if (chance(50)&&data['author']!=undefined) data['author']['url'] = choice(['https://google.com/', 'https://youtube.com/', 'https://youtube.com'])

    if (chance(50)) data['footer'] = {text: искажение(choice([message.author.tag, message.guild.name, bot.user.tag, choice(randomu)])).slice(0, 2048), iconUrl: choice([choice(avatars), choice(randomavatars)])}

    let fields = data['fields'] ?? [];
    fields = fields.map(f => f={'name': искажение(f['name']).slice(0, 256), 'value': искажение(f['value']).slice(0, 1024), inline: chance(50)});

	function pushInField() {
		fields.push({name: choice(["НЫААААААААААААА", "Хрю-Хрю", "Oink Oink!"]).slice(0, 256), value: choice(["НЫААААААААААААА", "Хрю-Хрю", "Oink Oink!"]).slice(0, 1024), inline: chance(70)});
	};
	
	if (chance(50)) pushInField();if (chance(50)) pushInField();if (chance(50)) pushInField();if (chance(50)) pushInField();if (chance(50)) pushInField();
    data['fields'] = fields;
	
    return data
};

function msgИскажение(msg) {
	const randomContent = [
		"ыыыаыа😭😭хихахахах🤣",
		"ЫЫЫЫЫЫЫкуцшрацшщарГВРЦРГШУРуашгццу",
		искажение(msg.content), "НННЫННАНАНАНАНАН♿♿♿🥰🥴🔥🔥🥳",
		"БЛИЯ", "ВОВОУ", "ЫЫЫЫЭЫЭЭАЭЦУЭЭУЭУАЭЭЫЭЫЭЭУЭАЭУЭЭЫЫЫЫЫЫаыыаы",
		"ЫЫЫЫЫЫЫыЫЫыыыыыыыыыыыАыаыаыаыаЫхыхыхыхаыыыыаыаыаыа",
		"ИДИ НАХУЙ ААААААААААААааааа",
		`ыыыыыыыыыыыыыыыыыыыы${искажение(msg.content)}АХЫХАХЫАххахаахахах😍😍😍`,
		"😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭🤡🤡🤡🤡🤡🤡"
	];
	const emb = msg.embeds.map(e=>eискажение(e.toJSON(), msg, msg.client));
	
	return {content: choice(randomContent), embeds: emb, reference: chance(50)};
};

module.exports = {
	искажение,
	msgИскажение
};