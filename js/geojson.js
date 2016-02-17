//function to create the map
function createMap() {

	//set the map view and create the map object
	var map = L.map('map').setView([20, 0], 2);

	//access map tiles
	L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
	maxZoom: 20,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	//use ajax to retreive megacities data
	$.ajax('data/MegaCities.geojson', {
		dataType: 'json',
		success: function(response) {

			//use options to assign different propoerties to the features
			L.geoJson(response, {
				pointToLayer: function(feature, latlng) {
					return L.circleMarker(latlng, {
						radius: 8,
               	 		fillColor: "#ff7800",
                		color: "#000",
               			weight: 1,
                		opacity: 1,
                		fillOpacity: 0.8
					})
				},
				onEachFeature: function(feature, layer) {
					var popupContent = '';
					if(feature.properties) {
						for(var property in feature.properties) {
							popupContent += '<p>' + property + ': ' + feature.properties[property];
						}
						layer.bindPopup(popupContent);
					}
				},
				filter: function(feature, layer) {
					return feature.properties.Pop_2015 > 20;
				}
			}).addTo(map);
		}
	});

};

//initilize the map when the document is ready
$(document).ready(createMap);