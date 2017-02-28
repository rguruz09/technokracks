var redis = require('redis');
var fs = require("fs");

var client = redis.createClient(6379, '10.10.4.252'); 

client.on('connect', function() {
    console.log('connected');
});


client.subscribe("link_event");

client.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
    
    var sts = JSON.parse(message).status;
    
    if(sts == 'failed'){
    	fs.writeFile( "../Data/failedLinks.json", message, "utf8", function(err){
        	if(err){
        		console.log(err);
        	}
        	console.log("FAIL :"+message);
        });
    }else{
    	console.log("healed :"+message);
    	fs.writeFile( "../Data/failedLinks.json", message, "utf8", function(err){
        	if(err){
        		console.log(err);
        	}
        	console.log("FAIL :"+message);
        });
    }
    
    
});



client.on('error', function() {
    console.log('error');
});


