const satellite = require('satellite.js');
const fs = require('fs')
const moment = require('moment');
//XXX OG
var julian = require('julian');
var some = "test"

//XXX OG

var tleLine1 = '1 25544U 98067A   18251.04275324  .00001933  00000-0  36838-4 0  9992',
	tleLine2 = '2 25544  51.6423 325.7976 0005100 134.3785 287.4226 15.53822970131401';

//TO GO FROM RAD/DAY -> REV/DAY: rad * 1440 * 0.159155
//To GO FROM REV/PER DAY TO MINS TO REV-> 1440/RevPerDay

// let sec = 0;

// line 18-26:  read from file and populate into array that holds tle as string
let iterations = [];
let obj = fs.readFileSync("sample_FCO_apo01.tle").toString()
iterations = obj.split("\n")
let fin = []

for (let count = 0; count < iterations.length - 1; count++) {
	fin.push(iterations[count].substring(0, iterations[count].length - 1)) //XXX SUCCESS
}
console.log("The file: ", fin.toString()) //XXX SUCCESS


let res = []; //result for position
let satrec = satellite.twoline2satrec(tleLine1, tleLine2); //Set satrec
let gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch)); //not needed right now
//console.log(satrec)
console.log("Julian Date: ",satrec.jdsatepoch);
//gmst = satellite.gstime(satrec.jdsatepoch);
console.log("gmst: ", gmst);
//console.log("JD: ", julian(new Date()));  // -> Julian date right now
console.log(`ISO time for set : `, julian.toDate(satrec.jdsatepoch).toISOString()); // -> The iso8 time from when TLE snapshot was(0 mins since epochtime)

//after 93mins
//let positionAndVelocity = satellite.sgp4(satrec, 93);
//console.log("Julian date after 93mins: ", satrec.jdsatepoch);
let mins90 = moment("2018-09-08T01:01:33.879Z").add(25,'h').toISOString(); //need [Z] to be treaated as UTC. WORKS!!!!!!!

console.log("After adding 25hours");
console.log(mins90,"\n\n");

//TO GO FROM RAD/DAY -> REV/DAY: rad * 1440 * 0.159155
//To GO FROM REV/PER DAY TO MINS TO REV-> 1440/RevPerDay

let totalIntervalsInDay = satrec.no * 1440 * 0.159155; //1440 = min && 0.159155 = 1turn
let minsPerInterval = 1440/totalIntervalsInDay; // mins for 1 revolution around earth

let intervalTime = moment(julian.toDate(satrec.jdsatepoch).toISOString()).toISOString()//.add(minsPerInterval,'m').toISOString();

console.log(intervalTime);

//intervalTime = moment(intervalTime).add(minsPerInterval, 'm').toISOString();
console.log("Time after 3x: ", intervalTime);

//console.log("Interval 1 :", minsPerInterval);


//TODO Look into CZML_Writer.
//let obj = {}
//obj["id"] = fin[0]
//obj["name"]
//obj[""]
//res.push(obj)


//set intervals 
let initialTime = moment(julian.toDate(satrec.jdsatepoch).toISOString()).toISOString();
let endTime = moment(initialTime).add(25,'h').toISOString(); //add 25 hours to 
console.log("Initial time:: ", initialTime);
console.log("End time:: ", endTime);
console.log("Mins per orbit: ", minsPerInterval);

let leadIntervalArray = [];
let trailIntervalArray = [];
console.log("\n\nSetting intervals: \n\n");
for(let i=0; i<=1500; i+=minsPerInterval){	//1500 == 25hours(which is our end time)

	if(i===0){ // intial interval 
		intervalTime = moment(intervalTime).add(minsPerInterval, 'm').toISOString();
		let currentOrbitalInterval = {
		  //"interval":"2012-03-15T10:00:00Z/2012-03-15T10:44:56.1031157730031Z",
		  "interval":`${initialTime}/${intervalTime}`,
          "epoch":`${initialTime}`,
          "number":[
            0,minsPerInterval*60,
            minsPerInterval*60,0
          ]
		}
		let currTrail = {
			"interval":`${initialTime}/${intervalTime}`,
			"epoch":`${initialTime}`,
			"number":[
				0,0,
				minsPerInterval*60,minsPerInterval*60
			]
		}
		leadIntervalArray.push(currentOrbitalInterval);
		trailIntervalArray.push(currTrail);
	}
	else{	//not initial so make intervals 
		let nextIntervalTime = moment(intervalTime).add(minsPerInterval, 'm').toISOString();
		let currentOrbitalInterval = {
			
			//"interval":"2012-03-15T10:00:00Z/2012-03-15T10:44:56.1031157730031Z",
			"interval":`${intervalTime}/${nextIntervalTime}`,
			"epoch":`${intervalTime}`,
			"number":[
			  0,minsPerInterval*60,
			  minsPerInterval*60,0
			]
			}
			let currTrail = {
				"interval":`${intervalTime}/${nextIntervalTime}`,
				"epoch":`${intervalTime}`,
				"number":[
					0,0,
					minsPerInterval*60,minsPerInterval*60
				]
			}
		  intervalTime = moment(intervalTime).add(minsPerInterval, 'm').toISOString();
			leadIntervalArray.push(currentOrbitalInterval);
			trailIntervalArray.push(currTrail);
	}
	
	//console.log()
}

console.log("LEAD INTERVAL ARRAY: ");
console.log(leadIntervalArray);
console.log("\n\nTRAIL INTERVAL ARRAY: ");
console.log(trailIntervalArray);




exports.getCoords = () => {//
let sec = 0;
console.log("THIS IS INSIDE EXPORT!!!!!!!!!");
	for (let i = 0; i <= 86400; i++) { //iterates every second (86400sec in 1day)
		//satrec = satellite.twoline2satrec(fin[1], fin[2]);
		let positionAndVelocity = satellite.sgp4(satrec, i*0.0166667); // 0.0166667min = 1sec

		let positionEci = positionAndVelocity.position;
		positionEci.x = positionEci.x * 1000;
		positionEci.y = positionEci.y * 1000;
		positionEci.z = positionEci.z * 1000;

		//geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);

		//var gmst2 = satellite.gstime(satrec.jdsatepoch);
		//console.log(satrec.ndot)
		//console.log(satrec.no)

		res.push(i, positionEci.x, positionEci.y, positionEci.z);
		//console.log("Res:" , res);
		sec+=900;
	}


	//console.log(JSON.stringify(res))

	//XXX Test multiples of 3
	//console.log(res.length) //SUCCESS
	//set initial object start for czml
let initialCZMLProps = [{
	"id": "document",
	"name": "CZML Point - Time Dynamic",
	"version": "1.0",
	"clock":{
			"interval":`${initialTime}/${endTime}`,
		 
			"multiplier":1,
			"range":"LOOP_STOP",
			"step":"SYSTEM_CLOCK_MULTIPLIER"
		}
	
}, 

{
    "id":"Satellite/ISS",
    "name":"ISS",
    "availability":`${initialTime}/${endTime}`,
    "description":"<!--HTML-->\r\n<p>The International Space Station (ISS) is a space station, or a habitable artificial satellite in low Earth orbit. It is a modular structure whose first component was launched in 1998. Now the largest artificial body in orbit, it can often be seen at the appropriate time with the naked eye from Earth. The ISS consists of pressurised modules, external trusses, solar arrays and other components. ISS components have been launched by American Space Shuttles as well as Russian Proton and Soyuz rockets. In 1984 the ESA was invited to participate in Space Station Freedom. In 1993, after the USSR ended, the United States and Russia merged Mir-2 and Freedom together.\r\nThe ISS serves as a microgravity and space environment research laboratory in which crew members conduct experiments in biology, human biology, physics, astronomy, meteorology and other fields. The station is suited for the testing of spacecraft systems and equipment required for missions to the Moon and Mars.</p>\r\n\r\n<p>Since the arrival of Expedition 1 on 2 November 2000, the station has been continuously occupied for 13 years and 86 days, the longest continuous human presence in space. (In 2010, the station surpassed the previous record of almost 10 years (or 3,634 days) held by Mir.) The station is serviced by a variety of visiting spacecraft: Soyuz, Progress, the Automated Transfer Vehicle, the H-II Transfer Vehicle, Dragon, and Cygnus. It has been visited by astronauts and cosmonauts from 15 different nations.</p>\r\n\r\n<p>After the U.S. Space Shuttle program ended in 2011, Soyuz rockets became the only provider of transport for astronauts at the International Space Station.\r\nThe ISS programme is a joint project among five participating space agencies: NASA, Roskosmos, JAXA, ESA, and CSA. The ownership and use of the space station is established by intergovernmental treaties and agreements. The station is divided into two sections, the Russian Orbital Segment (ROS) and the United States Orbital Segment (USOS), which is shared by many nations. The ISS maintains an orbit with an altitude of between 330 km (205 mi) and 435 km (270 mi) by means of reboost manoeuvres using the engines of the Zvezda module or visiting spacecraft. It completes 15.410 orbits per day. The ISS is funded until 2024, and may operate until 2028. The Russian Federal Space Agency, Roskosmos (RKA) has proposed using the ISS to commission modules for a new space station, called OPSEK, before the remainder of the ISS is deorbited. ISS is the ninth space station to be inhabited by crews, following the Soviet and later Russian Salyut, Almaz, and Mir stations, and Skylab from the US.</p>",
    "billboard":{
      "eyeOffset":{
        "cartesian":[
          0,0,0
        ]
      },
      "horizontalOrigin":"CENTER",
      "image":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADJSURBVDhPnZHRDcMgEEMZjVEYpaNklIzSEfLfD4qNnXAJSFWfhO7w2Zc0Tf9QG2rXrEzSUeZLOGm47WoH95x3Hl3jEgilvDgsOQUTqsNl68ezEwn1vae6lceSEEYvvWNT/Rxc4CXQNGadho1NXoJ+9iaqc2xi2xbt23PJCDIB6TQjOC6Bho/sDy3fBQT8PrVhibU7yBFcEPaRxOoeTwbwByCOYf9VGp1BYI1BA+EeHhmfzKbBoJEQwn1yzUZtyspIQUha85MpkNIXB7GizqDEECsAAAAASUVORK5CYII=",
      "pixelOffset":{
        "cartesian2":[
          0,0
        ]
      },
      "scale":1.5,
      "show":true,
      "verticalOrigin":"CENTER"
    },
    "label":{
      "fillColor":{
        "rgba":[
          255,0,255,255
        ]
      },
      "font":"11pt Lucida Console",
      "horizontalOrigin":"LEFT",
      "outlineColor":{
        "rgba":[
          0,0,0,255
        ]
      },
      "outlineWidth":2,
      "pixelOffset":{
        "cartesian2":[
          12,0
        ]
      },
      "show":true,
      "style":"FILL_AND_OUTLINE",
      "text":"ISS",
      "verticalOrigin":"CENTER"
    },
    "path":{
      "show":[
        {
          "interval":`${initialTime}/${endTime}`,
          "boolean":true
        }
      ],
      "width":1,
      "material":{
        "solidColor":{
          "color":{
            "rgba":[
              255,0,255,255
            ]
          }
        }
      },
      "resolution":120,
      "leadTime":leadIntervalArray,
      "trailTime":trailIntervalArray
    },
    "position":{
      "interpolationAlgorithm":"LAGRANGE",
      "interpolationDegree":5,
      "referenceFrame":"INERTIAL",
      "epoch":`${initialTime}`,
      "cartesian":res
    }
  }
]

	//TODO Write into a file
	//exports.getCoords = () => {
	let tle = "conv.czml"
	fs.writeFile(tle, JSON.stringify(initialCZMLProps, null, 4), function (err) {
		if (err) { console.log(err) }
		console.log("Success!")
	})

	let tempCZML = []
	tempCZML.push({ initialCZMLProps });
	return tle;
}

	exports.createF = () => {
		let tle = "conv.czml"
		fs.writeFile(tle, JSON.stringify(res), function (err) {
			if (err) { console.log(err) }
			console.log("Success!")
		})

		let tempCZML = []
		tempCZML.push({ res });
		return tle;
	}
// let tempCZML = []
// tempCZML.push(res);
//console.log(JSON.stringify(tempCZML));


//export{ some };
