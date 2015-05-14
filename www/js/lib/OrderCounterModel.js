
OCM = {};

OCM.Player = function(container){
	var player = this;
	this.container = container;
	this.tokens = {};
	this.tokenHolders = {};
	this.tipoToken = ["regular","irregular","mando"];
	for (var i in this.tipoToken){
		this.tokens[this.tipoToken[i]] = [];
		this.tokenHolders[this.tipoToken[i]] = new OCM.Tokenholder(this.tokens[this.tipoToken[i]]);


		console.log("#"+player.container+" > .espacio");
		$("#"+player.container+" > .espacio").append(this.tokenHolders[this.tipoToken[i]].getView());

		$("#"+player.container+" > .tabs > #"+this.tipoToken[i]).on("tap",function(){
			console.log("bien");
			this.tokenHolders[this.tipoToken[i]].show();
		});

	}
	

	this.addToken = function(tipo){
		player.tokens[tipo].push(new OCM.Token(tipo));
	}

	this.removeToken = function(tipo){
		var tamanio = player.tokens[tipo].length;
		if ( tamanio > 0){
			player.tokens[tipo][tamanio-1].clear();
			player.tokens[tipo].splice(tamanio-1,1);
		}
	}


}

OCM.Tokenholder = function(Tokenlist){
	var holder = this;
	this.tokenList = Tokenlist;
	this.view = new OCV.TokenHolderView(this);

	this.show = function(){
		holder.view.show();
	}

	this.hide = function(){
		holder.view.hide();
	}

	this.setTokenlist =  function(Tokenlist){
		holder.tokenList = Tokenlist;
	}	

	this.getView = function(){
		return holder.view.getView();
	}


}


OCM.Token = function(tipo){
	var token = this;
	this.view = new OCV.Tokenview(tipo);
	


	this.clear = function(){
		token.view.clear();
	}

	this.getView = function(){
		return token.view.getView();
	}
}


OCM.Log = {
	hitoric : "",

	add : function(text){
		log.hitoric = log.hitoric.concat(text+ "\n");
		console.log(text+ "\n");}
		,
	display : function(){
		console.log(log.historic);
		return log.historic;
	}
}





OCM.Unit = function(params,group){
	var unit = this;
	this.params = params;
	this.group = group;
	this.name = params.name;
	this.Id = params.Id;
	this.img = params.img;
	this.view = new OCV.unitView(this);
	this.disabled = false;
	if (GLOBALS.unitData[this.Id]){
		this.orderAvaiable = GLOBALS.unitData[this.Id].ordenes; //regular, irregular, impetuoso, teniente;
	}else{
		this.orderAvaiable =[1,0,0,0]; //regular, irregular, impetuoso, teniente;
	}
	this.orderUsed = [0,0,0,0]; //regular, irregular, impetuoso, teniente;





	this.useOrder = function(tipo){
		console.log("gastnado orden"+ tipo);
		switch(tipo){
			case "0"://regular
				if (unit.group.orders.regular > 0){
					unit.group.orders.regular--;
					unit.orderUsed[tipo]++; 
					unit.group.orders.impetuosa==0;
				}
				console.log("gastando orden regular");
			break;
			case "1":

				if (unit.orderAvaiable[tipo] > unit.orderUsed[tipo]){
					unit.group.orders.irregular--;
					unit.orderUsed[tipo]++; 
					unit.group.orders.impetuosa==0;
				}
			
			break;
			case "2":
				if (unit.orderAvaiable[tipo] > unit.orderUsed[tipo]){
					unit.group.orders.impetuosa--;
					unit.orderUsed[tipo]++; 
				}
			break;
			case "3":
				if (unit.orderAvaiable[tipo] > unit.orderUsed[tipo]){
					unit.group.orders.teniente--;
					unit.orderUsed[tipo]++; 
					unit.group.orders.impetuosa==0;
				}
			
			break;
		}

		unit.group.refresh();



		//OCM.log.add("Orden"+tipo+" -> " +unit.nombre);
	}

	this.toggleDisable = function(){
		if (!unit.disabled){
			unit.disabled = true;
			return "disabled";
		}else{
			unit.disabled = false;
			return "abled";
		}
	}
	this.getView = function(){
		return unit.view.getView();
	}

	this.removeUnit = function(){
		unit.group.removeUnit(unit);
	}
}

OCM.Group = function(params){
	var group = this;
	this.unitList = [];
	this.orders = {regular:0,irregular:0,impetuosa:0};

	this.view = new  OCV.groupView(this);
	this.headView = new OCV.groupHeadView(this);
	this.estado = "load";

	this.calcularOrdenes = function(){
		group.orders = {regular:0,irregular:0,impetuosa:0};
		for (var i in group.unitList){
			if (group.unitList[i].disabled === false && group.unitList[i].orderAvaiable[0] == 1){
				group.orders.regular += 1;
			}
			if (group.unitList[i].disabled === false && group.unitList[i].orderAvaiable[1] == 1){
				group.orders.irregular += 1;
			}
			if (group.unitList[i].disabled === false && group.unitList[i].orderAvaiable[2] == 1){
				group.orders.impetuosa += 1;
			}
			//TODO comprobar el tipo de ordenes que genera cada unidad en lugar de considerarlas todas regulares
		}
	}
	this.selectUnit = function(){
		if (group.estado === "load"){
		 GLOBALS.estado.home();
		}
	}

	this.getHeadView = function(){
		return group.headView.getView();
	}

	this.nuevoTurno = function(){
		group.calcularOrdenes();	
		group.refresh();
	}

	this.reiniciarUnidades = function(){
		group.unitList = [];
		group.view.refresh();

	}
	this.refreshOrderHeader = function(){
		group.headView.refresh();
	}

	this.refresh = function(){
		group.headView.refresh();
		group.view.refresh();
	}

	this.addUnit = function(params){
		if (group.estado === "load"){
			GLOBALS.estado.grupos();
			group.unitList.push(new OCM.Unit(params,group));
			group.view.refresh();
		}
	}

	this.lockList = function(){
		if (group.estado == "load"){
			group.estado = "lock";
			group.view.refresh();
			return group.estado;
		}else if(group.estado == "lock"){
			group.estado = "load";
			group.view.refresh();
			return group.estado;	
		}
	}

	this.removeUnit = function(unit){

		var index = group.unitList.indexOf(unit);
		group.unitList.splice(index,1);
		group.view.refresh();

	}

	this.getView = function(){
		return group.view.getView();
	}
}


OCM.Faction = function(params){
	var faction = this;
	this.name = params.name;
	this.unitList = params.unitList;
	this.id = params.id;
	this.img = params.img;
	this.view = new OCV.factionView(this);
	this.icon = $("<img class='factionIcon'src= 'img/"+faction.img+" '></img>");
	
	this.icon.on("tap",function(){
		GLOBALS.estado.grupos();
		$("#home").empty().append(faction.getView());
		console.log(faction.id);
		GLOBALS.unitData = cargaDataLogos_ENG(faction.id);
	});

	this.getView = function(){
		return faction.view.getView();
	}

	this.getIcon = function(){
		return faction.icon;
	}
}


