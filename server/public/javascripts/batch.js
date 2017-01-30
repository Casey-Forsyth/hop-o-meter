



function createBatchDiv (batch) {
	// body...


	var mainDiv = $("<div>")
	if(batch.beer && batch.beer.color){
		mainDiv.css("color",batch.beer.color);
	}else{
		mainDiv.css("color","rgb(183, 44, 0)");
	}
	mainDiv.addClass("col-xs-12")
	mainDiv.addClass("col-sm-6")
	mainDiv.addClass("col-md-6")
	mainDiv.addClass("batchDiv")
	if(!batch.error){
		var nameDiv = $("<div>")
		var nameh2 = $("<h2>").html(batch.beer.name);
		nameDiv.append(nameh2);

		mainDiv.append(nameDiv);




		if(isAdmin)
			mainDiv.append(createAdminBatchBar(batch));



	
		var numberDiv = $("<div>");
		var numSpan =  $("<div>");
		numSpan.addClass("number");
		numSpan.html(mlToUnits(getLastML(batch)));
		var leftSpan = $("<div>");
		leftSpan.html(batchView.name+" left");
		leftSpan.addClass("units");
		numberDiv.append(numSpan);
		numberDiv.append(leftSpan);

		mainDiv.append(numberDiv);


		var chartCan = $("<canvas>");


		
		
		mainDiv.append(chartCan);
	}else{
		var errorDiv = $("<div>");
		errorDiv.addClass("error")
		errorDiv.html("Oh No! Somthing went wrong.<BR> The boffins think the problem is:<BR><B>"+batch.error+"</b><BR>Whatever that means...")

		mainDiv.append(errorDiv);
	}


	return mainDiv
}

function createAdminBatchBar(batch){
	var adminDiv = $("<div>")
	adminDiv.addClass("adminBar")
	
	var newBatchButton = $("<button type=\"button\" class=\"btn btn-default\" aria-label=\"New Batch\"> <span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\"></span></button>")
	adminDiv.append(newBatchButton)

	new newBatchUI(newBatchButton,function (msg) {
		toastr.success(msg)
	},
	function (msg) {
		toastr.error("ERROR:" + msg)
	})

	var changeSettingsBtn = $("<a href=\"/setup#KegNum"+batch.kegNum+"\" type=\"button\" class=\"btn btn-default\" aria-label=\"New Batch\"> <span class=\"glyphicon glyphicon-wrench\" aria-hidden=\"true\"></span></a>")
	adminDiv.append(changeSettingsBtn)


	return adminDiv;



}


function addChartAfterAppend(currDiv,batch){
	var chartCan = currDiv.find("canvas");
	if(chartCan && chartCan.length>0){
		var ctx = chartCan[0].getContext("2d");

		new Chart(ctx).Scatter(getChartData(batch), getChartOptions(batch));
	}
}


function getChartOptions (batch) {
	return {scaleType:"date",
			responsive: true,
			pointDot:false,
			scaleStartValue:0,
			scaleBeginAtZero: true,
			bezierCurveTension: 0.001
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



function createTemperatureDiv () {
	


	var temperatureValueDiv = $("<div>")
	temperatureValueDiv.css("color","#0064ff");
	
	temperatureValueDiv.addClass("col-xs-12")
	temperatureValueDiv.addClass("col-sm-3")
	temperatureValueDiv.addClass("col-md-3")
	temperatureValueDiv.addClass("temperatureValue")


	var nameDiv = $("<div>")
	var nameh2 = $("<h2>").html("Temperature");
	nameDiv.append(nameh2);

	temperatureValueDiv.append(nameDiv);



	var numberDiv = $("<span>");
	numberDiv.addClass("value")
	numberDiv.html(cToTemperatureUnits(getLastTemeprature()));
	var unitsDiv = $("<span>");
	unitsDiv.html(temperatureUnits.shortName);

	temperatureValueDiv.append(numberDiv);
	temperatureValueDiv.append(unitsDiv);
	$("#temperatureHolder").append(temperatureValueDiv);

	if(isAdmin){
		var changeSettingsBtn = $("<a type=\"button\" href=\"/setup#temperatureUnits\" class=\"btn btn-default\" aria-label=\"New Batch\"> <span class=\"glyphicon glyphicon-wrench\" aria-hidden=\"true\"></span></a>")
		temperatureValueDiv.append(changeSettingsBtn)
	}
	

	var temperatureChartDiv = $("<div>")
	
	temperatureChartDiv.addClass("col-xs-12")
	temperatureChartDiv.addClass("col-sm-9")
	temperatureChartDiv.addClass("col-md-9")
	temperatureChartDiv.addClass("temperatureChart")


	var chartCan = $("<canvas height='100'>");
	temperatureChartDiv.append(chartCan);


	$("#temperatureHolder").append(temperatureChartDiv);
	createTemeratureChart(temperatureChartDiv);

}


function getLastTemeprature () {
	return temperatures[temperatures.length-1].value
}



function createTemeratureChart(currDiv){
	var chartCan = currDiv.find("canvas");
	if(chartCan && chartCan.length>0){
		var ctx = chartCan[0].getContext("2d");

		new Chart(ctx).Scatter(getTemperatureChartData(), getTemperatureChartOptions());
	}
}


function getTemperatureChartOptions (batch) {
	return {scaleType:"date",
			responsive: true,
			pointDot:false,
			bezierCurveTension: 0.001,
		};
}


function cToTemperatureUnits (c){

	return Math.round((temperatureUnits.ratio * c + temperatureUnits.offset)*2)/2

}

function getTemperatureChartData () {

	var data = [];
	for (var i = 0; i < temperatures.length; i++) {
		data.push({x:new Date(temperatures[i].recordedAt).getTime(),y:cToTemperatureUnits(temperatures[i].value)})
	};



	return [
			    {
			      label: '',
			      strokeColor: '#0064ff',
			      pointColor: '#0064ff',
			      pointStrokeColor: '#fff',
			      data: data
			    }
			  ];
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

	createTemperatureDiv();

}






$(function () {
	

	clearViews();
	fillAllViews();

	



})




