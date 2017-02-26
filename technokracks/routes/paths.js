var http = require('http');
var btoa = require('btoa');
var request = require('request');
var fs = require("fs");
var index = require("./index");


var getNodes = function(callback){
	
	var jsonData = JSON.parse(fs.readFileSync('./Data/routers.json', 'utf8'));
	var nodes = [];
	
	for(var i=0; i<jsonData.length; i++){
		var val = {};
		val.hostName = jsonData[i].hostName;
		val.coordinate = jsonData[i].coordinate;
		nodes[jsonData[i].id] = val;
	}
	
	
	callback(nodes);
}

exports.getAllPaths = function(req, res){
	
//	if (!fs.existsSync('./Data/routers.json')) {
//		index.getTopology()
//	}
//	
	
	
	res.send(nodes+" ");
}

exports.getRouterMap = function(req, res){
	
	getNodes(function(result){
		res.send({
			status : 200,
			data : result
		});
	});	
	
};
