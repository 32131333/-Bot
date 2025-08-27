module.exports = function (port) {
	return globalThis.server = require("http").createServer((req, res) => { 
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(">~<");
		res.end();
	}).listen(port||3000);
};