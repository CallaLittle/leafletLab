/* Calla Little, 2016 */

//create the map and set initial properties
var map = L.map('map', {minZoom: 5}).setView([39, -97], 5);

//get the tileset
var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

function parseYears(data) {

	var years = [];

	for(var attribute in data.features[0].properties) {
		years.push(attribute);
	}

	return years.slice(0, 7);
};

//create proportional symbols
function createPropSymbols(data, years) {

	var markerStyle = {
		fillColor: 'purple',
		color: 'purple',
		weight: 1,
		opacity: .3,
		fillOpacity: .3
	};

	L.geoJson(data, {
		pointToLayer: function(feature, latlng) {
			
			
			var attribute = years[2];

			var atValue = Number(feature.properties[attribute]);
			markerStyle.radius = calcRadius(atValue);

			var popUp = '<p><b><center>' + feature.properties.City + '<br></center> ';
			popUp += '<p>' + attribute + ':</b> ' + feature.properties[attribute] + '%';

			var layer = L.circleMarker(latlng, markerStyle).bindPopup(popUp, {
				offset: new L.Point(0, -markerStyle.radius),
				closeButton: false
			});

			layer.on({
				mouseover: function() {
					this.openPopup();
				},
				mouseout: function() {
					this.closePopup();
				},
				click: function() {
					$('#panel').html(popUp);
				} 
			})

			return layer;
		}
	}).addTo(map);
};

//determine the appropriate radius
function calcRadius(atValue) {
	var scaleFactor = 40;
	return Math.sqrt((atValue * scaleFactor)/(Math.PI * .9 ));
}

function createSequenceControls(years) {

	$('#slider').append('<input class="range-slider" type="range">' );

	$('.range-slider').attr({
		max: 6,
		min: 0,
		value: 0,
		step: 1
	});

	$('#slider').append('<button class="skip" id="reverse">Reverse');
	$('#slider').append('<button class="skip" id="forward"><img src="img/skip.png" height="8">');


};

//get the data for the map
function getData(map) {

	$.ajax('data/PovertyRates08-14.geojson', {
		dataType: 'json',
		success: function(response) {

			var dataYears = parseYears(response);
			createPropSymbols(response, dataYears) 
			createSequenceControls(dataYears);
		}
	});

};

//intitialize the document
$(document).ready(getData);
