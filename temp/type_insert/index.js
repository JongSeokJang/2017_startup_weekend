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

  var content_type = event.body.prefer_type
  var user_id      = event.body.user_id;

  var sql = "UPDATE user_type = ? FROM startup_user_info WHERE user_id = ?";
  var sql_input = [content_type, user_id];

  Processor.initializeConnection();
  Processor.connection.query(sql, sql_input,function(err, results){
    if(err){
      Processor.disconnect();
      callback(null, JSON.stringify({"result":"-1"}));
    }
    else{
      console.log(results);
      callback(null, JSON.stringify({"result":"1"}));
    }
  });

});
