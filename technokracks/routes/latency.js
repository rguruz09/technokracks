var redis = require('redis');
var fs = require("fs");

var client = redis.createClient(6379, '10.10.4.252');

client.on('connect', function() {
    console.log('connected');
});

var san_francisco_los_angeles;
var tampa_newyork;
var houston_los_angeles;
var dallas_los_angeles;
var tampa_houston;
var houston_miami;
var newyork_miami;
var dallas_miami;
var dallas_houston;
var chicago_newyork;
var chicago_dallas;
var chicago_miami;
var tampa_miami;
var san_francisco_dallas;
var san_francisco_chicago;

client.lrange('san francisco:los angeles:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      san_francisco_los_angeles = d["rtt-average(ms)"];
    }
});

client.lrange('tampa:new york:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      tampa_newyork = d["rtt-average(ms)"];
    }
});

client.lrange('houston:los angeles:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      houston_los_angeles = d["rtt-average(ms)"];
    }
});

client.lrange('dallas:los angeles:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      dallas_los_angeles = d["rtt-average(ms)"];
    }
});

client.lrange('tampa:houston:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      tampa_houston = d["rtt-average(ms)"];
    }
});

client.lrange('houston:miami:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      houston_miami = d["rtt-average(ms)"];
    }
});

client.lrange('tampa:miami:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      tampa_miami = d["rtt-average(ms)"];
    }
});

client.lrange('new york:miami:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      newyork_miami = d["rtt-average(ms)"];
    }
});

client.lrange('dallas:miami:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      dallas_miami = d["rtt-average(ms)"];
    }
});

client.lrange('dallas:houston:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      dallas_houston = d["rtt-average(ms)"];
    }
});

client.lrange('chicago:new york:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      chicago_newyork = d["rtt-average(ms)"];
    }
});

client.lrange('chicago:dallas:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      chicago_dallas = d["rtt-average(ms)"];
    }
});

client.lrange('chicago:miami:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      chicago_miami = d["rtt-average(ms)"];
    }
});

client.lrange('san francisco:dallas:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      san_francisco_dallas = d["rtt-average(ms)"];
    }
});

client.lrange('san francisco:chicago:latency', 0, 0, function(err, reply) {
    if(reply){
      var d = JSON.parse(reply);
      console.log(d["rtt-average(ms)"]);
      san_francisco_chicago = d["rtt-average(ms)"];
    }
});
