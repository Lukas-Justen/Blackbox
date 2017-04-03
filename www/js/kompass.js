
function showKompass(){
	$("#content").append('<p id="discription">Ausrichtung des Flugobjekts</p>');
	$("#content").append('<p id="value"></p>');
	$("#content").append('<canvas id="canvas" width="350" height="350"></canvas>');
	
	var value = $("#value");
	var canvas = $("#canvas").get(0).getContext("2d");
	var alterWinkel = 0;
	var neuerWinkel = 0;

	if(navigator.compass) {
		comWatch = navigator.compass.watchHeading(function(heading){
			neuerWinkel = parseInt(heading.magneticHeading);
			value.html(formatValue(neuerWinkel,3) + "\u00b0");
			canvas.clearRect(0,0,350,350);
			canvas.translate(175, 175);
			canvas.rotate((alterWinkel-neuerWinkel)*Math.PI / 180);
			canvas.translate(-175, -175);
			var img = new Image();
			img.src = "img/rose.jpg";
			canvas.drawImage(img, 0,0);
			alterWinkel = neuerWinkel;
		}, function() {
			value.html("ERROR");
		},{timeout:10000, enableHighAccuracy: true});
	}
}


function formatValue(val, digits) {
	while(val.toString().length < digits){
		val="0"+val;
	}
	return val;
}

