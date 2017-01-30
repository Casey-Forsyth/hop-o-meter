

var presetBeerColor = [
      {"Light": "#FEE799"},
      {"Tan": "#EE9E01"},
      {"Light Pale": "#DA7E01"},
      {"DarkerPale": "#B65300"},
      {"Red": "#721B00"},
      {"Stout": "#390708"}
    ]


class newBatchUI{

	constructor(el,onSuccessCB,onErrorCB){
		this.el = el;
		this.onSuccessCB = onSuccessCB;
		this.onErrorCB = onErrorCB;

		this.setupUI();

	}





	setupUI () {

			$("#beer-color").paletteColorPicker({
				// Color in { key: value } format
				colors: presetBeerColor,
				// Force the position of picker's bubble
				position: 'downside', // default -> 'upside'
				// Where is inserted the color picker's button, related to the input
				insert: 'after', // default -> 'before'
				// Don't add clear_btn
				clear_btn: 'last', // null -> without clear button, default -> 'first'
				// Timeout for the picker's fade out in ms
				timeout: 2000 // default -> 2000
			});




		self = this;
		this.el.click(function (e) {
			self.modal = $('#newBatchModal').modal({});
			var saveBtn = $("#save-btn");
			saveBtn.unbind("click")
			saveBtn.click(function  (e) {
				self.sendNewBatchToServer();
			})
		});
	}


	sendNewBatchToServer(){

		var modal = $("#newBatchModal");
		var nameInput = modal.find("#beer-name");
		var colorLabel = modal.find("#beer-color").val();

		for (var i = 0; i < presetBeerColor.length; i++) {
			var hexVal = presetBeerColor[colorLabel];
			if(!hexVal)
				hexVal = "#FEE799";
		};


		var dToSend = {
			beer:{
				name 	: nameInput.val(),
				color 	: hexVal
			}
		}

		var instance = this;
		var self = this;
		$.ajax({
			type: 'POST',
			url: '/batch/new',
			data: JSON.stringify(dToSend),
			success: function(data) { 
				instance.onSuccess();
				self.modal.close()

			},
			error: function(data){
					instance.onError(data.statusText);
				},
			contentType: "application/json",
			dataType: 'json'
		});
	}

	onSuccess(msg){
		this.onSuccessCB(msg)
	}

	onError(msg){
		this.onErrorCB(msg)
	}



}
