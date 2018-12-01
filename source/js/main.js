var north = {
	toys		: 0,
	workshopLvl : 0,
	toolLvl		: 0,
	elfLevel 	: 0,
	sleighLvl 	: 0,
	bagLvl 		: 0,
	deerLvl 	: 0,
	chMagic		: 0
}

var northF = {
 getQuota : function() {
 	return parseFloat((25*(Math.pow(1.1, north.sleighLvl + north.bagLvl + north.deerLvl))).toFixed(0));
 	//25 * (1 + north.sleighLvl + north.bagLvl + north.deerLvl);
 },
 canDeliver : function() {
 	return (north.toys >= this.getQuota());
 },
 upgradeCost : function(upgradeType) {
 	//((north[upgradeType]+1)*25)
 	//50×1.07^1
 	//Base Cost * (Rate ^ UpgradeLvl)
 	return parseFloat((25*(Math.pow(1.07, (north[upgradeType])))).toFixed(0));
 },
 canUpgrade :  function(upgradeType) {
 	return north.chMagic >= northF.upgradeCost(upgradeType);
 },
 buildRate : function() {
 	return 1 + north.workshopLvl + north.toolLvl + north.elfLevel;
 }
}

function saveGame(){
	localStorage.setItem('northPole', JSON.stringify(north));
	renderGame.toys();
	renderGame.quota();
	renderGame.chMagic();
	renderGame.upgradeButtons();
}
function loadGame(){
	if (JSON.parse(localStorage.getItem('northPole'))){
		north = JSON.parse(localStorage.getItem('northPole'));
	}
	renderGame.toys();
	renderGame.quota();
	renderGame.chMagic();
	renderGame.upgradeButtons();
}

function deliver() {
	if(northF.canDeliver()){
		north.toys = north.toys - northF.getQuota();
		north.chMagic = north.chMagic + northF.getQuota();
		saveGame();
	}
}

function makeToy() {
	if(northF.getQuota() > north.toys){
		north.toys = north.toys + northF.buildRate();;
	 	saveGame();
 	}
}
function upgrade(upgradeType){
	if(northF.canUpgrade(upgradeType)){
		north.chMagic = north.chMagic - northF.upgradeCost(upgradeType);
		north[upgradeType]++;
		saveGame();
	}
}

var renderGame = {
	//Render Workshop
	//Toys
	toys : function() {
		$("span.clickTotal").html(north.toys);
		$("span#stock").html(north.toys);
	},
	quota : function() {
		$("span#quota").html(northF.getQuota());
		$(".progress-bar").css("width", ( (north.toys/northF.getQuota())*100)+"%");
	},
	chMagic : function() {
		$("span#magic").html(north.chMagic);
	},
	upgradeButtons : function() {
		//Class= btn-[UpgradeName]
		var upgrades = ["workshopLvl", "toolLvl", "elfLevel", "sleighLvl", "bagLvl", "deerLvl"];
		upgrades.forEach(function(element) {
			$("#num-"+element).html(north[element]);
			$("#cost-"+element).html(northF.upgradeCost(element));
			// console.log(north[element]);
			if (northF.canUpgrade(element)) {
  				$("#btn-"+element).removeClass("disabled");
  			}
  			else{
  				$("#btn-"+element).addClass("disabled");
  			}
		});
		if(northF.canDeliver()){
			$("#btn-deliverGifts").removeClass("disabled");
		}
		else{
  			$("#btn-deliverGifts").addClass("disabled");
  		}
  		//update World Delivery Rate
  		$("#deliveryRate").html(((northF.getQuota()/1993484080)*100).toFixed(6));
	}
	//Render Santa's Garage

}

//Inistalize Memory or save to Memory for first time
if (JSON.parse(localStorage.getItem('northPole'))) {
    console.log("Load from Memory");
    loadGame();
}
else{
	console.log("Load Defaults");
    saveGame();
}    

$( "#makeToy" ).click(function() {
 	makeToy();
});
$( "#btn-deliverGifts" ).click(function() {
 	deliver();
});
$( ".btn-upgrade" ).click(function(event) {
 	upgrade((event.target.id).substring(4));
});


            


//~~~~~RESET GAME~~~~~~
$( "#resetGame" ).click(function() {
    localStorage.clear();
    location.reload(); 
});

            
           

function autoToy() {
    clickTest();
    setTimeout(autoToy, 1);
}


function clickTest(){
	var updatedScore = JSON.parse(localStorage.getItem('masterScore'));
    updatedScore = updatedScore + 1*(JSON.parse(localStorage.getItem('workshopLvl')));
    $("span.clickTotal").html(updatedScore);
    localStorage.setItem('masterScore', updatedScore);
    if (updatedScore == 100) {
        $("#upgradeElf").removeClass("disabled");
    }
}



