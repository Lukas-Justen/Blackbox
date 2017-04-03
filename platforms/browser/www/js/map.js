
function showMap() {
	if (localStorage.getItem("showMap")=="true") {
		$("#content").append('<div id="map"></div>');
		var marker = null;
		var image = '../img/back.png';
		
		var map = new google.maps.Map($("#map").get(0), {
			center: pos,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.SATELLITE,
			disableDefaultUI: true
		});	
		
		if(navigator.geolocation){
			geoWatch = navigator.geolocation.watchPosition(function(position){ 
				if (marker)
					marker.setMap(null);
				marker = new google.maps.Marker({
					position: pos,
					map: map
				});
				map.panTo(pos);
				if (flightPath) {	
					flightPath.setMap(null);
				}
				flightPath = new google.maps.Polyline({
					path: JSON.parse(localStorage.getItem("trackingCoords")),
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2
				});
				flightPath.setMap(map);
			});
		}
		map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(new trackingControls(map));
		if(localStorage.getItem("tracking")=="true") {
			controlUI.style.backgroundColor = '#f55d3e';
			controlUI.style.border = '2px solid #f55d3e';
			controlText.innerHTML = 'Stop';
		}
	} else {
		$("#content").append('<p id="discription">Bitte die Karte in den Optionen einschalten</p>');
	}
}

function writeFileToSDCard(name, data) {
	window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
		dir.getDirectory("Blackbox", {create: true, exclusive: false}, function(par){
			par.getFile(name + ".kml", {create:true}, function(file) {
			logOb = file;
			if(!logOb) return;
			logOb.createWriter(function(fileWriter) {
				fileWriter.seek(fileWriter.length);
				var blob = new Blob([data], {type:'text/plain'});
				fileWriter.write(blob);
			});          
		});
		}, function(){});
    });
}

function saveKML() {
	var kml = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n<name>Track</name>\n<Style id="style">\n<LineStyle>\n<color>ff3e5df5</color>\n<width>4</width>\n</LineStyle>\n</Style>\n<Placemark>\n<name>Track</name>\n<visibility>1</visibility>\n<styleUrl>#style</styleUrl>\n<LineString>\n<tessellate>1</tessellate>\n<altitudeMode>relative</altitudeMode>\n<coordinates>\n';
	kml += stringifyCoords(JSON.parse(localStorage.getItem("trackingCoords")));
	kml += '</coordinates>\n</LineString>\n</Placemark>\n</Document>\n</kml>';
	localStorage.setItem("track" + trackNumber, kml);
	var d = new Date();
	writeFileToSDCard(trackNumber +"_" +"track", kml);
	trackNumber++;
	localStorage.setItem("trackNumber", trackNumber);
}

function trackingControls(map) {
	controlDiv = document.createElement('div');
	controlDiv.index = 1;
	controlUI = document.createElement('div');
	controlUI.style.backgroundColor = '#99d102';
	controlUI.style.border = '2px solid #99d102';
	controlUI.style.borderRadius = '3px';
	controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
	controlUI.style.cursor = 'pointer';
	controlUI.style.marginBottom = '22px';
	controlUI.style.textAlign = 'center';
	controlUI.title = 'Click to start tracking';
	controlDiv.appendChild(controlUI);
	
	controlText = document.createElement('div');
	controlText.style.color = 'rgb(25,25,25)';
	controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
	controlText.style.fontSize = '16px';
	controlText.style.lineHeight = '38px';
	controlText.style.paddingLeft = '5px';
	controlText.style.paddingRight = '5px';
	controlText.innerHTML = 'Start';
	controlUI.appendChild(controlText);
	 
	 controlUI.addEventListener('click', function() {
		 if(localStorage.getItem("tracking")== "true") {
			localStorage.setItem("tracking", "false");
			controlUI.style.backgroundColor = '#99d102';
			controlUI.style.border = '2px solid #99d102';
			controlText.innerHTML = 'Start';
			saveKML();
			if (flightPath) {	
				flightPath.setMap(null);
			}
			localStorage.setItem("trackingCoords", JSON.stringify(new Array));
		 } else {
			localStorage.setItem("tracking", "true");
			controlUI.style.backgroundColor = '#f55d3e';
			controlUI.style.border = '2px solid #f55d3e';
			controlText.innerHTML = 'Stop';
		 }

	});
	
	return controlDiv;
}

function stringifyCoords(coords) {
	coordsString = "";
	for (i in coords) {
		coordsString += coords[i].lng+ ","+coords[i].lat +",0\n";
	}
	return coordsString;
}
