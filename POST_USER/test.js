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

var user_id = "whdtjr321";
var user_pass = "whdtjr321";
var user_age = 20;
var user_gender = 0; // 0: man, 1 : woman

// var user_id       = event.body.user_id;
// var user_pass     = event.body.user_pass;
// var user_age      = event.body.user_age;
// var user_gender   = event.body.user_gender;
var sql = "SELECT user_id FROM startup_user_info WHERE user_id = ?";
var sql_input = [user_id];

Processor.initializeConnection();
Processor.connection.query(sql, sql_input,function(err, results){
  if(err){
    Processor.disconnect();
    console.log("result:-1");
  }
  else{

    console.log(results);
    if(results.length){
      Processor.disconnect();
      console.log("result:-1");
    }
    else{

      var sql = "INSERT INTO startup_user_info (user_id, user_pass, user_age, user_gender)";
      sql    += " VALUES(?,?,?,?)";
      var sql_input = [user_id, user_pass, user_age, user_gender];

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
  }
});
