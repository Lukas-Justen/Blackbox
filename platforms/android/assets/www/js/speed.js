
function showSpeed() {
	var width = $("body").get(0).scrollWidth;
	var canvasWidth = parseInt(width / 100) * 100;
	var canvasPadding = parseInt((width-canvasWidth) / 2);
	var maxSpeed = localStorage.getItem("maxSpeed");
		if (!(maxSpeed)) {maxSpeed = 50;}
	
	$("#content").append('<p id="discription">Geschwindigkeit des Flugobjekts</p>');
	$("#content").append('<p id="value">0</p>');
	$("#content").append('<canvas id="canvas" width="' + width + '" height="350"></canvas>');
		
	var value = $("#value");
	var canvas = $("#canvas").get(0).getContext("2d");	
	var gradient = canvas.createLinearGradient(0,0,width,0);
		gradient.addColorStop(0,"red");
		gradient.addColorStop(0.5,"yellow");
		gradient.addColorStop(1,"green");	
		canvas.fillStyle = gradient;
	
	canvas.clearRect(canvasPadding,100,canvasWidth,250);
	canvas.globalAlpha = 0.3;
	canvas.fillRect(canvasPadding,100,canvasWidth,250);
	canvas.globalAlpha = 1;
				
	for(var i = 0; i <= 5; i++) {
		canvas.fillText(maxSpeed/5*i, canvasPadding + i*(canvasWidth/5),30);
		canvas.fillRect(canvasPadding + i*(canvasWidth/5)-1,50, 2,300);
	}
	
	if(navigator.geolocation){
		geoWatch = navigator.geolocation.watchPosition(function(position){
			var speed = position.coords.speed*3.6;
			value.html(speed + " km/h");
			canvas.clearRect(canvasPadding,100,canvasWidth,250);
			canvas.globalAlpha = 0.3;
			canvas.fillRect(canvasPadding,100,canvasWidth,250);
			canvas.globalAlpha = 1;
						
			for(var i = 0; i <= 5; i++) {
				canvas.fillText(maxSpeed/5*i, canvasPadding + i*(canvasWidth/5),30);
				canvas.fillRect(canvasPadding + i*(canvasWidth/5)-1,50, 2,300);
			}
			if (speed>maxSpeed) {
				canvas.fillStyle = "#800000";
				canvas.fillRect(canvasPadding,100,canvasWidth,250);
			} else {
				canvas.fillStyle=gradient;
				canvas.fillRect(canvasPadding,100,canvasWidth/maxSpeed*speed,250);
			}
		},function(){
			value.html("ERROR");
		}, {timeout:10000, enableHighAccuracy: true, maximumAge: 200});
	}
}
