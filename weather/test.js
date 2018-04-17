let kmaWeather = require('kma-js').Weather;
kmaWeather.townWeather('37.4817998', '127.0494742').then( function(data){

	
	console.log(data);
	console.log(data.info[0]);
		
	var weather		= data.info[0].sky.code;
	var temperature = data.info[0].temperature.current;

	console.log(weather);
	console.log(temperature);


	console.log("hihi");

})
