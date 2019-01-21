
var histog = dc.barChart("#histog");
var rows_chart = dc.rowChart("#rows_chart");

// change_histog(2016);
function change_histog(year){
	console.log("year = " + year);
/*
var make_histog = function (chart, col, ndx, extent, width, num, labelx) {
	var f   =   function(d) {return d[col];},
    dim =   ndx.dimension(f),
    grp =   dim.group(function(d){ return Math.floor(d/width)*width; });

	chart
	    .height(255)
	    .x(d3.scale.linear().domain(extent))
	    .xUnits(function(){return num;}) 
	    .xAxisLabel(labelx)
	    .yAxisLabel("Count")
	    .dimension(dim)
	    .group(grp);
	// speed12Bars.xAxis().ticks(3);
	// speed12Bars.yAxis().ticks(2);  
	// speed12Bars.render();
}
*/

/**
* 
*/        
d3.csv("assets/DATA/act2013_c2011_c2016.csv").then( function(data) {
	var ndx =   crossfilter(data);
	var i = 0;
	data.forEach(function(x) {            
	    // x.pos       =   x.Position;
	    x.name      =   x.name;
	    
	    // x.Speed12   =   +x.Speed12;
	    x.rr     	=   +x["rr"+year];
	});

	ndx         	=   crossfilter(data);

	var rrFunc    		=   function(d){ return +d.rr; },
	    rrDim     		=   ndx.dimension(rrFunc),     
	    rrExtent  		=   [20000, 33000],
	    rr_bin_width	= 1000,
	    // rr_num_bins		= 10,
	    rr_name_Grp			=	rrDim
	    							.group()
	    							.reduceSum(dc.pluck('rr'));
	    rrGrp
	        =   rrDim.group(
	                function(d) {
	                    return Math.floor(d/rr_bin_width)*rr_bin_width;
	                }
	            );

	var nameFunc	=   function(d){ return d.Name; };
	// var nameDim     =   ndx.dimension( nameFunc );
	var num_over_30 = 0;
	var filtered_name_func = function(d) {
		if (d.rr > 30000) {
			num_over_30++;
			return d.name;
		}
		else return'';
	}
	var nameDim     =   ndx.dimension( filtered_name_func );
	console.log('nameDim = ' + nameDim);
	// var nameDim     =   ndx.dimension( dc.pluck('name') );
	// nameGrp			=	nameDim.group();
	// nameDim 		= 		nameDim.filter(function(d) { 
	// 	if (d !== '') return d; 
	// });
	// var nd  = nameDim.filter('').remove();
	var nameGrp			=		nameDim.group().reduceSum(function(d) { return d.rr; });
	var ng = remove_bins(nameGrp, '');
	console.log('nameGrp = ' + nameGrp.all());
	// var nd  = nameDim.bottom(num_over_30-2);
	// nameGrp			=	rrDim.group().reduceSum(function(d) { return (d > 30000)?dc.pluck('name') });
	// nameGrp			=	rrDim.group().reduceSum(dc.pluck('name'));
	// var nameGrp 	=	nameDim.group().reduce(dc.pluck('name'));
	        /*=   nameDim.group(
	                function(d) {
	                    return d;
	                }
	            );*/
	// var data = function(d) {
	// 	return {}
	// }


	function remove_bins(source_group) { // (source_group, bins...}
	    var bins = Array.prototype.slice.call(arguments, 1);
	    return {
	        all:function () {
	            return source_group.all().filter(function(d) {
                	return bins.indexOf(d.key) === -1;
            	});
        	}
    	};
	}








	histog
	    .height(255)
	    .x(d3.scaleLinear().domain(rrExtent))
	    .xUnits(function(){return 13;}) 
	    .xAxisLabel("Representative ratio")
	    .yAxisLabel("Count")
	    .dimension(rrDim)
	    .group(rrGrp);
	histog.xAxis().ticks(4);
	histog.yAxis().ticks(2);
	histog.render();

	rows_chart
	    .height(755)
	    // .width(400)
	    // .elasticX(true)
	    .elasticX(false)
	    // xAxis().ticks(3)		
	    // .y(d3.scale.ordinal().domain(nameDim.group()))
	    // .xUnits(function(){return 16;}) 
	    // .xAxisLabel("Representative ratio")
	    // .yAxisLabel("Constituency")
	    // .dimension(rrDim)
	    .dimension(nameDim)
	    // .dimension(nd)
	    // .filter()
	    // .data(nameDim)
	    // .data(rrFunc)
	    .group(ng)
	    // .filter('')
	    ;
	    // .group(rr_name_Grp);

	rows_chart.x(d3.scaleLinear().range([0, rows_chart.width()]).domain([30000, 33000]));
	// can make it go left by simplt swapping max and min of domain
	// prolly can't have it both ways tho
	// rows_chart.xAxis().tickValues([30000, 31000, 32000]);
	rows_chart.xAxis().scale(rows_chart.x()).tickValues([30000, 31000, 32000]);
	// rows_chart.xAxis().scale(rows_chart.x()).tickValues([20000, 25000, 30000, 33000]);
	rows_chart.render();          

});
}