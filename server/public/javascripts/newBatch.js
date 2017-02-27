

var presetBeerColor = {
      "Light": "#FEE799",
      "Tan": "#EE9E01",
      "Light Pale": "#DA7E01",
      "DarkerPale": "#B65300",
      "Red": "#721B00",
      "Stout": "#390708"
    }


class newBatchUI{

	constructor(el,onSuccessCB,onErrorCB,kegNum){
		this.el = el;
		this.onSuccessCB = onSuccessCB;
		this.onErrorCB = onErrorCB;
		this.currKegNum = kegNum;

		this.setupUI();

	}





	setupUI () {

			$("#beer-color").paletteColorPicker({
				// Color in { key: value } format
				colors: this.prepColorsForPallet(),
				// Force the position of picker's bubble
				position: 'downside', // default -> 'upside'
				// Where is inserted the color picker's button, related to the input
				insert: 'after', // default -> 'before'
				// Don't add clear_btn
				clear_btn: 'last', // null -> without clear button, default -> 'first'
				// Timeout for the picker's fade out in ms
				timeout: 2000 // default -> 2000
			});

			$("#myModalLabel .kegNum").html(this.kegNum);




		var self = this;
		this.el.data('kegNum',this.kegNum)
		this.el.click(function (e) {
			self.modal = $('#newBatchModal').modal({});
			var saveBtn = $("#save-btn");
			saveBtn.unbind("click")
			saveBtn.click(function  (ee) {
				self.sendNewBatchToServer(self.currKegNum);
			})
		});
	}


	prepColorsForPallet(){
		var keys = Object.keys(presetBeerColor);
		var out = [];
		for (var i = 0; i < keys.length; i++) {
			var temp = {};
			temp[keys[i]] = presetBeerColor[keys[i]];
			out.push(temp);
		};

		return out;
	}


	sendNewBatchToServer(kegNum){

		var modal = $("#newBatchModal");
		var nameInput = modal.find("#beer-name");
		var colorLabel = modal.find("#beer-color").val();

		var hexVal = presetBeerColor[colorLabel];
		if(!hexVal)
			hexVal = "#FEE799";


		var dToSend = {
			beer:{
				name 	: nameInput.val(),
				color 	: hexVal
			},
			kegNum:kegNum
		}

		var instance = this;
		var self = this;
		$.ajax({
			type: 'POST',
			url: '/batch/new',
			data: JSON.stringify(dToSend),
			success: function(data) { 
				instance.onSuccess();
				self.modal.modal('hide')

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
		if(this.onErrorCB){
			this.onErrorCB(msg)
		}
	}



}
