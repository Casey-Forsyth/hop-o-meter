


class BeerUnitManager{
  	constructor(){
  		this.beerUnits = [
			{
				name:"Imperial Pint",
		        sizeInML: 568  
			},
			{
				name:"Bottles (355 ML)",
		        sizeInML: 355  
			},
			{
				name:"Shots",
		        sizeInML: 29.5735  
			}
		]
	}



	fillBeerUnitSelect (select) {


		var option = $("<option>");
		option.html("Custom");
		option.val(-1);
		select.append(option);

		for (var i = 0; i < this.beerUnits.length; i++) {
			var cUnit = this.beerUnits[i];

			var option = $("<option>");
			option.html(cUnit.name);
			option.val(i);
			select.append(option);
		};



	}


	setSelectListener(select){
		var manager = this
		select.change(function(e){
			
			var i = select.val();
			if(i>=0){
				manager.fillUIFeildsWithSelection(manager.beerUnits[i]);
			}
		});
	}

	fillUIFeildsWithSelection(unit){
		$("#beerUnitSize").val(unit.sizeInML)
		$("#beerUnitName").val(unit.name)
	}

	detectIfPresetIsSelected () {

		var foundID = -1;
		var select = $("#presetBeerUnits");

		for (var i = 0; i < this.beerUnits.length; i++) {
			var currPreSet = this.beerUnits[i];

			if(currPreSet.name == currentBeerUnits.name &&
				currPreSet.sizeInML == currentBeerUnits.sizeInML){
				foundID = i;
			}
		}

		select.val(foundID);
	}

	setOnChangeBeerUnitListeners () {
		var manager = this

		$("#advancedBeerUnits input").change(function (e) {
			manager.setCurrentBeerUnits();
			manager.detectIfPresetIsSelected();
		})
	}

	setCurrentBeerUnits (argument) {
		currentBeerUnits = {"name":$("#beerUnitName").val(),"sizeInML":parseFloat($("#beerUnitSize").val())}
	}

	sendBeerUnitsToServer () {
	
	

		$.ajax({
			type: 'POST',
			url: '/setup/beerUnits/',
			data: JSON.stringify({config:currentBeerUnits}),
			success: function(data) { 
				toastr.success('Beer Units Saved')

			},
			error: function(data){
				toastr.error('Failed To Save')
			},
			contentType: "application/json",
			dataType: 'json'
		});


	}


	start(){
		this.fillUIFeildsWithSelection(currentBeerUnits);
		var select = $("#presetBeerUnits");
		this.fillBeerUnitSelect(select);
		this.setSelectListener(select);
		this.setOnChangeBeerUnitListeners();
		this.detectIfPresetIsSelected();


		var manager = this;
		$(".saveBeerUnits").click(function(){
			manager.sendBeerUnitsToServer();
		})

	}

	
}


$(function () {

	new BeerUnitManager().start();
})	