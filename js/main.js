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
	var SequenceControl = L.Control.extend({
		options: {
			position: 'bottomleft'
		},

		onAdd: function() {

			var container = L.DomUtil.create('div', 'sequence-control-container');

			$(container).append('<input class="range-slider" type="range">' );

			$(container).append('<button class="skip" id="reverse">Reverse');
			$(container).append('<button class="skip" id="forward"><img src="img/skip.png" height="8">');

			$(container).on('mousedown dblclick', function(e) {
				L.DomEvent.stopPropagation(e);
			});


			return container;
		}
	});

	map.addControl(new SequenceControl());

	//create the slider bar 
	$('.range-slider').attr({
		max: 6,
		min: 0,
		value: 0,
		step: 1
	});


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
		console.log(layer.feature);
		if(layer.feature && layer.feature.properties[year]) {

			var props = layer.feature.properties;
			console.log(year);
			var radius;

			//pass percentage array if population is being mapped
			if(dataValueIndex > 0) {
				radius = calcRadius(props[year], props[percentArrayYear]);
			}
			else {
				radius = calcRadius(props[year], 1);
			};
			
			//update symbol properties
			layer.setRadius(radius);
			layer.setStyle({fillColor: 'purple'})

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

//calculate the radius appropriate for the difference between years
function calcDifferenceRadius(difference) {

	var scaleFactor;

	//check if population in poverty needs to be calculated
	if(dataValueIndex > 0) {
		//percentage = percentage/100;
		scaleFactor = .01;
	} 
	else {
		scaleFactor = 80;
	};
	
	return Math.sqrt((difference  * scaleFactor)/(Math.PI * .6 ));
};

//calculate the change between user input years
function calculate(percentYears, popYears) {

	//check for user input
	$('.calculate-selector').change(function() {
		var selectedFromYear = $('#select-from-year').val();
		var selectedToYear = $('#select-to-year').val();

		var fromPerc = percentYears[selectedFromYear];
		var toPerc = percentYears[selectedToYear];

		//wait for user to submit their selection
		$('#submit').click(function() {

			//check which attribute is being mapped
			if(dataValueIndex < 1) {
				
				map.eachLayer(function(layer) {

					//iterate through each feature
					if(layer.feature && layer.feature.properties[fromPerc] && layer.feature.properties[toPerc]) {

						var features = layer.feature.properties;

						//calculate the change between years
						var difference = features[toPerc] - features[fromPerc];
						
						//apply appropriate symbol properties
						var calculatedRadius = calcDifferenceRadius(Math.abs(difference));
						
						layer.setRadius(calculatedRadius);

						var popUp = '<p><b><center>' + features.City + '<br></center> ';

						if(difference < 0) {
							layer.setStyle({fillColor: 'green'});
							popUp += '<p>From ' + fromPerc + ' to ' + toPerc + ': ' + Math.abs(difference) + '% decrease';
						} 
						else {
							layer.setStyle({fillColor: 'orange'});
							popUp += '<p>From ' + fromPerc + ' to ' + toPerc + ': ' + Math.abs(difference) + '% increase';
						};

						//update popup
						layer.bindPopup(popUp, {
							offset: new L.Point(0, -calculatedRadius)
						});

					};
				});
			}
			else {

				var fromPop = popYears[selectedFromYear];
				var toPop = popYears[selectedToYear];

				//iterate through each feature
				map.eachLayer(function(layer) {
					if(layer.feature && layer.feature.properties[fromPop] && layer.feature.properties[toPop]) {

						var features = layer.feature.properties;

						//calculate the change between years
						console.log(features[toPop] * (features[toPerc]/100));
						console.log(features[fromPop] * (features[fromPerc]/100));

						var difference = (features[toPop] * (features[toPerc]/100)) - ( features[fromPop] * (features[fromPerc]/100));

						var calculatedRadius = calcDifferenceRadius(Math.abs(difference));
						
						//apply appropriate symbol properties
						layer.setRadius(calculatedRadius);

						var popUp = '<p><b><center>' + features.City + '<br></center> ';

						if(difference < 0) {
							layer.setStyle({fillColor: 'green'});
							popUp += '<p>From ' + fromPop.substring(3) + ' to ' + toPop.substring(3) + ': ' + Math.abs(difference) + ' fewer people';
						} 
						else {
							layer.setStyle({fillColor: 'orange'});
							popUp += '<p>From ' + fromPop.substring(3) + ' to ' + toPop.substring(3) + ': ' + Math.abs(difference) + ' more people';
						};

						//update popup
						layer.bindPopup(popUp, {
							offset: new L.Point(0, -calculatedRadius)
						});

					};
	
				});
			};
		});
	});
};

function createLegend(attributes) {
	var LegendControl = L.Control.Extend({
		options: {
			position: 'bottomleft'
		},

		onAdd: function() {
			var container = L.DomUtil.create('div', 'legend-control-container');

			return container;
		}
	});

	map.addControl(new LegendControl);
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
			calculate(percentYears, popYears);

		}
	});

};

//intitialize the document
$(document).ready(getData());
