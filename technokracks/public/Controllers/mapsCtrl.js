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

SDNControllerApp.service('LSPServices', function() {	
	var LSP;
	return{
		set : function(t){
			LSP = t;
		},
		get :  function(){
			return LSP;
		}
	};
});


SDNControllerApp.service('LSPLinksServices', function() {	
	var LSPLinks;
	return{
		set : function(t){
			LSPLinks = t;
		},
		get :  function(){
			return LSPLinks;
		}
	};
});


SDNControllerApp.service('mapNodeToLinkServices', function() {	
	var mapNodeToLink;
	return{
		set : function(t){
			mapNodeToLink = t;
		},
		get :  function(){
			return mapNodeToLink;
		}
	};
});

SDNControllerApp.service('polyLineServices', function() {	
	var poly;
	return{
		set : function(t){
			poly = t;
		},
		get :  function(){
			return poly;
		}
	};
});


SDNControllerApp.service('failedServices', function() {	
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

SDNControllerApp.service('flines', function() {	
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


SDNControllerApp.controller('MapCtrl', function ($rootScope,$interval,$scope, $http, $window, 
		failedServices, tokenService, routerService, LinkService, mapNodeToLinkServices, 
		GraphService, PathsService, polyLineServices, LSPLinksServices, flines) {
        console.log('Inside controller');
        
        
        var mapNodes = [];
        var mapLinks = [];
        var mapgraph = {};
        var mapNodeToLink = [];
        var lsps_all = [];
        
        var map;
        
        var healMe = function(){
        	var lines = flines.get();
        	for(var o in lines){
        		//stopCircle(lines[o]);
        		var ll = lines[o];
        		ll.setMap(null);
        		ll.setVisible(false);
        		ll=null;
        		flines.set([]);
        	}
        };
        
        var updateLSPAfter = function(){
        	
        	var failed = failedServices.get();
        	var lsps = LSPLinksServices.get();
        	var lines = polyLineServices.get();
        	var curEro;
        	var c ={};
        	var nA;
			var nZ;
			
			
        	for(var i=0; i<lsps.length; i++){
        		
        		var typ = lsps[i].cur;
        		
        		if(typ == "P"){
        			curEro =  lsps[i].eroP;
        		}else{
        			curEro =  lsps[i].eroS;
        		}
        		
        		for(var j=0; j<curEro.length; j++){
        			if(failed.interface_address.includes(curEro[j].substring(0,10))){

        				var er; 
        				if(typ == "P"){
        					er = lsps[i].eroS;
        					lsps[i].cur = "S";        					
        				}else{
        					er = lsps[i].eroP;
        					lsps[i].cur = "P";
        				}
        				        				
        				var l=lines[lsps[i].name];
        				stopCircle(l);
        				l.setMap(null);
        				
        				var id = lsps[i].lspIndex;
        				        				
        				if(id >= 85 && id <= 88){
            				c.color = "#228B22";
            				c.strokeWeight = 5;
            				c.strokeOpacity = 0.2;
            			}
            			else{
            				c.color = "#e2cd81";
            				c.strokeWeight = 12;
            				c.strokeOpacity = 0.8;
            			}
            			
        				var myPath1 = [];
        				for( var q=0; q<er.length; q++){
        					for(var p=1; p<mapLinks.length; p++){
            					if(mapLinks[p].interfaceZ == er[q] || mapLinks[p].interfaceA == er[q]){
            				
        	  						if(mapLinks[p].interfaceZ == er[q]  ){
        	  							nA = mapNodes[mapLinks[p].nodeA];
        		  						nZ = mapNodes[mapLinks[p].nodeZ];
        	  						}else{
        	  							nA = mapNodes[mapLinks[p].nodeZ];
        		  						nZ = mapNodes[mapLinks[p].nodeA];
        	  						}
        	  						
        	  						var dup = true;
        	  						
            						var pt = {};
        	  						pt.lat = nA.lat;
        	  						pt.lng = nA.lan;
        	  						myPath1.push(jQuery.extend(true, {}, pt));
        	  						
        	  						for(var xx=0; xx<myPath1.length; xx++){
        	  							if(myPath1[xx].lat == pt.lat && myPath1[xx].lng == pt.lng){
        	  								dup = false;
        	  								break;
        	  							}
        	  						}
        	  						if(dup)
        	  							myPath1.push(jQuery.extend(true, {}, pt));
        	  						
        	  						dup = true;
        	  						var pt1 = {};
        	  						pt1.lat = nZ.lat;
        	  						pt1.lng = nZ.lan;
        	  						myPath1.push(jQuery.extend(true, {}, pt1));
            						
        	  						for(var xx=0; xx<myPath1.length; xx++){
        	  							if(myPath[xx].lat == pt1.lat && myPath[xx].lng == pt1.lng){
        	  								dup = false;
        	  								break;
        	  							}
        	  						}
        	  						if(dup)
        	  							myPath1.push(jQuery.extend(true, {}, pt1));
            						break;
            					}      
            					
            				}
        				}
        				
        				var ln = drawLine(myPath1,c,map);
              			//lines.push(line);
              			lines[lsps[i].name] = ln;
              			polyLineServices.set(lines);
              			
        				$http({
        	    	  		method : 'post',
        	    	  		url : '/updateLSP',
        	    	  		data : {							
        						"lspIndex" : lsps_all[i].lspIndex,
        						"to" : lsps_all[i].to,
        						"from" : lsps_all[i].from,
        						"ero" : er.toString(),
        						"name" : lsps_all[i].name
        					}
        	    	  	}).success(function(data) {
        	    	  		
        	    	  	});
        				
        			}
        		}
        	}
        	
        	for(var p=1; p<mapLinks.length; p++){
        		var myPath2 = [];
				if(mapLinks[p].interfaceZ == failed.interface_address || mapLinks[p].interfaceA == failed.interface_address){
						
					if(mapLinks[p].interfaceZ == failed.interface_address  ){
						nA = mapNodes[mapLinks[p].nodeA];
						nZ = mapNodes[mapLinks[p].nodeZ];
					}else{
						nA = mapNodes[mapLinks[p].nodeZ];
						nZ = mapNodes[mapLinks[p].nodeA];
					}
						
					var pt = {};
					pt.lat = nA.lat;
					pt.lng = nA.lan;
					myPath2.push(jQuery.extend(true, {}, pt));
					
					var pt1 = {};
					pt1.lat = nZ.lat;
					pt1.lng = nZ.lan;
					myPath2.push(jQuery.extend(true, {}, pt1));
					
	        		c.color = "#0000FF";
					c.strokeWeight = 16;
					c.strokeOpacity = 0.8;
				
	        		var ln = drawLine1(myPath2,c,map);
	        		lns = [];
	        		lns.push(ln);
	        		flines.set(lns);
					
				}      
				
			}
        	
        }
        
        var updateExample = function(){
        	console.log("getFailedLinks");
//        	make API Call here
    		$http({
    	  		method : 'get',
    	  		url : '/getFailedLinks',
    	  	}).success(function(data) {
    	  		if(data.status == 200){
    	  			
    	  			var d = data.data;
    	  			var result = {};
    	  			result.status = d.status;
    	  			result.interface_address = d.interface_address; 
    	  			
    	  			if(result.status == "failed"){
    	  				failedServices.set(result);
    	  				updateLSPAfter();
    	  			}else{
    	  				healMe();
    	  			}
    	  			
    	  			
    	  		}
    	  	});
        };
        
               
     
	 
        $scope.getTopology = function(){
        	console.log('Inside getTopology');
        	map = new google.maps.Map(document.getElementById('map'), {
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
    		  		
    		  		mapNodeToLinkServices.set(mapNodeToLink);
    		  		console.log(mapgraph);
    		  		console.log(mapLinks);
    		  		LinkService.set(mapLinks);
    		  		GraphService.set(mapgraph);
    		  		var p = getAllPath(mapgraph);
    		  		
    		  		var linkrec = [];
    		  		for(var j=0; j<p.length; j++){
    		  			var linkRes = {};
    		  			var linkarray = [];
    		  			var linkarray2 = [];
    		  			linkRes.distance = 0;
    		  			for(var k=1; k<p[j].length; k++){
    		  				var dis = getDistance(mapNodes[p[j][k-1]].lat, mapNodes[p[j][k-1]].lan, mapNodes[p[j][k]].lat, mapNodes[p[j][k]].lan)
    		  				linkRes.distance = dis + linkRes.distance;
    		  				linkarray.push(mapNodeToLink[p[j][k-1]+"_"+p[j][k]]);
    		  				linkarray2.push(mapNodeToLink[p[j][k]+"_"+p[j][k-1]]);
    		  			}
    		  			linkRes.path = p[j];
    		  			linkRes.links = linkarray;
    		  			linkRes.links2 = linkarray2;
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
        }
        
        
        $scope.loadLSP = function(){
        	
        	console.log("inside load LSP");
        	var len;
        	
    		$http({
    	  		method : 'get',
    	  		url : '/getMyLSPs',
    	  	}).success(function(data) {
    	  		
    	  		if(data.status == 200){
    	  			
    		  		$scope.allLSP = data.data;
    		  		len = $scope.allLSP.length;
    		  		
    		  		var lines = [];
    		  		polyLineServices.set(lines);
    		  		
    		  		for(var i=0; i<$scope.allLSP.length; i++){
    		  			var each_lsp ={};
    		  			each_lsp.name = $scope.allLSP[i].name;
    		  			each_lsp.from = $scope.allLSP[i].from;
    		  			each_lsp.to = $scope.allLSP[i].to;
    		  			each_lsp.lspIndex = $scope.allLSP[i].lspIndex;
    		  			each_lsp.eroP = $scope.allLSP[i].ero.slice();
    		  			each_lsp.eroS = $scope.allLSP[i].ero.slice();
    		  			each_lsp.eroB = $scope.allLSP[i].ero.slice();
    		  			
    		  			
    		  			myPath = [];
    		  			for(var j=0; j<$scope.allLSP[i].ero.length; j++){
    		  				var interfaceip = $scope.allLSP[i].ero[j];
    		  				
    		  				
    		  				for(var k=1; k<mapLinks.length; k++){
    		  					if(mapLinks[k ].interfaceA == interfaceip || mapLinks[k].interfaceZ == interfaceip ){
    		  						var nodeA;
    		  						var nodeB;
    		  						if(mapLinks[k ].interfaceA == interfaceip ){
    		  							nodeA = mapNodes[mapLinks[k].nodeZ];
        		  						nodeB = mapNodes[mapLinks[k].nodeA];
    		  						}else{
    		  							nodeA = mapNodes[mapLinks[k].nodeA];
        		  						nodeB = mapNodes[mapLinks[k].nodeZ];
    		  						}
    		  						
    		  						
    		  						var color = {};
    		  						if($scope.allLSP[i].lspIndex >= 41 && $scope.allLSP[i].lspIndex <= 44){
    		  							color.color = "#e2cd81";
    		  							color.strokeWeight = 12;
    		  							color.strokeOpacity = 1;
    		  						}
    		  						else{
    		  							color.color = "#228B22";
    		  							color.strokeWeight = 5;
    		  							color.strokeOpacity = 0.2;
    		  						}
    		  						var pt = {};
    		  						pt.lat = nodeA.lat;
    		  						pt.lng = nodeA.lan;
    		  						
    		  						var dup = true;
    		  						for(var xx=0; xx<myPath.length; xx++){
    		  							if(myPath[xx].lat == pt.lat && myPath[xx].lng == pt.lng){
    		  								dup = false;
    		  								break;
    		  							}
    		  						}
    		  						if(dup)
    		  							myPath.push(jQuery.extend(true, {}, pt));
    		  						
    		  						var pt1 = {};
    		  						pt1.lat = nodeB.lat;
    		  						pt1.lng = nodeB.lan;
    		  						
    		  						dup = true;
    		  						for(var xx=0; xx<myPath.length; xx++){
    		  							if(myPath[xx].lat == pt1.lat && myPath[xx].lng == pt1.lng){
    		  								dup = false;
    		  								break;
    		  							}
    		  						}
    		  						if(dup)
    		  							myPath.push(jQuery.extend(true, {}, pt1));
    		  						
    		  						break;
    		  						//drawLine(nodeA.lat,nodeA.lan,nodeB.lat,nodeB.lan,color,map);
    		  					}
    		  				}
    		  			}
    		  			var line = drawLine(myPath,color,map);
    		  			lines = polyLineServices.get();
    		  			//lines.push(line);
    		  			lines[$scope.allLSP[i].name] = line;
    		  			polyLineServices.set(lines);
    		  			
    		  			lsps_all.push(each_lsp);
    		  		}
    		  		
    		  		console.log(PathsService.get());
    		  		
    	  		}else{
    	  			 console.log("Something wrong");
    	  		}
    	  		
    	  	});
        	
        	
        
        	
        }
        
        //update the LSPs path
        $scope.updateLSPLinks = function(){
        	
        	var lines = polyLineServices.get();
        	
//        	for(var o=0; o<lines.length; o++){
//        		lines[o].setMap(null);
//        	}
        	
        	
        	for(var o in lines){
        		lines[o].setMap(null);
        	}
        	
        	polyLineServices.set([]);
        	
        	var len = lsps_all.length;
        	var reIndex = 0;
    		for(var i=0; i<len; i++){
    			reIndex = i%4;
    			var c = {};
    			
    			var er;
    			
    			if(lsps_all[i].lspIndex >=	85 && lsps_all[i].lspIndex <= 88){
    				er= PathsService.get()[reIndex].links.slice();
    				c.color = "#228B22";
    				c.strokeWeight = 5;
    				c.strokeOpacity = 0.2;
    			}
    				
    			else{
    				er= PathsService.get()[reIndex].links2.slice().reverse();
    				c.color = "#e2cd81";
    				c.strokeWeight = 12;
    				c.strokeOpacity = 0.8;
    			}
    				
    			
				lsps_all[i].eroP = er;
				var nA;
				var nZ;
				myPath = [];
				
				for( var q=0; q<er.length; q++){
					for(var p=1; p<mapLinks.length; p++){
    					if(mapLinks[p].interfaceZ == er[q] || mapLinks[p].interfaceA == er[q]){
    				
	  						if(mapLinks[p].interfaceZ == er[q]  ){
	  							nA = mapNodes[mapLinks[p].nodeA];
		  						nZ = mapNodes[mapLinks[p].nodeZ];
	  						}else{
	  							nA = mapNodes[mapLinks[p].nodeZ];
		  						nZ = mapNodes[mapLinks[p].nodeA];
	  						}
	  						
	  						
	  						var dup = true;
	  						
    						var pt = {};
	  						pt.lat = nA.lat;
	  						pt.lng = nA.lan;
	  						myPath.push(jQuery.extend(true, {}, pt));
	  						
	  						for(var xx=0; xx<myPath.length; xx++){
	  							if(myPath[xx].lat == pt.lat && myPath[xx].lng == pt.lng){
	  								dup = false;
	  								break;
	  							}
	  						}
	  						if(dup)
	  							myPath.push(jQuery.extend(true, {}, pt));
	  						
	  						dup = true;
	  						var pt1 = {};
	  						pt1.lat = nZ.lat;
	  						pt1.lng = nZ.lan;
	  						myPath.push(jQuery.extend(true, {}, pt1));
    						
	  						for(var xx=0; xx<myPath.length; xx++){
	  							if(myPath[xx].lat == pt1.lat && myPath[xx].lng == pt1.lng){
	  								dup = false;
	  								break;
	  							}
	  						}
	  						if(dup)
	  							myPath.push(jQuery.extend(true, {}, pt1));
    						break;
    					}      
    					
    				}
				}
				
				
				$http({
	    	  		method : 'post',
	    	  		url : '/updateLSP',
	    	  		data : {							
						"lspIndex" : lsps_all[i].lspIndex,
						"to" : lsps_all[i].to,
						"from" : lsps_all[i].from,
						"ero" : lsps_all[i].eroP.toString(),
						"name" : lsps_all[i].name
					}
	    	  	}).success(function(data) {
	    	  		
	    	  	});
				
				saPath = polyLineServices.get();
				
				var l = drawLine(myPath,c,map);
				saPath[lsps_all[i].name] = l;
				polyLineServices.set(saPath);
				console.log(mapNodeToLinkServices.get());
    		}
    		
    		
    		for(var i=0; i<len; i++){
    			
    			for(var x=4; x<PathsService.get().length; x++){
    				var found = true;
    				if(lsps_all[i].lspIndex >=	85 && lsps_all[i].lspIndex <= 88){
    					for(var y=0; y<PathsService.get()[x].links.length; y++){
    						if(lsps_all[i].eroP.indexOf(PathsService.get()[x].links[y]) >= 0){
    							found = false;
    							break;
    						}            	    						
	    				}
    					if(found)
    						er= PathsService.get()[x].links.slice();
	    			}            	    				
	    			else{
	    				
	    				for(var y=0; y<PathsService.get()[x].links2.length; y++){
    						if(lsps_all[i].eroP.indexOf(PathsService.get()[x].links2[y]) >= 0){
    							found = false;
    							break;
    						}            	    						
	    				}
    					if(found)
    						er= PathsService.get()[x].links2.slice().reverse();
	    			}   
    			}
    			         	    				
    			
				lsps_all[i].eroS = er;
				lsps_all[i].cur = "P";
				console.log(mapNodeToLinkServices.get());
    		}
    		
    		console.log(lsps_all);
    		
    		LSPLinksServices.set(lsps_all);
    		console.log(LSPLinksServices.get());
        	$interval(updateExample, 10000);
        	
        	/*
        	
    		$http({
    	  		method : 'get',
    	  		url : '/getMyLSPs',
    	  	}).success(function(data) {
    	  		
    	  		if(data.status == 200){
    	  			
    		  		$scope.allLSP = data.data;
    		  		len = $scope.allLSP.length;
    		  		for(var i=0; i<$scope.allLSP.length; i++){
    		  			var each_lsp ={};
    		  			each_lsp.name = $scope.allLSP[i].name;
    		  			each_lsp.from = $scope.allLSP[i].from;
    		  			each_lsp.to = $scope.allLSP[i].to;
    		  			each_lsp.lspIndex = $scope.allLSP[i].lspIndex;
    		  			each_lsp.eroP = $scope.allLSP[i].ero.slice();
    		  			each_lsp.eroS = $scope.allLSP[i].ero.slice();
    		  			each_lsp.eroB = $scope.allLSP[i].ero.slice();
    		  			
    		  			for(var j=0; j<$scope.allLSP[i].ero.length; j++){
    		  				var interfaceip = $scope.allLSP[i].ero[j];
    		  				
    		  				for(var k=1; k<mapLinks.length; k++){
    		  					if(mapLinks[k ].interfaceA == interfaceip || mapLinks[k].interfaceZ == interfaceip ){
    		  						var nodeA = mapNodes[mapLinks[k].nodeA];
    		  						var nodeB = mapNodes[mapLinks[k].nodeZ];
    		  						
    		  						var color = {};
    		  						if($scope.allLSP[i].lspIndex >= 41 && $scope.allLSP[i].lspIndex <= 44){
    		  							color.color = "#e2cd81";
    		  							color.strokeWeight = 12;
    		  							color.strokeOpacity = 1;
    		  						}
    		  						else{
    		  							color.color = "#228B22";
    		  							color.strokeWeight = 2;
    		  							color.strokeOpacity = 0.2;
    		  						}
    		  						drawLine(nodeA.lat,nodeA.lan,nodeB.lat,nodeB.lan,color,map);
    		  					}
    		  				}
    		  			}
    		  			lsps_all.push(each_lsp);
    		  		}
    		  		
    		  		console.log(PathsService.get());
    	    		
    		  		
    		  		
    		  		
    	    		for(var i=0; i<len; i++){
    	    			
    	    			var er;
    	    			  
    	    			for(var x=4; x<PathsService.get().length; x++){
    	    				var found = true;
    	    				if(lsps_all[i].lspIndex >=	85 && lsps_all[i].lspIndex <= 88){
    	    					for(var y=0; y<PathsService.get()[x].links.length; y++){
    	    						if(lsps_all[i].eroP.indexOf(PathsService.get()[x].links[y]) >= 0){
    	    							found = false;
    	    							break;
    	    						}            	    						
        	    				}
    	    					if(found)
    	    						er= PathsService.get()[x].links.slice();
        	    			}            	    				
        	    			else{
        	    				
        	    				for(var y=0; y<PathsService.get()[x].links2.length; y++){
    	    						if(lsps_all[i].eroP.indexOf(PathsService.get()[x].links2[y]) >= 0){
    	    							found = false;
    	    							break;
    	    						}            	    						
        	    				}
    	    					if(found)
    	    						er= PathsService.get()[x].links2.slice().reverse();
        	    			}   
    	    			}
    	    			         	    				
    	    			
	    				lsps_all[i].eroS = er;
	    				
	    				console.log(mapNodeToLinkServices.get());
    	    		}
    		  		
    		  		
    		  		
    	  		}else{
    	  			 console.log("Something wrong");
    	  		}
    	  		
    	  	});*/
        	
        	
        };
        
        
        
        
 });

function drawLine(mypath, c, map){
	
	var lineSymbol = {
		    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		    scale: 4,
		    strokeColor: "#000000"
		  };

	
	var line = new google.maps.Polyline({
		    path: mypath,
		    icons: [{
		        icon: lineSymbol,
		        offset: '100%'
		      }],
		    strokeColor: c.color,
		    strokeOpacity: c.strokeOpacity,
		    strokeWeight: c.strokeWeight,
		    map: map
		});
	animateCircle(line);
	return line;
};


function drawLine1(mypath, c, map){
	
	var lineSymbol = {
	          path: 'M 0,-1 0,1',
	          strokeOpacity: 1,
	          scale: 4
	        };
	
	var line = new google.maps.Polyline({
	    path: mypath,
	    icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '20px'
          }],
	    strokeColor: "ea0b29",
	    strokeOpacity: 0,
	    strokeWeight: 10,
	    map: map
	});
	return line;
}


function animateCircle(line) {
    var count = 0;
    window.setInterval(function() {
      count = (count + 1) % 200;

      var icons = line.get('icons');
      if(icons){
    	  icons[0].offset = (count / 2) + '%';
          line.set('icons', icons);
      }
  }, 20);
}

function stopCircle(line) {
    
    window.clearInterval(line.offsetId);
    line.setOptions({
    	icons:null
    });
}


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
		paths.push(path.slice());
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
