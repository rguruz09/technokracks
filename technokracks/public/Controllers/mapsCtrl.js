/**
 * http://usejsdoc.org/
 */


 var sampleApp = angular.module('myApp', []);
 sampleApp.controller('MapCtrl', function ($rootScope,$scope, $http, $window) {
        console.log('Inside controller');

		$window.map = new google.maps.Map(document.getElementById('map'), {
        	center: {
            	lat: 39.849312,
            	lng: -104.673828
        	},
        	zoom: 4
   		});


 });