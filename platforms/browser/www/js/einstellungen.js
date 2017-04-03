
var app = {
	
    initialize: function() {
        this.bindEvents();
    },
	
	bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
	onDeviceReady: function() {
		StatusBar.backgroundColorByHexString("#759eb8");
		var height = document.body.scrollHeight-65;
		$("#content").css({"height":height});
		
		setupSlider("maxSpeed", 50, 3);
		setupSlider("maxSteigung", 10, 2);
		setupShowMap();
		
		if(navigator.geolocation){
			navigator.geolocation.watchPosition(function(position){ 
				pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				if (localStorage.getItem("tracking")=="true") {
					var trackingCoords = JSON.parse(localStorage.getItem("trackingCoords"));
					trackingCoords.push({lat: position.coords.latitude, lng: position.coords.longitude});
					localStorage.setItem("trackingCoords",JSON.stringify(trackingCoords));
				}
			});
		}
	}		
};

function setupSlider(sliderName, standardValue, digits) {
	var val = standardValue;
	if (localStorage.getItem(sliderName)) {
		val = localStorage.getItem(sliderName);
	} else {
		localStorage.setItem(sliderName, val);
	}
	
	$("#"+sliderName+"Slider").val(val);
	$("#"+sliderName+"Value").html(formatValue(val,digits));
		
	$("#"+sliderName+"Slider").get(0).oninput = function(){
		val = $("#"+sliderName+"Slider").val();
		$("#"+sliderName+"Value").html(formatValue(val,digits));
		localStorage.setItem(sliderName, val );
	};
}

function setupShowMap() {
	val = true;
	if (typeof localStorage.getItem("showMap") != 'undefined') {
		val = localStorage.getItem("showMap");	
		if (val == "false") {	
			$("#showMap").get(0).checked = false;
		}
	} else {
		localStorage.setItem("showMap", val);
	}
	
	$("#showMap").get(0).onclick = function(){
		localStorage.setItem("showMap", $("#showMap").get(0).checked );
	};
}

function formatValue(val, digits) {
	while(val.toString().length < digits){
		val="0"+val;
	}
	return val;
}

app.initialize();