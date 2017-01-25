



function createKegDiv (currentConfig) {
	// body...

	var mainDiv = $("<div>")
	mainDiv.addClass("configDiv")
	mainDiv.addClass("col-xs-12")
	var nameDiv = $("<div>")
	var nameh2 = $("<h2>").html("Keg Number: " + currentConfig.kegNum);
	nameDiv.append(nameh2)

	var chartCan = $("<canvas>");


	mainDiv.append(nameDiv);
	mainDiv.append(chartCan);
	return mainDiv
}

function addChartAfterAppend(currDiv,currentConfig,sensorSamples){
	var chartCan = currDiv.find("canvas");
	var ctx = chartCan[0].getContext("2d");

	new Chart(ctx).Scatter(getChartData(currentConfig,sensorSamples), getChartOptions(currentConfig));

}


function getChartOptions (config) {
	return {scaleType:"date",
			responsive: true,
			pointDot:false
			};
}

function getChartData (currentConfig,samp) {

	var data = [];
	for (var i = 0; i < samp.length; i++) {
		var c = samp[i];
		data.push({x:Date.parse(c.recordedAt),y:c.value})
	};



	return [
			    {
			      label: '',
			      strokeColor: "blue",
			      pointColor: "blue",
			      pointStrokeColor: '#fff',
			      data: data
			    }
			  ];
}







function clearViews () {
	$("#configHolder").html("");
}

function fillAllViews () {
	// body...
	var holder = $("#configHolder");
	for (var i = 0; i < configs.length; i++) {
		var currK = configs[i].kegNum
		var newDiv = createKegDiv(configs[i]);
		holder.append(newDiv); 
		addChartAfterAppend(newDiv,configs[i],sensorData[currK])
	};

}




$(function () {
	

	clearViews();
	fillAllViews();
})




