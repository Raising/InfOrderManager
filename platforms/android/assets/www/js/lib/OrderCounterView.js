	
OCV = {};


OCV.Tokenview = function (tipo) {

	var token = this;
	this.view = $("<div class='token'></div>");
	this.tipo = tipo;
	this.image = $("<img src='img/"+tipo+".png'></img>");
	this.view.append(this.image);

	ths.getView = function(){
		return token.view;
	}

	this.hide = function(){

	}
	this.show = function(){

	}

	this.setRandomPosition = function(){

	}

	this.setDrag = function(container){

	}

	this.clear = function(){
		token.view.remove();
	}

}

OCV.TokenHolderView = function(model){
	var holderview = this;
	this.model = model;

	this.view = $("<div class = 'holdertoken'></div>");
	this.areaUsado = $("<div class = 'darken'></div>");
	this.view.append(this.areaUsado);

	this.fill = function(){
		holderview.view.empty();
		for (var i in holderview.model.tokenList){
			holderview.view.append(holderview.model.tokenList[i].getView());
		}
		holderview.view.append(holderview.areaUsado);
	}
	this.getView = function(){
		return holderview.view;
	}
}



OCV.unitView = function(model){
	var view = this;
	this.html = $("<div class = 'unitView'></div>");
	this.unitIcon = $("<img src='img/"+model.img+"' class='unitIcon'></img>");
	this.unitName = $("<div class='unitName' >"+model.name+"</div>");
	this.actionSpace= $("<div class= 'actionSpace'></div>");
	this.unitDisable = $("<div class='button'>Dis<div>");
	this.removeUnit = $("<div class='button'> D <img></img></div>");
	this.editar =  $("<div class='button'>E<div>");
	this.orders = [$("<div class='button regular'><div>"),
	$("<div class='button irregular'> </div>"),
	$("<div class='button impetuoso'></div>"),
	$("<div class='button teniente'> </div>")];

	this.unitIcon.on("tap",function(){
		console.log("hola");
		view.pop = new OCV.popUp({body:"hola"});
		view.html.append(view.pop.getView());
	});

	this.html
		.append(this.unitIcon)
		.append(this.unitName)
		.append(this.actionSpace);
	this.actionSpace
		.append(this.removeUnit);

	this.unitDisable.on("tap",function(){
		console.log("toggledisabled");
		if (model.toggleDisable() === "disabled"){
			view.html.addClass("disabled");
		}else{
			view.html.removeClass("disabled");
		}
	});

	this.removeUnit.on("tap",function(){
		model.removeUnit();
	})

	this.refreshActions= function(){
		view.actionSpace.empty();
		if (GLOBALS.gameStatus === "load"){
			if (model.group.estado === "load"){
				view.actionSpace.append(view.removeUnit);
			}else if(model.group.estado === "lock"){
				view.actionSpace.append(view.editar);
			}
		}else if(GLOBALS.gameStatus === "playing"){
			view.actionSpace.append(view.unitDisable);
			if (model.disabled === false){
				for (var i = model.orderAvaiable.length - 1; i >= 0; i--) {
					if(model.orderAvaiable[i] == 1){
						view.actionSpace.append(view.orders[i]);
					}
				};
			}else{
				//quitar disabled
			}
		}
	}


	this.getView = function(){
		return view.html;
	}

}
OCV.groupView = function(model){
	var view = this;
	this.html = $("<div class= 'groupView'><div>");
	this.addButton = $("<div class= 'buttonAdd'> + </div>");
	this.lockList = $("<div class= 'buttonLock'> L </div>");
	this.startGame = $("<div class= 'buttonStart'>Iniciar</div>");
	this.nuevoTurno = $("<div class= 'buttonStart'>Turno</div>");

	this.html
		.append(this.addButton)
		.append(this.lockList)
		.append(this.startGame);

	this.addButton.on("tap",function(){
		model.selectUnit();
	});



	this.startGame.on("tap",function() {
		var empezar = confirm("¿Seguro que desea comenzar la partida con estas unidades?");
		if ( empezar == true){
			GLOBALS.startGame();
		}
	});

	this.nuevoTurno.on("tap",function(){
		var turno = confirm("¿Seguro desea cambiar de turno?");
		if ( turno == true){
			GLOBALS.startGame();
		}
	});


	this.lockList.on("tap",function(){
		var estado = model.lockList();
		if (estado == "load"){
			view.addButton.removeClass("locked");
			view.lockList.removeClass("locked");
		}else if(estado == "lock"){
			view.addButton.addClass("locked");
			view.lockList.addClass("locked");
		}
	});



	this.refresh = function(){
		view.html.empty();
		if (GLOBALS.gameStatus === "load"){
			view.html
			.append(this.addButton)
			.append(this.lockList)
			.append(this.startGame);
		}
		else{
			view.html
			.append(this.nuevoTurno);
		}
		for (var i in model.unitList){
			model.unitList[i].view.refreshActions();
			view.html.append(model.unitList[i].getView());
		}
	}
	

	this.getView = function(){
		return view.html;
	}


}

OCV.groupHeadView = function(model){
	var view = this;
	this.html = $("<div class = 'groupHeadView'></div>");
	this.orders = {regular:$("<div class='buttonhead regular'><div>"),
	irregular:$("<div class='buttonhead irregular'> </div>"),
	impetuosa:$("<div class='buttonhead impetuoso'></div>")};
	
	for (var i in view.orders){
		view.html.append(view.orders[i]);
	}
	
	this.getView = function(){
		return view.html;
	}

	this.refresh = function(){
		for(var i in model.orders){
			view.orders[i].empty().append(model.orders[i]);
		}
	}
}

OCV.factionView = function(model){
	var view = this;
	this.html = $("<div class = 'factionUnitList'></div>");
	for (var i in model.unitList){
		model.unitList[i].Id = model.unitList[i].img.split("/")[3].split("_")[1].split(".")[0];
		
		
		var uSelector = new OCV.unitSelector(model.unitList[i]);
		this.html.append(uSelector.getView());
	}

	this.getView = function(){
		return view.html;
	}
}

OCV.unitSelector = function(params){
	var selector = this;
	this.html = $("<div class='unitSelector'></div>");
	this.icon = $("<img class='unitIconSelector' src='img/"+params.img+"'></img>");
	this.text = params.name;
	this.html.append(this.icon);

	this.html.on("touchstart",function(){
		$("#log").empty().append(selector.text);
	});

	this.html.on("tap",function(){
		if(GLOBALS.current.group.addUnit){
			GLOBALS.current.group.addUnit(params);
			console.log("añadiendo unidad");
		}	
	});


	this.getView = function(){
		return selector.html;
	}
}



OCV.popUp = function (params){
	var pop = this;
	$("body > .total").remove();
	this.html = $("<div class='popup'></div>");
	this.body = $("<div class='popupBody'></div>");
	this.closeIcon = $("<div class='popupCloseIcon'>X</div>");

	this.hideBack = $("<div class='total traslucido'></div>");

	
	this.body.append(params.body);

	this.html
			.append(this.body)
			.append(this.closeIcon);
	
	this.hideBack.append(this.html);
	
	


	//$("body").append(this.hideBack);
	/*setTimeout(function() {
		$("div").on("tap",function(){
			console.log(this.innerHTML);
		pop.body.append("");
		return false;
		//$("body > .total").remove();
	});
	}, 500);
	
*/

	this.closeIcon.on("tap",function(){
		pop.body.append("tap en closeicon");
		pop.html.remove();
		
	});

	this.getView = function(){
		return pop.html;
	}
}
