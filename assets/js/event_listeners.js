//
// event_listeners
//

/* 
tl_items.on('*', function (event, properties) {
      logEvent(event, properties);
    });

    function stringifyObject (object) {
      if (!object) return;
      var replacer = function(key, value) {
        if (value && value.tagName) {
          return "DOM Element";
        } else {
          return value;
        }
      }
      return JSON.stringify(object, replacer)
    }

    function logEvent(event, properties) {
      var log = document.getElementById('log');
      var msg = document.createElement('div');
      msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
          'properties=' + stringifyObject(properties);
      log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
    }
*/

/**
 *
 */
function centreNewInterval(g, t) {
	
}

/**
 *
 */
timeline.on('rangechange', function (properties) {
	console.log('timeline range changed!!');

	// logEvent('rangechange', properties);
	var t = getCentreDate(properties);
	// if (!isSameInterval(t)) updateStuff(t);
	if (!isSameInterval(t)) 
		// updateStuff(t);
	tl.rangeChanged = true;
});

timeline.on('mouseDown', function (p) {
	console.log('mouseDown on timeline!!');
	tl.rangeChanged = false;
});

timeline.on('click', function (p) {
	if (tl.rangeChanged) {
		return;
	}
	if (selected_element) {
		selected_element.style.border = 'none';
		selected_element.style.zIndex = 0;
	}

	console.log('clicked on timeline!!');
	// console.log('Bad Bad Bad to have the "tl.selected_track" variable defined outside this funnction');
	console.log('track =' + tl.selected_track);
	console.log('new track =' + p.group);

	// logEvent('rangechange', properties);
	let what = p.what;
	let item = p.item;
	let group = p.group;
	console.log(p);
	console.log('what was clicked = ' + what + ', ' + item);
	// if (!isSameInterval(t)) updateStuff(t);


	// if click not on one of tracks
	// if ([1, 2, 3, 4].indexOf(p.group) == -1) 
	// 	return;
	if (p.time > byAct_act_census[0].end) 
		return;
	if (p.time < byAct_census_act[byAct_census_act.length-1].start) 
		return;
	
	if (p.item != null) {
		console.log('a non-BG item was clicked');
		return;
		// prolly want at least a tooltip with dates on click
	}

	let start, end;
	[start, end] = get_clicked_interval(p.group, p.time);
	moveToCentre(start, end);
	tl.selected_track = p.group;
/*
	if (tl.selected_track == p.group) {
		if (!isSameInterval(t)) {
			centreNewInterval(p.group, p.time);
		}
	}

	let t;
	if (p.what == 'background') {

		t = p.time;
	} else return;
	
	if (isSameInterval(t) && tl.selected_track == group) {
		
	} else {
		updateStuff(t, p.group);
	}
*/
	selected_element = p.event.target.parentElement;
	selected_element.style.border = "2px solid white";
	selected_element.style.zIndex = 2;


/**
 *
 * to have border around the 3 tracks get 
 	n = which number child p.event.target.parentElement is
	p.event.target.parentElement.parentElement.next(~Previous)Sibling.nthChild(n)
 */

	updateStuff();
});


function get_clicked_interval(group, time) {
	// var item = timeline.itemSet.itemFromElement(p.event.target.parentElement);
	// var item = timeline.itemSet.itemFromTarget(p.event); //.target.parentNode);

	// timeline.focus(id, options);
	var sel = timeline.getSelection();

	
	/**
	 *
	 *	REALLY GONNA HAVE TO MAKE AN array of by_act and by_eff start dates
	 */

	let track_dates;
	switch(group) {
		case 1:
			track_dates = byAct;
			// start = byAct_act_census[1].start;
			// end = byAct_act_census[1].end;
			break;
		case 2: case 3: case 4:
			track_dates = byEff;
			// start = byEff_act_census[1].start;
			// end = byEff_act_census[1].end;
			break;
		default:
			console.log('...click not on any track');
			return;
	}

	let start, end;
	// let d;	
	// for (d of track_dates) {
	for (let i = 0; i < track_dates.length; i++) {
		if (time < track_dates[i]._d) 
			continue;
		else {
			start = track_dates[i]._d;
			end = track_dates[i-1]._d;
			break;
		}
	}
	// console.log("d = " + d._d);
	// let y = d._d.getFullYear();

	// let start = track_dates[1].start.getTime();
	// let end = track_dates[1].end.getTime();
	let centre = new moment((start.getTime() + end.getTime())/2);
	console.log('start = ' + start);
	console.log('end = ' + end);
	console.log('centre = ' + centre._d);

	start = new moment(centre);
	end = new moment(centre);
	start._d.setFullYear(centre._d.getFullYear()-4);
	end._d.setFullYear(centre._d.getFullYear()+4);
	return [start, end];
}


/** 
 *
 */
/*title_info.onAdd = function(map) {
 	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
 }*/

/**
 * updated when timeline changed or switch clicked...
 */
/*title_info.update = function (props) {
	console.log("want to see if we can use props of collection rather than of individual feature");
	console.log("have to write them into the geojson too, they are not in spec but not forbidden");
	// console.log(props.rep_rat_next);
	this._div.innerHTML =
			'<h3>YEAR...</h3>'+
			'put the switch view button here...' + 
			'' + 
			'<h4>Nationwide Representative Ratio</h4>' +
			'<b>' + 'CENSUS total...' + '</b><br />' + 
			0 + ' people / TD';
};
title_info.addTo(map);
*/
/**
 *
 */
hover_info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

/**
 *
 */
hover_info.update = function (props) {
	// console.log('census year = ' + census_year);
	var r;
	this._div.innerHTML = '<h4>Representative Ratio</h4>';
	if (props){
		// console.log(props.rep_rat_next);
		r = props['rr' + census_year];

		this._div.innerHTML += 
			'<b>' + props.name + ':&nbsp </b>' +
			'<div id="ratio">&nbsp&nbsp' + r + '</div><br />' + // people / TD
			'Population:&nbsp <div id="pop">' + props['pop' + census_year] + '</div><br />' +
			'TDs:&nbsp <div id="tds">' + props.no_tds + '</div><br />';
	} else {
		this._div.innerHTML += 'Hover over a constituency';
	}
	/*
	console.log("r = " + r);
	//ha can put the title in here too for when the hover is not over a constituency

	this._div.innerHTML = 
		'<h4>Representative Ratio</h4>' +
		(props ? '<b>' + props.name + '</b><br />' + 
			r + ' people / TD'
		: 'Hover over a constituency');
	*/
};
hover_info.addTo(map);

/**
 *
 */
legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		// grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		// grades = [22, 23, 24, 25, 26, 27, 28, 29, 30],
		// grades = [22, 24, 26, 28, 30],
		// grades = [20, 25, 30],
		grades = [21, 24, 27, 30],
		size = 3,
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + size) + '"></i>' +
			from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = 'Pop per TD<br>(Thousands)<br>' + labels.join('<br>');
	return div;
};
legend.addTo(map);
