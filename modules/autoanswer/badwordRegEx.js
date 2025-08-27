const fs = require("fs");
const path = require("path");

const badwords = fs.readFileSync(path.resolve(__dirname, "./badwords.txt")).toString().replaceAll("\r", "").split("\n").filter(s=>typeof s=="string"&&s.length>0);
const badwordRegExp = new RegExp("(я).("+badwords.join("|")+")", "g");
const badwordRegExp1 = new RegExp("(я не).("+badwords.join("|")+")", "g");

const tiBadwordRegExp = new RegExp("(ты|сам).("+badwords.join("|")+")", "g");

function baad(content) {
	const match = content.toLowerCase().match(badwordRegExp);
	var secondWord = match && match[0].split(" ")[1];
	if (secondWord) return ["Ты и вправду "+secondWord, "Согласен! Ты и есть "+secondWord+" по жизни",
		"БОЖ ТИ ПРИЗНАЛЬСЯ!!!", "Ахахахахахахахахаха, "+secondWord, "Да не, я не считаю тебя как "+secondWord,
		"Ех, самозванец, я тебя ни признаю как "+secondWord, "Какой же ты никчемный!! Ты круче всех",
		"Ебать ты "+secondWord, "Серьезно, ты "+secondWord+"?? Жаль, что такое же ничтожество, как и я, чувствует непревзойденность над другими",
		"Приятно чувствовать себя никчемным уродом?", `Помни свое место, ${secondWord} - твое второе имя`];
};
function baad1(content) {
	const match = content.toLowerCase().match(badwordRegExp1);
	var secondWord = match && match[0].split(" ")[2];
	if (secondWord) return ["Хули ты бредишь? Ты и вреале "+secondWord, "Ну до, ты не "+secondWord, "Слушай, может, эгоистом тоже быть плохо"];
};

function tiBaad(content) {
	const match = content.toLowerCase().match(tiBadwordRegExp);
	var secondWord = match && match[0].split(" ")[1];
	if (secondWord) return ["Кому ты там метаешь?", "Ивправду он "+secondWord, "Может это ты "+secondWord+"?", "Неее, он не "+secondWord,
		"Слыш ты эгоист херов, ты сам "+secondWord, "Какой ты никчемный петух", "Слышты амёба паукообразное, ты сам и есть "+secondWord+", идиотское поколение, как вас таких земля крутит?"];
};

module.exports = {
	badwords, badwordRegExp, badwordRegExp1, tiBadwordRegExp,
	baad, baad1, tiBaad
	// Если что, я прям ничего здесь не изменял,буквально. Я только переделал получение этих команд
	// Ну и обновил немного, чтобы упростить взаимодействие
};