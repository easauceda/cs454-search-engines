var Promise = require('bluebird');
var oid = require('mongodb').ObjectID;

module.exports = function(app){
	var db = app.get('mongo');
	app.get('/', function(req, res) {
		res.sendFile(path.resolve('index.html'));
	});

	app.get('/search', function(req, res) {
		var data = { tfidf : '',
			urls :  []
		};
		var count = 0;
		results = db.collection('Index').findOneAsync({ "term" : req.query.query})
		 .then(function(results) {
			 data.tfidf = results['tfIdf'];
		 	for (var key in results['locations']){
		 		count++;
		 		location = db.collection('DocumentMetadata').findOne({"_id" : new oid(key)}, function(err, result){
		 			data.urls.push(result['url'])
		 			count--;
		 			if (count === 0){
		 				res.send(data);
		 			}
		 		})
		 	}
		 })
	});
}