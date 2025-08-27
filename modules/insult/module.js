console.log("insult.js > Генератор оскорбления для СвиньяBot. С любовью от создателя :3");

function choice(target) {
	return target[Number(Math.floor(target.length*Math.random()))];
};






const { приставка, слово, второеСлово1, второеСлово2, род } = require("./slovar.js");


function createInsult() {
	var firstWord = choice(приставка);
	var secondWord = choice(слово.filter(w=>!firstWord.toLowerCase().includes(w.slice(0, w.length-1))));
	
	if (род(firstWord)==2) {
		var Word = choice(второеСлово2);
	} else {
		var Word = choice(второеСлово1);
	};

  if (Math.random()<0.2) {
    Word=choice(приставка.filter(w=>w!=firstWord)).toLowerCase() + Word;
  };

  return {firstWord: firstWord, secondWord: secondWord, word: Word, firstWordConnected: String(firstWord)+String(secondWord), full: `${firstWord}${secondWord} ${Word}`};
};

module.exports.словарь = {приставка: приставка, слово: слово, мужскойрод: второеСлово1, женскийрод: второеСлово2, род: род};
module.exports.оскорбить = createInsult;
module.exports.choice = choice;

/*module.exports.createDiscordMessage = function (l) {
	let i = createInsult();
	let result = i.full;
	if (l) {
		
	} else return {content: l};
};*/