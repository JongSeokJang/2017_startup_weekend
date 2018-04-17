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

  var user_id  = event.body.user_id;
  var sql = "SELECT user_type FROM startup_user_info WHERE user_id = ?";
  var wsql = "";
  var sql_input = [];
  var type_array;
  var ii

  sql_input = [user_id];

  Processor.initializeConnection();
  Processor.connection.query(sql, sql_input,function(err, results){
    if(err){
      Processor.disconnect();
      callback(null, JSON.stringify({"result":"-1"}));
    }
    else{
      console.log(results);
      type_array = results.split(",");

      sql = "SELECT * FROM startup_content "
      sql_input = [];
      for( ii = 0 ; ii < type_array.length; ii++){

        if( ii == 0){
          wsql = "WHERE content_type = ?"
          sql_input.push(type_array[ii]);
        }
        else{
          wsql = "OR content_type = ?"
          sql_input.push(type_array[ii]);
        }
      }

      Processor.connection.query(sql+wsql, sql_input,function(err, results){
        if(err){
          Processor.disconnect();
          callback(null, JSON.stringify({"result":"-1"}));
        }
        else{

          Processor.disconnect();
          var random = Math.floor(Math.random() * results.length);
          console.log(results[random].content_memo);
          callback(null, JSON.stringify({"result":results[random].content_memo}));
        }
      });
    }
  });

});
