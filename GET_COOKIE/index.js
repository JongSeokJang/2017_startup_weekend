var mysql     = require('mysql');

Processor = {};
Processor.initializeConnection = function(){
  Processor.connection = mysql.createConnection({
    host	 : 'biopama-test.c0hijoqmccs5.ap-northeast-2.rds.amazonaws.com',
    port   : 3306,
    user	 : 'jang',
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

exports.handler = function(event, context, callback){

	var sql = "SELECT * FROM startup_weather ";
	var user_id  = event.query.user_id;
	var wsql = "";
	var sql_input = [];
	var type_array;
	var ii
	
	Processor.initializeConnection();
	Processor.connection.query(sql, function(err, results){
		if(err){
		  Processor.disconnect();
		  callback(null, {"result":"-1"});
		}
		else{
			var weather     = results[0].weather;
		    var temperature = results[0].temperature;
		    var wind        = results[0].wind;
			var rain        = results[0].rain;

			sql = "SELECT user_type FROM startup_user_info WHERE user_id = ?";
			sql_input = [user_id];	

			Processor.connection.query(sql, sql_input,function(err, results){
				if(err){
					Processor.disconnect();
					callback(null, {"result":"-1"});
				}
				else{
					if(results[0].user_type){// exist user_type;
						type_array = results[0].user_type.split(",");
						sql = "SELECT * FROM startup_content WHERE weather = ? "
						sql_input = [weather];

						for( ii = 0 ; ii < type_array.length; ii++){
							if( ii == 0 ){
								wsql = "AND (content_type = ?";
								sql_input.push(type_array[ii]);
							}
							else{
								wsql += " OR content_type = ?"
								sql_input.push(type_array[ii]);
							}

							if( ii == type_array.length - 1 )
								wsql += ")";
						}

						Processor.connection.query(sql+wsql, sql_input,function(err, results){
							if(err){
								Processor.disconnect();
								callback(null, {"result":"-1"});
							}
							else{
								
								var content = [];

								if(results){ // exist
									Processor.disconnect();
									var random = Math.floor(Math.random() * results.length);

									content.type    = results[random].content_type;
									content.weather = results[random].weather_comment;
									content.intro   = results[random].intro;
									content.content = results[random].content_memo;
									content.writer  = results[random].content_writer;

									callback(null, {"result":content}));
								}
								else{
									sql = "SELECT * FROM startup_content WHERE weather = ? "
									sql_input = [weather];

									Processor.connection.query(sql,sql_input,function(err, results){
										if(err){
											Processor.disconnect();
											callback(null, JSON.stringify({"result":"-1"}));
										}
										else{
											var content={};
											Processor.disconnect();
											var random = Math.floor(Math.random() * results.length);

											content.type    = results[random].content_type;
											content.weather = results[random].weather_comment;
											content.intro   = results[random].intro;
											content.content = results[random].content_memo;
											content.writer  = results[random].content_writer;
											
											callback(null, {"result":content}));
										}
									});
								}
								
							}
						});

					}
					else{ // doesn't exist user_type;
						sql = "SELECT * FROM startup_content WHERE weather = ? "
						sql_input = [weather];

						Processor.connection.query(sql,sql_input,function(err, results){
							if(err){
								Processor.disconnect();
								callback(null, JSON.stringify({"result":"-1"}));
							}
							else{
								var content={};
								Processor.disconnect();
								var random = Math.floor(Math.random() * results.length);

								content.type    = results[random].content_type;
								content.weather = results[random].weather_comment;
								content.intro   = results[random].intro;
								content.content = results[random].content_memo;
								content.writer  = results[random].content_writer;
								
								callback(null, {"result":content}));
							}
						});
					}
				}
			});	


		}

	});
}

