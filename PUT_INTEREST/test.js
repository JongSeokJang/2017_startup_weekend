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

var content_type = "사랑,나,감사";
var user_id ="whdtjr321";
//var content_type = event.body.prefer_type
//var user_id      = event.body.user_id;

var sql = "UPDATE startup_user_info SET user_type = ? WHERE user_id = ?";
var sql_input = [content_type, user_id];

Processor.initializeConnection();
console.log(sql);
console.log(sql_input);
Processor.connection.query(sql, sql_input,function(err, results){
  if(err){
    Processor.disconnect();
    console.log("result:-1");
    // callback(null, JSON.stringify({"result":"-1"}));
  }
  else{
    // console.log(results);
    Processor.disconnect();
    console.log("result:1");
    // callback(null, JSON.stringify({"result":"1"}));
  }
});
