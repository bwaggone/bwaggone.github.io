'use strict';   // See note about 'use strict'; below
$(document).ready(function(){
	$('.parallax').parallax();
});

var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {

	$scope.readScore = function(allText) {
		var allTextLines = allText.split(/\r\n|\n/);
		var headers = allTextLines[0].split(',');
		var lines = [];
		for (var i = 1; i < allTextLines.length; i++) {
			// split content based on comma
			var data = allTextLines[i].split(',');
			if (data.length == headers.length) {
				var tarr = {
					name: data[0],
					mar: parseInt(data[1]),
					per: parseInt(data[2]),
					gr8: parseInt(data[3]),
					good: parseInt(data[4]),
					off: parseInt(data[5]),
					miss: parseInt(data[6]),
					diff: parseInt(data[7]),
					total: parseInt(data[8])
				};
				lines.push(tarr);
			}
		}

		$scope.scores = lines;
	}

	$http.get('./data/ddr.csv').success($scope.readScore);
});
