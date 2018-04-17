let kmaWeather = require('kma-js').Weather;
var mysql     = require('mysql');

Processor = {};
Processor.initializeConnection = function(){
	Processor.connection = mysql.createConnection({
		host     : 'biopama-test.c0hijoqmccs5.ap-northeast-2.rds.amazonaws.com',
		port   : 3306,
		user     : 'jang',
		password : 'whdtjr0713',
		database : 'biopama'
	});
	Processor.connection.connect();
};

Processor.disconnect = function () {
	Processor.connection.end(function(err) {
		console.log("Disconnect.");
	});
};

kmaWeather.townWeather('37.4817998', '127.0494742').then(function(data){

	var weather     = data.info[0].sky.code;
	var temperature = data.info[0].temperature.current;
	var wind		= data.info[0].wind.speed;
	var rain		= data.info[0].rain.code;

	console.log(data.info[0]);
	console.log(weather);
	console.log(temperature);
	console.log(wind);
	console.log(rain);

	var sql = "SELECT num FROM startup_weather";
	var sql_input;

	Processor.initializeConnection();
	Processor.connection.query(sql, function(err, results){
		if(err){
			Processor.disconnect();
			console.log("result:-1");
		}
		else{
			if(results.length){
				// update	
				sql = "UPDATE startup_weather SET weather = ?, temperature = ?, wind = ?, rain =? WHERE num = ?";
				sql_input = [weather, temperature, wind, rain, results[0].num];
			}
			else{
				// insert
				sql  = "INSERT INTO startup_weather (weather, temperature, wind, rain)";
				sql += " VALUES(?,?,?,?)";
				sql_input = [weather, temperature, wind, rain];
			}

			console.log(sql);
			console.log(sql_input);
			Processor.connection.query(sql, sql_input,function(err, results){
				if(err){
					Processor.disconnect();
					console.log("result:-1");
				}
				else{
					Processor.disconnect();
					console.log("result:1");	
				}
			});
		}
	});


})

