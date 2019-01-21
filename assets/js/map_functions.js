
/**
 *
 */
function onEachFeature(feature, layer, map) {
	// console.log("feature added: " + feature.properties.name);
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

/**
 *
 */
function loadTiles(map){	
	console.log("loadTiles() was called!!");
	let mapboxAccessToken = 
		'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' 
		+ mapboxAccessToken, {id: 'mapbox.light'}).addTo(map);
	map.attributionControl.addAttribution('Imagery © <a href="http://mapbox.com">Mapbox</a>');
}

/**
 *
 */
function asyncOtherBoundaries(vector_layers) {

	// vector_layers[2017][2016]
	// var current_geojson_layer = getLayer(ac[0].key(), ac[0][0]);


	// 	for (let yr of act_years) {
	// 	// boundary_file_names[i++] = 'boundaries' + yr + '.geojson';
	// 	let fn = 'boundaries' + yr + '.geojson';
	// 	vector_layers[yr] = {};
	// 	for (ler y of ac[yr]) {
	// 		vector_layers[yr][y] = newLayer(map, ......., 'rep_rat'); //rr'+census);
	// 	}

	// }


	// let vector_layers = {};
	// boundaries_gj[2007] = boundaries2007;
	// for (let a in actcen) {
	// 	for (let c of actcen[a])
	// 	vector_layers['act'+a+'census'+c] = newLayer(map, boundaries_gj[a], 'rr'+c);
	// }
	// vector_layers[2013] = {};
	// vector_layers[2009] = {};

	// let a = 2013; //act
	// let b = Act2013_c2011_c2016; //boundaries
	// let c = 2016; // census. abc see what I did there? 
	let b = act2009_geojson; //boundaries
	vector_layers[2009] = newLayer(b);
	// vector_layers[a][c] = newLayer(map, b, 'rr'+c);



	// c = 2011;
	// vector_layers[a][c] = newLayer(b, 'rep_rat');


	// b = boundaries2007;
	// c = 2011;
	// vector_layers[a][c] = newLayer(b, 'rep_rat_next');
	
	// c = 2006;
	// vector_layers[a][c] = newLayer(b, 'rep_rat');

	// return vector_layers;
}

/**
 *
 */
function newLayer(boundaries) {
	console.log("newLayer() was called!!");
	// var bounds = getBoundaries(boundaries);
	// console.log('show_pop_next = ' + show_pop_next);
	return L.geoJson(boundaries, {
			style: layerStyle,
			// style: function(feature) { 
			// 	// console.log('inside style anon!');
			// 	return layerStyle(feature);
			// },
			// style: style,
			// style: function(feature) {return style(feature, show_pop_next);},
			onEachFeature: onEachFeature
		});
}

/**
 * see e.g. https://www.mapbox.com/mapbox.js/example/v1.0.0/choropleth-joined-data-multiple-variables/
 * 			https://stackoverflow.com/questions/25773389/changing-the-style-of-each-feature-in-a-leaflet-geojson-layer
 */
function change_census_style(current_geojson_layer, census_year) {
	current_geojson_layer.eachLayer(function(layer) {
		var r = layer.feature.properties['rr' + census_year];
        layer.setStyle({
			fillColor: getColor(r/1000) //'#555555'
        });
    });
}

/**
 *
 */
function change_constituency_boundaries(vector_layers, current_geojson_layer, act_year, census_year) {
	map.removeLayer(current_geojson_layer);
	current_geojson_layer = vector_layers[act_year];
	map.addLayer(current_geojson_layer);
	change_census_style(current_geojson_layer, census_year);
}

/**
 * // get color depending on representative ratio
 */
function getColor(d) { 
 	return d > 30 ? '#8b0000' :
 			d > 27  ? 'orange' :
 			d > 24  ? 'yellow' :
 			d > 21  ? 'green' :
 			// d > 25  ? '#c7e9c0' :
 			// d > 24  ? '#edf8e9' :
 			// d > 23  ? 'yellow' :
 			// d > 22  ? 'orange' :
 				'#0000FF';
}

function layerStyle(feature) {
	console.log('style called');
	// // we prolly want to use crossfilter rather than using properties...
	// // var cen_yr = getCensusYear();
	// // var con_yr = getBoundariesYear();
	var r = feature.properties['rr' + census_year];
	
	return {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.6,
		fillColor: getColor(r/1000) //'#555555'
	};
}

/**
 *
 */
function loadAttribution(map){
	map.attributionControl.addAttribution('Boundary data &copy; <a href="http://www.osi.ie">OSi</a>');
	map.attributionControl.addAttribution('Population data &copy; <a href="http://www.cso.ie/en/index.html">CSO</a>');
}

/**
 *
 */
function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	hover_info.update(layer.feature.properties);
}

/**
 *
 */
function resetHighlight(e) {
	// geojson.resetStyle(e.target);
	// var layer = e.target;
	current_geojson_layer.resetStyle(e.target);
	hover_info.update();
}	

/**
 *
 */
function zoomToFeature(e) {
	// might be nice to return to zoom whole island if next click is on same feature...
	map.fitBounds(e.target.getBounds());
}

function getColor_old() {
	// return d > 30 ? '#8b0000' :
 // 			d > 25  ? 'yellow' :
 // 			d > 20  ? 'green' :
 // 			// d > 25  ? '#c7e9c0' :
 // 			// d > 24  ? '#edf8e9' :
 // 			// d > 23  ? 'yellow' :
 // 			// d > 22  ? 'orange' :
 // 				'#0000FF';


	// got these colors using d3.schemeGreens[6]
 	// return d > 30 ? '#8b0000' :
 	// 		d > 28  ? '#006d2c' :
 	// 		d > 26  ? '#31a354' :
 	// 		d > 24  ? '#74c476' :
 	// 		d > 22  ? '#a1d99b' :
 	// 		// d > 25  ? '#c7e9c0' :
 	// 		// d > 24  ? '#edf8e9' :
 	// 		// d > 23  ? 'yellow' :
 	// 		// d > 22  ? 'orange' :
 	// 			'#0000FF';

	// got these colors by using the eye dropper on the following page
	// https://mekshq.com/how-to-convert-hexadecimal-color-code-to-rgb-or-rgba-using-php/
	// return d > 30 ? '#FF0000' :
	// 		d > 29  ? '#178000' :
	// 		d > 28  ? '#298903' :
	// 		d > 27  ? '#449906' :
	// 		d > 26   ? '#4DA00A' :
	// 		d > 25   ? '#70B50D' :
	// 		d > 24   ? '#93C814' :
	// 					'#0000FF';

	/*R = (255 * n) / 100
	G = (255 * (100 - n)) / 100 
	B = 0
	return d > 30 ? '#800026' :
			d > 29  ? '#BD0026' :
			d > 28  ? '#E31A1C' :
			d > 27  ? '#FC4E2A' :
			d > 26   ? '#FD8D3C' :
			d > 25   ? '#FEB24C' :
			d > 24   ? '#FED976' :
						'#FFEDA0';
						*/
}