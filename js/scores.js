'use strict';   // See note about 'use strict'; below
$(document).ready(function(){
	$('.parallax').parallax();
});

var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {

	$scope.getPercent = function(x) {
		return ((x.mar + x.per) / x.total)*100;
	};

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
					grade: parseFloat(data[8])
				};
				lines.push(tarr);
			}
		}

		$scope.scores = lines;
	}

	var pullSongData = function(xmlItem, playerName, minScore){
		var _dir = xmlItem.parentNode.getAttribute('Dir');
		var _split = _dir.split('/');
		var songName = _split[_split.length - 2];

		var _songHighScore = xmlItem.firstElementChild.firstElementChild
		if(_songHighScore.children.length === 0){
			return false;
		}
		var grade = _songHighScore.children[1].innerHTML;
		var name = _songHighScore.children[6].innerHTML;
		var percentdp = _songHighScore.children[7].innerHTML;
		var tapNoteScores = _songHighScore.children[13].children;

		if(name !== playerName || percentdp < minScore)
			return false;

		var boo = tapNoteScores[1].innerHTML;
		var miss = tapNoteScores[6].innerHTML;
		var good = tapNoteScores[2].innerHTML;
		var great = tapNoteScores[3].innerHTML;
		var perfect = tapNoteScores[7].innerHTML;
		var marvelous = tapNoteScores[5].innerHTML;

		var datum = {
			name: songName,
			mar: marvelous,
			per: perfect,
			gr8: great,
			good: good,
			off: boo,
			miss: miss,
			diff: grade,
			grade: percentdp*100
		}
		return datum;


	}

	$scope.readXML = function(xmlString) {
		var xmlDoc = jQuery.parseXML(xmlString);
		var xml = $( xmlDoc );
		var allScores = document.evaluate('/Stats/SongScores/*/Steps[@Difficulty="Hard" and @StepsType="dance-single"]', xmlDoc, null, XPathResult.ANY_TYPE);
                var item = allScores.iterateNext();
		while(item != null){
			var output = pullSongData(item, "BAW", 0.95);
			if(output !== false)
				$scope.scores.push(output);
				console.log(output);

			item = allScores.iterateNext();
		}
							      

		/*xml.find( "SongScores" ).children().each(function(){
			try{
				console.log(this);
				var singleCharts = $( this ).find('Steps');
				var highScore = $( this ).find('HighScore');
				var grade = highScore[0].children.item(1);
				var name = highScore[0].children.item(6);
				var percentdp = highScore[0].children.item(7);
				var tapNoteScores = highScore[0].children.item(13);
				console.log(name.innerHTML);
			}
			catch(err){
				console.log("A song didn't load properly");
			}
		});*/
		//SongScores


	}


	$http.get('./data/ddr.csv').success($scope.readScore);
	$http.get('./data/STATS.XML').success($scope.readXML);
});
