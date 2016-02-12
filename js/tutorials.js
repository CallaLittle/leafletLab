//Leaftlet tutorials

//set the center of the map and the initial zoom level
var map = L.map('map').setView([39.665488, -105.205243], 10);


//set the source of the map tiles, the attributions, and add to site
L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
	maxZoom: 20,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//add a simple marker to the map based on latlng
var marker = L.marker([39.665488, -105.205243]).addTo(map);

//add a circle marker to the map based on latlng
var circle = L.circle([39.65560, -105.193123], 100, {
	color: 'blue',
	fillColor: 'green',
	fillOpacity: 0.3
}).addTo(map);

//draw and add a polygon based on latlng
var polygon = L.polygon([
	[39.672903, -105.229986],
	[39.662625, -105.222825],
	[39.662718, -105.234842]
]).addTo(map);

//add popups to each of the objects
marker.bindPopup('I am a popup').openPopup();
circle.bindPopup('I am a circle');
polygon.bindPopup('I am a polygon');

//create a stand alone popup at latlng
var popup = L.popup()
	.setLatLng([39.686075, -105.183982])
	.setContent('I am a loner')
	.openOn(map);

//allow user to click on map and tell them the location clicked
function onMapClick(e) {
	var popup = L.popup()
		.setLatLng(e.latlng)
		.setContent('You clicked the map at ' + e.latlng.toString())
		.openOn(map);

};

//call the click function
map.on('click', onMapClick);

////////////////////////////JSON tutorial///////////////////////////////////


//create variables to hold a feature
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

//var myLayer = L.geoJson().addTo(map);
//myLayer.addData(geojsonFeature);


var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

//variable to hold the style of my lines
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

//add lines to map with the specified style
L.geoJson(myLines, {
	style: myStyle
}).addTo(map);

//create another layer of features
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


//add the features to the map and color based on party property
L.geoJson(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: 'red'};
            case 'Democrat': return {color: 'blue'};
        }
    }
}).addTo(map); 

//turn the point feature into a layer and give a popup based on properties
L.geoJson(geojsonFeature, { 
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: '#ff7800',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
    onEachFeature: function(feature, layer) {
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
    }

}).addTo(map);

//another variable to hold more features
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

//add the features based on the show on map property
L.geoJson(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);