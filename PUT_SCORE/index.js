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

  var user_id       = event.body.user_id;
  var content_type  = event.body.content_type;
  var content_score = event.body.content_score;

  var sql = "SELECT score, ecount FROM startup_score WHERE user_id = ? AND content_type = ?";
  var sql_input = [user_id, content_type];

  Processor.initializeConnection();
  Processor.connection.query(sql, sql_input,function(err, results){
    if(err){
      Processor.disconnect();
      callback(null, JSON.stringify({"result":"-1"}));
    }
    else{
      if(results.length){ // exist
        // UPDATE
        var score   = results[0].score + content_score;
        var ecount  = results[0].ecount + 1;

        sql  = "UPDATE startup_score SET score = ?, ecount = ? WHERE user_id =? AND content_type = ?";
        sql_input = [score, ecount, user_id, content_type];

      }
      else{
        sql  = "INSERT INTO startup_score (user_id, content_type, score, ecount)";
        sql += " VALUES(?,?,?,?)"
        sql_input = [user_id, content_type, content_score, 1]
        // INSERT
      }
      Processor.connection.query(sql, sql_input,function(err, results){
        if(err){
          Processor.disconnect();
          callback(null, JSON.stringify({"result":"-1"}));
        }
        else{
          Processor.disconnect();
          callback(null, JSON.stringify({"result":"1"}));
        }
      });

      console.log(results);
    }
  });

});
