//Leaftlet tutorials

var map = L.map('map').setView([39.665488, -105.205243], 10);

L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
	maxZoom: 20,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([39.665488, -105.205243]).addTo(map);

var circle = L.circle([39.65560, -105.193123], 100, {
	color: 'blue',
	fillColor: 'green',
	fillOpacity: 0.3
}).addTo(map);

var polygon = L.polygon([
	[39.672903, -105.229986],
	[39.662625, -105.222825],
	[39.662718, -105.234842]
]).addTo(map);

marker.bindPopup('I am a popup').openPopup();
circle.bindPopup('I am a circle');
polygon.bindPopup('I am a polygon');

var popup = L.popup()
	.setLatLng([39.686075, -105.183982])
	.setContent('I am a loner')
	.openOn(map);

function onMapClick(e) {
	var popup = L.popup()
		.setLatLng(e.latlng)
		.setContent('You clicked the map at ' + e.latlng.toString())
		.openOn(map);

};

map.on('click', onMapClick);

////////////////////////////JSON tutorial///////////////////////////////////

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

//L.geoJson(geojsonFeature).addTo(map);

var myLayer = L.geoJson().addTo(map);
myLayer.addData(geojsonFeature);




var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

L.geoJson(myLines, {
	style: myStyle
}).addTo(map);




var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];