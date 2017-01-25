



function createBatchDiv (batch) {
	// body...

	var mainDiv = $("<div>")
	mainDiv.css("color",batch.beer.color);
	mainDiv.addClass("batchDiv")
	mainDiv.addClass("col-xs-12")
	mainDiv.addClass("col-sm-6")
	mainDiv.addClass("col-md-6")
	var nameDiv = $("<div>")
	var nameh2 = $("<h2>").html(batch.beer.name);
	nameDiv.append(nameh2)


	var numberDiv = $("<div>");
	var numSpan =  $("<div>");
	numSpan.addClass("number");
	numSpan.html(mlToUnits(getLastML(batch)));
	var leftSpan = $("<div>");
	leftSpan.html(batchView.name+" left");
	leftSpan.addClass("units");
	numberDiv.append(numSpan)
	numberDiv.append(leftSpan)


	var chartCan = $("<canvas>");


	mainDiv.append(nameDiv);
	mainDiv.append(numberDiv);
	mainDiv.append(chartCan);
	return mainDiv
}

function addChartAfterAppend(currDiv,batch){
	var chartCan = currDiv.find("canvas");
	var ctx = chartCan[0].getContext("2d");

	new Chart(ctx).Scatter(getChartData(batch), getChartOptions(batch));

}


function getChartOptions (batch) {
	return {scaleType:"date",
			responsive: true,
			pointDot:false
			};
}

function getChartData (batch) {

	var data = [];
	var mls = batch.ml
	for (var i = 0; i < mls.length; i++) {
		data.push({x:mls[i].t,y:mlToUnits(mls[i].ml)})
	};



	return [
			    {
			      label: '',
			      strokeColor: batch.beer.color,
			      pointColor: batch.beer.color,
			      pointStrokeColor: '#fff',
			      data: data
			    }
			  ];
}

function getLastML (batch) {
	return batch.ml[batch.ml.length-1].ml
}

function mlToUnits (ml) {
	return Math.floor(ml/batchView.sizeInML)
}






function clearViews () {
	$("#batchHolder").html("");
}

function fillAllViews () {
	// body...
	var holder = $("#batchHolder");
	for (var i = 0; i < batches.length; i++) {
		var newDiv = createBatchDiv(batches[i]);
		holder.append(newDiv); 
		addChartAfterAppend(newDiv,batches[i])
	};

}




$(function () {
	

	clearViews();
	fillAllViews();
})




