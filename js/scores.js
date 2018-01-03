'use strict';   // See note about 'use strict'; below

var diff15 = ['Arrabbiata', 'CRAZY LOVE', 'KIMONO PRINCESS', 'ZETA ~The World of Prime Numbers and the Transcendental Being~', 'ZEPHYRANTHES', 'Silver Dream', 'Beautiful Dream', 'MAX 300', 'FLOWER', 'Knight of Nights', 'JOMANDA', 'Nostalgia Is Lost', 'Osenju meditation', 'Cleopatrysm', 'Xepher', 'TRIP MACHINE PhoeniX', 'IMANOGUILTS', 'Bamboo Sword Girl'];
var diff16 = ['Dadadadadadadadadada', 'Chinese Snowy Dance', 'out of focus', 'VANESSA', 'Engraved Mark', 'Come to Life', 'KHAMEN BREAK', 'PARANOiA ~HADES~']
var HARDSONGS = diff15.concat(diff16)


$(document).ready(function(){
	$('.parallax').parallax();
        $('ul.tabs').tabs();
	$('.collapsible').collapsible();

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
					diff: parseString(data[7]),
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
		var difficulty = xmlItem.attributes[0].value;


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
			diff: difficulty,
			grade: percentdp*100,
			tier: 'normal',
			difficulty: difficulty
		}

		if(name != playerName)
			return false;

		if(HARDSONGS.indexOf(datum.name) >= 0){
			datum.tier = 'hard';
			if(diff15.indexOf(datum.name) >= 0){
				datum.tier = 'hard15';

			}else{
				datum.tier = 'hard16';

			}

			if(datum.name === 'out of focus'){
				if(datum.diff === 'Hard'){
					datum.tier = 'hard15'
				}else{
					datum.tier = 'hard16'
				}
			}
			if(datum.name === 'Beautiful Dream' && datum.diff != 'Challenge'){
				datum.tier = 'normal';

			}
			if(datum.name === 'Xepher' && datum.diff != 'Challenge'){
				datum.tier = 'normal';

			}

			return datum;
		}
		else if(percentdp < minScore)
			return false;


		for(var i = 0; i < $scope.scores.length; i = i + 1){
			if($scope.scores[i].name === datum.name &&
					$scope.scores[i].grade > datum.grade)
				return false;
		}

		return datum;


	}

	$scope.readXML = function(xmlString) {
		var xmlDoc = jQuery.parseXML(xmlString);
		var xml = $( xmlDoc );
		var allScores = document.evaluate('/Stats/SongScores/*/Steps[(@Difficulty="Hard" or @Difficulty="Challenge") and @StepsType="dance-single"]', xmlDoc, null, XPathResult.ANY_TYPE);
                var item = allScores.iterateNext();
		while(item != null){
			var output = pullSongData(item, "BAW", 0.955);
			if(output !== false){
				if(output.tier === 'normal'){
					$scope.scores.push(output);
				}
				else{
					$scope.hardScores.push(output);
					if(output.tier === 'hard15')
						$scope.hard15s.push(output);
					else
						$scope.hard16s.push(output);

				}
				console.log(output);
			}

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

	$scope.scores = [];
	$scope.hardScores = [];
	$scope.hard15s = [];
	$scope.hard16s = [];

	$http.get('./data/ddr.csv').success($scope.readScore);
	$http.get('./data/STATS.XML').success($scope.readXML);
});
