var http = require("http");
var sys = require('sys');
var _ = require('underscore');
var querystring = require('querystring');
var json2csv = require('json2csv');

var resource = require('./resource'); 
/*
 * GET home page.
 */
 
function index(req, res){
  res.render('index', { title: 'restapi' });
}

/**
 * Set up custom product service
*/
 
module.exports = function(app, options) {
		
 app.get('/', index);
  //no mongo
 //resource.setup(app, options);

 app.get('/products', function(req, res, next){
	 
	   if(_.isEmpty(req.query) ){
			res.render('products');
		}
	   
	
		var queryObj = new Object();
		var keywordQuery;
		var requestString =""; 

		if(req.query.keyword || req.query["maximum-price"] || req.query["minimum-price"] || req.query["new"]){
			var attrs = new Array();
			var itemsToRemove = new Array();
			if(_.has(req.query,"keyword")){
				console.log("keyword: " + "(" + req.query.keyword + ")");
				keywordQuery = "search=" + req.query.keyword;			
				attrs.push(keywordQuery);
				itemsToRemove.push("keyword");				
			}

			if(req.query["maximum-price"]){
				var maxprice = "regularPrice<" + req.query["maximum-price"];
				attrs.push(maxprice);
				itemsToRemove.push("minimum-price");
			}

			if(req.query["minimum-price"]){
				var minprice ="regularPrice>"+ req.query["minimum-price"];
				attrs.push(minprice);
				itemsToRemove.push("maximum-price");
			}

			if(_.has(req.query,"new")){
				var newitem ="new="+ req.query["new"];

			}
			
			if(_.has(req.query, "marketplace")){
				var marketplace ="marketplace="+ req.query["marketplace"];
				attrs.push(marketplace);
				itemsToRemove.push("marketplace");
			}

			var join = attrs.join("&");
			//remove the above formatted items...
			queryObj = _.omit(req.query, itemsToRemove);
			
			//configure the query string...
			requestString = "("+ join + ")?";

		}else{
			queryObj = req.query;
			requestString="?";
		}
		
		//merge in the rest of the options for the request.
		if(_.has(queryObj,"per-page")){
			requestString+="&pageSize=" + queryObj["per-page"];
		}else{
			requestString+="&pageSize=100";
		}
		if(_.has(queryObj,"page")){
			requestString+="&page=" + queryObj["page"];
		}else{
			requestString+="&page=1";
		}		
		if(_.has(queryObj,"format")){
			//just get json anyway and package it same as json data
			requestString+="&format=json";
		}else{
			requestString+="&format=json";
		}

		requestString+="&apiKey=ptafrhg64xq5gjete2pz9xfm";
	/*
	//example fro api
	(search=camera&salePrice<500)?apiKey=ptafrhg64xq5gjete2pz9xfm&sort=regularPrice.asc&show=url&format=json'
	*/	
	
		//for development
	/*	console.log("query: ");
		console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
		console.log(requestString);
		console.log("XXXXXXXXXXXXXXXXXXXXXXXX"); */

		//build the request options
		var ConfigOptions = {
		  host: 'api.remix.bestbuy.com',
		  path: '/v1/products'+requestString,
		  port: '80',
		  headers:{'Accept': 'application/json'}
		};	
		
		//make a get request to the api
		http.get(ConfigOptions, function(response) {

			var data = "";

		    response.on("data", function (chunk) {
		        data += chunk;
		    });

		    response.on("end", function () {			        					

				var jsonObj = JSON.parse(data);
											
				var jsonArray = _.map(jsonObj.products, function(value){

						return {
							"price": value.regularPrice,
							"image": value.image,
							"url": value.url,
							};
					
				},this);
				
				
				//wrap up the array as products with pagination info...
				
				var jsonresponse = {
					"products":jsonArray,
					"currentPage": jsonObj.currentPage,
				  	"totalPages": jsonObj.totalPages,
				}
								
				//check if this should be csv or json...
				
				if(_.has(queryObj, "format")){
					if(queryObj.format === "csv"){
						
					json2csv({data: jsonArray, fields: ['price', 'image', 'url']}, function(err, csv) {
						  if (err) console.log(err);
						 res.setHeader('Content-disposition', 'attachment; filename=products.csv');
						 res.setHeader('Content-type', 'text/plain');
						  	res.send(csv);
						});
					
					}else{
					//parse the response from the api
					res.setHeader('Content-Type', 'application/json');				
					res.send(jsonresponse);
					 
					}
				}
						
				/*
				not using mongo or mongoose.
				var mongoModel = options.mongoose.model("products");				
				*/

				
			   /* mongoModel.create(jsonObj, function (err, obj) {
			      if (err) {
			        console.log(err);
			        res.send(500, err);
			      }
			      else {
			        res.send(200, obj);
			      }
			    }); */

			});

	}).on('error', function(err) {
		  console.log('ERROR: ' + err.message);
		  return next(err);
		});
	
	
});


};
