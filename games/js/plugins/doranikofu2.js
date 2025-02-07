// doranikofu edits to battle menu, and essential plugins that need to be at front
/*:
 * @plugindesc custom edits to battle menu, actor battler image/breath
 *
*/

// update saving for global save
DataManager.setupNewGame = function() {
    this.createGameObjects();
    this.selectSavefileForNewGame();
	this._globalSaveData = this.loadGlobalSaveData(); //add global
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer($dataSystem.startMapId,
        $dataSystem.startX, $dataSystem.startY);
    Graphics.frameCount = 0;
};
/*
DataManager.loadGameWithoutRescue = function(savefileId) {
    var globalInfo = this.loadGlobalInfo();
    if (this.isThisGameFile(savefileId)) {
        var json = StorageManager.load(savefileId);
        this.createGameObjects();
        this.extractSaveContents(JsonEx.parse(json));
        this._lastAccessedId = savefileId;
		this._globalSaveData = this.loadGlobalSaveData(); //add
        return true;
    } else {
        return false;
    }
};
*/

// bug for substitute, check damage, set to not apply to recover, only for HP and only for single target skill. also skip state 140 for walking dead
//also check restriction for substitute
BattleManager.checkSubstitute = function(target) {
    return target.isDying() && !this._action.isCertainHit() && !this._action.isRecover() && this._action.isHpEffect() && this._action.isForOne() && !target.isStateAffected(140);
};

Game_BattlerBase.prototype.isSubstitute = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove() && !this.isRestricted();
};


//=============================================================================
//##################rpg_sprites.js edits for static battler image; show breath and some status updates
//if restriction do not update motion for actors
Game_Actor.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    if (!this.isSpriteVisible()){// && !this.isRestricted()) {
       // this.requestMotion('damage');
  //  } else {
        $gameScreen.startShake(5, 5, 10);
    }
    SoundManager.playActorDamage();
};
//remove action to avoid jump of sprites
Game_Actor.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
};

//offset enemy spirte location slightly for wider screen
Sprite_Enemy.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    this._enemy = battler;
    this.setHome(battler.screenX()+80, battler.screenY()+30);
    this._stateIconSprite.setup(battler);
};


//play animation based on battler's z
    Sprite_Base.prototype.startAnimation = function(animation, mirror, delay) {
        var sprite = new Sprite_Animation();
        sprite.setup(this._effectTarget, animation, mirror, delay);
        //this.parent.addChild(sprite);  
        if(animation.position === 3){
            this.parent.addChild(sprite);
        } else {
            this.addChild(sprite);
        }

        this._animationSprites.push(sprite);
    };

    Sprite_Animation.prototype.updatePosition = function() {
        if (this._animation.position === 3) {
            this.x = this.parent.width / 2;
            this.y = this.parent.height / 2;

        } else {
            var parent = this._target.parent;
            var grandparent = parent ? parent.parent : null;
			if (this._animation.name.contains("LOOP")) {
          this.x = this._target.x;    //改成0的话动画本身不再偏移 this.x = 0;//
          this.y = this._target.y;    //改成0的话动画本身不再偏移 this.y = 0;//
			} else {
		        this.x = 0;   
				this.y = 0;  
			}
        if (this.parent === grandparent) {
            this.x += parent.x;
            this.y += parent.y;
        }
            if (this._animation.position === 0) {
                this.y -= this._target.height;
            } else if (this._animation.position === 1) {
                this.y -= this._target.height / 2;
            }
        }
			//if (this._animation.animation1Name == "xie_seal")	{ //special animations that play below chars
			if (this._animation.name.contains("BLW"))	{ //change to special prefix "BLW"for anime playing under chars
				this.z = -1;
			} else {
				this.z = 8;
			}
    };

//=======================

var _Sprite_Actor_initMembers = Sprite_Actor.prototype.initMembers;
Sprite_Actor.prototype.initMembers = function() {
    _Sprite_Actor_initMembers.call(this);
	this._random = [Math.random()*1000000,Math.random()*1000000];

};

Sprite_Actor.prototype.createShadowSprite = function() {
    this._shadowSprite = new Sprite();
    this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow2');
    this._shadowSprite.anchor.x = 0.5;
    this._shadowSprite.anchor.y = 0.5;
    this._shadowSprite.y = -17;
	this._shadowSprite.bitmap.smooth = true;
    this.addChild(this._shadowSprite);
};

var _sprite_actor_sprite_updateBitmap_d = Sprite_Actor.prototype.updateBitmap;
Sprite_Actor.prototype.updateBitmap = function() {
	_sprite_actor_sprite_updateBitmap_d.call(this);
	//resize shadow
	//this._shadowSprite.scale.y = (s+breathY);
	this._shadowSprite.scale.x = this._mainSprite.scale.x*this._mainSprite.bitmap.width/400;
	this._shadowSprite.scale.y = this._mainSprite.scale.y;
};


Sprite_Actor.prototype.updateFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
    var bitmap = this._mainSprite.bitmap;
    if (bitmap) {
        var motionIndex = this._motion ? this._motion.index : 0;
        var cw = bitmap.width / 4;
        var cx = 0;
		
		switch(motionIndex) {
			case 15:    //abnormal
				cx = cw;
				break;
			case 16:   //sleep
				cx = 2*cw;
				break;
			case 17:  //dead
				cx = 3*cw;
				break;
		} 
		
    }
   	this._mainSprite.bitmap.smooth = true;
    this._mainSprite.setFrame(cx, 0, cw, bitmap.height);

// breathing effect copied from AnimatedSVEnemies.js, edited for custom use
//breathing control
if(this._actor.canMove()){
	var breathS = 50/1000;
	var bx = (Graphics.frameCount+this._random[0]);
	var by = (Graphics.frameCount+this._random[1]);
	breathS *= (this._actor.hp/this._actor.mhp)+.1;
	var breathY = Math.cos(bx*breathS)*(6/1000);
	var breathX = Math.cos(by*breathS)*(3/1000);
	breathY *= (this._actor.hp/this._actor.mhp);
	var s = 0.78+0.3*this.y/Graphics.boxHeight;
	this._mainSprite.scale.y = s+breathY;
	this._mainSprite.scale.x = s+breathX;
}
};



//=====adjust status balloon position

Sprite_StateOverlay.prototype.initMembers = function() {
    this._battler = null;
    this._overlayIndex = 0;
    this._animationCount = 0;
    this._pattern = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1.2;
};


//========================================================
//#######################rpg_window.js edits

// edit battle menu location
Window_PartyCommand.prototype.initialize = function() {
    var x = Graphics.boxWidth/2 - this.windowWidth()/2;
	var y = Graphics.boxHeight/2 - this.windowHeight()/2;
    Window_Command.prototype.initialize.call(this, x, y);
    this.openness = 0;
    this.deactivate();
};

Window_ActorCommand.prototype.initialize = function() {
    var x = Graphics.boxWidth/2 - this.windowWidth()/2;
	var y = - this.windowHeight()*0.4;
    Window_Command.prototype.initialize.call(this, x, y);
    this.openness = 0;
    this.deactivate();
    this._actor = null;
    this.opacity = 0;
};



Scene_Battle.prototype.update = function() {
    var active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    this.updateStatusWindow();
  //  this.updateWindowPositions();
    if (active && !this.isBusy()) {
        this.updateBattleProcess();
    }
    Scene_Base.prototype.update.call(this);
};


Scene_Battle.prototype.createActorCommandWindow = function() {
    this._actorCommandWindow = new Window_ActorCommand();
    this._actorCommandWindow.setHandler('attack', this.commandAttack.bind(this));
    this._actorCommandWindow.setHandler('skill',  this.commandSkill.bind(this));
    this._actorCommandWindow.setHandler('guard',  this.commandGuard.bind(this));
    this._actorCommandWindow.setHandler('item',   this.commandItem.bind(this));
//    this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
    this._actorCommandWindow.setHandler('escape', this.commandEscapeActor.bind(this));
    this.addWindow(this._actorCommandWindow);
	//this._actorCommandWindow.opacity = 150;
};

Scene_Battle.prototype.commandEscapeActor = function() {
  var actorIndex = BattleManager._actorIndex;
  BattleManager.selectNextCommand();
  BattleManager._actorIndex = actorIndex;
  this.commandEscape();
}


Window_ActorCommand.prototype.makeCommandList = function() {
    if (this._actor) {
        this.addAttackCommand();
        this.addSkillCommands();
        this.addGuardCommand();
        this.addItemCommand();
		this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
    }
};

//####################image menu for battle command
Scene_Boot.prototype.loadSystemImages = function() {
    ImageManager.loadSystem('Window');
    ImageManager.loadSystem('IconSet');
    ImageManager.loadSystem('Balloon');
    ImageManager.loadSystem('Shadow1');
    ImageManager.loadSystem('Shadow2');
    ImageManager.loadSystem('Damage');
    ImageManager.loadSystem('States');
    ImageManager.loadSystem('Weapons1');
    ImageManager.loadSystem('Weapons2');
    ImageManager.loadSystem('Weapons3');
    ImageManager.loadSystem('ButtonSet');
    ImageManager.loadSystem('Bbtn0');
    ImageManager.loadSystem('bb0');
    ImageManager.loadSystem('bb1');
    ImageManager.loadSystem('bb2');
    ImageManager.loadSystem('bb3');
    ImageManager.loadSystem('bb4');
    ImageManager.loadSystem('bb5');
    ImageManager.loadSystem('bb6');
	ImageManager.loadFace('menu_face');
	//load menu status figures
	//ImageManager.loadSystem('actbg_baoyu');
	//ImageManager.loadSystem('actbg_jiangyoufan');
	//ImageManager.loadSystem('actbg_lan');
	//ImageManager.loadSystem('actbg_xia');
	//ImageManager.loadSystem('actbg_xiaoman');
	//ImageManager.loadSystem('actbg_xie');
	//ImageManager.loadSystem('actbg_yipin');
	//ImageManager.loadSystem('actbg_youniang');
	
};



Window_ActorCommand.prototype.drawButton = function(faceName, x, y, width, height) {
    var bitmap = ImageManager.loadSystem(faceName);
    this.contents.blt(bitmap, 0, 0, width, height, x, y);
};

//_alias_battlemenu_prototype_windowActorcmd_drawItem = Window_ActorCommand.prototype.drawItem;
Window_ActorCommand.prototype.drawItem = function(index)
{
//    _alias_battlemenu_prototype_windowActorcmd_drawItem.call(this);
    var bitmap = 'Bbtn0';
	ImageManager.loadSystem(bitmap).addLoadListener(function() {
    this.drawButton(bitmap, -18, 390, 280, 280);
	  }.bind(this));	
//    this.drawButton(bitmap, -18, 100, 280, 280);
};

_alias_battlemenu_prototype_scene_battle_update = Window_ActorCommand.prototype.updateCursor;
Window_ActorCommand.prototype.updateCursor = function() {
    _alias_battlemenu_prototype_scene_battle_update.call(this);
	if (this._index == 1)	{
	    var bitmap = 'bb1';
	}	else if (this._index == 2){
		var bitmap = 'bb2';
	} else if (this._index == 3) {
		var bitmap = 'bb3';
	} else if (this._index == 4) {
		var bitmap = 'bb4';
	} else if (this._index == 5) {
		var bitmap = 'bb5';
	} else if (this._index == 6) {
		var bitmap = 'bb6';
	} else {
		var bitmap = 'bb0';
	}
	this.refresh();
	ImageManager.loadSystem(bitmap).addLoadListener(function() {
    this.drawButton(bitmap, -18, 390, 280, 280);
	  }.bind(this));	
};


Window_ActorCommand.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        var lastIndex = this.index();
		switch (lastIndex) {
		case 0:
			if (Input.isRepeated('left')) {
				this.select(3);
			}
			if (Input.isRepeated('right')) {
				this.select(2);
			}
			if (Input.isRepeated('up')) {
				this.select(1);
			}
			if (Input.isRepeated('down')) {
				this.select(5);
			}
			if (this.index() !== lastIndex) {
				SoundManager.playCursor();
			}	
			break;
		case 1:
			if (Input.isRepeated('left')) {
				this.select(3);
			}
			if (Input.isRepeated('right')) {
				this.select(2);
			}
			if (Input.isRepeated('up')) {
				this.select(5);
			}
			if (Input.isRepeated('down')) {
				this.select(0);
			}
			if (this.index() !== lastIndex) {
				SoundManager.playCursor();
			}	
			break;
		case 2:
			if (Input.isRepeated('left')) {
				this.select(0);
			}
			if (Input.isRepeated('right')) {
				this.select(3);
			}
			if (Input.isRepeated('up')) {
				this.select(1);
			}
			if (Input.isRepeated('down')) {
				this.select(4);
			}
			if (this.index() !== lastIndex) {
				SoundManager.playCursor();
			}	
			break;
		case 3:
			if (Input.isRepeated('left')) {
				this.select(2);
			}
			if (Input.isRepeated('right')) {
				this.select(0);
			}
			if (Input.isRepeated('up')) {
				this.select(1);
			}
			if (Input.isRepeated('down')) {
				this.select(6);
			}
			if (this.index() !== lastIndex) {
				SoundManager.playCursor();
			}	
			break;
		case 4:
			if (Input.isRepeated('left')) {
				this.select(0);
			}
			if (Input.isRepeated('right')) {
				this.select(6);
			}
			if (Input.isRepeated('up')) {
				this.select(2);
			}
			if (Input.isRepeated('down')) {
				this.select(5);
			}
			if (this.index() !== lastIndex) {
				SoundManager.playCursor();
			}	
			break;
		case 5:
			if (Input.isRepeated('left')) {
				this.select(6);
			}
			if (Input.isRepeated('right')) {
				this.select(4);
			}
			if (Input.isRepeated('up')) {
				this.select(0);
			}
			if (Input.isRepeated('down')) {
				this.select(1);
			}
			if (this.index() !== lastIndex) {
				SoundManager.playCursor();
			}	
			break;
		case 6:
			if (Input.isRepeated('left')) {
				this.select(4);
			}
			if (Input.isRepeated('right')) {
				this.select(0);
			}
			if (Input.isRepeated('up')) {
				this.select(3);
			}
			if (Input.isRepeated('down')) {
				this.select(5);
			}
			if (this.index() !== lastIndex) {
				SoundManager.playCursor();
			}	
			break;
		}



    }
};


// hide actor command menu during selection
Scene_Battle.prototype.startActorCommandSelection = function() {
    this._statusWindow.select(BattleManager.actor().index());
    this._partyCommandWindow.close();
    this._actorCommandWindow.setup(BattleManager.actor());
    this._actorCommandWindow.show();
};



Scene_Battle.prototype.onEnemyCancel = function() {
    this._enemyWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
    case 'attack':
        this._actorCommandWindow.activate();
		this._actorCommandWindow.show();
			  	  	console.log(11);
        break;
    case 'skill':
        this._skillWindow.show();
        this._skillWindow.activate();
        break;
    case 'item':
        this._itemWindow.show();
        this._itemWindow.activate();
        break;
    }
};


Scene_Battle.prototype.onSkillCancel = function() {
    this._skillWindow.hide();
    this._actorCommandWindow.activate();
	this._actorCommandWindow.show();
};


Scene_Battle.prototype.onItemCancel = function() {
    this._itemWindow.hide();
    this._actorCommandWindow.activate();
	this._actorCommandWindow.show();
};

Scene_Battle.prototype.onSelectAction = function() {
    var action = BattleManager.inputtingAction();
    this._skillWindow.hide();
    this._itemWindow.hide();
	this._actorCommandWindow.hide();
    if (!action.needsSelection()) {
        this.selectNextCommand();
    } else if (action.isForOpponent()) {
        this.selectEnemySelection();
    } else {
        this.selectActorSelection();
    }
};



var _alias_scene_battler_command_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    _alias_scene_battler_command_update.call(this);

    //update mouse selection for command window
  if(this._actorCommandWindow.active){
    if(TouchInput.isTriggered() && TouchInput._x > 480 && TouchInput._x < 542 
        && TouchInput._y > 215 && TouchInput._y < 277) {
        this._actorCommandWindow.select(0);  
        SoundManager.playCursor();
        this._actorCommandWindow.processOk();
    
    }

    if(TouchInput.isTriggered() && TouchInput._x > 492 && TouchInput._x < 544 
        && TouchInput._y > 162 && TouchInput._y < 212) {
        SoundManager.playCursor();
        this._actorCommandWindow.select(1);
        SoundManager.playCursor();
        this._actorCommandWindow.processOk();
    }

    if(TouchInput.isTriggered() && TouchInput._x > 550 && TouchInput._x < 600 
        && TouchInput._y > 188 && TouchInput._y < 238) {
        SoundManager.playCursor();
        this._actorCommandWindow.select(2);
        SoundManager.playCursor();
        this._actorCommandWindow.processOk();
    }

    if(TouchInput.isTriggered() && TouchInput._x > 428 && TouchInput._x < 478 
        && TouchInput._y > 188 && TouchInput._y < 238) {
        SoundManager.playCursor();
        this._actorCommandWindow.select(3);
        SoundManager.playCursor();
        this._actorCommandWindow.processOk();
    }

    if(TouchInput.isTriggered() && TouchInput._x > 550 && TouchInput._x < 600 
        && TouchInput._y > 262 && TouchInput._y < 512) {
        SoundManager.playCursor();
        this._actorCommandWindow.select(4);
        SoundManager.playCursor();
        this._actorCommandWindow.processOk();
    }

    if(TouchInput.isTriggered() && TouchInput._x > 492 && TouchInput._x < 544 
        && TouchInput._y > 288 && TouchInput._y < 338) {
        SoundManager.playCursor();
        this._actorCommandWindow.select(5);
        SoundManager.playCursor();
        this._actorCommandWindow.processOk();
    }

    if(TouchInput.isTriggered() && TouchInput._x > 428 && TouchInput._x < 478 
        && TouchInput._y > 262 && TouchInput._y < 512) {
        SoundManager.playCursor();
        this._actorCommandWindow.select(6);
        SoundManager.playCursor();
        this._actorCommandWindow.processOk();
    }

  }
};



//######################custom edit of menu

Scene_Equip.prototype.onSlotOk = function() {
    this._itemWindow.activate();
    this._itemWindow.select(0);
	this._slotWindow.hide();
};

Scene_Equip.prototype.onItemOk = function() {
    SoundManager.playEquip();
    this.actor().changeEquip(this._slotWindow.index(), this._itemWindow.item());
    this._slotWindow.show();
    this._slotWindow.activate();
    this._slotWindow.refresh();
    this._itemWindow.deselect();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
};

Scene_Equip.prototype.onItemCancel = function() {
    this._slotWindow.show();
	this._slotWindow.activate();
    this._itemWindow.deselect();
};


//sell window 
Scene_Shop.prototype.onCategoryCancel = function() {
    this._commandWindow.activate();
	this._commandWindow.show();
    this._dummyWindow.show();
    this._categoryWindow.hide();
    this._sellWindow.hide();
};

Scene_Shop.prototype.commandSell = function() {
    this._dummyWindow.hide();
    this._categoryWindow.show();
    this._categoryWindow.activate();
    this._sellWindow.show();
    this._sellWindow.deselect();
    this._sellWindow.refresh();
	this._commandWindow.hide();
};



//update for waiting movie play credit: Victor Sant

Graphics.playVideo = function(src) {
    this._video.src = src;
    this._video._isLoading = true;
    this._video.onloadeddata = this._onVideoLoad.bind(this);
    this._video.onerror = this._onVideoError.bind(this);
    this._video.onended = this._onVideoEnd.bind(this);
    this._video.load();
};

Graphics._updateVisibility = function(videoVisible) {
    this._video._isLoading = false;
    this._video.style.opacity = videoVisible ? 1 : 0;
    this._canvas.style.opacity = videoVisible ? 0 : 1;
};

Graphics._isVideoVisible = function() {
    return this._video._isLoading || this._video.style.opacity > 0;
};


//remove regeneration on map
Game_Actor.prototype.turnEndOnMap = function() {
   // if ($gameParty.steps() % this.stepsForTurn() === 0) {
        //this.onTurnEnd();
   //     if (this.result().hpDamage > 0) {
   //         this.performMapDamage();
  //      }
   // }
};

Game_Party.prototype.ratePreemptive = function(troopAgi) {
    var rate = this.agility() >= troopAgi ? 0.1 : 0.06;
    if (this.hasRaisePreemptive()) {
        rate *= 4;
    }
    return rate;
};

Game_Party.prototype.rateSurprise = function(troopAgi) {
    var rate = this.agility() >= troopAgi ? 0.06 : 0.1;
    if (this.hasCancelSurprise()) {
        rate = 0;
    }
    return rate;
};


//remove multiple action bug
Game_Battler.prototype.makeActionTimes = function() {
        return 1;
};
