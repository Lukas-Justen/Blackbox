
var accWatch = 0;
var geoWatch = 0;
var comWatch = 0;
var pos;
var controlUI;
var controlText;
var trackNumber;
var flightPath;

var app = {
	
    initialize: function() {
        this.bindEvents();
    },
	
	bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
	onDeviceReady: function() {
		StatusBar.backgroundColorByHexString("#759eb8");
		var height = $("body").get(0).scrollHeight-95;
		$("#content").css({"height":height});
		switchToClickedTab(0);
		
		if (!localStorage.getItem("tracking")) {
			localStorage.setItem("tracking", "false");
		}
		if (!localStorage.getItem("trackNumber")) {
			trackNumber = 1;
		} else {
			trackNumber = localStorage.getItem("trackNumber");
		}
		if(!localStorage.getItem("showMap")) {
			localStorage.setItem("showMap", "true")
		}
		if(!JSON.parse(localStorage.getItem("trackingCoords"))) {
			localStorage.setItem("trackingCoords", JSON.stringify(new Array));
		}
		
		$("li").click(function(){
			$(this).removeClass().addClass("clicked");
			$("li").not(this).removeClass().addClass("clickable");
			switchToClickedTab($("li").index(this));
		});
		
		if(navigator.accelerometer) {
			navigator.accelerometer.watchAcceleration(function(acc){
				if (-parseInt(acc.y - 9.81) > 2 && localStorage.getItem("tracking")=="false") {
					localStorage.setItem("tracking", "true");					
					if (controlUI) {
						controlUI.style.backgroundColor = '#f55d3e';
						controlUI.style.border = '2px solid #f55d3e';
					}
					if (controlText) {
						controlText.innerHTML = 'Stop';
					}	
				}
			});
		}
		
		if(navigator.geolocation){
			navigator.geolocation.watchPosition(function(position){ 
				pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				if (localStorage.getItem("tracking")=="true") {
					var trackingCoords = JSON.parse(localStorage.getItem("trackingCoords"));
					trackingCoords.push(pos);
					localStorage.setItem("trackingCoords",JSON.stringify(trackingCoords));
				}
			});
		}
    }
	
};

function clearWatches() {
	if (accWatch) {
		navigator.accelerometer.clearWatch(accWatch);
		accWatch = 0;
	}
	if (geoWatch) {
		navigator.geolocation.clearWatch(geoWatch);
		geoWatch = 0;
	}
	if (comWatch) {
		navigator.compass.clearWatch(comWatch);
		comWatch = 0;
	}
}

function switchToClickedTab(clickedTab) {
	clearWatches();
	$("#content").html('');
	switch(clickedTab){
		case 3:
			showMap();
			break;
		case 2:
			showSpeed();
			break;
		case 1:
			showSteigung();
			break;
		default:
			showKompass();
	}
}

app.initialize();