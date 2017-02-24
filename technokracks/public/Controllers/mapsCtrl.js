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
	}
});

SDNControllerApp.controller('MapCtrl', function ($rootScope,$scope, $http, $window, tokenService) {
        console.log('Inside controller');

		$window.map = new google.maps.Map(document.getElementById('map'), {
        	center: {
            	lat: 39.849312,
            	lng: -104.673828
        	},
        	zoom: 4
   		});

   		//var auth = $base64.encode("foo:bar"), 
   		var auth = btoa(JSON.stringify("group2:technokracks"));
    	header = {"Authorization": "Basic " + auth};

   		$http({
			method : 'post',
			url : 'https://10.10.2.29:8443/oauth2/token',
			data : {
				"username" : "group2",
				"password" : "technokracks",
				"grant_type" : "password"
			},
			headers : header
		}).then(function successCallback(response) {
			var t = {
				key : response.data.access_token,
				typ : response.data.token_type
			}

		    tokenService.set(t);
		    console.log("type ", tokenService.get().typ);
		    console.log("tokem ",tokenService.get().key);

			$http({
				method : 'get',
				url : 'https://10.10.2.29:8443/NorthStar/API/v2/tenant/1/topology/1/nodes',
				headers : {"Authorization": tokenService.get().typ+" "+tokenService.get().key},
				data : {
					"username" : "group2",
					"password" : "technokracks",
					"grant_type" : "password"
				}
				//headers : {"Authorization": "Bearer vfhLJ9CNrppeyCE2aeHMQQOA0GUjoPcD8tsp+rvYCh0="}
			}).then(function successCallback(response) {
					console.log(response.data.length);
			}, function errorCallback(response) {
		    		console.log("failure response");
			});


		}, function errorCallback(response) {
		    console.log(response);
		});


 });