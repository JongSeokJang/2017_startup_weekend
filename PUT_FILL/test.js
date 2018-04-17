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

var content_num = 5; 

var sql = "SELECT feeling FROM startup_content WHERE content_num = ?";
var sql_input = [content_num];


Processor.initializeConnection();
Processor.connection.query(sql, sql_input,function(err, results){
	if(err){
		Processor.disconnect();
		console.log("result: -2");
	}
	else{
		console.log(results);
		if(results.length){ // exist
			var feelcount = results[0].feeling + 1;
			
			sql  = "UPDATE startup_content SET feeling = ? WHERE content_num =?";
			sql_input = [ feelcount, content_num ];
			Processor.connection.query(sql, sql_input,function(err, results){
				if(err){
					Processor.disconnect();
					console.log("result: -2");
				}
				else{
					Processor.disconnect();
					console.log("results:1");
				}
			});
		}
		else{
			// error
			Processor.disconnect();
			console.log("results:-1");
		}
    }
});
