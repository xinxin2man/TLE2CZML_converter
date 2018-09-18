const satellite = require('satellite.js');
var julian = require('julian');

console.log("This got here! ");

//'1 38778U 12051A   12288.95265372  .00000136  00000-0  00000+0 0   217'
//'2 38778 000.0698 254.6769 0000479 231.1384 284.5280 01.00269150   226'
var tleLine1 = '1 25544U 98067A   18251.04275324  .00001933  00000-0  36838-4 0  9992',
    tleLine2 = '2 25544  51.6423 325.7976 0005100 134.3785 287.4226 15.53822970131401';


let TLEarray = [
    "1 25544U 98067A   18251.04275324  .00001933  00000-0  36838-4 0  9992",
    "2 25544  51.6423 325.7976 0005100 134.3785 287.4226 15.53822970131401",

    "1 25544U 98067A   18251.23089730  .00003284  00000-0  57440-4 0  9990",
    "2 25544  51.6419 324.8596 0005017 133.5918 261.3475 15.53827591131434",
    
    "1 25544U 98067A   18251.24259628  .00003015  00000-0  53336-4 0  9998",
    "2 25544  51.6418 324.8013 0005029 133.9199 326.5031 15.53826959131434",
    
    "1 25544U 98067A   18251.51760417  .00001781  00000-0  34510-4 0  9992",
    "2 25544  51.6421 323.4306 0004962 135.4139  64.3537 15.53825153131471",
    
    "1 25544U 98067A   18251.57118757  .00001741  00000-0  33903-4 0  9993",
    "2 25544  51.6422 323.1635 0004967 135.6359   4.0635 15.53825280131487",
    
    "1 25544U 98067A   18251.57118757  .00001741  00000-0  33903-4 0  9993",
    "2 25544  51.6422 323.1635 0004967 135.6359   4.0635 15.53825280131487",
    
    "1 25544U 98067A   18251.69944711  .00001720  00000-0  33588-4 0  9999",
    "2 25544  51.6423 322.5248 0005037 136.5037   1.1247 15.53825593131500",
    
    "1 25544U 98067A   18251.69944711  .00001758  00000-0  34159-4 0  9995",
    "2 25544  51.6423 322.5244 0004965 136.1360   1.4938 15.53825909131501"
]

let sec = 0;
let iterations = [];

for(let i = 0; i <= 1440; i+=15){

    // #8
    //console.log("\n\nFOR SET , where tle1: \n");

    //console.log(tleLine1);
    satrec = satellite.twoline2satrec(tleLine1, tleLine2);
    positionAndVelocity = satellite.sgp4(satrec, i);
    gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));

    positionEci = positionAndVelocity.position;
    positionEci.x = positionEci.x*1000;
    positionEci.y = positionEci.y*1000;
    positionEci.z = positionEci.z*1000;
    //console.log(`\nThe position in eci for set(i): ${i}:`, positionEci);

    geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
    //console.log("\nThe geodetic coords: ", geodeticCoords); //in radians
    //console.log("Km to m ",  geodeticCoords.height * 1000.0);
    //console.log("Julian Date: ",satrec.jdsatepoch);
    var gmst = satellite.gstime(satrec.jdsatepoch);
    //console.log("gmst: ", gmst);

    //console.log("JD: ", jd = julian(now));  // -> '2456617.949335'
    //console.log(`ISO time for set : ${i}`, julian.toDate(satrec.jdsatepoch).toISOString()); // -> Timestamp above in local TZ (ISO)

    //console.log()

    iterations.push(sec, positionEci.x, positionEci.y, positionEci.z);
    sec+=900;
    

}


console.log("The final array: \n\n\n");
console.log(JSON.stringify(iterations));













/* IGNORE THE REST. IT MAY BE USEFUL LATER BUT NOT NOW.  */
//Go through list of TLE's and 
// for(let i = 0; i < TLEarray.length; i++){
//     //
//     let line1 = TLEarray[count];
//     let line2 = TLEarray[count+1];
//     console.log("\n\nTHE ARRAY LENGTH: ", TLEarray.length);
//     if(typeof line1 == 'string' || line1 instanceof String || typeof line2 ==
//     'string' || line2 instanceof String){

//         console.log("Count is ", count);
//         let satrec = satellite.twoline2satrec(line1, line2);
//         let positionAndVelocity = satellite.sgp4(satrec, 5000); //Whats the difference between sgp4 and propogate? 

//         console.log("This is for set", satrec);
//         console.log("tle line 1: ", line1);
//         console.log("\ntle line 2: ", line2);
//         count++;
//         // TLEarray.shift();
//         // TLEarray.shift();

      
//     }
//     else{
        
//           }
// }



// // Initialize a satellite record
// console.log('FOR SET 1: ');
// var satrec = satellite.twoline2satrec(tleLine1, tleLine2);
// var positionAndVelocity = satellite.sgp4(satrec, 0);
// var gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));

// //console.log("\n The satrec object:\n ", satrec);
// //console.log("\n\n\n The position and velocity:\n ", positionAndVelocity );
// var positionEci = positionAndVelocity.position;
// console.log("The position in eci: ", positionEci);

// //to ecf
// //var positionEcf   = satellite.eciToEcf(positionEci, gmst);
// //console.log("\n\nPosition in ecf: ", positionEcf);
// //console.log("\nSatrec jdate: ", satrec.jdsatepoch);

// //SET ECI FROM KM TO M, SINCE THATS WHAT CESIUM ACCEPTS
// // positionEci.x = positionEci.x * 1000;
// // positionEci.y = positionEci.y * 1000;
// // positionEci.z = positionEci.z * 1000;

// var geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
// console.log("\nThe geodetic coords: ", geodeticCoords); //in radians
// console.log("Km to m ",  geodeticCoords.height * 1000.0);
// console.log("Julian Date: ",satrec.jdsatepoch);
// var gmst = satellite.gstime(satrec.jdsatepoch);
// console.log("gmst: ", gmst);

// var now = new Date();           // Let's say it's Thu, 21 Nov 2013 10:47:02 GMT
// var jd = '';
// //console.log("JD: ", jd = julian(now));  // -> '2456617.949335'
// console.log("Local time zone: ", julian.toDate(satrec.jdsatepoch).toISOString()); // -> Timestamp above in local TZ (ISO)

// /*
//     iso TIMES


// */


// // #2 
// console.log("\n\nFOR SET 2");

// tleLine1 = "1 25544U 98067A   18251.23089730  .00003284  00000-0  57440-4 0  9990"
// tleLine2 = "2 25544  51.6419 324.8596 0005017 133.5918 261.3475 15.53827591131434"
// satrec = satellite.twoline2satrec(tleLine1, tleLine2);
// positionAndVelocity = satellite.sgp4(satrec, 0);
// gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));

// positionEci = positionAndVelocity.position;
// console.log("\nThe position in eci: ", positionEci);

// geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
// console.log("\nThe geodetic coords: ", geodeticCoords); //in radians
// console.log("Km to m ",  geodeticCoords.height * 1000.0);
// console.log("Julian Date: ",satrec.jdsatepoch);
// var gmst = satellite.gstime(satrec.jdsatepoch);
// console.log("gmst: ", gmst);

// //console.log("JD: ", jd = julian(now));  // -> '2456617.949335'
// console.log("ISO time for set 2: ", julian.toDate(satrec.jdsatepoch).toISOString()); // -> Timestamp above in local TZ (ISO)









// // #3
// console.log("\n\nFOR SET 3");
// tleLine1 = "1 25544U 98067A   18251.24259628  .00003015  00000-0  53336-4 0  9998"
// tleLine2 = "2 25544  51.6418 324.8013 0005029 133.9199 326.5031 15.53826959131434"
// satrec = satellite.twoline2satrec(tleLine1, tleLine2);
// positionAndVelocity = satellite.sgp4(satrec, 0);
// gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));

// positionEci = positionAndVelocity.position;
// console.log("\nThe position in eci: ", positionEci);

// geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
// console.log("\nThe geodetic coords: ", geodeticCoords); //in radians
// console.log("Km to m ",  geodeticCoords.height * 1000.0);
// console.log("Julian Date: ",satrec.jdsatepoch);
// var gmst = satellite.gstime(satrec.jdsatepoch);
// console.log("gmst: ", gmst);

// //console.log("JD: ", jd = julian(now));  // -> '2456617.949335'
// console.log("ISO time for set 3: ", julian.toDate(satrec.jdsatepoch).toISOString()); // -> Timestamp above in local TZ (ISO)





// // #4
// console.log("\n\nFOR SET 4");
// tleLine1 = "1 25544U 98067A   18251.51760417  .00001781  00000-0  34510-4 0  9992"
// tleLine2 = "2 25544  51.6421 323.4306 0004962 135.4139  64.3537 15.53825153131471"
// satrec = satellite.twoline2satrec(tleLine1, tleLine2);
// positionAndVelocity = satellite.sgp4(satrec, 0);
// gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));

// positionEci = positionAndVelocity.position;
// console.log("\nThe position in eci: ", positionEci);

// geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
// console.log("\nThe geodetic coords: ", geodeticCoords); //in radians
// console.log("Km to m ",  geodeticCoords.height * 1000.0);
// console.log("Julian Date: ",satrec.jdsatepoch);
// var gmst = satellite.gstime(satrec.jdsatepoch);
// console.log("gmst: ", gmst);

// //console.log("JD: ", jd = julian(now));  // -> '2456617.949335'
// console.log("ISO time for set 4: ", julian.toDate(satrec.jdsatepoch).toISOString()); // -> Timestamp above in local TZ (ISO)





// // #5
// console.log("\n\nFOR SET 5");
// tleLine1 = "1 25544U 98067A   18251.57118757  .00001741  00000-0  33903-4 0  9993"
// tleLine2 = "2 25544  51.6422 323.1635 0004967 135.6359   4.0635 15.53825280131487"
// satrec = satellite.twoline2satrec(tleLine1, tleLine2);
// positionAndVelocity = satellite.sgp4(satrec, 0);
// gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));

// positionEci = positionAndVelocity.position;
// console.log("\nThe position in eci: ", positionEci);

// geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
// console.log("\nThe geodetic coords: ", geodeticCoords); //in radians
// console.log("Km to m ",  geodeticCoords.height * 1000.0);
// console.log("Julian Date: ",satrec.jdsatepoch);
// var gmst = satellite.gstime(satrec.jdsatepoch);
// console.log("gmst: ", gmst);

// //console.log("JD: ", jd = julian(now));  // -> '2456617.949335'
// console.log("ISO time for set 5: ", julian.toDate(satrec.jdsatepoch).toISOString()); // -> Timestamp above in local TZ (ISO)





// // #6
// console.log("\n\nFOR SET 6");
// tleLine1 = "1 25544U 98067A   18251.57118757  .00001741  00000-0  33903-4 0  9993"
// tleLine2 = "2 25544  51.6422 323.1635 0004967 135.6359   4.0635 15.53825280131487"
// satrec = satellite.twoline2satrec(tleLine1, tleLine2);
// positionAndVelocity = satellite.sgp4(satrec, 0);
// gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));

// positionEci = positionAndVelocity.position;
// console.log("\nThe position in eci: ", positionEci);

// geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
// console.log("\nThe geodetic coords: ", geodeticCoords); //in radians
// console.log("Km to m ",  geodeticCoords.height * 1000.0);
// console.log("Julian Date: ",satrec.jdsatepoch);
// var gmst = satellite.gstime(satrec.jdsatepoch);
// console.log("gmst: ", gmst);

// //console.log("JD: ", jd = julian(now));  // -> '2456617.949335'
// console.log("ISO time for set 6: ", julian.toDate(satrec.jdsatepoch).toISOString()); // -> Timestamp above in local TZ (ISO)





// // #7
// console.log("\n\nFOR SET 7");
// tleLine1 = "1 25544U 98067A   18251.69944711  .00001720  00000-0  33588-4 0  9999"
// tleLine2 = "2 25544  51.6423 322.5248 0005037 136.5037   1.1247 15.53825593131500"
// satrec = satellite.twoline2satrec(tleLine1, tleLine2);
// positionAndVelocity = satellite.sgp4(satrec, 0);
// gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));

// positionEci = positionAndVelocity.position;
// console.log("\nThe position in eci: ", positionEci);

// geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
// console.log("\nThe geodetic coords: ", geodeticCoords); //in radians
// console.log("Km to m ",  geodeticCoords.height * 1000.0);
// console.log("Julian Date: ",satrec.jdsatepoch);
// var gmst = satellite.gstime(satrec.jdsatepoch);
// console.log("gmst: ", gmst);

// //console.log("JD: ", jd = julian(now));  // -> '2456617.949335'
// console.log("ISO time for set 7: ", julian.toDate(satrec.jdsatepoch).toISOString()); // -> Timestamp above in local TZ (ISO)





// // #8
// console.log("\n\nFOR SET 8, where tle1: \n");
// tleLine1 = "1 25544U 98067A   18251.69944711  .00001758  00000-0  34159-4 0  9995"
// tleLine2 = "2 25544  51.6423 322.5244 0004965 136.1360   1.4938 15.53825909131501"
// //console.log(tleLine1);
// satrec = satellite.twoline2satrec(tleLine1, tleLine2);
// positionAndVelocity = satellite.sgp4(satrec, 0);
// gmst = satellite.gstime(julian.toDate(satrec.jdsatepoch));

// positionEci = positionAndVelocity.position;
// console.log("\nThe position in eci: ", positionEci);

// geodeticCoords = satellite.eciToGeodetic(positionEci, gmst);
// console.log("\nThe geodetic coords: ", geodeticCoords); //in radians
// console.log("Km to m ",  geodeticCoords.height * 1000.0);
// console.log("Julian Date: ",satrec.jdsatepoch);
// var gmst = satellite.gstime(satrec.jdsatepoch);
// console.log("gmst: ", gmst);

// //console.log("JD: ", jd = julian(now));  // -> '2456617.949335'
// console.log("ISO time for set 8: ", julian.toDate(satrec.jdsatepoch).toISOString()); // -> Timestamp above in local TZ (ISO)
