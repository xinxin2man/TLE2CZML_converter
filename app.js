const satellite = require('satellite.js');
const fs = require('fs')

//XXX OG
var julian = require('julian');

//XXX OG
//var tleLine1 = '1 25544U 98067A   18251.04275324  .00001933  00000-0  36838-4 0  9992',
//    tleLine2 = '2 25544  51.6423 325.7976 0005100 134.3785 287.4226 15.53822970131401';

let sec = 0;
let iterations = [];
let obj = fs.readFileSync("sample_FCO_apo01.tle").toString()
iterations = obj.split("\n")
let fin = []

for(let count = 0; count < iterations.length - 1; count++){
	fin.push(iterations[count].substring(0,iterations[count].length - 1)) //XXX SUCCESS
}
//console.log(fin.toString()) //XXX SUCCESS

let res = []

for(let i = 0; i <= 1440; i += 15){
	satrec = satellite.twoline2satrec(fin[1], fin[2]);
	positionAndVelocity = satellite.sgp4(satrec, i);
	gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));
	
	positionEci = positionAndVelocity.position;
	//console.log(positionEci)
	positionEci.x = positionEci.x*1000;
	positionEci.y = positionEci.y*1000;
	positionEci.z = positionEci.z*1000;
	
	geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
	var gmst = satellite.gstime(satrec.jdsatepoch);
	
	res.push(sec, positionEci.x, positionEci.y, positionEci.z);
	sec+=900;
}
//console.log(JSON.stringify(res))

//TODO Write into a file
let tle = "conv.czml"
fs.writeFile(tle, JSON.stringify(res), function(err){
	if(err){console.log(err)}
	console.log("Success!")
})

//XXX OG
//for(let i = 0; i <= 1440; i+=15){
//    satrec = satellite.twoline2satrec(tleLine1, tleLine2);
//    positionAndVelocity = satellite.sgp4(satrec, i);
//    gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));
//
//    positionEci = positionAndVelocity.position;
//    positionEci.x = positionEci.x*1000;
//    positionEci.y = positionEci.y*1000;
//    positionEci.z = positionEci.z*1000;
//
//    geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
//    var gmst = satellite.gstime(satrec.jdsatepoch);
//
//    iterations.push(sec, positionEci.x, positionEci.y, positionEci.z);
//    sec+=900;
//}
//console.log(JSON.stringify(iterations));
