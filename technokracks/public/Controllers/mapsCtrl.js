/**
 * http://usejsdoc.org/
 */


var SDNControllerApp = angular.module('myApp', ['ngRoute']);

SDNControllerApp.service('tokenService', function() {
	var token = {
		key : "",
		typ : ""
	}
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

SDNControllerApp.controller('MapCtrl', function ($rootScope,$scope, $http, $window, tokenService) {
        console.log('Inside controller');

        
        var mapNodes = [];
        
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
		  			
		  			mapNodes[$scope.allNodes[i].id] = { lat : x, lan : y};
		  			
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
		  		
		  		
		  		for(var i=0; i<$scope.allLinks.length; i++){
		  			
		  			var nodeA = $scope.allLinks[i].nodeA;
		  			var nodeB = $scope.allLinks[i].nodeZ;
		  					
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
		  		}
	  			
	  		}else{
	  			 console.log("Something wrong");
	  		}
	  		
	  	});
		

 });