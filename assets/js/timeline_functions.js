/*

Items at wrong date...
https://stackoverflow.com/questions/44397092/vis-js-timeline-items-at-wrong-position
...fixed in 4.20
...but I have 4.21 and dates are still wrong
...
......meh, use moment.js instead (gotta sort out the deprecated constructor tho)
*/			

// /**
//  *
//  **/
// function loadAllItems(all_items, tl_item_categories) {
// 	for (let group of tl_item_categories) {
// 		for (let item of group) {
// 			all_items.update(item);
// 		}
// 	}
// };

// /**
//  * OPTIONS
//  */
// function initOptions() { 		
// 	// console.log("fillTimeline() was called!!");	
// 	var today 		= new Date();
// 	var start_date 	= new Date();
// 	var end_date 	= new Date();

// 	start_date.setFullYear(today.getFullYear()-4);
// 	end_date.setFullYear(today.getFullYear()+4);

// 	return { start: start_date, end: end_date };
//  }

// /**
//  *
//  */
// // function initTimeline(timeline, items, groups) {
// 	// initTimeline(timeline, all_items, groups); // fillTimeline();
// function initTimeline(timeline_container, tl_item_categories, tl_tracks) {
// 	/*
// 	 * GROUPS
// 	 */
// 	var tl_tracks = new vis.DataSet([
// 	    {id: 1, content: tl_tracks[0]},
// 	    {id: 2, content: tl_tracks[1]}
// 	    // {id: 'group_stat', content: 'Statutory'},
// 	    // {id: 'group_leg', content: 'Legeslitive'}
// 	    // {id: 'group_exec', content: 'Executive'}
// 	    // {id: 3, content: 'Executive'}
// 	]);
// 	/*
// 	 * ITEMS
// 	 */
// 	var tl_items = new vis.DataSet();
// 	loadAllItems(tl_items, tl_item_categories);
	
// 	/*
// 	 * OPTIONS
// 	 */
// 	var options = initOptions();

// 	/*
// 	 * TIMELINE
// 	 */
// 	var timeline = new vis.Timeline(timeline_container);	
// 	timeline.setOptions(options);
// 	timeline.setGroups(tl_tracks);
// 	timeline.setItems(tl_items);
// 	return timeline;
// }








/**
 *
 */
function loadAllItems(all_items, tl_item_categories) {
	for (let group of tl_item_categories) {
		for (let item of group) {
			all_items.update(item);
		}
	}
 }

/**
 * OPTIONS
 */
function initOptions(timeline) {
	// console.log("fillTimeline() was called!!");	
	var today 		= new moment();
	var start_date 	= new moment();
	var end_date 	= new moment();

	start_date._d.setFullYear(today._d.getFullYear()-4);
	end_date._d.setFullYear(today._d.getFullYear()+4);

	let minHeight = "200px";
	// let groupMinHeight = "90px";
	// let nestedGroups = ["dail"];


	var options = {
		start: start_date, 
		end: end_date, 
		minHeight: minHeight, 
		// nestedGroups: nestedGroups, 
		// showNested: true,
		// subgroupStack: false
	};
	timeline.setOptions(options);
 }

/**
 *
 */
function initTimeline(timeline, tl_item_categories, tl_tracks) {
	/*
	 * ITEMS
	 */
	
	loadAllItems(tl_items, tl_item_categories);
	timeline.setItems(tl_items);

	initOptions(timeline);
	timeline.setGroups(tl_tracks);
 }

/**
 *
 */
 /*
function getNextInterval(t) {
	// this is surely not as efficient as possible but there are bigger fish to fry
	console.log("getNextInterval() called...");


	// ...these should now be population_intervals...
	// we want to enforce a change at earliest stage...i.e.
	if (t < intervals[0][0]) 
			return intervals[0];
	if (t > intervals[intervals.length-1][1]) 
		return intervals[intervals.length-1];
	
	// for (let interval of background_intervals) {
	for (let interval of intervals) {

		// if (interval.start < t  && t <= interval.end) {
		if (interval[0] < t  && t <= interval[1]) {
			// return {interval.start, interval.end};
			return interval;
		}
	}

	if (t < intervals[0][0]) 
		return intervals[0];
	if (t > intervals[intervals.length-1][1]) 
		return intervals[intervals.length-1];
	
	// for (let interval of background_intervals) {
	for (let interval of intervals) {

		// if (interval.start < t  && t <= interval.end) {
		if (interval[0] < t  && t <= interval[1]) {
			// return {interval.start, interval.end};
			return interval;
		}
	}
}
*/

/**
 *
 */
function isSameInterval(t) {
	// console.log("isSameInterval() called...");

	// if (current_interval.start < t  && t < current_interval.end) {
	if (current_interval[0] < t  && t < current_interval[1]) {
		return true;
	}
	else {
		// next_interval = getNextInterval(t);
		return false;
	} 
}

function moveToCentre(start, end) {
	// let w = (timeline.range.end - timeline.range.start) / 2;
	// let start_date 	= new Date(t-w);
	// let end_date 	= new Date(t.getTime()+w)

	let options = {
		start: start,
		end: end, 
	};
	timeline.setOptions(options);
}

/**
 *
 */
function getCentreDate(properties) {
	// console.log("getCentreDate() called...");
	var tstart = new moment(properties.start)._d.getTime();
	var tend = new moment(properties.end)._d.getTime();

	return new moment((tstart + tend)/2);
	// var twidth = tend - tstart;
	// var tcentre = new Date(tstart + twidth/2);
	// // console.log("tcentre = " + tcentre);
	// return tcentre;
}

function setCentreDate(timeline, t) {
	let w = (timeline.range.end - timeline.range.start) / 2;
	let start_date 	= new moment(t-w);
	let end_date 	= new moment(t.getTime()+w)

	let options = {
		start: start_date,
		end: end_date, 
	};
	timeline.setOptions(options);
	
}