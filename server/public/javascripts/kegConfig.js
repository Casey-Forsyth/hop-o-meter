



function createKegDiv (config) {
	// body...

	var mainDiv = $("<div>")
	mainDiv.addClass("kegConfigDiv")
	mainDiv.addClass("col-xs-12")
	var nameDiv = $("<div>")
	var nameh2 = $("<h2>")
	nameh2.html("Keg Number: " + (config.kegNum+1));		
	nameh2.attr("id","KegNum"+config.kegNum)

	nameDiv.append(nameh2)

	mainDiv.append(nameDiv);

	var container = $("<div>");
	container.addClass("container");

	var chartDiv = $("<div>");
	chartDiv.addClass("col-xs-12")
	chartDiv.addClass("col-sm-8")

	var chartCan = $("<canvas>");


	chartDiv.append(chartCan);



	container.append(chartDiv);
	container.append(buildControls(config));


	mainDiv.append(container);

	return mainDiv
}



function buildControls (config) {
	var controlDiv = $("<div>");
	controlDiv.addClass("col-xs-12")
	controlDiv.addClass("col-sm-4")

	var all = $("<form>\
		  <div class=\"form-group\">\
		    <label for=\"sizeMl\">Volume (ML)</label>\
		    <input type=\"number\" class=\"form-control\" id=\"volume\"  placeholder=\"Enter keg volume in ml\">\
		  </div>\
		  <div class=\"form-group\">\
		    <label for=\"minV\">Min Sensor Value</label>\
		    <input type=\"number\" class=\"form-control\" id=\"minV\"  placeholder=\"Enter keg volume in ml\" step=\"0.1\">\
		    <small id=\"minHelp\" class=\"form-text text-muted\">When the keg is on the scale with the lines connected but empty.</small>\
		  </div>\
		  <div class=\"form-group\">\
		    <label for=\"maxV\">Max Sensor Value</label>\
		    <input type=\"number\" class=\"form-control\" id=\"maxV\" placeholder=\"Enter keg volume in ml\" step=\"0.1\">\
		    <small id=\"maxHelp\" class=\"form-text text-muted\">When the keg is on the scale with the lines connected and Full.</small>\
		  </div>\
		  <button type=\"button\" class=\"saveConfig btn btn-primary\">Save</button>\
\
		</form>");


	all.find("#minV").val(config.minV);
	all.find("#maxV").val(config.maxV);
	all.find("#volume").val(config.sizeMl);

	all.find("input").change(function (e) {
		onConfigInputChange(config,$(this).closest(".kegConfigDiv"))
	})

	setOnClickForSave(all.find(".saveConfig"),config);
	

	controlDiv.append(all);
	return controlDiv;

}

function setOnClickForSave (btn,config) {
	btn.click(function (e) {
		
		sendConfigToServer(config.kegNum);

	})
}


function sendConfigToServer (kegNum) {
	
	var dToSend = {
		config:{
			minV 	: configs[kegNum].minV,
			maxV 	: configs[kegNum].maxV,
			sizeMl 	: configs[kegNum].sizeMl,
		}
	}

	$.ajax({
		type: 'POST',
		url: '/kegConfig/'+kegNum,
		data: JSON.stringify(dToSend),
		success: function(data) { 
			toastr.success('Keg '+ (kegNum+1) +" Saved")

		},
		error: function(data){
				toastr.error('Failed To Save')
			},
		contentType: "application/json",
		dataType: 'json'
	});


}

function onConfigInputChange (config,parentDiv) {

	var newMin = parentDiv.find("#minV").val();
	var newMax = parentDiv.find("#maxV").val();
	var newVol = parentDiv.find("#volume").val();

	configs[config.kegNum].minV = newMin;
	configs[config.kegNum].maxV = newMax;
	configs[config.kegNum].sizeMl = newVol;

	addChartAfterAppend(parentDiv,config,sensorData[config.kegNum]);
}



function addChartAfterAppend(currDiv,currentConfig,sensorSamples){
	var chartCan = currDiv.find("canvas");
	var ctx = chartCan[0].getContext("2d");

	new Chart(ctx).Scatter(getChartData(currentConfig,sensorSamples), getChartOptions(currentConfig));

}


function getChartOptions (config) {
	return {scaleType:"date",
			responsive: true,
			animation : false
			};
}

function getChartData (currentConfig,samp) {

	var data = [];
	var d = new Date();

	if(samp){
		for (var i = 0; i < samp.length; i++) {
			var c = samp[i];
			var timeWithOffset = Date.parse(c.recordedAt) - (d.getTimezoneOffset() * 60 * 1000)
			data.push({x:timeWithOffset ,y:c.value})
		};

		var minData = [{
			x:getClosestTimeToSensorValue(currentConfig.minV,samp) - (d.getTimezoneOffset() * 60 * 1000),
			y:currentConfig.minV,
			r:3
		}];


		var maxData = [{
			x:getClosestTimeToSensorValue(currentConfig.maxV,samp) - (d.getTimezoneOffset() * 60 * 1000),
			y:currentConfig.maxV,
			r:3
		}];
	}



	var chartData = [];

	if(data){
		chartData.push({
			      label: '',
			      strokeColor: "blue",
			      pointColor: "blue",
			      pointStrokeColor: '#fff',
			      data: data
			    })
	}

	if(minData){
		chartData.push({
			      label: 'min',
			      strokeColor: "purple",
			      pointColor: "purple",
			      pointStrokeColor: '#fff',
			      data: minData
			    })
	}

	if(maxData){
		chartData.push({
			      label: 'max',
			      strokeColor: "red",
			      pointColor: "red",
			      pointStrokeColor: '#fff',
			      data: maxData
			    })
	}

	return chartData;

}


function getClosestTimeToSensorValue(target,samp){

	var absMin = Math.abs(samp[0].value - target);
	var minIndex = 0;

	for (var i = 0; i < samp.length; i++) {
		var c = samp[i];
		var distance = Math.abs(samp[i].value - target)
		if(absMin > distance){
			absMin = distance;
			minIndex = i;
		}
	};

	return Date.parse(samp[minIndex].recordedAt)


}







function clearViews () {
	$("#configHolder").html("");
}

function fillAllViews () {
	// body...
	var holder = $("#configHolder");
	for (var i = 0; i < configs.length; i++) {
		var currK = i
		if(configs[i]){
			currK = configs[i].kegNum;
		}
		
		var newDiv = createKegDiv(configs[i]);
		holder.append(newDiv); 
		addChartAfterAppend(newDiv,configs[i],sensorData[currK])
	};

}


function scrollToHash(){
	if (window.location.hash ) {
	    $('html, body').animate({
	        scrollTop: $(window.location.hash).offset().top
	    }, 1000);
	    $(window.location.hash).css("text-decoration", "underline");

	}
}

$(function () {
	

	clearViews();
	fillAllViews();

	scrollToHash()
})




