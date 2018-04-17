var mecab = require('mecab-ya');

var ko_text1 = '대한민국여행의기준이되다';
var content = "그대를 만나 행복합니다.";

/*
mecab.pos(ko_text1, function(err, result) {
  console.log(result);
});

mecab.morphs(ko_text1, function(err, result) {
  console.log(result);
});

mecab.nouns(ko_text1, function(err, result) {
  console.log(result);
});
*/

mecab.nouns(content, function(err, result) {
  console.log(result);
});
