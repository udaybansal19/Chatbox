//Logging types and conventions
const log = {
	error:1,
	warn:2,
	log:3,
	info:4,
	debug:5
}
Object.freeze(log);

function logger(message, type) {
	switch(type) {
		case 1:
			console.error(message);
			break;

		case 2:
			console.warn(message);
			break;

		case 3:
			//console.log(message);
			break;

		case 4:
			console.log(`%c ${message}`,"color:Chartreuse");
			break;

		case 5:
			console.log(`%c ${message}`,"color:yellow");
			break;

		default:
			console.log(message);
			break;
	}

}