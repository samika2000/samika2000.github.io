var selectValue = "Total";
function button_combined(){
	selectValue = "Total"
	populate_map("medals_total.csv");
}

function button_women(){
	selectValue = "Women";
	populate_map("medals_women.csv");
}

function button_men(){
	selectValue = "Men"
	populate_map("medals_men.csv");
}


	// The svg
const allGroup = ["total", "Gold", "Silver","Bronze"];
let filename;
const select = d3.select('#select')
	.on('change',onchange);

const options = select
  .selectAll('option')
	.data(allGroup).enter()
	.append('option')
		.text(function (d) { return d; });
var svg = d3.select("svg"),
	width = +svg.attr("width"),
	height = 800;
svg.append("text")
		.attr("x", (width / 2))             
		.attr("y", 20)
		.attr("text-anchor", "middle")  
		.style("font-size", "16px") 
		.style("text-decoration", "underline")  
		.text("Medal Counts World Map");
		
const tip = d3.tip() 
	.attr('class','d3-tip')
	.offset([-7,0])
	.html(function(d) {
	    const dataRow = data.get(d.properties.name);
	    if (dataRow) {
		    try{
		        return dataRow.code + ": " + dataRow2.total;
		    } catch (e){
			    return "United States" + " Total: "+d.total;
		    }
	    } else {
		    return d.properties.name + " Total: "+d.total;
	    }
    });
const tip2 = d3.tip()
	.attr('class','d3-tip')
	.offset([-7,0])
	.html(function(d) {
	    const dataRow2 = data.get(d.properties.name);
		//console.log(dataRow2)
	    if (!dataRow2) {
			return d.properties.name + " Gold: "+d.Gold;
		}//handles normal cases
		
		if (dataRow2.code === undefined) {
			return "United States" + " Gold: " + d.Gold;
		}//handles the US
		return dataRow2.code + ": " + dataRow2.Gold; //error case; should not execute
		    //try{
		    //    return dataRow2.code + ": " + dataRow2.Gold;
		    //} catch (e){
			//    return "United States" + " Gold: "+d.Gold;
//		    }
		//return d.properties.name + " Gold: "+d.Gold;
    });
const tip4 = d3.tip()
	.attr('class','d3-tip')
	.offset([-7,0])
	.html(function(d) {
		const dataRow2 = data.get(d.properties.name);
		//console.log(dataRow2)
	    if (!dataRow2) {
			return d.properties.name + " Silver: "+d.Silver;
		}
		
		if (dataRow2.code == undefined) {
			return "United States" + " Silver: "+d.Silver;
		}
	    return d.dataRow2.code + " Silver: "+datarow2.Silver;
    });
const tip3 = d3.tip()
	.attr('class','d3-tip')
	.offset([-7,0])
	.html(function(d) {
		const dataRow2 = data.get(d.properties.name);
	    if (!dataRow2) {
			return d.properties.name + " Bronze: " + d.Bronze;
		}
		if (dataRow2.code == undefined) {
			return "United States" + " Bronze: "+d.Bronze;
		}
		   //console.log("no dataRow2", +d.Bronze);
		return d.dataRow2.code + " Bronze: "+datarow2.Bronze;
	});

// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
	.scale(width / 2 / Math.PI)
	.translate([width / 2, height / 2])
var path = d3.geoPath()
	.projection(projection);

// Data and color scale
const data = d3.map();
const colorScheme = d3.schemeGreens[6];
colorScheme.unshift("#eee")
const colorScale1 = d3.scaleThreshold()
	.domain([1, 6, 26, 101, 501, 1001])
	.range(colorScheme);
const colorScheme2 = d3.schemeReds[6];
colorScheme2.unshift("#eee")
const colorScale2 = d3.scaleThreshold()
	.domain([1, 6, 26, 51, 101, 501])
	.range(colorScheme2);
const colorScheme3 = d3.schemeBlues[6];
colorScheme3.unshift("#eee")
const colorScale3 = d3.scaleThreshold()
	.domain([1, 6, 26, 51, 101, 501])
	.range(colorScheme3);
const colorScheme4 = d3.schemePurples[6];
colorScheme4.unshift("#eee")
const colorScale4 = d3.scaleThreshold()
	.domain([1, 6, 26, 51, 101, 401])
	.range(colorScheme4);
const colorScheme5 = d3.schemeGnBu[6];
colorScheme5.unshift("#eee")
const colorScale5 = d3.scaleThreshold()
	.domain([1, 6, 26, 51, 101, 401])
	.range(colorScheme5);

// Legend
var g = svg.append("g")
	.attr("class", "legendThreshold")
	.attr("transform", "translate(20,20)");
g.append("text")
	.attr("class", "caption")
	.attr("x", 0)
	.attr("y", -6)
	.text("Medal Count");
var labels = ['0', '1-5', '6-25', '26-100', '101-500', '501-1000', '> 1000'];
var legend = d3.legendColor()
	.labels(function (d) { return labels[d.i]; })
	.shapePadding(4)
	.scale(colorScale1);
svg.select(".legendThreshold")
	.call(legend);

	
function onchange() {
	//console.log("here")
	selectValue = d3.select('#select').property('value');
	d3.select('body')
		.append('p');
	if(selectValue == "Silver"){
		svg.select(".legendThreshold")
			.remove();
		// Legend
		var g = svg.append("g")
			.attr("class", "legendThreshold")
			.attr("transform", "translate(20,20)");
		g.append("text")
			.attr("class", "caption")
			.attr("x", 0)
			.attr("y", -6)
			.text("Silver Medal Count");
		var labels = ['0', '1-5', '6-25', '26-50', '51-100', '101-500', '> 500'];
		var legend = d3.legendColor()
			.labels(function (d) { return labels[d.i]; })
			.shapePadding(4)
			.scale(colorScale3);
		svg.select(".legendThreshold")
			.call(legend);
		d3.queue()
			.defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
			.defer(d3.csv, filename, function(d) { 
			data.set(d.code,+d.Silver);
			})
			.await(ready);
	} else if(selectValue == "Bronze"){
		svg.select(".legendThreshold")
			.remove();
		// Legend
		var g = svg.append("g")
			.attr("class", "legendThreshold")
			.attr("transform", "translate(20,20)");
		g.append("text")
			.attr("class", "caption")
			.attr("x", 0)
			.attr("y", -6)
			.text("Bronze Medal Count");
		var labels = ['0', '1-5', '6-25', '26-50', '51-100', '101-400', '> 400'];
		var legend = d3.legendColor()
			.labels(function (d) { return labels[d.i]; })
			.shapePadding(4)
			.scale(colorScale4);
		svg.select(".legendThreshold")
			.call(legend);
		d3.queue()
			.defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
			.defer(d3.csv, filename, function(d) { 
			data.set(d.code,+d.Bronze);
			})
			.await(ready);
	} else if(selectValue == "Total"){
		svg.select(".legendThreshold")
			.remove();
		// Legend
		var g = svg.append("g")
			.attr("class", "legendThreshold")
			.attr("transform", "translate(20,20)");
		g.append("text")
			.attr("class", "caption")
			.attr("x", 0)
			.attr("y", -6)
			.text("Medal Count");
		var labels = ['0', '1-5', '6-25', '26-100', '101-500', '501-1000', '> 1000'];
		var legend = d3.legendColor()
			.labels(function (d) { return labels[d.i]; })
			.shapePadding(4)
			.scale(colorScale1);
		svg.select(".legendThreshold")
			.call(legend);
		d3.queue()
			.defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
			.defer(d3.csv, filename, function(d) { 
			data.set(d.code,+d.total);
			})
			.await(ready);
	}
	else if(selectValue == "Gold"){
		console.log(selectValue)
		svg.select(".legendThreshold")
			.remove();
		// Legend
		var g = svg.append("g")
			.attr("class", "legendThreshold")
			.attr("transform", "translate(20,20)");
		g.append("text")
			.attr("class", "caption")
			.attr("x", 0)
			.attr("y", -6)
			.text("Gold Medal Count");
		var labels = ['0', '1-5', '6-25', '26-50', '51-100', '101-500', '> 500'];
		var legend = d3.legendColor()
			.labels(function (d) { return labels[d.i]; })
			.shapePadding(4)
			.scale(colorScale2);
		svg.select(".legendThreshold")
			.call(legend);
		d3.queue()
				.defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
				.defer(d3.csv, filename, function(d) { 
				data.set(d.code,+d.Gold);
				})
				.await(ready);
	}
};


function ready(error, topo) {
	if (error) throw error;

	// Draw the map
	if (selectValue == "Total"){
		svg.append("g")
			.attr("class", "countries")
			.selectAll("path")
			.data(topo.features)
			.enter().append("path")
				.attr("fill", function (d){
					// Pull data for this country
					d.total = data.get(d.id) || 0;
					// Set the color
			if (selectValue == "Total"){
					svg.call(tip);
					return colorScale1(d.total);
			}else if (selectValue == "Gold"){
					svg.call(tip2);
					//console.log("no dataRow");
					return colorScale2(d.Gold);
			}else if (selectValue == "Silver"){
					return colorScale3(d.Silver);
			}else if (selectValue == "Bronze"){
					return colorScale4(d.Bronze);
			}
	
		
				})
			.attr("d", path)
			.on('mouseover',tip.show)
			.on('mouseout',tip.hide);
	}
	if (selectValue == "Gold"){
		svg.append("g")
			.attr("class", "countries")
			.selectAll("path")
			.data(topo.features)
			.enter().append("path")
				.attr("fill", function (d){
					// Pull data for this country
					d.total = data.get(d.id) || 0;
			d.Gold = data.get(d.id) || 0;
			d.Silver = data.get(d.id) || 0;
			d.Bronze = data.get(d.id) || 0;
					// Set the color
			if (selectValue == "Total"){
					svg.call(tip);
					return colorScale(d.total);
			}else if (selectValue == "Gold"){
					svg.call(tip2);
					//console.log("no dataRow");
					return colorScale2(d.Gold);
			}else if (selectValue == "Silver"){
					return colorScale3(d.Silver);
			}else if (selectValue == "Bronze"){
					return colorScale4(d.Bronze);
			}
	
		
				})
			.attr("d", path)
			.on('mouseover',tip2.show)
			.on('mouseout',tip2.hide);
	}
		if (selectValue == "Silver"){
		svg.append("g")
			.attr("class", "countries")
			.selectAll("path")
			.data(topo.features)
			.enter().append("path")
				.attr("fill", function (d){
					// Pull data for this country
					d.total = data.get(d.id) || 0;
			d.Gold = data.get(d.id) || 0;
			d.Silver = data.get(d.id) || 0;
			d.Bronze = data.get(d.id) || 0;
					// Set the color
			if (selectValue == "Total"){
					svg.call(tip);
					return colorScale(d.total);
			}else if (selectValue == "Gold"){
					svg.call(tip2);
					//console.log("no dataRow");
					return colorScale2(d.Gold);
			}else if (selectValue == "Silver"){
					svg.call(tip4)
					return colorScale3(d.Silver);
			}else if (selectValue == "Bronze"){
					return colorScale4(d.Bronze);
			}
	
		
				})
			.attr("d", path)
			.on('mouseover',tip4.show)
			.on('mouseout',tip4.hide);
	}
	if (selectValue == "Bronze"){
		svg.append("g")
			.attr("class", "countries")
			.selectAll("path")
			.data(topo.features)
			.enter().append("path")
				.attr("fill", function (d){
					// Pull data for this country
	d.Gold = data.get(d.id) || 0;
			d.Silver = data.get(d.id) || 0;
			d.Bronze = data.get(d.id) || 0;
					// Set the color
			if (selectValue == "Total"){
					svg.call(tip);
					return colorScale(d.total);
			}else if (selectValue == "Gold"){
					svg.call(tip2);
					//console.log("no dataRow");
					return colorScale2(d.Gold);
			}else if (selectValue == "Silver"){
					return colorScale3(d.Silver);
			}else if (selectValue == "Bronze"){
					svg.call(tip3)
					return colorScale4(d.Bronze);
			}
		
				})
			.attr("d", path)
			.on('mouseover',tip3.show)
			.on('mouseout',tip3.hide);
	}
}
function populate_map(newfile){
		filename = newfile;
		// Load external data and boot
		//d3.queue()
		//	.defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
		//	.defer(d3.csv, filename, function(d) { 
		//	data.set(d.code, +d.total); // "+" coerces string to num
			//console.log(d);
		//	})
		//	.await(ready);
		onchange();

}

document.getElementById('combined').onclick = button_combined;
document.getElementById('men').onclick = button_men;
document.getElementById('women').onclick = button_women;


button_combined();