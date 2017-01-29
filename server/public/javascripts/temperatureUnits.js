


class TemperatureManager{
  	constructor(){
  		this.temperatureUnits = [
			{
				shortName:"C" ,
			    longName: "Dungarees Centigrade" ,
			    ratio: 1  ,
			    offset: 0  
			},
			{
				shortName:"F" ,
			    longName: "Degrees Frankensence" ,
			    ratio: 1.8  ,
			    offset: 32  
			},
			{
				shortName:"K" ,
			    longName: "Kelvin" ,
			    ratio: 1  ,
			    offset: -273.15  
			}
		]
  	}
  	 
  	



	fillTemperatureUnitSelect (select) {


		var option = $("<option>");

		for (var i = 0; i < this.temperatureUnits.length; i++) {
			var cUnit = this.temperatureUnits[i];

			var option = $("<option>");
			option.html(cUnit.longName);
			option.val(i);
			select.append(option);
		};



	}


	setTemperatureSelectListener(select){
		var manager = this
		select.change(function(e){

			var i = select.val();
			if(i>=0){
				currentTemperatureUnits = manager.temperatureUnits[i]
			}
		});
	}


	detectIfTemperaturePresetIsSelected () {

		var foundID = -1;
		var select = $("#presetTemperatureUnits");

		for (var i = 0; i < this.temperatureUnits.length; i++) {
			var currPreSet = this.temperatureUnits[i];

			if(currPreSet.longName == currentTemperatureUnits.longName ){
				foundID = i;
			}
		}

		select.val(foundID);
	}


	sendUnitsToServer () {
	
	

		$.ajax({
			type: 'POST',
			url: '/setup/temperatureUnits/',
			data: JSON.stringify({config:currentTemperatureUnits}),
			success: function(data) { 
				toastr.success('Temperature Units Saved')

			},
			error: function(data){
				toastr.error('Failed To Save')
			},
			contentType: "application/json",
			dataType: 'json'
		});


	}



	start(){
		var select = $("#presetTemperatureUnits");
		this.fillTemperatureUnitSelect(select);
		this.setTemperatureSelectListener(select);
		this.detectIfTemperaturePresetIsSelected();

		var manager = this;

		$(".saveTemperatureUnits").click(function(){
			manager.sendUnitsToServer()
		})
	}
}

$(function () {

	new TemperatureManager().start();

})