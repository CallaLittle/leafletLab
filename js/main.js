/* Calla Little, 2016 */

var map = L.map('map').setView([39, -97], 5);

var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

function createPropSymbols(data) {

	var markerStyle = {
		radius: 8,
		fillColor: 'green',
		color: 'black',
		weight: 1,
		opacity: 1,
		fillOpacity: 0.6
	};

	L.geoJson(data, {
		pointToLayer: function(feature, latlng) {
			console.log(feature);
			return L.circleMarker(latlng, markerStyle);
		}
	}).addTo(map);
};

$.ajax('data/PovertyRates08-14.geojson', {
	dataType: 'json',
	success: function(response) {
		createPropSymbols(response) 
	}
});