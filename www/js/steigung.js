
function showSteigung() {
	$("#content").append('<p id="discription">Steigung des Flugobjekts</p>');
	$("#content").append('<p id="value">0</p>');
	$("#content").append('<canvas id="canvas" width="350" height="350"></canvas>');
	
	var media = new Media('../sounds/beep.mp3', null);
	var maxSteigung = localStorage.getItem("maxSteigung");
		if (!(maxSteigung)) {maxSteigung = 10;}
	var stepWidth = 175 / maxSteigung;
	var value = $("#value");
	var canvas = $("#canvas").get(0).getContext("2d");
	var gradient = canvas.createLinearGradient(0,0,0,350);
		gradient.addColorStop(0,"red");
		gradient.addColorStop(0.25,"yellow");	
		gradient.addColorStop(0.5,"green");
		gradient.addColorStop(0.75,"yellow");	
		gradient.addColorStop(1,"red");	
	canvas.globalAlpha = 0.3;
	canvas.fillStyle = gradient;
	canvas.fillRect(75,0,200,350);
	canvas.globalAlpha = 1;
	canvas.fillRect(75,175,200,2);
	for (var i = 1; i <= maxSteigung; i++) {
		canvas.fillRect(65,175-i*stepWidth,210,2);
		canvas.fillRect(75,173+i*stepWidth,210,2);
		if(i%2!=0){
			canvas.fillText(i,50,182-i*stepWidth);
			canvas.fillText(-i,285,173+i*stepWidth);
		}
	}
	if(navigator.accelerometer) {
		accWatch = navigator.accelerometer.watchAcceleration(function(acc){
			var steigung = -parseInt(acc.y - 9.81);
			value.html( steigung + " m/s\u00b2");
			canvas.clearRect(65,0,220,350);
			canvas.globalAlpha = 0.3;
			canvas.fillStyle = gradient;
			canvas.fillRect(75,0,200,350);
			canvas.globalAlpha = 1;
			canvas.fillRect(75,175,200,2);
			for (var i = 1; i <= maxSteigung; i++) {
				canvas.fillRect(65,175-i*stepWidth,210,2);
				canvas.fillRect(75,173+i*stepWidth,210,2);
			}
			if (steigung < 0) {
				media.play();
				navigator.notification.beep(1);
			}	
			if (Math.abs(steigung)>maxSteigung) {
				canvas.fillStyle = "#800000";
				canvas.fillRect(75,176,200,-stepWidth*steigung)
			} else {
				canvas.fillStyle=gradient;
				canvas.fillRect(75,176,200,-stepWidth*steigung)
			}
		},function(){
			value.html("ERROR");
		},{frequency:1000});
	}
}
