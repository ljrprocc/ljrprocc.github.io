//###########patch to the Yanfly party menu

//=============================================================================
 /*:
 * @plugindesc custom patch to Yanfly party menu
 */

Window_PartyList.prototype.drawRemove = function(rect) {
    //var ibw = Window_Base._iconWidth + 4;
    rect.width -= this.textPadding();
   // this.drawIcon(Yanfly.Icon.PartyRemove, rect.x + 2, rect.y + 2);
    this.drawText(Yanfly.Param.PartyCommand2, rect.x + 4, rect.y,
      rect.width - 4);
};


Window_PartyList.prototype.drawBasic = function(actor, rect) {
    var wx = Window_Base._iconWidth / 2 + this.textPadding() / 2;
    var wy = rect.y + rect.height + Yanfly.Param.PartySpriteBufferY
   // this.drawActorCharacter(actor, wx, wy);
    this.changeTextColor(this.listColor(actor));
    this.changePaintOpacity(this.actorIsEnabled(actor));
    //var ibw = Window_Base._iconWidth + 4;
    this.drawText(actor.name(), rect.x + 4, rect.y, rect.width - 4);
    this.changePaintOpacity(true);
    this.drawRestrictions(actor, rect);
    this.resetFontSettings();
};

Window_PartyList.prototype.makeItemList = function() {
    this._data = [0];
    this.createActorOrder();
   // this._data.push(0);
};


Window_PartySelect.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    rect.width = 180;
    rect.height = 152;
    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY + 8;
    return rect;
};

Window_PartySelect.prototype.drawItem = function(index) {
    var actor = $gameActors.actor(this._data[index]);
    var rect = this.itemRect(index);
	var padding = 4;
    rect.x += padding ;
    rect.y += padding ;
    rect.width -= this.padding;
    rect.height -= this.padding/2;
    if (actor) {// && this._data[index] < 9) { //remove npc chars
      this.drawActor(rect, actor);
    } else {
	      this.drawEmpty(rect);
    }
};


Window_PartySelect.prototype.drawEmpty = function(rect) {
 //   var color = this.gaugeBackColor();
 //   this.changePaintOpacity(false);
 //   this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
 //   this.changePaintOpacity(true);
 //   this.resetFontSettings();
    var text = Yanfly.Param.PartyEmptyText
    this.contents.drawText(text, rect.x, rect.y, rect.width,
        rect.height, 'center');
};


    var _Scene_Party_create = Scene_Party.prototype.create;
    Scene_Party.prototype.create = function() {
        _Scene_Party_create.call(this);
		var masterOpacity = 0;
      //  this._helpWindow.opacity = masterOpacity;
        this._partyWindow.opacity = masterOpacity;
        this._commandWindow.opacity = masterOpacity;
        this._listWindow.opacity = masterOpacity;
        this._detailWindow.opacity = masterOpacity;
		// party window on top
		this._partyWindow.width = Graphics.boxWidth*0.76;
		this._partyWindow.height = Graphics.boxHeight*0.28+10;
		this._partyWindow.x = 0;
		this._partyWindow.y = -10;
		// category selection window
		this._commandWindow.width = Graphics.boxWidth*0.24;
		this._commandWindow.height = Graphics.boxHeight*0.35;
		this._commandWindow.x = Graphics.boxWidth*0.76;
		this._commandWindow.y = 0;
		// status window shows all the effects of item with the icon
        this._listWindow.x = Graphics.boxWidth*0.73;
        this._listWindow.y = Graphics.boxHeight*0.46;
        this._listWindow.width = Graphics.boxWidth*0.22;
        this._listWindow.height = Graphics.boxHeight*0.54;
		// action window shows action to item, overlay with info
        this._detailWindow.x = Graphics.boxWidth*0;
        this._detailWindow.y = Graphics.boxHeight*0.28 - 6;
        this._detailWindow.width = Graphics.boxWidth*0.65;
        this._detailWindow.height = Graphics.boxHeight*0.72 + 106;

    };


	    var _Scene_Party_createBackground = Scene_Party.prototype.createBackground;
    Scene_Party.prototype.createBackground = function(){
        
            this._backgroundSprite = new Sprite();
//            this._backgroundSprite.bitmap = ImageManager.loadPicture("menu_party");
			            this._backgroundSprite.bitmap = ImageManager.loadSystem("menu_party");
            this.addChild(this._backgroundSprite);
            return;
        
        // if background file is invalid, it does original process.
        _Scene_Party_createBackground.call(this);
    };



Window_PartyDetail.prototype.refresh = function() {
    if (!this._actor || this._actor._actorId>8) return this.clear(); //removing npc
    this.contents.clear();
    this.drawActorBasicInfo();
    this.calculateAvailableLines();
  //  this.drawDarkRectangles();
    this.drawActorParams();
    this.drawActorEquips();
};



Window_PartyDetail.prototype.clear = function() {
    this.contents.clear();
//    this.drawDarkRect(0, 0, this.contents.width, this.contents.height);
//    this.changeTextColor(this.systemColor());
//    var text = Yanfly.Param.PartyEmptyText
//    this.contents.drawText(text, 0, 0, this.contents.width,
//        this.contents.height, 'center');
};



Window_PartyDetail.prototype.drawActorBasicInfo = function() {
    var w = this.width - this.padding * 2;
    var h = this.height - this.padding * 2;
    var y = 0;
    var padding = 0;
    var xpad = padding + Window_Base._faceWidth + 100;
    var width = w - 280 - this.textPadding();
    h = Window_Base._faceHeight;
    this.drawActorFace(this._actor, 36, 0, Window_Base._faceWidth, h);
    this.drawActorSimpleStatus(this._actor, xpad, y+14, width);
};

Window_PartyDetail.prototype.drawActorParams = function() {
  //  this.drawActorParamsTitle();
    for (var i = 0; i < 6; ++i) {
      var rect = this.paramRect(i);
      if (this._linesAvailable > 4) {
        rect.x += 8;
        rect.width -= 16;
      } else {
        rect.x += 4;
        rect.width -= 8;
      }
	  var w = rect.width *0.7;
      var paramId = i + 2;
      var text = TextManager.param(paramId);
      this.changeTextColor(this.systemColor());
      this.drawText(text, rect.x +16, rect.y + 20, w);
      var paramValue = Yanfly.Util.toGroup(this._actor.param(paramId));
      this.changeTextColor(this.normalColor());
      this.drawText(paramValue, rect.x, rect.y + 20, w, 'right');
    }
};

Window_PartyDetail.prototype.drawActorEquips = function() {
 //   this.drawActorEquipsTitle();
    var equips = this.getActorEquips();
    this.drawActorEquipsList(equips);
};


Window_PartyDetail.prototype.drawActorEquipsList = function(equips) {
    this._lastSlot = false;
    var max = this._linesAvailable;
    var ww = this.contents.width /2;
    var wh = this.lineHeight();
    var wy = this.lineHeight() * 5 ;
    var wx = ww + 6;
    ww -= 12;
    if (this._linesAvailable >= 7) {
      max -= 1;
      wy += this.lineHeight();
    }
    if (this._linesAvailable === 4) {
      max -= 1;
      wy += this.lineHeight();
    }
    for (var i = 0; i < equips.length; ++i) {
      var equip = equips[i];
      if (!equip) break;
      if (i >= max - 1 && i < equips.length - 1) this._lastSlot = true;
      if (this._lastSlot) {
        var iconIndex = equip.iconIndex;
        this.drawIcon(iconIndex, wx + 2, wy + 2);
        wx += Window_Base._iconWidth;
        continue;
      } else if (this._lastSlot && i === equips.length - 1) {
        var iconIndex = equip.iconIndex;
        this.drawIcon(iconIndex, wx + 2, wy + 2);
        wx += Window_Base._iconWidth;
      } else {
        this.drawItemName(equip, wx, wy, ww);
      }
      wy += this.lineHeight();
    }
};

    Window_PartyMenuCommand.prototype.lineHeight = function() {
        return 56;
    };


Scene_Party.prototype.createDetailWindow = function() {
    if (!eval(Yanfly.Param.PartyDetailWin)) return;
    var wx = this._listWindow.width;
    var wy = Graphics.boxHeight*0.44;
    var ww = Graphics.boxWidth - wx;
    var wh = 480;
    this._detailWindow = new Window_PartyDetail(wx, wy, ww, wh);
    this.addWindow(this._detailWindow);
    this._partyWindow.setDetailWindow(this._detailWindow);
    this._listWindow.setDetailWindow(this._detailWindow);
    this._detailWindow.clear();
};

Window_PartyMenuCommand.prototype.makeCommandList = function() {
    this.addChangeCommand();
//    this.addRemoveCommand();
    this.addRevertCommand();
    this.addCustomCommand();
    this.addCancelCommand();
};

Scene_Party.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_PartyMenuCommand(0, 0);
    if (this._helpWindow) this._commandWindow.y = this._helpWindow.height;
    this._commandWindow.setHandler('change', this.commandAdjust.bind(this));
//    this._commandWindow.setHandler('remove', this.commandAdjust.bind(this));
    this._commandWindow.setHandler('revert', this.commandRevert.bind(this));
    this._commandWindow.setHandler('cancel', this.commandFinish.bind(this));
    this.addWindow(this._commandWindow);
};

/*
//set char >id 8 as following npc only
Window_PartyList.prototype.createActorOrder = function() {
    for (var i = 0; i < $gameParty._actors.length; ++i) {
      var actorId = $gameParty._actors[i];
      if ($gameActors.actor(actorId) && actorId<9) this._data.push(actorId);
    }
};

Game_Party.prototype.initializeBattleMembers = function() {
    this._battleMembers = [];
	var j = 0;
    for (var i = 0; i < 8; ++i) {
      if (this._actors[i]) {
		  if (this._actors[i]<9 && j < this.maxBattleMembers()) {
			  this._battleMembers.push(this._actors[i]);
			  j += 1;
		  } else {
	          this._battleMembers.push(0);
		  }
      } else {
        this._battleMembers.push(0);
      }
    }
    if ($gamePlayer) $gamePlayer.refresh();
};


Game_Party.prototype.battleMembers = function() {
    if (this.toInitializeBattleMembers()) this.initializeBattleMembers();
    var battleParty = [];
    for (var i = 0; i < this._battleMembers.length; ++i) {
      var actorId = this._battleMembers[i];
      if (battleParty.length > this.maxBattleMembers()) break;
      if (actorId === null) continue;
      if (!$gameActors.actor(actorId)) continue;
      if (!$gameActors.actor(actorId).isAppeared()) continue;
      if (actorId<9)
      {
      battleParty.push($gameActors.actor(actorId));
	  }
    }
    return battleParty;
};



//patch to menu, assuming the npcs are after the major characters, this should work...
Window_MenuStatus.prototype.maxItems = function() {
	var num_npc = 0;
    $gameParty.members().forEach(function(actor) {
        if (actor._actorId>8) { num_npc++;};
    }, this);
    return $gameParty.size()-num_npc;
};

*/

Game_Party.prototype.battleMembers = function() {
    if (this.toInitializeBattleMembers()) this.initializeBattleMembers();
    var battleParty = [];
    for (var i = 0; i < this._battleMembers.length; ++i) {
      var actorId = this._battleMembers[i];
      if (battleParty.length > this.maxBattleMembers()) break;
      if (actorId === null) continue;
      if (!$gameActors.actor(actorId)) continue;
      if (!$gameActors.actor(actorId).isAppeared()) continue;
      if (actorId<9)
      {
      battleParty.push($gameActors.actor(actorId));
	  }
    }
    return battleParty;
};
