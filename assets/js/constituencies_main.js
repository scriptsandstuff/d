
/**
 *	3 ways of viewing things
 *		population with proposed boundaries (when commission published report)
 * 		pop with enacted (when Act passed)
 *		pop with effected (on dissolution of Dail)
 */

 /**
 todo
 set map zoom to suit screen size
  and much much more
 */

// var csochart = document.getElementById('cso-chart');
// csochart.on

// $('cso-chart').tooltip({ content: '<img src="pop-per-td-2016-CSO-chart.png" />' });
// $(document).ready(function() {
	$('#cso-chart').tooltip({ content: '<img src="CSO-chart.png" />' });
// });

// loadDistraction();
var event_detail = document.getElementById('event_detail');

/**
 *	Setup Timeline
 *
 */
var timeline_container = document.getElementById('IE-rep-timeline');
// var tl_item_categories = [general_elections, dail_terms, census_taken, census_results, commission_reports];
// var tl_tracks = ['Statutory', 'Legeslitive'];
// var timeline = initTimeline(timeline_container, tl_item_categories, tl_tracks);

var timeline = new vis.Timeline(timeline_container);

var tl_item_categories = [dail_terms, census_taken, actsOnly, 
	byAct_act_census, byAct_census_act,
	// byAct_act_census_bkg, byAct_census_act_bkg,
	byEff_election_census4, byEff_census_election4,
	byEff_election_census, byEff_census_election,
	byEff_election_census_bkg, byEff_census_election_bkg
	];
// var tl_item_categories = [general_elections, census_taken, census_results, commission_reports];
let groupMinHeight = "220";

var enacted_tracks = [1];
var empty_tracks = [0];
var effected_tracks = [2, 3, 4];
// var selected_track = 2;

var tracks = new vis.DataSet([
    {
    	id: 0,
    	// content: 'Boundary Act',
    	// minHeight: groupMinHeight
    },{
    	id: 1,
    	content: 'Enacted',
    },{
    	id: 2,
    	content: 'Effected',
		nestedGroups: [3, 4],
		showNested: true,
    } ,{
    	id: 3,
    	content: '',
    } ,{
    	id: 4,
    	content: '',
    }
]);

var options = {
	// showTooltips: true,
 //    tooltip: {
 //      followMouse: true
 //    },
	stack: false
        // height: 700
};

initTimeline(timeline, tl_item_categories, tracks); //, options);
timeline.setOptions(options);


// window.addEventListener('load', function() { refreshArrow(); return; });
// refreshArrow(); 
// div.vis-panel:nth-child(5)
// function refreshArrow() {
	// document.ready(){
	// window.addEventListener('load', function() { 
	let ll = document.getElementsByClassName('vis-left');
	let l = ll[0].offsetWidth;
	
	let cc = document.getElementsByClassName('vis-background');
	let c = cc[0].offsetWidth;
	
	let arrow = document.getElementsByClassName('arrow-up');
	let a = arrow[0].offsetWidth;
	
	// console.log('ll = ' + ll[0]);	
	// console.log('l = ' + l);	
	// console.log('cc = ' + cc[0]);	
	// console.log('c = ' + c);	
	// console.log('aa = ' + arrow[0]);	
	// console.log('a = ' + a);	
	let w = (c+l)/2 - a/2;
	console.log('width = ' + w);
	arrow[0].style.left = w+"px";

	// let w = Math.floor((pl[0].offsetWidth)/2);
// }

let vc  = document.getElementsByClassName('vis-content');
console.log('c = ' + vc.lenght);
selected_element = vc[0].firstChild.firstChild.firstChild;
// .nextSibling.nextSibling.firstChild.nextSibling;
selected_element.style.border = '2px solid white';



/**
 *	Setup Map
 *
 */
var IE_map = document.getElementById('IE_map'); 	// <div> containing map

let zoomLim = { maxZoom: 14, minZoom:6 };
var map = L.map('IE_map',zoomLim).setView([53.416, -8.042], 7);	// [37.8, -96], 4); // USA coords
// var title_info = L.control(); // control that shows National stats
var hover_info = L.control(); // control that shows constituency info on hover
var legend = L.control({position: 'bottomright'});

// loadTiles(map);
var current_geojson_layer =	newLayer(act2013_geojson); //rr'+census);
current_geojson_layer.addTo(map);
loadAttribution(map);
var vector_layers = {2013: current_geojson_layer};
asyncOtherBoundaries(vector_layers);

census_year = 2016;


var population_intervals = {
	/* counties from commission */
	'p2018': {'a': [new Date(2017, 6, 27), new Date(2018, 9, 1)]}, //commission report -now
	'p2013': {
		/* 2016 census */
		'b': [new Date(2016, 7, 14), new Date(2018, 9, 1)], //2016 cnsus - now
		/* 2011 census */
		'a': [new Date(2013, 3, 20), new Date(2016, 7, 14)] // act to 2016 census
	},
	'p2007': {
		/* 2011 census */
		'b': [new Date(2011, 6, 30), new Date(2016, 2, 26)] //  2011 census to 2016 election
	}
};

var current_interval = population_intervals.p2018.a; //getNextInterval(new Date());
var next_interval;



change_histog(2016);




/**
 * if click
 * if rangechange
 */
function updateStuff(t, group_num) {
	console.log("UPDATING!!!!");
	change_histog(2011);

	// if it is a click we can ge the item from the event	
	// getHighlitedInterval();
	// getBackgroundItem();
	var track = 'enacted';

	// act_year = getActYear(t, group_num);
	// census_year = getCensusYear(t, group_num);
	act_year = 2009
	census_year = 2006;
	displayNewMap(act_year, census_year);
	// displayNewMap(t, group_num);
	
	displayNewDetails();
}

function getActYear(t, group_num) {
	if (group_num == 1) {
		return getActYear_enacted(time);
	} 
	// else if () { }

}
function getCensusYear(t, group_num) {

}

/**
 *
 */
function getCensusYear_enacted(time) {
	let year = -1;
	for (let i = 0; i < census_taken.length; i++) {		
		if (time < census_taken[i].end) {
		// if (census_taken[i].end < time && time < census_taken[i-1].end) {
			// return census_taken[i].start.year;
			// year = 
			// continue;
		} else {
			year = census_taken[i].start.getFullYear();
			break;
		}
	}
	return year;
}

/**
 *
 */
function getActYear_enacted(time) {
	let year = -1;
	for (let i = 0; i < actsOnly.length; i++) {
		if (time < actsOnly[i].start) {
		// if (actsOnly[i].start < time && time < actsOnly[i+1].start) {
			// return actsOnly[i].start.getFullYear();

		} else {
			year = actsOnly[i].start.getFullYear();
			break;
		}
	}
	// for (let i of byAct_census_act) {
	// 	if (within(time, i)) return i.start.year();
	// }
	// for (let i of byAct_census_act) {
	// 	if (within(time, i)) return i.start.year();
	// }	
	return year;
}

/**
 *
 */
function within(time, interval) {
	if (interval.start < time && time < interval.end) {
		return true;
	} else {
		return false;
	}
}

/**
 *
 */
function getEnactedYears(time) {
	let a = 0;
	let c = 0;
	let acts = byAct_census_act;
	for (let i = 0; i < acts.lenght; i++) {
		if (acts[i].start < time && acts[i+1] < time) {
			a = acts[i].start.year;
		}
	}

	// for (let y of actcen[a]) {
	if (censuses.id['census '+ actcen[a][0]].end > time ) {
		console.log('next...');
		c = actcen[a][1]; //.start.year;
	}
	return [a, c];
}

/**
 *
 */
function getHighlitedInterval() {
}

/**
 *
 */
// function displayNewMap(time, group_num){	
function displayNewMap(act_year, census_year){	
	console.log("displayNewMap(time, track) called...");
	
	var change_census = false;
	var change_boundaries = true;


	if (change_census) {
		change_census_style(current_geojson_layer, census_year);
	} else if (change_boundaries) {
		change_constituency_boundaries(vector_layers, current_geojson_layer, act_year, census_year);
	}
}

/*********************************
 *
 */
function loadDistraction(){
	console.log("loadDistraction() was called!!");	
}
function getEffectedMap(time) {
}
function displayNewDetails() {
	console.log("displayNewDetails() called...");
}
/**
 * simple loop if boundary intervals do NOT overlap
 */
/*function displayNewMap(time){	

	// getYears();
	vector_layers.addTo(map);


	console.log("displayNewMap() called...");
	map.removeLayer(current_geojson_layer);

	if (time > population_intervals.p2018.a[0]) {
		console.log("--ERROR -- Future unknown --");
		show_pop_next = false;
		current_geojson_layer = layer_b2013_next;
		next_interval = population_intervals.p2018.a;
	} else if ( time > population_intervals.p2013.b[0]) {
		show_pop_next = true;
		current_geojson_layer = layer_b2013_next;
		next_interval = population_intervals.p2013.b;
		// BOGUS
		// this layer has to change when it is available
	}
	else if (time > population_intervals.p2013.a[0]) {
		show_pop_next = false;
		current_geojson_layer = layer_b2013;
		next_interval = population_intervals.p2013.a;
	}
	else if (time > population_intervals.p2007.b[0]) {
		show_pop_next = false;
		current_geojson_layer = layer_b2007_next;
		next_interval = population_intervals.p2007.b;
	} else {
		console.log("--INVERVAL-- ERROR, boundaries prior to Act 2005 (General Election 2007) not found");
		show_pop_next = false;
		current_geojson_layer = layer_b2007_next;
		next_interval = population_intervals.p2007.b;
	}
	// update_constituency_style();

	map.addLayer(current_geojson_layer);
}*/
/*
	if (time > population_intervals.p2018.a[0]) {
		console.log("--ERROR -- Future unknown --");
		show_pop_next = false;
		current_geojson_layer = layer_b2013_next;
		next_interval = population_intervals.p2018.a;
	} else if ( time > population_intervals.p2013.b[0]) {
		show_pop_next = true;
		current_geojson_layer = layer_b2013_next;
		next_interval = population_intervals.p2013.b;
		// BOGUS
		// this layer has to change when it is available
	}
	else if (time > population_intervals.p2013.a[0]) {
		show_pop_next = false;
		current_geojson_layer = layer_b2013;
		next_interval = population_intervals.p2013.a;
	}
	else if (time > population_intervals.p2007.b[0]) {
		show_pop_next = false;
		current_geojson_layer = layer_b2007_next;
		next_interval = population_intervals.p2007.b;
	} else {
		console.log("--INVERVAL-- ERROR, boundaries prior to Act 2005 (General Election 2007) not found");
		show_pop_next = false;
		current_geojson_layer = layer_b2007_next;
		next_interval = population_intervals.p2007.b;
	}
*/