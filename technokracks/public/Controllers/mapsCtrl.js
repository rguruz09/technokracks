/**
 * http://usejsdoc.org/
 */


var SDNControllerApp = angular.module('myApp', ['ngRoute']);

SDNControllerApp.service('tokenService', function() {
	var token = {
		key : "",
		typ : ""
	};
	return{
		set : function(t){
			token.key = t.key;
			token.typ = t.typ;
		},
		get :  function(){
			return token;
		}
	};
});

SDNControllerApp.service('routerService', function() {	
	var routers;
	return{
		set : function(t){
			routers = t;
		},
		get :  function(){
			return routers;
		}
	};
});

SDNControllerApp.service('LinkService', function() {	
	var links;
	return{
		set : function(t){
			links = t;
		},
		get :  function(){
			return links;
		}
	};
});

SDNControllerApp.service('GraphService', function() {	
	var graph;
	return{
		set : function(t){
			graph = t;
		},
		get :  function(){
			return graph;
		}
	};
});

SDNControllerApp.service('PathsService', function() {	
	var path;
	return{
		set : function(t){
			path = t;
		},
		get :  function(){
			return path;
		}
	};
});


SDNControllerApp.controller('MapCtrl', function ($rootScope,$scope, $http, $window, tokenService, routerService, LinkService, GraphService, PathsService) {
        console.log('Inside controller');

        
        var mapNodes = [];
        var mapLinks = [];
        var mapgraph = {};
        var mapNodeToLink = [];
        
		var map = new google.maps.Map(document.getElementById('map'), {
        	center: {
            	lat: 39.849312,
            	lng: -104.673828
        	},
        	zoom: 4
   		});
		
		$http({
	  		method : 'get',
	  		url : '/getTopology',
	  	}).success(function(data) {
	  		
	  		if(data.status == 200){
	  			
		  		$scope.allNodes = data.nodes;
		  		$scope.allLinks = data.links;
		  		
		  		for(var i=0; i<$scope.allNodes.length; i++){
		  			var x = $scope.allNodes[i].coordinate.latitude;
		  			var y = $scope.allNodes[i].coordinate.longitude;
		  			
		  			mapNodes[$scope.allNodes[i].id] = { lat : x, lan : y, hostName : $scope.allNodes[i].hostName, nodeIndex : $scope.allNodes[i].nodeIndex};
		  			
		  			var site = $scope.allNodes[i].hostName;
		  			
		  			var marker = new google.maps.Marker({
					      position: new google.maps.LatLng(x,y),
					      map: map,
					      label: site,
					      labelStyle: {opacity: 0},
					      //icon:'../imgs/rt.png'
					});
		  			
		  			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				         return function() {
				            console.log("Yes here: " + marker.label);
				         };
				    })(marker, i));	  			
		  		
		  		}
		  		
		  		routerService.set(mapNodes);
		  		
		  		console.log("hello "+ routerService.get());
		  		
		  		
		  		
		  		for(var i=0; i<$scope.allLinks.length; i++){
		  			
		  			var linksarr = {};
		  			
		  			var nodeA = $scope.allLinks[i].nodeA;
		  			var nodeB = $scope.allLinks[i].nodeZ;
		  			
		  			linksarr.id = $scope.allLinks[i].id;
		  			linksarr.operationalStatus = $scope.allLinks[i].operationalStatus;
		  			
		  			linksarr.interfaceA =  $scope.allLinks[i].interfaceA;
		  			linksarr.interfaceZ =  $scope.allLinks[i].interfaceZ;
		  			
		  			linksarr.nodeA =  nodeA;
		  			linksarr.nodeZ =  nodeB;
		  			
		  			mapNodeToLink[nodeA+"_"+nodeB] = $scope.allLinks[i].interfaceZ;
		  			mapNodeToLink[nodeB+"_"+nodeA] = $scope.allLinks[i].interfaceA;
		  			
		  			linksarr.distance = getDistance(mapNodes[nodeA].lat, mapNodes[nodeA].lan, mapNodes[nodeB].lat, mapNodes[nodeB].lan);
		  					
					var line = new google.maps.Polyline({
		  			    path: [
		  			        new google.maps.LatLng(mapNodes[nodeA].lat, mapNodes[nodeA].lan), 
		  			        new google.maps.LatLng(mapNodes[nodeB].lat, mapNodes[nodeB].lan)
		  			    ],
		  			    strokeColor: "#FF0000",
		  			    strokeOpacity: 0.5,
		  			    strokeWeight: 2,
		  			    map: map
		  			});
					
					mapLinks[$scope.allLinks[i].linkIndex] = linksarr;
					
					if(!( nodeA in mapgraph)){
						mapgraph[nodeA] = new Array();
					}
					mapgraph[nodeA].push(nodeB);
					
					if(! (nodeB in mapgraph)){
						mapgraph[nodeB] = new Array();
					}
					mapgraph[nodeB].push(nodeA);
					
		  		}
		  		console.log(mapgraph);
		  		console.log(mapLinks);
		  		LinkService.set(mapLinks);
		  		GraphService.set(mapgraph);
		  		var p = getAllPath(mapgraph);
		  		
		  		var linkrec = [];
		  		for(var j=0; j<p.length; j++){
		  			var linkRes = {};
		  			var linkarray = [];
		  			linkRes.distance = 0;
		  			for(var k=1; k<p[j].length; k++){
		  				var dis = getDistance(mapNodes[p[j][k-1]].lat, mapNodes[p[j][k-1]].lan, mapNodes[p[j][k]].lat, mapNodes[p[j][k]].lan)
		  				linkRes.distance = dis + linkRes.distance;
		  				linkarray.push(mapNodeToLink[p[j][k-1]+"_"+p[j][k]]);
		  			}
		  			linkRes.path = p[j];
		  			linkRes.links = linkarray;
		  			linkrec.push(linkRes);
		  			
		  		}
		  		
		  		for(var v=0; v<linkrec.length; v++){
					for(var s=i+1; s<linkrec.length; s++){
						if(linkrec[v].distance>linkrec[s].distance){
							var temp = linkrec[v];
							linkrec[v] = linkrec[s];
							linkrec[s] = temp;
						}
					}
				}
		  		
		  		PathsService.set(linkrec);
		  		console.log(PathsService.get());
		  		
		  		
		  		
	  		}else{
	  			 console.log("Something wrong");
	  		}
	  		
	  	});
 });

var paths = [];

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function getDistance(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}


function getAllPath(graph){
	
	var visited = [];
	var path = [];
	//var paths = [];
	
	for(var node in graph){
		visited[node] = false;
	}
	
	getAllPathUtils("10.210.10.100", "10.210.10.118", visited, path, graph);
	
	return (paths);
	
}

function getAllPathUtils(u, d, visited, path,  graph){
	
	visited[u] = true;
	path.push(u);
	
	if(u === d){
//		var newarr = new Array();
//		newarr.push(path);
		paths.push(path.slice());
//		console.log(path);
	}else{
		for(var i = 0; i< graph[u].length; i++){
			if(visited[graph[u][i]] == false){
				getAllPathUtils(graph[u][i], d, visited, path,  graph)
			}
		}
	}
	path.pop();
	visited[u] = false;
	
	//return paths;
}
