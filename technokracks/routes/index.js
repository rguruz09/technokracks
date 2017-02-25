
var http = require('http');
var btoa = require('btoa');
var request = require('request');
var fs = require("fs");


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};



var getToken = function(callback){

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
			callback("error", null);
		}else{
			callback(null, response);
		}		
	});
  
};

exports.getTopology = function(req, res){
	
	getToken(function(err,result){
		
		if(result){

			//var token = "vfhLJ9CNrppeyCE2aeHMQQOA0GUjoPcD8tsp+rvYCh0=";
			var token = JSON.parse(result.body).access_token;
			var type = JSON.parse(result.body).token_type;
			
			request({
				url: 'https://10.10.2.29:8443/NorthStar/API/v2/tenant/1/topology/1',
				rejectUnauthorized : false,
				method: 'GET',
				headers: {
				    //'Authorization': 'Bearer vfhLJ9CNrppeyCE2aeHMQQOA0GUjoPcD8tsp+rvYCh0=',
					'Authorization': type + " " + token,
				    'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}, function(err, response){
				if(err){
					console.log(err);
				}else{
					console.log(response.body);
					
					var routers = [];
					var n = JSON.parse(response.body).nodes;
					
					for(var i=0; i<n.length; i++){
						var nodes = {};
						
						nodes.id = n[i].id;
						nodes.nodeIndex = n[i].nodeIndex;
						nodes.nodeIndex = n[i].nodeIndex;
						nodes.hostName = n[i].hostName;
						
						var coordinates = {
								latitude : n[i].topology.coordinates.coordinates[0],
								longitude : n[i].topology.coordinates.coordinates[1]
						};
						nodes.coordinate = coordinates;
						routers.push(nodes);
					}
					
					fs.writeFile( "./Data/routers.json", JSON.stringify( routers ), "utf8", function(){
						
						
						var l = JSON.parse(response.body).links;
						var linkarray = [];
						
						for(i=0;i<l.length;i++){
							var links = {};
							links.id = l[i].id;
							links.operationalStatus = l[i].operationalStatus;
							links.linkIndex = l[i].linkIndex;
							links.interfaceA = l[i].endA.ipv4Address.address;
							links.interfaceZ = l[i].endZ.ipv4Address.address;
							links.nodeA = l[i].endA.node.id;
							links.nodeZ = l[i].endZ.node.id;
							linkarray.push(links);
						}
						
						fs.writeFile( "./Data/links.json", JSON.stringify( routers ), "utf8", function(){
							res.send({
								status : 200,
								nodes : routers,
								links : linkarray
							});
							
						});
						
					} );	
				}		
				
			});
			
		
		}else{
			res.send({
				status : 420
			});
		}
		
	});
};