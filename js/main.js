/* Calla Little, 2016 */

//create the map and set initial properties
var map = L.map('map', {minZoom: 5}).setView([39, -97], 5);

//get the tileset
var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

//create proportional symbols
function createPropSymbols(data) {

	var markerStyle = {
		fillColor: 'blue',
		//color: 'black',
		weight: 1,
		opacity: .3,
		fillOpacity: .3
	};

	L.geoJson(data, {
		pointToLayer: function(feature, latlng) {
			
			var attribute = "2008"
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
	return Math.sqrt((atValue * scaleFactor)/(Math.PI   * .9));
}

//get the data for the map
function getData(map) {

	$.ajax('data/PovertyRates08-14.geojson', {
		dataType: 'json',
		success: function(response) {
			createPropSymbols(response) 
		}
	});

};

//intitialize the document
$(document).ready(getData);
