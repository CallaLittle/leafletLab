/* Calla Little, 2016 */

//global variables
var dataValueIndex = 0; //tracks attribute being mapped

var map = L.map('map', {minZoom: 5}).setView([39, -97], 5); //map intialization

//tileset
var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);


//parse percentage index array
function parsePercentage(data) {

	var years = [];

	for(var attribute in data.features[0].properties) {
		years.push(attribute);
	}

	return years.slice(0,7);
};

//parse population index array
function parsePopulation(data) {

	var years = [];

	for(var attribute in data.features[0].properties) {
		years.push(attribute);
	}

	return years.slice(8);
};


//determine the appropriate radius
function calcRadius(atValue, percentage) {

	var scaleFactor;

	//check if population in poverty needs to be calculated
	if(dataValueIndex > 0) {
		percentage = percentage/100;
		scaleFactor = .002;
	} 
	else {
		scaleFactor = 40;
	};
	
	return Math.sqrt((atValue * percentage * scaleFactor)/(Math.PI * .6 ));
	//return 1.0083 * Math.pow((atValue * percentage)/7.1,.5716) * 35.2; 
};


//create intial proportional symbols
function createPropSymbols(data, years) {

	//prop symbol style
	var markerStyle = {
		fillColor: 'purple',
		color: 'purple',
		weight: 1,
		opacity: .3,
		fillOpacity: .3
	};

	//convert leaflet markers to circles
	L.geoJson(data, {
		pointToLayer: function(feature, latlng) {
			
			
			var attribute = years[0];

			var atValue = Number(feature.properties[attribute]);
			markerStyle.radius = calcRadius(atValue, 1);

			//create popup
			var popUp = '<p><b><center>' + feature.properties.City + '<br></center> ';
			popUp += '<p>' + attribute + ':</b> ' + feature.properties[attribute] + '%';

			var layer = L.circleMarker(latlng, markerStyle).bindPopup(popUp, {
				offset: new L.Point(0, -markerStyle.radius),
				closeButton: false
			});

			//set popup features
			layer.on({
				mouseover: function() {
					this.openPopup();
				},
				mouseout: function() {
					this.closePopup();
				},
				click: function() {
					//$('#panel').html(popUp);
					this.openPopup();

				} 
			})

			return layer;
		}
	}).addTo(map);
};


//create the slider bar
function createSequenceControls(perYears, popYears) {

	//create the slider bar 
	$('#slider').append('<input class="range-slider" type="range">' );

	$('.range-slider').attr({
		max: 6,
		min: 0,
		value: 0,
		step: 1
	});

	$('#slider').append('<button class="skip" id="reverse">Reverse');
	$('#slider').append('<button class="skip" id="forward"><img src="img/skip.png" height="8">');

	//put percentage index array and population index array into an array
	var dataArray = [perYears, popYears];

	//set the slider bar year index when user clicks
	$('.skip').click(function() {

		var index = $('.range-slider').val();

		if($(this).attr('id') == 'forward') {
			index++;
			index = index > 6 ? 0 : index;
		} 
		else if($(this).attr('id') == 'reverse') {
			index--;
			index = index < 0 ? 6 : index;
		};

		//update the slider and the prop symbols
		$('.range-slider').val(index);
		console.log(index);
		//pass the current attribute index array with the year index
		updatePropSymbols(dataArray[dataValueIndex][index], dataArray[0][index]);
	});

	//update the year index and slider if user drags slider
	$('.range-slider').on('input', function() {

		var index = $(this).val();

		//pass the current attribute index array with the year index
		updatePropSymbols(dataArray[dataValueIndex][index], dataArray[0][index]);


	});

	//wait for a change in the dropdown attribute menu
	$('#selector').change(function() {
		$('.range-slider').val(0); //set the slider value back to 0

		//update the attribute index
		dataValueIndex++; 
		dataValueIndex = dataValueIndex > 1 ? 0 : dataValueIndex;

		//update the proportional symbols at year 2008 with the correct attribute
		updatePropSymbols(dataArray[dataValueIndex][0], dataArray[0][0]);
	});

};


//update the prop symbols
function updatePropSymbols(year, percentArrayYear) {

	map.eachLayer(function(layer) {
		if(layer.feature && layer.feature.properties[year]) {

			var props = layer.feature.properties;
			var radius;
			// console.log(props);
			// console.log(year);
			// console.log(percentArrayYear);
			// console.log(props[year]);
			// console.log(props[percentArrayYear]);

			//pass percentage array if population is being mapped
			if(dataValueIndex > 0) {
				radius = calcRadius(props[year], props[percentArrayYear]);
			}
			else {
				radius = calcRadius(props[year], 1);
			};
			
			console.log(radius);
			layer.setRadius(radius);

			//bind appropriate popup
			var popUp = '<p><b><center>' + props.City + '<br></center> ';
			if(dataValueIndex < 1) {
				popUp += '<p>' + year + ':</b> ' + props[year] + '%';
			}
			else {
				popUp += '<p>' + year.substring(3) + ':</b> ' + props[year] + ' people';
			}

			layer.bindPopup(popUp, {
				offset: new L.Point(0, -radius)
			});
		};
	});

};

function filter(percentYears, popYears) {

	
	var selectedFromYear = 0;
	$('#select-from-year').change(function() {
		//console.log($('#select-from-year').val());
		selectedFromYear = $('#select-from-year').val();
		//console.log(selectedFromYear);
	});

	console.log(selectedFromYear); 

	var selectedToYear = 1;
	$('#select-to-year').change(function() {
		selectedToYear = $('#select-to-year').val();
		console.log(selectedToYear);
	});

	console.log(selectedToYear); 

	var fromProperty = percentYears[selectedFromYear];
	var toProperty = percentYears[selectedToYear];

	/*$('#submit').click(function() {

		if(dataValueIndex < 1) {
			map.eachLayer(function(layer) {
				if(layer.feature && layer.feature.properties[fromProperty] && layer.feature.properties[toProperty]) {
					var features = layer.feature.properties;
					console.log(features);
					console.log(features[fromProperty]);
					console.log(features[toProperty]);

					
				
				};
			});
		};
	
	});*/
};


//get the data for the map
function getData() {

	$.ajax('data/PovertyRates&Pop08-14_formatted.geojson', {
		dataType: 'json',
		success: function(response) {

			var percentYears = parsePercentage(response);
			var popYears = parsePopulation(response);
			createPropSymbols(response, percentYears); 
			createSequenceControls(percentYears, popYears);
			filter(percentYears, popYears);

		}
	});

};

//intitialize the document
$(document).ready(getData());
