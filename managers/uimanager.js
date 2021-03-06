﻿/**
 * 
 */

function UIManager() {
	this.ctx = gm.ctxUI;
	this.ctx.lineWidth="2";
	this.screenWidth = this.ctx.canvas.width;
	this.screenHeight = this.ctx.canvas.height;
	this.gameMenu = new GameMenu(this, this.ctx, 10, 10);
	this.gameMenu.addButtonPackage(this.gameMenu.getGameMenuButtons());
	this.dialogueBox = new DialogueBox(this, this.ctx);
	this.merchantMenu = new MerchantMenu(this, this.ctx, this.screenWidth / 4 + 15, 10);
	this.optionsMenu = new OptionsMenu(this, this.ctx, this.screenWidth / 4 + 15, 10);
	this.itemsMenu = new ItemsMenu(this, this.ctx, this.screenWidth / 4 + 15, 10);
	this.statusBox = new StatusBox(this, this.ctx);
	
	this.titleMenu = new TitleMenu(this, this.ctx);
	
	this.playerDisplay = new PlayerDisplay(this, this.ctx, 10, null);
	this.focusItem = null;
	
	this.showBattleItems = false;
	this.battleItemsMenu = new BattleItemsMenu(this, this.ctx, this.screenWidth / 4 + 15, 10); 
	
	this.showStatusBox = false;
	this.showDialogue = false;
	this.showGameMenu = false;
	this.showBattleMenu = false;
	this.menuState = "none";
	
	this.battleMenu = new GameMenu(this, this.ctx, 100, 100);
    this.battleMenu.addButtonPackage(this.battleMenu.getBattleMenuButtons());
    this.battleMenu.updateMenu(0, 0, this.screenWidth / 6, this.screenHeight / 18);
    this.battleMenu.adaptiveMenu = true;
	
	document.getElementById("uiLayer").style.zIndex = "-1";
	this.controls();
}
UIManager.prototype.update = function() {
	if (this.showGameMenu) {
		this.gameMenu.update();
		this.playerDisplay.update();
		
		switch(this.menuState) {
			case "options":
				this.optionsMenu.update();
				break;
			case "items":
				this.itemsMenu.update();
				break;
		}
		
	}
	if (this.showBattleMenu) {
		this.battleMenu.update();
		this.statusBox.update();
		if (this.showBattleItems) {
			this.battleItemsMenu.update();
		}
	}
	if (this.showStatusBox) {
		this.statusBox.update();
	}
	if (this.showMerchant) {
		this.merchantMenu.update();
	}
	if (this.showDialogue) {
		this.dialogueBox.update();
	}
	if (this.showTitleMenu) {
		this.titleMenu.update();
	}
	
	gm.im.setAllFalse();
}
UIManager.prototype.draw = function() {
	this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
	if (this.showGameMenu) {
		this.gameMenu.draw();
		this.playerDisplay.draw();
		
		switch(this.menuState) {
		case "options":
			this.optionsMenu.draw();
			break;
		case "items":
			this.itemsMenu.draw();
			break;
	}
		
	}
	if (this.showDialogue) {
		this.dialogueBox.draw();
	}
	if (this.showBattleMenu) {
		this.battleMenu.draw();
		this.statusBox.draw();
		if (this.showBattleItems) {
			this.battleItemsMenu.draw();
		}
	}
	if (this.showStatusBox) {
		this.statusBox.draw();
	}
	if (this.showMerchant) {
		this.merchantMenu.draw();
	}
	if (this.showTitleMenu) {
		this.titleMenu.draw();
	}
}

UIManager.prototype.controls = function () {
	var temp = gm.im.currentgroup.name;
	gm.im.addGroup("ui", this.ctx);
	//console.log(gm.im.currentgroup);
	gm.im.currentgroup.addMouse();
	gm.im.addInput(new Input("up", 'w'));
	gm.im.addInput(new Input("down", 's'));
	gm.im.addInput(new Input("left", 'a'));
	gm.im.addInput(new Input("right", 'd'));
	gm.im.addInput(new Input("menu", 'q'));
	gm.im.addInput(new Input("confirm", 'e'));
	gm.im.changeCurrentGroupTo(temp);
}
/* +------------------------------------------+ */
/* |           ===  Title Menu  ===           | */
/* +------------------------------------------+ */
function TitleMenu(uimanager, ctx) {
	this.ui = uimanager;
	this.ctx = ctx;
	this.splashImage = gm.am.getAsset("./img/ArdentEndeavorTitle.png");
	this.startGameBtn = new Button(this, this.ctx, "Start Game",
			this.ui.screenWidth / 3,
			this.ui.screenHeight / 4 * 3,
			200, 38,
			closeTitle = function () {
				gm.closeTitleMenu();
			});
}

TitleMenu.prototype.update = function () {
	this.startGameBtn.update();
}

TitleMenu.prototype.draw = function () {
	this.ctx.drawImage(gm.am.getAsset("./img/ArdentEndeavorTitle.png"), 0, 0);
	
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	roundRect(this.ctx, this.ui.screenWidth / 3 - 10, this.ui.screenHeight / 4 * 3 - 5, 220, 50, 20, true, true);
	
	this.startGameBtn.draw(this.ctx);
}


/* +------------------------------------------+ */
/* |         ===  Player Display  ===         | */
/* +------------------------------------------+ */
function PlayerDisplay(uimanager, ctx, x, y) {
	this.ui = uimanager;
	this.ctx = ctx;
	this.BORDER_PADDING = 5;
	this.VERT_PADDING = this.ui.screenWidth / 50;
	this.MENU_WIDTH = this.ui.screenWidth - (this.BORDER_PADDING * 2);
	this.PLAYER_HEIGHT = this.ui.screenHeight / 7;
	this.PLAYER_WIDTH = (this.ui.screenWidth - (this.VERT_PADDING * 4) - (this.BORDER_PADDING * 2)) / 3;
	this.TOP_BOT_PADDING = this.ui.screenHeight / 48;
	
	this.x = this.BORDER_PADDING;
	this.y = this.ui.screenHeight - this.BORDER_PADDING - this.TOP_BOT_PADDING*2 - this.PLAYER_HEIGHT;
	this.buttons = [];
	this.init();
}

PlayerDisplay.prototype.init = function () {
	this.buttons.length = 0;
	for (var i = 0; i < gm.bm.battleUnits.length; i++) {
		this.buttons.push(new PlayerButton(this, this.ctx, gm.bm.battleUnits[i],
				this.x + this.VERT_PADDING*(i+1) + this.PLAYER_WIDTH*i, this.y + this.TOP_BOT_PADDING,
				this.PLAYER_WIDTH, this.PLAYER_HEIGHT
		));
	}
	
}

PlayerDisplay.prototype.update = function () {
	// Update buttons
	var i;
	for (i = 0; i < this.buttons.length; i++) {
		this.buttons[i].update(this.ctx);
	}
	
}
PlayerDisplay.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, (this.PLAYER_HEIGHT + this.TOP_BOT_PADDING*2), 5, true, true);
			
	if (gm.ui.focusItem != null) {
		roundRect(this.ctx, this.x + 50 + (this.MENU_WIDTH / 4), this.y - 55, this.MENU_WIDTH / 3, (this.PLAYER_HEIGHT / 4 + this.TOP_BOT_PADDING*2), 5, true, true);
	}
	
	// Draw Currency
	roundRect(this.ctx, this.x, this.y - 55, this.MENU_WIDTH / 4, (this.PLAYER_HEIGHT / 4 + this.TOP_BOT_PADDING*2), 5, true, true);
	// Font options
	var fontSize = 24;
	this.ctx.fillStyle = "rgb(255, 255, 255)";
	this.ctx.font = fontSize + "px sans-serif";
	// Text position
	var textSize = this.ctx.measureText("HP:");
	var textX = this.x + this.VERT_PADDING;// + (this.width/2) - (textSize.width);
	var textY = this.y-(this.PLAYER_HEIGHT/4);// + (fontSize);
	this.ctx.fillText(gm.player.gold + " gold", textX, textY);
	
	if (gm.ui.focusItem != null) {
		textSize = this.ctx.measureText("Select Target");
		var textX = this.x + 50 + (this.MENU_WIDTH / 4) + (this.MENU_WIDTH/3/2) - (textSize.width/2);
		this.ctx.fillText("Select Target", textX, textY);
	}
	
	// Draw buttons
	var i;
	for (i = 0; i < this.buttons.length; i++) {
		this.buttons[i].draw(this.ctx);
	}
}


function PlayerButton(parent, ctx, playerUnit, x, y, width, height) {
	this.parent = parent;
	this.ctx = ctx;
	this.playerUnit = playerUnit;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.hovered = false;
	this.onClickEvent = null;
}

PlayerButton.prototype.moveButton = function (x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

PlayerButton.prototype.update = function (canvas) {
    
    if (gm.im.checkMouse() && gm.im.getMouse() != null) {
    	//console.log("x: " + gm.im.getMouse().x + "  y: " + gm.im.getMouse().y);
    	if (gm.im.getMouse().x > this.x && 
				gm.im.currentgroup.mouse.y > this.y &&
				gm.im.currentgroup.mouse.x < this.x + this.width &&
				gm.im.currentgroup.mouse.y < this.y + this.height) {
			this.hovered = true;
		} else {
			this.hovered = false;
		}
    }
    if (gm.im.checkMouse() && gm.im.getClick() != null) {
    	if (gm.im.getMouse().x > this.x && 
				gm.im.currentgroup.mouse.y > this.y &&
				gm.im.currentgroup.mouse.x < this.x + this.width &&
				gm.im.currentgroup.mouse.y < this.y + this.height) {
    		//console.log(this.text + " menu option was clicked");
    		if (gm.ui.focusItem != null) {
        		//this.onClickEvent();
    			if (gm.ui.focusItem.constructor.name === "Consumable") {
    				console.log(gm.ui.focusItem.constructor.name);
    				gm.ui.focusItem.use(this.playerUnit);
    				if (gm.ui.focusItem.quantity <= 0) {
    					gm.ui.focusItem = null;
    				}
    				gm.ui.itemsMenu.init();
    			}
    		}
    	}
    }
}

PlayerButton.prototype.draw = function(ctx) {
	// Button color
	if (gm.ui.focusItem != null && this.hovered) {
		ctx.fillStyle = 'rgba(255,165,0,0.5)';
	} else {
		ctx.fillStyle = 'rgba(0,0,0,0)';
	}
	
	// Draw button frame
	ctx.fillRect(this.x, this.y, this.width, this.height);
	
	// Font options
	var fontSize = 24;
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = fontSize + "px sans-serif";
	
	// Text position
	var textSize = ctx.measureText("HP:");
	var textX = this.x + (this.width/2) - (textSize.width);
	var textY = this.y + (fontSize);
	
	// Draw playerUnit
    //this.playerUnit.animation.drawEntity(gm.clockTick, ctx, this.x - this.parent.VERT_PADDING, this.y + this.parent.PLAYER_HEIGHT + this.parent.TOP_BOT_PADDING);
	if (gm.ui.focusItem != null && this.hovered) {
		this.playerUnit.animation.drawPlayerUnitUIEntity(gm.clockTick, ctx, this.x - this.parent.VERT_PADDING, this.y + this.parent.TOP_BOT_PADDING);
	} else {
		ctx.drawImage(this.playerUnit.animation.spriteSheet,
				0, 0,  // source from sheet
				this.playerUnit.animation.frameWidth, this.playerUnit.animation.frameHeight,
				this.x - this.parent.VERT_PADDING, this.y + this.parent.TOP_BOT_PADDING,
				this.playerUnit.animation.frameWidth * this.playerUnit.animation.scale,
				this.playerUnit.animation.frameHeight * this.playerUnit.animation.scale);	
	}
	
	
	// Draw text
	ctx.fillText(this.playerUnit.name, textX, textY);
	ctx.font = 20 + "px sans-serif";
	ctx.fillText("Lvl: " + this.playerUnit.level + "  xp: " + this.playerUnit.exp + "/" + this.playerUnit.nextLevelExp, textX, textY+fontSize*1);
	ctx.fillText("HP: " + this.playerUnit.health + " / " + this.playerUnit.maxhealth, textX, textY+fontSize*2+5);
}






/* +------------------------------------------+ */
/* |           ===  Game Menu  ===            | */
/* +------------------------------------------+ */
function GameMenu(uimanager, ctx, x, y) {
	this.ui = uimanager;
	this.VERT_PADDING = this.ui.screenWidth / 50;
	this.BUTTON_HEIGHT = this.ui.screenHeight / 20;
	this.MENU_WIDTH = this.ui.screenWidth / 4;
	this.TOP_BOT_PADDING = this.ui.screenHeight / 48;
	
	this.x = x;
	this.y = y;
	this.ctx = ctx;
	this.buttons = [];
	this.adaptiveMenu = false;
}
GameMenu.prototype.update = function () {
	// Update buttons
	for (var i = 0; i < this.buttons.length; i++) {
		this.buttons[i].update(this.ctx);
	}
	
	if (!this.adaptiveMenu) {
		if (gm.im.checkInput("menu")) {
			gm.closeGameMenu();
			gm.im.currentgroup.input_list[4].isPressed = false;
		}
	}
	if (this.adaptiveMenu && !gm.ui.showBattleItems) {
		let click = gm.im.getClick();
		if (gm.im.checkMouse() && click) {
	    	if (!(click.x > this.x && 
				click.y > this.y &&
				click.x < this.x + this.MENU_WIDTH &&
				click.y < this.y + (this.BUTTON_HEIGHT * this.buttons.length + this.TOP_BOT_PADDING*2)))
			{
				gm.im.currentgroup.click = undefined;
				gm.bm.cursor.deselect();
	    		gm.closeBattleMenu();
	    	}
	    }
	} else if (this.adaptiveMenu && gm.ui.showBattleItems) {
		let click = gm.im.getClick();
		if (gm.im.checkMouse() && click) {
	    	if (!(click.x > gm.ui.battleItemsMenu.x && 
				click.y > gm.ui.battleItemsMenu.y &&
				click.x < gm.ui.battleItemsMenu.x + gm.ui.battleItemsMenu.MENU_WIDTH + gm.ui.battleItemsMenu.VERT_PADDING*2 &&
				click.y < gm.ui.battleItemsMenu.y + (gm.ui.battleItemsMenu.BUTTON_HEIGHT * gm.ui.battleItemsMenu.items.length + gm.ui.battleItemsMenu.TOP_BOT_PADDING*2)))
			{
				gm.im.currentgroup.click = undefined;
				gm.ui.showBattleItems = false;
	    	}
	    }
	}
	
}
GameMenu.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, (this.BUTTON_HEIGHT * this.buttons.length + this.TOP_BOT_PADDING*2), 15, true, true);
			
	// Draw buttons
	var i;
	for (i = 0; i < this.buttons.length; i++) {
		this.buttons[i].draw(this.ctx);
	}
}
GameMenu.prototype.addButtonPackage = function (buttonPackage) {
	this.buttons = buttonPackage.slice(0);
}

GameMenu.prototype.moveMenu = function (x, y) {
	this.updateMenu(x, y, this.MENU_WIDTH, this.BUTTON_HEIGHT);
}

GameMenu.prototype.updateMenu = function (x, y, menuWidth, buttonHeight) {
	this.x = x;
	this.y = y;
	this.MENU_WIDTH = menuWidth;
	this.BUTTON_HEIGHT = buttonHeight;
	for (i = 0; i < this.buttons.length; i++) {
		this.buttons[i].moveButton(x + this.VERT_PADDING, y + (this.BUTTON_HEIGHT*i + this.TOP_BOT_PADDING), menuWidth - this.VERT_PADDING*2, buttonHeight);
	}
}


GameMenu.prototype.getGameMenuButtons = function () {
	var buttons = [];
	buttons.push(new Button(this, this.ctx, "Items",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*0 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openItems = function () {
				console.log("Open Items");
				gm.ui.menuState = "items";
				gm.ui.focusItem = null;
			}));
	
//	buttons.push(new Button(this, this.ctx, "Magic",
//			this.x + this.VERT_PADDING,
//			this.y + (this.BUTTON_HEIGHT*1 + this.TOP_BOT_PADDING),
//			this.MENU_WIDTH - this.VERT_PADDING*2,
//			this.BUTTON_HEIGHT,
//			openMagic = function () {
//				console.log("Open Magic");
//				gm.ui.menuState = "magic";
//			}));
	
	buttons.push(new Button(this, this.ctx, "Equipment",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*1 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openEquipment = function () {
				console.log("Open Equipment");
				gm.ui.menuState = "equipment";
				gm.ui.focusItem = null;
			}));
	
	buttons.push(new Button(this, this.ctx, "Status",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*2 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openStatus = function () {
				console.log("Open Status");
				gm.ui.menuState = "status";
				gm.ui.focusItem = null;
				//gm.openBattleMenu(300, 300);
			}));
	
	buttons.push(new Button(this, this.ctx, "Options",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*3 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openOptions = function () {
				console.log("Open Options");
				gm.ui.menuState = "options";
				gm.ui.focusItem = null;
			}));
	
//	buttons.push(new Button(this, this.ctx, "Save",
//			this.x + this.VERT_PADDING,
//			this.y + (this.BUTTON_HEIGHT*5 + this.TOP_BOT_PADDING),
//			this.MENU_WIDTH - this.VERT_PADDING*2,
//			this.BUTTON_HEIGHT,
//			openSave = function () {
//				console.log("Open Save");
//				gm.ui.menuState = "save";
//				//gm.openDialogueBox("Star Wars", "CHEWBACCA: A legendary Wookiee warrior and Han Solo’s co-pilot aboard the Millennium Falcon, Chewbacca was part of a core group of Rebels who restored freedom to the galaxy. Known for his short temper and accuracy with a bowcaster, Chewie also has a big heart -- and is unwavering in his loyalty to his friends. He has stuck with Han through years of turmoil that have changed both the galaxy and their lives.");
//			}));
	return buttons;
}

GameMenu.prototype.getBattleMenuButtons = function () {
	var buttons = [];
	buttons.push(new Button(this, this.ctx, "Attack",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*0 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openItems = function () {
				let selected = gm.bm.cursor.selected;
				if(!selected.attacked)
				{
				console.log("Run Attack");
				
				selected.selectedAction.attack = true;
				}

				//gm.ui.battleMenu.moveMenu(300, 300);
			}));
	buttons.push(new Button(this, this.ctx, "Move",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*1 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openMagic = function () {
				let selected = gm.bm.cursor.selected;
				if(!selected.moved)
				{
					console.log("Run Move");
					selected.selectedAction.move = true;
				}
			}));
	buttons.push(new Button(this, this.ctx, "Items",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*2 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openMagic = function () {
				console.log("Run Items");
				gm.ui.battleItemsMenu.init();
				gm.ui.showBattleItems = true;
				gm.im.currentgroup.click = undefined;
			}));
	buttons.push(new Button(this, this.ctx, "End Phase",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*2 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*3,
			this.BUTTON_HEIGHT,
			endPhase = function () {
				//gm.bm.currentBattle.resolveBattle();
				gm.im.currentgroup.click = undefined;
				gm.bm.cursor.deselect();
				console.log("TURN DONE")
		        gm.bm.currentBattle.resetPUnits();
		        gm.bm.cursor.reset();
		        gm.im.setFalse("endTurn");
		        gm.closeBattleMenu();
		        gm.bm.currentBattle.currentPhase = gm.bm.currentBattle.enemyPhase;
	}));
	return buttons;
}


/* +------------------------------------------+ */
/* |          ===  Options Menu  ===          | */
/* +------------------------------------------+ */
function OptionsMenu(uimanager, ctx, x, y) {
	this.ui = uimanager;
	this.VERT_PADDING = this.ui.screenWidth / 50;
	this.BUTTON_HEIGHT = this.ui.screenHeight / 14;
	this.MENU_WIDTH = this.ui.screenWidth * 3 / 4 - 20;
	this.TOP_BOT_PADDING = this.ui.screenHeight / 48;
	
	this.x = x;
	this.y = y;
	this.ctx = ctx;
	this.items = [];
	this.init();
}

OptionsMenu.prototype.init = function () {
	this.items.push(new CheckBox(this, this.ctx, "DEBUG: Display Collision",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*0 + this.TOP_BOT_PADDING),
			20,
			20,
			toggleDrawCollision = function () {
				gm.hitBoxVisible = this.isChecked;
			}));
	this.items.push(new CheckBox(this, this.ctx, "CHEAT: No Battles",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*1 + this.TOP_BOT_PADDING),
			20,
			20,
			toggleDrawCollision = function () {
				gm.nobattles = this.isChecked;
			}));
	this.items.push(new CheckBox(this, this.ctx, "Adaptive Battle Menu",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*2 + this.TOP_BOT_PADDING),
			20,
			20,
			toggleDrawCollision = function () {
				gm.mouseMenuActive = this.isChecked;
			}));
}
OptionsMenu.prototype.update = function () {
	// Update buttons
	var i;
	for (i = 0; i < this.items.length; i++) {
		this.items[i].update(this.ctx);
	}
	
}
OptionsMenu.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, (this.BUTTON_HEIGHT * this.items.length + this.TOP_BOT_PADDING*2), 15, true, true);
			
	// Draw buttons
	var i;
	for (i = 0; i < this.items.length; i++) {
		this.items[i].draw(this.ctx);
	}
}


/* +------------------------------------------+ */
/* |       ===  Battle Items Menu  ===        | */
/* +------------------------------------------+ */
function BattleItemsMenu(uimanager, ctx, x, y) {
	this.ui = uimanager;
	this.VERT_PADDING = this.ui.screenWidth / 50;
	this.BUTTON_HEIGHT = this.ui.screenHeight / 20;
	this.MENU_WIDTH = this.ui.screenWidth * 3 / 4 - 20;
	this.TOP_BOT_PADDING = this.ui.screenHeight / 48;
	
	this.x = x;
	this.y = y;
	this.counter = 0;
	this.ctx = ctx;
	this.items = [];
	//this.init();
}

BattleItemsMenu.prototype.init = function () {
	this.items.length = 0;
	this.counter = 0;
	for (var i = 0; i < gm.player.inventory.items.length; i++) {
		if ((gm.player.inventory.items[i].constructor.name === "Consumable" ||
				gm.player.inventory.items[i].constructor.name === "Item") &&
				gm.player.inventory.items[i].quantity > 0) {
			this.items.push(new uiBattleItem(this, this.ctx, this.x, this.counter,
					this.MENU_WIDTH, this.BUTTON_HEIGHT,
					gm.player.inventory.items[i]
			));
			this.counter++;
		}
	}
}
BattleItemsMenu.prototype.update = function () {
	// Update buttons
	var i;
	for (i = 0; i < this.items.length; i++) {
		this.items[i].update(this.ctx);
	}
	
}
BattleItemsMenu.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, (this.BUTTON_HEIGHT * this.items.length + this.TOP_BOT_PADDING*2), 15, true, true);
	
	// Draw buttons
	var i;
	for (i = 0; i < this.items.length; i++) {
		this.items[i].draw(this.ctx);
	}
}


function uiBattleItem(parent, ctx, x, i, width, height, item) {
	this.item = item;
	this.x = x;
	this.y = parent.y + parent.TOP_BOT_PADDING + (parent.BUTTON_HEIGHT * i);
	this.width = width;
	this.height = height;
	this.parent = parent;
	this.ctx = ctx;
	this.that = this;
	this.itemBtn = new Button(this, ctx, item.name + " - " + item.description, this.x+45, this.y, width/4*3, height,
		runItem = function () {
			console.log("Clicked " + item.name);
			this.parent.getItem().use(gm.bm.cursor.selected);
			gm.ui.statusBox.refresh();
			gm.ui.showBattleItems = false;
		});
}

uiBattleItem.prototype.getItem = function () {
	return this.item;
}

uiBattleItem.prototype.update = function (canvas) {
    this.itemBtn.update();
}

uiBattleItem.prototype.draw = function(ctx) {
	// Font options
	var fontSize = 20;
	this.ctx.fillStyle = "rgb(255, 255, 255)";
	this.ctx.font = fontSize + "px sans-serif";
	// Text position
	var textSize = this.ctx.measureText(this.item.quantity);
	var textX = this.x + this.parent.VERT_PADDING;
	var textY = this.y + (fontSize) + 2;
	this.ctx.fillText(this.item.quantity, textX, textY);
	
	this.itemBtn.draw(ctx, "left");
}




/* +------------------------------------------+ */
/* |           ===  Items Menu  ===           | */
/* +------------------------------------------+ */
function ItemsMenu(uimanager, ctx, x, y) {
	this.ui = uimanager;
	this.VERT_PADDING = this.ui.screenWidth / 50;
	this.BUTTON_HEIGHT = this.ui.screenHeight / 20;
	this.MENU_WIDTH = this.ui.screenWidth * 3 / 4 - 20;
	this.TOP_BOT_PADDING = this.ui.screenHeight / 48;
	
	this.x = x;
	this.y = y;
	this.ctx = ctx;
	this.items = [];
	//this.init();
}

ItemsMenu.prototype.init = function () {
	this.items.length = 0;
	var counter = 0;
	for (var i = 0; i < gm.player.inventory.items.length; i++) {
		if ((gm.player.inventory.items[i].constructor.name === "Consumable" ||
				gm.player.inventory.items[i].constructor.name === "Item") &&
				gm.player.inventory.items[i].quantity > 0) {
			this.items.push(new uiItem(this, this.ctx, this.x, counter,
					this.MENU_WIDTH, this.BUTTON_HEIGHT,
					gm.player.inventory.items[i]
			));
			counter++;
		}
	}
}
ItemsMenu.prototype.update = function () {
	// Update buttons
	var i;
	for (i = 0; i < this.items.length; i++) {
		this.items[i].update(this.ctx);
	}
//	for (var j = 0; j < gm.player.inventory.items.length; j++) {
//		console.log(gm.player.inventory.items[j].quantity + " " + gm.player.inventory.items[j].name);
//	}
	
}
ItemsMenu.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, (this.BUTTON_HEIGHT * this.items.length + this.TOP_BOT_PADDING*2), 15, true, true);
			
	// Draw buttons
	var i;
	for (i = 0; i < this.items.length; i++) {
		this.items[i].draw(this.ctx);
	}
}


function uiItem(parent, ctx, x, i, width, height, item) {
	this.item = item;
	this.x = x;
	this.y = parent.y + parent.TOP_BOT_PADDING + (parent.BUTTON_HEIGHT * i);
	this.width = width;
	this.height = height;
	this.parent = parent;
	this.ctx = ctx;
	this.itemBtn = new Button(parent, ctx, item.name + " - " + item.description, this.x+45, this.y, width/4*3, height,
		runItem = function () {
			console.log("Clicked " + item.name);
			gm.ui.focusItem = item;
		});
}

uiItem.prototype.update = function (canvas) {
    this.itemBtn.update();
}

uiItem.prototype.draw = function(ctx) {
	// Font options
	var fontSize = 20;
	this.ctx.fillStyle = "rgb(255, 255, 255)";
	this.ctx.font = fontSize + "px sans-serif";
	// Text position
	var textSize = this.ctx.measureText(this.item.quantity);
	var textX = this.x + this.parent.VERT_PADDING;
	var textY = this.y + (fontSize) + 2;
	this.ctx.fillText(this.item.quantity, textX, textY);
	
	this.itemBtn.draw(ctx, "left");
}



/* +------------------------------------------+ */
/* |           ===  Merchant Menu  ===           | */
/* +------------------------------------------+ */
function MerchantMenu(uimanager, ctx, x, y) {
	this.ui = uimanager;
	this.VERT_PADDING = this.ui.screenWidth / 50;
	this.BUTTON_HEIGHT = this.ui.screenHeight / 20;
	this.MENU_WIDTH = this.ui.screenWidth * 3 / 4 - 20;
	this.TOP_BOT_PADDING = this.ui.screenHeight / 48;
	
	this.merchantFocus = null;
	this.ctx = ctx;
	this.buyBox = new BuyBox(this, this.ctx, 10, 10);
	this.x = x;
	this.y = y;
	this.items = [];
	this.init();
}

MerchantMenu.prototype.init = function () {
	this.items.length = 0;
	var counter = 0;
    this.items.push(new MerchantItem(this, this.ctx, this.x, 0,
			this.MENU_WIDTH, this.BUTTON_HEIGHT,
			Inventory.LIBRARY.HEALTH_POTION
	));
    this.items.push(new MerchantItem(this, this.ctx, this.x, 1,
			this.MENU_WIDTH, this.BUTTON_HEIGHT,
			Inventory.LIBRARY.HIGH_POTION
	));
    this.items.push(new MerchantItem(this, this.ctx, this.x, 2,
			this.MENU_WIDTH, this.BUTTON_HEIGHT,
			Inventory.LIBRARY.ELIXER
	));
}
MerchantMenu.prototype.update = function () {
	// Update buttons
	var i;
	for (i = 0; i < this.items.length; i++) {
		this.items[i].update(this.ctx);
	}
//	for (var j = 0; j < gm.player.inventory.items.length; j++) {
//		console.log(gm.player.inventory.items[j].quantity + " " + gm.player.inventory.items[j].name);
//	}
	if (gm.im.checkInput("menu") || gm.im.checkInput("confirm")) {
		gm.im.setAllFalse();
		this.merchantFocus = null;
		//gm.im.currentgroup.input_list[4].isPressed = false;
		gm.closeMerchantMenu();
	}
	
	if (this.merchantFocus != null) {
		this.buyBox.update();
	}
	
}
MerchantMenu.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, (this.BUTTON_HEIGHT * this.items.length + this.TOP_BOT_PADDING*2), 15, true, true);
			
	// Draw Currency Box
	roundRect(this.ctx, 10, this.ui.screenHeight - this.BUTTON_HEIGHT - this.TOP_BOT_PADDING*2 - 10, this.buyBox.MENU_WIDTH, (this.BUTTON_HEIGHT + this.TOP_BOT_PADDING*2), 5, true, true);
	
	// Draw buttons
	var i;
	for (i = 0; i < this.items.length; i++) {
		this.items[i].draw(this.ctx);
	}
	
	if (this.merchantFocus != null) {
		this.buyBox.draw();
	}
	
	
	// Draw Currency
	// Font options
	var fontSize = 24;
	this.ctx.fillStyle = "rgb(255, 255, 255)";
	this.ctx.font = fontSize + "px sans-serif";
	// Text position
	var textSize = this.ctx.measureText(gm.player.gold + " gold");
	var textX = 10 + (this.buyBox.MENU_WIDTH/2) - (textSize.width/2);
	var textY = this.ui.screenHeight - this.BUTTON_HEIGHT - this.TOP_BOT_PADDING - 10 + fontSize;
	this.ctx.fillText(gm.player.gold + " gold", textX, textY);
}


function BuyBox(parent, ctx, x, y) {
	this.VERT_PADDING = parent.ui.screenWidth / 50;
	this.LINE_HEIGHT = parent.ui.screenHeight / 20;
	this.MENU_WIDTH = parent.ui.screenWidth / 4;
	this.TOP_BOT_PADDING = parent.ui.screenHeight / 48;
	
	this.parent = parent;
	this.ctx = ctx;
	this.x = x;
	this.y = y;
	this.item = null;
	this.inventoryIndex = null;
	this.quantity = 0;
	this.buyCount = 0;
	
	// Increment / Decrement buttons
	this.decrementOneBtn = new Button(parent, ctx, "-",
			this.x+50, this.y+this.LINE_HEIGHT*3, 20, this.LINE_HEIGHT,
			runItem = function () {
				if (gm.ui.merchantMenu.buyBox.quantity + gm.ui.merchantMenu.buyBox.buyCount > 0) {
					gm.ui.merchantMenu.buyBox.buyCount--;
				}
				if (gm.ui.merchantMenu.buyBox.buyCount === 0) {
					gm.ui.merchantMenu.buyBox.buySellBtn.setText("---");
				} else if (gm.ui.merchantMenu.buyBox.buyCount < 0) {
					gm.ui.merchantMenu.buyBox.buySellBtn.setText("Sell");
				}
			}, true);
	
	this.decrementFiveBtn = new Button(parent, ctx, "--",
			this.x+10, this.y+this.LINE_HEIGHT*3, 35, this.LINE_HEIGHT,
			runItem = function () {
				if (gm.ui.merchantMenu.buyBox.quantity + gm.ui.merchantMenu.buyBox.buyCount > 4) {
					gm.ui.merchantMenu.buyBox.buyCount -= 5;
				} else {
					gm.ui.merchantMenu.buyBox.buyCount = -1 * gm.ui.merchantMenu.buyBox.quantity;
				}
				if (gm.ui.merchantMenu.buyBox.buyCount === 0) {
					gm.ui.merchantMenu.buyBox.buySellBtn.setText("---");
				} else if (gm.ui.merchantMenu.buyBox.buyCount < 0) {
					gm.ui.merchantMenu.buyBox.buySellBtn.setText("Sell");
				}
			}, true);
	
	this.incrementOneBtn = new Button(parent, ctx, "+",
			this.x+90, this.y+this.LINE_HEIGHT*3, 20, this.LINE_HEIGHT,
			runItem = function () {
				if ((gm.ui.merchantMenu.buyBox.buyCount+1)*gm.ui.merchantMenu.buyBox.item.price < gm.player.gold) {
					gm.ui.merchantMenu.buyBox.buyCount++;
				}
				if (gm.ui.merchantMenu.buyBox.buyCount === 0) {
					gm.ui.merchantMenu.buyBox.buySellBtn.setText("---");
				} else if (gm.ui.merchantMenu.buyBox.buyCount > 0) {
					gm.ui.merchantMenu.buyBox.buySellBtn.setText("Buy");
				}
			}, true);
	
	this.incrementFiveBtn = new Button(parent, ctx, "++",
			this.x+115, this.y+this.LINE_HEIGHT*3, 35, this.LINE_HEIGHT,
			runItem = function () {
				if ((gm.ui.merchantMenu.buyBox.buyCount+5)*gm.ui.merchantMenu.buyBox.item.price < gm.player.gold) {
					gm.ui.merchantMenu.buyBox.buyCount += 5;
				} else {
					gm.ui.merchantMenu.buyBox.buyCount = Math.floor(gm.player.gold / gm.ui.merchantMenu.buyBox.item.price);
				}
				if (gm.ui.merchantMenu.buyBox.buyCount === 0) {
					gm.ui.merchantMenu.buyBox.buySellBtn.setText("---");
				} else if (gm.ui.merchantMenu.buyBox.buyCount > 0) {
					gm.ui.merchantMenu.buyBox.buySellBtn.setText("Buy");
				}
			}, true);
	
	
	// Buy / Sell button
	this.buySellBtn = new Button(parent, ctx, "---",
			this.x+52, this.y+this.LINE_HEIGHT*5 + 15, 50, this.LINE_HEIGHT,
			runItem = function () {
				gm.player.inventory.addItem(gm.ui.merchantMenu.buyBox.item, gm.ui.merchantMenu.buyBox.buyCount);
				gm.player.gold -= gm.ui.merchantMenu.buyBox.getCost();
				gm.ui.merchantMenu.merchantFocus = null;
			}, true);
}

BuyBox.prototype.init = function (item) {
	gm.player.inventory.addItem(item, 0);
	this.inventoryIndex = gm.player.inventory.items.indexOf(item);
	this.item = item;
	this.quantity = gm.player.inventory.items[this.inventoryIndex].quantity;
	this.buyCount = 0;
}
BuyBox.prototype.getCost = function () {
	if (this.buyCount >= 0) {
		return this.buyCount * this.item.price;
	} else {
		return this.buyCount * (this.item.price / 2);
	}
}
BuyBox.prototype.update = function () {
	// Update buttons
	this.incrementOneBtn.update();
	this.incrementFiveBtn.update();
	this.decrementOneBtn.update();
	this.decrementFiveBtn.update();
	this.buySellBtn.update();
}
BuyBox.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, (this.LINE_HEIGHT * 6 + this.TOP_BOT_PADDING*2), 15, true, true);
			
	// Draw buttons
	this.incrementOneBtn.draw(this.ctx);
	this.incrementFiveBtn.draw(this.ctx);
	this.decrementOneBtn.draw(this.ctx);
	this.decrementFiveBtn.draw(this.ctx);
	this.buySellBtn.draw(this.ctx);
	
	// Font options
	var fontSize = 20;
	this.ctx.fillStyle = "rgb(255, 255, 255)";
	this.ctx.font = fontSize + "px sans-serif";
	// Text position
	var textSize = this.ctx.measureText(this.item.name);
	var textX = this.x + this.MENU_WIDTH/2 - textSize.width/2;
	var textY = this.y + this.LINE_HEIGHT*1;
	this.ctx.fillText(this.item.name, textX, textY);
	
	this.ctx.fillText(" " + this.quantity + "  +  " + this.buyCount + "  =  " + (this.quantity+this.buyCount),
			this.x + this.VERT_PADDING,
			this.y + this.LINE_HEIGHT*2 + this.TOP_BOT_PADDING);
	
	var cost = this.getCost();
	if (cost < 0) {
		cost *= -1;
		cost = "+" + cost;
	}
	textSize = this.ctx.measureText(cost + " gold");
	textX = this.x + this.MENU_WIDTH/2 - textSize.width/2;
	this.ctx.fillText(cost + " gold",
			textX,
			this.y + this.LINE_HEIGHT*5 + this.TOP_BOT_PADDING - (fontSize/2));
}


function MerchantItem(parent, ctx, x, i, width, height, item) {
	this.item = item;
	this.x = x;
	this.y = parent.y + parent.TOP_BOT_PADDING + (parent.BUTTON_HEIGHT * i);
	this.width = width;
	this.height = height;
	this.parent = parent;
	this.ctx = ctx;
	this.itemBtn = new Button(parent, ctx, item.name + " - " + item.description,
		this.x+55, this.y, width/4*3, height,
		runItem = function () {
			console.log("Clicked " + item.name);
			parent.merchantFocus = item;
			gm.ui.merchantMenu.buyBox.init(item);
		});
}

MerchantItem.prototype.update = function (canvas) {
    this.itemBtn.update();
}

MerchantItem.prototype.draw = function(ctx) {
	// Font options
	var fontSize = 20;
	this.ctx.fillStyle = "rgb(255, 255, 255)";
	this.ctx.font = fontSize + "px sans-serif";
	// Text position
	var textSize = this.ctx.measureText(this.item.price);
	var textX = this.x + this.parent.VERT_PADDING;
	var textY = this.y + (fontSize) + 2;
	this.ctx.fillText(this.item.price + "g", textX, textY);
	
	this.itemBtn.draw(ctx, "left");
}






/* +------------------------------------------+ */
/* |            ===  Button  ===              | */
/* +------------------------------------------+ */

function Button(parent, ctx, text, x, y, width, height, onClickEvent, fillButton) {
	this.parent = parent;
	this.ctx = ctx;
	this.text = text;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.hovered = false;
	this.onClickEvent = onClickEvent;
	this.fillButton = false;
	if (fillButton != undefined) {
		this.fillButton = fillButton;
	}
}

Button.prototype.moveButton = function (x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Button.prototype.setText = function (string) {
	this.text = string;
}

Button.prototype.update = function (canvas) {
    
    if (gm.im.checkMouse() && gm.im.getMouse() != null) {
    	//console.log("x: " + gm.im.getMouse().x + "  y: " + gm.im.getMouse().y);
    	if (gm.im.getMouse().x > this.x && 
				gm.im.currentgroup.mouse.y > this.y &&
				gm.im.currentgroup.mouse.x < this.x + this.width &&
				gm.im.currentgroup.mouse.y < this.y + this.height) {
			this.hovered = true;
		} else {
			this.hovered = false;
		}
    }
    if (gm.im.checkMouse() && gm.im.getClick() != null) {
    	if (gm.im.getMouse().x > this.x && 
				gm.im.currentgroup.mouse.y > this.y &&
				gm.im.currentgroup.mouse.x < this.x + this.width &&
				gm.im.currentgroup.mouse.y < this.y + this.height) {
    		//console.log(this.text + " menu option was clicked");
    		this.onClickEvent();
    	}
    }
}

Button.prototype.draw = function(ctx, align) {
	var alignment = "center";
	if (align != null && align != undefined) {
		alignment = align;
	}
	
	
	// Button color
	if (this.hovered) {
		ctx.fillStyle = 'rgba(255,165,0,0.5)';
		if (this.fillButton) {
			ctx.fillStyle = 'rgba(255,165,0,1)';
		}
	} else if (this.fillButton) {
		ctx.fillStyle = 'rgba(6, 147, 194, 0.6)';
	} else {
		ctx.fillStyle = 'rgba(0,0,0,0)';
	}
	
	// Draw button frame
	roundRect(ctx, this.x, this.y, this.width, this.height, 15, true, false);
	//ctx.fillRect(this.x, this.y, this.width, this.height);
	
	// Font options
	var fontSize = 20;
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = fontSize + "px sans-serif";
	
	// Text position
	var textSize = ctx.measureText(this.text);
	var textX = this.x + (this.width/2) - (textSize.width/2);
	if (alignment === "left") {
		textX = this.x + 15;
	}
	var textY = this.y + (this.height) - (fontSize/2);
	
	// Draw text
	ctx.fillText(this.text, textX, textY);
}

/* +------------------------------------------+ */
/* |            ===  CheckBox  ===            | */
/* +------------------------------------------+ */

function CheckBox(parent, ctx, text, x, y, width, height, onClickEvent, isChecked) {
	this.parent = parent;
	this.ctx = ctx;
	this.text = text;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.hovered = false;
	this.isChecked = isChecked;
	this.onClickEvent = onClickEvent;
}

CheckBox.prototype.moveCheckBox = function (x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

CheckBox.prototype.update = function (canvas) {
    
    if (gm.im.checkMouse() && gm.im.getMouse() != null) {
    	//console.log("x: " + gm.im.getMouse().x + "  y: " + gm.im.getMouse().y);
    	if (gm.im.getMouse().x > this.x && 
				gm.im.currentgroup.mouse.y > this.y &&
				gm.im.currentgroup.mouse.x < this.x + this.width &&
				gm.im.currentgroup.mouse.y < this.y + this.height) {
			this.hovered = true;
		} else {
			this.hovered = false;
		}
    }
    if (gm.im.checkMouse() && gm.im.getClick() != null) {
    	if (gm.im.getMouse().x > this.x && 
				gm.im.currentgroup.mouse.y > this.y &&
				gm.im.currentgroup.mouse.x < this.x + this.width &&
				gm.im.currentgroup.mouse.y < this.y + this.height) {
    		//console.log(this.text + " menu option was clicked");
    		if (this.isChecked) {
    			this.isChecked = false;
    		} else {
    			this.isChecked = true;
    		}
    		this.onClickEvent(this.isChecked);
    	}
    }
}

CheckBox.prototype.draw = function(ctx) {
	// Checkbox highlight color
	if (this.hovered) {
		ctx.fillStyle = 'rgba(255,165,0,0.5)';
	} else {
		ctx.fillStyle = 'rgba(0,0,0,0)';
	}
	ctx.fillRect(this.x, this.y, this.width, this.height);
	
	ctx.strokeRect(this.x, this.y, this.width, this.height);
	if (this.isChecked) {
		ctx.lineWidth="2";
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.width, this.y + this.height);
		ctx.moveTo(this.x, this.y + this.height);
		ctx.lineTo(this.x + this.width, this.y);
		ctx.stroke();
		//ctx.lineWidth="1";
	}
	
	// Font options
	var fontSize = 20;
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = fontSize + "px sans-serif";
	
	// Text position
	var textSize = ctx.measureText(this.text);
	var textX = this.x + (this.width) + 10;
	var textY = this.y + (this.height);// - (fontSize/2);
	
	// Draw text
	ctx.fillText(this.text, textX, textY);
}


/* +------------------------------------------+ */
/* |         ===  Dialogue Box  ===           | */
/* +------------------------------------------+ */
function DialogueBox(uimanager, ctx) {
	this.ui = uimanager;
	this.BORDER_PADDING = 5;
	this.VERT_PADDING = this.ui.screenWidth / 50;
	this.LINE_HEIGHT = this.ui.screenHeight / 19;
	this.MENU_WIDTH = this.ui.screenWidth - (this.BORDER_PADDING * 2);
	this.TOP_BOT_PADDING = this.ui.screenHeight / 42;
	this.PAGE_SIZE = 4; // lines per page.
	this.LINE_SIZE = 75; // characters per line.
	this.canClose = true;
	this.LINE_SIZE = 65; // characters per line.
	
	// Text values
	this.targetName = "";
	this.pages = 0;
	this.lineCount = 0;
	this.parsedText = []; // pages array of lines array that contains characters.
	this.lastPage = false;
	this.arrowCount = 0;
	
	this.x = this.BORDER_PADDING;
	this.y = this.ui.screenHeight - (this.PAGE_SIZE * this.LINE_HEIGHT) - (this.TOP_BOT_PADDING * 2) - this.BORDER_PADDING;
	this.ctx = ctx;
	this.buttonMsg = "";
	this.buttons = [];
}

DialogueBox.prototype.update = function () {
	
	if (gm.im.checkInput("confirm")) {
		if (this.lastPage) {
			if (this.canClose)
				gm.closeDialogueBox();
		} else {
			gm.im.setAllFalse();
			this.lineCount += this.PAGE_SIZE;
			
			if (this.lineCount + this.PAGE_SIZE >= this.parsedText.length) {
				this.lastPage = true;
			}
		}
	}
	if (this.arrowCount < 100) {
		this.arrowCount++;
	} else {
		this.arrowCount = 0;
	}
	
}

DialogueBox.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	
	// Name Box
	if (this.targetName != null) {
		roundRect(this.ctx, this.x + 10, this.y - this.LINE_HEIGHT - this.TOP_BOT_PADDING, this.MENU_WIDTH / 3, this.LINE_HEIGHT + (this.TOP_BOT_PADDING), 5, true, true);
	}
	// Dialogue Box
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, ((this.LINE_HEIGHT * this.PAGE_SIZE) + (this.TOP_BOT_PADDING*2)), 15, true, true);
	
	// Font options
	var fontSize = 20;
	this.ctx.fillStyle = "rgb(255, 255, 255)";
	this.ctx.font = fontSize + "px sans-serif";
	var textY = null;
	
	if (this.targetName != null) {
		this.ctx.fillText(this.targetName, this.x + 18, this.y - 10);
	}
	
	for (var i = 0; i < this.PAGE_SIZE; i++) {
		textY =  (this.y + this.TOP_BOT_PADDING + (i * this.LINE_HEIGHT)) + (this.LINE_HEIGHT/2);
		if (this.lineCount + 1 + i <= this.parsedText.length) {
			this.ctx.fillText(this.parsedText[this.lineCount + i], (this.x + this.VERT_PADDING), textY);
		}
	}
	if (!this.lastPage && this.arrowCount < 50) {
		this.ctx.fillRect(this.x + this.MENU_WIDTH - this.VERT_PADDING - 10,
				this.y + this.TOP_BOT_PADDING + (this.PAGE_SIZE * this.LINE_HEIGHT) - 10,
				10, 10);
	}
}

/* Parses Dialogue string into format for UI display. */
DialogueBox.prototype.newDialogue = function (name, string) {
	this.dialogue = string;
	this.targetName = name;
	this.parsedText.length = 0;
	//this.pages = string.length / (this.LINE_SIZE * this.PAGE_SIZE);
	
	// Parse the dialogue text into lines of text.
	var index = 0;
	var line = 0;
	while (index < string.length) {
		line = index + this.LINE_SIZE - 1;
		while (line < string.length && string.charAt(line) != ' ') {
			line--;
		}
		if (line >= string.length) {
			line = string.length - 1;
		}
		this.parsedText.push(string.substring(index, line + 1));
		index = line + 1;
	}
	
	this.lineCount = 0;
	if (this.lineCount + this.PAGE_SIZE >= this.parsedText.length) {
		this.lastPage = true;
	} else {
		this.lastPage = false;
	}
	gm.im.setAllFalse();
	this.ui.showDialogue = true;
}



/* +------------------------------------------+ */
/* |           ===  Status Box  ===          | */
/* +------------------------------------------+ */
function StatusBox(uimanager, ctx) {
	this.ui = uimanager;
	this.VERT_PADDING = this.ui.screenWidth / 50;
	this.LINE_HEIGHT = this.ui.screenHeight / 20;
	this.MENU_WIDTH = this.ui.screenWidth / 4;
	this.TOP_BOT_PADDING = this.ui.screenHeight / 48;
	
	this.x = 10;
	this.y = this.ui.screenHeight - (this.VERT_PADDING*2) - (this.LINE_HEIGHT*2) - 10;
	this.ctx = ctx;
	
	this.name = "Demo";
	this.currentHP = 000;
	this.maxHP = 999;
}

StatusBox.prototype.newInfo = function (name, currentHP, maxHP) {
	this.name = name;
	this.currentHP = currentHP;
	this.maxHP = maxHP;
	this.refresh(); // Overrides other stuff.
}
StatusBox.prototype.refresh = function () {
	this.name = gm.bm.cursor.selected.name;
	this.currentHP = gm.bm.cursor.selected.health;
	this.maxHP = gm.bm.cursor.selected.maxhealth;
}
StatusBox.prototype.move = function (x, y) {
	this.x = x;
	this.y = y;
}
StatusBox.prototype.update = function () {
	if (this.showStatusBox) {
		let click = gm.im.getClick();
		if (gm.im.checkMouse() && click) {
	    	if (!(click.x > this.x && 
				click.y > this.y &&
				click.x < this.x + this.MENU_WIDTH &&
				click.y < this.y + (this.BUTTON_HEIGHT * this.buttons.length + this.TOP_BOT_PADDING*2)))
			{
				gm.im.currentgroup.click = undefined;
				gm.bm.cursor.deselect();
	    		gm.closeStatusBox();
	    	}
	    }
	}
}
StatusBox.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, (this.LINE_HEIGHT * 2 + this.TOP_BOT_PADDING*2), 10, true, true);
	
	// Font options
	var fontSize = 20;
	this.ctx.fillStyle = "rgb(255, 255, 255)";
	this.ctx.font = fontSize + "px sans-serif";
	
	// Text position
	//var textSize = this.ctx.measureText(this.text);
	var textX = this.x + this.VERT_PADDING;
	var textY = this.y + this.TOP_BOT_PADDING + (this.LINE_HEIGHT*0) + (fontSize);
	
	// Draw text
	this.ctx.fillText(this.name, textX, textY);
	
	textY += this.LINE_HEIGHT;
	this.ctx.fillText("HP   " + this.currentHP + " / " + this.maxHP, textX, textY);
}









function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	  if (typeof stroke === 'undefined') {
	    stroke = true;
	  }
	  if (typeof radius === 'undefined') {
	    radius = 5;
	  }
	  if (typeof radius === 'number') {
	    radius = {tl: radius, tr: radius, br: radius, bl: radius};
	  } else {
	    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
	    for (var side in defaultRadius) {
	      radius[side] = radius[side] || defaultRadius[side];
	    }
	  }
	  ctx.beginPath();
	  ctx.moveTo(x + radius.tl, y);
	  ctx.lineTo(x + width - radius.tr, y);
	  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	  ctx.lineTo(x + width, y + height - radius.br);
	  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	  ctx.lineTo(x + radius.bl, y + height);
	  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	  ctx.lineTo(x, y + radius.tl);
	  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	  ctx.closePath();
	  if (fill) {
	    ctx.fill();
	  }
	  if (stroke) {
	    ctx.stroke();
	  }

	}