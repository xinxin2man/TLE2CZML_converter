//TODO Figure out WHY `require` is NOT being accepted.
const converter = require("./Converter.js");

function allowDrop(ev) {
    //prevents file from being uploaded automatically
    ev.preventDefault();
}

function dropped(ev) {
	//XXX OG
    //console.log("Drop");
    //ev.preventDefault();
    //let data = ev.dataTransfer;
    //let files = data.files;
    //console.log(files[0]);

	//XXX NEW
	ev.preventDefault()
	let data = ev.dataTransfer
	let conv = converter.convert(data)
}
