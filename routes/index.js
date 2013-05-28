var request = require('request'),
	jsdom = require('jsdom'),
	http = require('http'),
	url = require('url');

/*
 * Routes
 */
module.exports.create = function (app) {
	
	app.get('/', function (req, res, next) {
		res.render('index', {
      		title: "fuseapp"	
    	});
    });

    app.get('/getResource', function (req, res, next) {
		var title = req.param('title');
		var userURL = req.param('URL');
		var URL = url.parse(userURL)

		request({ uri: URL }, function (error, response, body) {
		  if (error) {
		    res.send({error: error.message, type: 'N/A'});
		    return;
		  }
		  if (response.headers['content-type'].indexOf('text/html') == -1) {
		  	var type = response.headers['content-type'];	
		  	res.send({error: 'Wrong Content Type', type: type});
		  	return;
		  } 
		  else {
			  	jsdom.env({
			    html: body,
			    scripts: ['http://code.jquery.com/jquery-1.5.min.js']
			  }, function (err, window) {
			    var $ = window.$;
			    var linkArray = [];
			    var description;
			    console.log(body);
			    $('a').each(function() {
			    	var href = $(this).attr('href');
			    	linkArray.push(href);
			    });
			    $('meta').each(function() {
			    	var desc = $(this).attr('name');
			    	if(desc == "description") {
			    		description = $(this).attr('content');
			    	}
			    });
			    var title = $('title').html();
			    res.send({linkArray: linkArray, title: title, desc: description, URL: URL});
			  });
		  	}
		});
    });
};






  