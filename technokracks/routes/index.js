
/*
 * GET home page.
 */
var http = require('http');
var btoa = require('btoa');
var request = require('request');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


exports.getToken1 = function(req, res){

	console.log("getToken");
	var auth = btoa(JSON.stringify("group2:technokracks"));
	var options = {
  		host: '10.10.2.29',
  		port: 8443,
  		path: '/oauth2/token',
  		method: 'POST',
  		headers: {
    		'Content-Type': 'application/x-www-form-urlencoded',
    		'Authorization': 'Basic ' + auth
  		}
	};

	http.request(options, function(err, response){
		if(err){
			console.log("Error");
		}else{
			console.log(response);
		}
		res.render('index', { title: 'Express' });
	});
	
  
};

exports.getToken = function(req, res){

	request({
		url: 'https://10.10.2.29:8443/oauth2/token',
		rejectUnauthorized : false,
		method: 'POST',
		auth: {
			username : 'group2',
			password: 'technokracks'
		},
		form : {
			'grant_type' : 'password',
			 'username' : 'group2',
			 'password': 'technokracks'
		}
	}, function(err, response){
		if(err){
			console.log(err);
		}else{
			console.log(response.body);
		}		res.send(response.body);
	});
  
};


exports.getTopology = function(req, res){
	
	var token = "vfhLJ9CNrppeyCE2aeHMQQOA0GUjoPcD8tsp+rvYCh0=";
	
	request({
		url: 'https://10.10.2.29:8443/NorthStar/API/v2/tenant/1/topology/1',
		rejectUnauthorized : false,
		method: 'GET',
		headers: {
		    'Authorization': 'Bearer vfhLJ9CNrppeyCE2aeHMQQOA0GUjoPcD8tsp+rvYCh0=',
		    'Content-Type' : 'application/x-www-form-urlencoded'
		}
	}, function(err, response){
		if(err){
			console.log(err);
		}else{
			console.log(response.body);
		}		res.send(response.body);
	});
}