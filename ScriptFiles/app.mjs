export function convert(tle){
	const satellite = require('satellite.js');
	const fs = require('fs')
	
	//XXX OG
	var julian = require('julian');
	
	//XXX OG
	//var tleLine1 = '1 25544U 98067A   18251.04275324  .00001933  00000-0  36838-4 0  9992',
	//    tleLine2 = '2 25544  51.6423 325.7976 0005100 134.3785 287.4226 15.53822970131401';
	
	let sec = 0;
	let iterations = [];
	let obj = tle.toString()
	//let obj = fs.readFileSync("../tles/sample_FCO_apo01.tle").toString()
	iterations = obj.split("\n")
	let fin = []
	
	for(let count = 0; count < iterations.length - 1; count++){
		fin.push(iterations[count].substring(0,iterations[count].length - 1)) //XXX SUCCESS
	}
	//console.log(fin.toString()) //XXX SUCCESS
	
	let res = []
	
	satrec = satellite.twoline2satrec(fin[1], fin[2])
	gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));
	//console.log(satrec.)
	
	
	//TODO Look into CZML_Writer.
	//let obj = {}
	//obj["id"] = fin[0]
	//obj["name"]
	//obj[""]
	//res.push(obj)
	
	
	for(let i = 0; i <= 1440; i += 15){
		//satrec = satellite.twoline2satrec(fin[1], fin[2]);
		positionAndVelocity = satellite.sgp4(satrec, i);
	
		positionEci = positionAndVelocity.position;
		positionEci.x = positionEci.x*1000;
		positionEci.y = positionEci.y*1000;
		positionEci.z = positionEci.z*1000;
	
		geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
	
		//var gmst2 = satellite.gstime(satrec.jdsatepoch);
		//console.log(satrec.ndot)
		//console.log(satrec.no)
		
		res.push(sec, positionEci.x, positionEci.y, positionEci.z);
		sec+=900;
	}
	//console.log(JSON.stringify(res))
	//XXX Test multiples of 3
	//console.log(res.length) //SUCCESS
	
	//TODO Write into a file
	//let tle = "../Curr_SD-Proj_v2/Source/conv.czml"
	//fs.writeFile(tle, JSON.stringify(res), function(err){
	//	if(err){console.log(err)}
	//	console.log("Success!")
	//})

	let tleSave = "../czml/satellite.czml"
	fs.writeFile(tleSave, JSON.stringify(res), function(er){
		if(err){console.log(err)}
		console.log("Success!")
	}
	
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
}
