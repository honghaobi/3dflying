var rp = require('request-promise');
var env = require('require-env');

// module.exports = {
//   getInsta: () => {
//     var options ={
//       method: 'GET',
//       uri:'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ userInput + '.json',
//       qs: {
//         access_token:process.env.MAPBOXKEY
//       },
//       json:true
//     }
//
//     return rp(options)
//       .then(function(data) {
//         var lat = data.features[0].center[0];
//         var long = data.features[0].center[1];
//         return {lat,long};
//       })
//       .catch(function(err) {
//         console.log(err);
//       });
//
//   }
// };
