

// var my_chart = dc.seriesChart("#chart");
// var my_chart = dc.lineChart("#chart");
// var my_chart = dc.scatterPlot("#chart");
var my_chart = dc.compositeChart("#rep-compos-chart");

/**
* 
*/        
// var parseDate = d3.time.format("%Y,%m,%d").parse;
// careful of the spaces
var parseDate = d3.timeParse("%Y,\ %m,\ %d");//.parse;

function getCols(x) {
	x.event				=	x.event;
	// x.date				=	new Date(x.date);
	x.date				=	parseDate(x.date);
	x.national_pop		=	+x.national_pop;
	//	 x.tds_high		=   x.  // tds_high;
	//	 x.tds_low		=   x.  // tds_low;
	x.national_tds		=	+x.national_tds;
	x.national_ratio	=	+x.national_ratio;
	x.lowest_name		=   x.lowest_name;
	x.lowest_pop		=   +x.lowest_pop;
	x.lowest_tds		=   +x.lowest_tds;
	x.lowest_ratio		=	+x.lowest_ratio;
	x.highest_name		=	x.highest_name;
	x.highest_pop		=   +x.highest_pop;
	x.highest_tds		=   +x.highest_tds;
	x.highest_ratio		=	+x.highest_ratio;
	return x;
}

d3.csv("assets/DATA/rep_line.csv").then(function(data) {
	data.forEach(function(x) { return getCols(x); });
	var ndx					=   crossfilter(data);

	var dateFunc		=   function(d){ return (d.date); },
	    dateDim			=   ndx.dimension(dateFunc),
	    dateExtent		=   [
		    					new Date("1935,1,1"),
		    					new Date("2019,1,1")
		    				];
	    // dateExtent  		=   [dateDim.min, dateDim.max];

	var rrFunc    		=   function(d){ return +d.national_ratio; },
	    rrDim     		=   ndx.dimension(rrFunc), //dc.pluck('key')),
	    rrExtent  		=   [10000, 46000],
	    // rrGrp			=   dateDim.group().reduceSum(rrFunc);
	    rrGrp			=   dateDim.group().reduceSum(dc.pluck('national_ratio'));
	    // (function(d) {return Math.floor(d/rr_bin_width)*rr_bin_width;});
	    // rr_bin_width	= 1000,
	    // rr_num_bins		= 10,

	var rrHighFunc    		=   function(d){ return +d.highest_ratio; },
	    rrHighDim     		=   ndx.dimension(rrHighFunc), //dc.pluck('key')),
	    rrHighGrp			=   dateDim.group().reduceSum(dc.pluck('highest_ratio'));


	var rrLowFunc    		=   function(d){ return +d.lowest_ratio; },
	    rrLowDim     		=   ndx.dimension(rrLowFunc), //dc.pluck('key')),
	    rrLowGrp			=   dateDim.group().reduceSum(dc.pluck('lowest_ratio'));


	var tdFunc			=   function(d){ 
								return +d.national_tds;
							},
	    tdDim			=   ndx.dimension(tdFunc),
	    // dateExtent  		=   [dateDim.min, dateDim.max];
	    tdExtent		=   [150, 170],
	    tdGrp			=   tdDim.group();

	var popFunc			=   function(d){ return +d.national_pop; },
	    popDim			=   ndx.dimension(popFunc);
	
	var eventFunc			=   function(d){ return d.event; },
	    eventDim			=   ndx.dimension(eventFunc);
	// var index = crossfilter([]);
	// var dimension = index.dimension(dc.pluck('key'));
     // * chart.dimension(dimension);
     // * chart.group(dimension.group(crossfilter.reduceSum()));

     var lowGrp = dateDim.group().reduceSum(dc.pluck('lowest_ratio'));
     // var lowGrp = dateDim.group().reduceSum(function(d) { return d.lowest_ratio });
     var natGrp = dateDim.group().reduceSum(function(d) { return d.national_ratio });
     var highGrp = dateDim.group().reduceSum(function(d) { return d.highest_ratio });



  	var dim = ndx.dimension(function(d) {return [+d.national_ratio, +d.lowest_ratio, +d.highest_ratio]; });
  	// var dim = ndx.dimension(function(d) {return ["national ratio": +d.national_ratio, d.lowest_name: +d.lowest_ratio, d.highest_name: +d.highest_ratio]; });
  	var rrGrp = dim.group().reduceSum(dc.pluck('national_ratio'));
  	// reduceCount(function(d) {return d.date;});
	// rrGrp			=   dateDim.group().reduceSum(dc.pluck('national_ratio'));
	var lowNameFunc		=   function(d){ return (d.lowest_name); },
		lowNameDim		=	ndx.dimension(lowNameFunc)

	var highNameFunc		=   function(d){ return (d.lowest_name); },
		highNameDim		=	ndx.dimension(lowNameFunc)

     my_chart
			.height(255)
			.x(d3.scaleTime().domain(dateExtent))
			.y(d3.scaleLinear().domain(rrExtent))
			.xAxisLabel("Date")
			.yAxisLabel("Representative ratio")
			// .yAxisPadding(20)
			// .clipPadding(10)
			// .dimension(dateDim, tdDim, popDim, eventDim)
			// .dimension(dateDim)
			// .dotRadius(10)

/*    		.valueAccessor(function (d) {
				return d.value;
			})
			.title(function (d) {
				return "\nRatio: " + d.key;
			})*/
			// .colors(['red', 'blue', 'green'])
			// .ordinalColors(['red','green','blue'])

			// .x(d3.scale.linear().domain([4, 27]))
			// .dimension(lowNameDim)
			// .dimension(dim)
			// .title(function(data) { 
			//    return data.key + ': ' + data.value; 
			//    // return data.lowest_name + ': ' + data.value; 
			// })

			// .label(function(data) { 
			//    return data.lowNameDim + ': ' + data.value; 
			// })
			.legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
			.compose([
				dc.lineChart(my_chart)
					// .dimension(dateDim)
					// .ordinalColors(['red'])
					// .colors(d3.scale.ordinal().range(['red']))
					// .colors('green')
					.group(lowGrp, 'lowest ratio')
					.dashStyle([5,5])
					.renderDataPoints({
						radius: 3,
						fillOpacity: 0.8,
						strokeOpacity: 0.8,
						// fillColor: 'green',
						// strokeColor: 'green',
						// color: 'green',
						// fill: 'green',
						// stroke: 'green',
					})
					,



				dc.lineChart(my_chart)
					.group(natGrp, 'nationwide ratio')
					.renderDataPoints({
						radius: 3,
						fillOpacity: 0.8,
						strokeOpacity: 0.8,
					})
				,
				dc.lineChart(my_chart)
					.group(highGrp, 'highest ratio')
					.dashStyle([1, 2, 1])
					.renderDataPoints({
						radius: 3,
						fillOpacity: 0.8,
						strokeOpacity: 0.8,
					})
					// .colors('red')
			])
	// my_chart.xAxis().ticks(4);
	// my_chart.yAxis().ticks(5);
	// my_chart
    		.brushOn(false) // points wont render with brush on
	.render();
});

// my_chart.on('pretransition.add-tip', function(chart) {
//     chart.selectAll('g.row')
//         .call(rowtip)
//         .on('mouseover', rowtip.show)
//         .on('mouseout', rowtip.hide);
// });