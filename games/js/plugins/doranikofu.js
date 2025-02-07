//=============================================================================
// doranikofu's edit to other plugins
//=============================================================================

/*:
 * @plugindesc custom edits to other plugins
 * @param Equip text
 * @desc text left to the actor name having the equipment.
 * @default equiped on

 * @param Save time text
 * @desc text left to game time in save window.
 * @default Time
 *
 * @param Auto save text
 * @desc text for the name of the auto save file.
 * @default AutoSave
 
 * @param Delete Text
 * @desc Text displayed when deleting a save file.
 * @default Do you wish to delete this save file?
 *
 * @param Confirm Yes
 * @desc Text used for the 'Yes' confirm command
 * @default Yes
 *
 * @param Confirm No
 * @desc Text used for the 'No' confirm command
 * @default No
 * @param Confirm Del
 * @desc Text used for the 'Del' confirm command
 * @default Del
*/



//=============================================================================
// Parameter Variables
//=============================================================================
Yanfly.Parameters = PluginManager.parameters('doranikofu');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.EquipActorText = String(Yanfly.Parameters['Equip text']);
Yanfly.Param.SaveText1 = String(Yanfly.Parameters['Save time text']);
Yanfly.Param.SaveText2 = String(Yanfly.Parameters['Auto save text']);


//=============================================================================
//#######################AltMenuScreen3.js edits rearrange sub menus


//#######################
//=============================================================================

//=============================================================================
// edit dim dialog background, remove gradient at bottom
//=============================================================================
Window_Base.prototype.refreshDimmerBitmap = function() {
    if (this._dimmerSprite) {
        var bitmap = this._dimmerSprite.bitmap;
        var w = this.width;
        var h = this.height;
        var m = this.padding;
        var c1 = this.dimColor1();
        var c2 = this.dimColor2();
        bitmap.resize(w, h);
        bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
        bitmap.fillRect(0, m, w, h - m, c1);
       // bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
        this._dimmerSprite.setFrame(0, 0, w, h);
    }
};

//=============================================================================
//#######################rpg_windows.js edits
//#doranikofu edit start
Window_Base.prototype.drawActorIconsM = function(actor, x, y, width) {
    width = width || 144;
	row = Math.floor(width / Window_Base._iconWidth);
    var icons = actor.allIcons().slice(0, 2 * row);
    for (var i = 0; i < icons.length; i++) {
        this.drawIcon(icons[i], x + Window_Base._iconWidth * (i%row), y + 2 + Window_Base._iconWidth * Math.floor(i/row));
    }
};
//edit end

//#######################
//=============================================================================

//###remove extra window in equip menu
Scene_Equip.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    //this.updateLowerRightWindowTriggers()
};
//

//shift icon for equip menu
Window_EquipSlot.prototype.drawEmptySlot = function(wx, wy, ww) {
    this.changePaintOpacity(false);
    var ibw = Window_Base._iconWidth + 4;
    this.resetTextColor();
    this.drawIcon(Yanfly.Icon.EmptyEquip, wx + 2, wy + 8);
    var text = Yanfly.Param.EquipEmptyText;
    this.drawText(text, wx + ibw, wy, ww - ibw);
};

Window_EquipItem.prototype.drawRemoveEquip = function(index) {
    if (!this.isEnabled(null)) return;
    var rect = this.itemRect(index);
    rect.width -= this.textPadding();
    this.changePaintOpacity(true);
    var ibw = Window_Base._iconWidth + 4;
    this.resetTextColor();
    this.drawIcon(Yanfly.Icon.RemoveEquip, rect.x + 2, rect.y + 8);
    var text = Yanfly.Param.EquipRemoveText;
    this.drawText(text, rect.x + ibw, rect.y, rect.width - ibw);
};

//=============================================================================
//#######################YEP_CoreEngine.js edits
//#doranikofu edit
Window_Base.prototype.drawActorLevelBG = function(actor, x, y) {
    this.changeTextColor(this.systemColor());
		var dw1 = this.textWidth(TextManager.levelA);
//#doranikofu		this.drawText(TextManager.levelA, x, y, dw1);
    this.resetTextColor();
		var level = Yanfly.Util.toGroup(actor.level);
		var dw2 = this.textWidth(actor.maxLevel());
    this.drawText(level, x + dw1 - 4, y + 5 , dw2, 'right');
};

/*
Window_Base.prototype.drawCurrentAndMax = function(current, max, x, y,
                                                   width, color1, color2) {
		//var labelWidth = this.textWidth('HP');
   // var valueWidth = this.textWidth(Yanfly.Util.toGroup(max));
    var valueWidth = this.textWidth(max);
    var x1 = x + width*0.92 - valueWidth;
        this.changeTextColor(color1);
   //     this.drawText(Yanfly.Util.toGroup(current), x1, y, valueWidth, 'right');
        this.drawText(current, x1, y, valueWidth, 'right');
};
*/
Window_Base.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
	this.drawIcon(11, x, y, 32);
//    this.changeTextColor(this.systemColor());
//    this.drawText(TextManager.hpA, x, y, 44);
//    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
//                           this.hpColor(actor), this.normalColor());
	  this.changeTextColor(this.hpColor(actor));
	  this.drawText(actor.hp, x + width*0.92 - 84, y, 84, 'right');
      this.resetTextColor();
};

Window_Base.prototype.drawActorMp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
//    this.changeTextColor(this.systemColor());
//    this.drawText(TextManager.mpA, x, y, 44);
	this.drawIcon(13, x, y, 32);
//    this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
//                           this.mpColor(actor), this.normalColor());
	  this.changeTextColor(this.mpColor(actor));
	  this.drawText(actor.mp, x + width*0.92 - 84, y, 84, 'right');
      this.resetTextColor();
};

Window_Base.prototype.drawActorTp = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
//    this.changeTextColor(this.systemColor());
//    this.drawText(TextManager.tpA, x, y, 44);
	this.drawIcon(12, x, y, 32);
    this.changeTextColor(this.tpColor(actor));
    this.drawText(actor.tp, x + width*0.92 - 84, y, 84,	'right');
     this.resetTextColor();
};

Window_Base.prototype.drawActorEXP2 = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.textColor(28);//this.expGaugeColor1();
    var color2 = this.textColor(29);//this.expGaugeColor2();
    if (actor.isMaxLevel()) {
		var rate = 1;
	    } else {
		var rate = (actor.currentExp() -  actor.currentLevelExp())/(actor.nextLevelExp() - actor.currentLevelExp());
		}
    this.drawGauge(x, y, width, rate, color1, color2);
    this.changeTextColor(this.systemColor());
//    this.drawText(TextManager.exp, x, y, 44);
  // this.drawText(rate, x, y, 44);
	this.drawIcon(14, x, y, 32);
    this.resetTextColor();
    if (actor.isMaxLevel()) {
	} else {
	 this.drawText(actor.nextRequiredExp(), x + width*0.92 - 64, y, 64,
			'right');
	}
};

Window_Base.prototype.drawActorEXP = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.textColor(28);//this.expGaugeColor1();
    var color2 = this.textColor(29);//this.expGaugeColor2();
    if (this._actor.isMaxLevel()) {
		var rate = 1;
	    } else {
		var rate = (this._actor.currentExp() -  this._actor.currentLevelExp())/(this._actor.nextLevelExp() - this._actor.currentLevelExp());
		}
    this.drawGauge(x, y, width, rate, color1, color2);
//    this.changeTextColor(this.systemColor());
//    this.drawText(TextManager.exp, x, y, 44);
  // this.drawText(rate, x, y, 44);
	this.drawIcon(14, x, y+3, 32);
    this.resetTextColor();
    if (actor.isMaxLevel()) {
	} else {
    this.drawText(this._actor.nextRequiredExp(), x + width*0.92 - 64, y, 64,
			'right');
	}
};

Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
		var xpad = Window_Base._faceWidth + (5 * Yanfly.Param.TextPadding)//(2 * Yanfly.Param.TextPadding);
    var x2 = x + xpad;
    var width2 = Math.max(200, width - xpad - this.textPadding());
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x, y + lineHeight * 1);
    this.drawActorIconsM(actor, x, y + lineHeight * 2);
  //  this.drawActorClass(actor, x2, y, width2);
	this.drawActorEXP(actor, x2, y, width2);
    this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
	this.drawActorTp(actor, x2, y + lineHeight * 2, width2);
    this.drawActorMp(actor, x2, y + lineHeight * 3, width2);

};


Window_SkillStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var w = this.width - this.padding * 2;
        var h = this.height - this.padding * 2;
				if (!eval(Yanfly.Param.MenuTpGauge)) {
					var y = h / 2 - this.lineHeight() * 1.5;
				} else {
					var y = 0;
				}
				//#doranikofu edit placement
				var xpad = Yanfly.Param.WindowPadding + 225; //Window_Base._faceWidth;
//        var width = w - xpad - this.textPadding();
//padding changes in update, fix with constant to avoid shifting
		//#doranikofu edit align face from bottom
        this.drawActorFace(this._actor, 36, 0, Window_Base._faceWidth, Window_Base._faceHeight);
		
        this.drawActorSimpleStatus(this._actor, xpad, y, 480);//width);
    }
};

//#######################
//=============================================================================


//=============================================================================
//#######################YEP_EquipCore.js edits
Window_StatCompare.prototype.drawItem = function(x, y, paramId) {
//		this.drawDarkRect(x, y, this.contents.width, this.lineHeight());
		this.drawParamName(y, paramId);
    this.drawCurrentParam(y, paramId);
		this.drawRightArrow(y);
    if (!this._tempActor) return;
		this.drawNewParam(y, paramId);
		this.drawParamDifference(y, paramId);
};


//#doranikofu remove limit of box height
Scene_Equip.prototype.createSlotWindow = function() {
    var wy = this._commandWindow.y + this._commandWindow.height;
    var ww = Graphics.boxWidth / 2;
    var wh = Graphics.boxHeight;// - wy;
    this._slotWindow = new Window_EquipSlot(0, wy, ww, wh);
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._slotWindow.setHandler('ok',       this.onSlotOk.bind(this));
    this._slotWindow.setHandler('cancel',   this.onSlotCancel.bind(this));
    this.addWindow(this._slotWindow);
};
//#doranikofu remove limit of box height
Scene_Equip.prototype.createItemWindow = function() {
    var wy = this._slotWindow.y;
    var ww = Graphics.boxWidth / 2;
    var wh = Graphics.boxHeight;// - wy;
    this._itemWindow = new Window_EquipItem(0, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
    this._itemWindow.hide();
};
Scene_Equip.prototype.createCompareWindow = function() {
    this._lowerRightWindows = [];
    var wx = this._itemWindow.width;
    var wy = this._itemWindow.y;
    var ww = Graphics.boxWidth - wx - 24;
    var wh = Graphics.boxHeight;// - wy;
    this._compareWindow = new Window_StatCompare(wx, wy, ww, wh);
    this._slotWindow.setStatusWindow(this._compareWindow);
    this._itemWindow.setStatusWindow(this._compareWindow);
    this.addWindow(this._compareWindow);
    this._lowerRightWindows.push(this._compareWindow);
    if (Imported.YEP_ItemCore && eval(Yanfly.Param.ItemSceneItem)) {
      this.createItemInfoWindow();
    }
};


/*

Dora.Equip.Scene_Equip_createSlotWindow = Scene_Equip.prototype.createSlotWindow;
Scene_Equip.prototype.createSlotWindow = function() {
    Dora.Equip.Scene_Equip_createSlotWindow.call(this);
    var wh = Graphics.boxHeight;// - wy;
};

Dora.Equip.Scene_Equip_createItemWindow = Scene_Equip.prototype.createItemWindow;
Scene_Equip.prototype.createItemWindow = function() {
    Dora.Equip.Scene_Equip_createItemWindow.call(this);
    var wh = Graphics.boxHeight;// - wy;
};

Dora.Equip.Scene_Equip_creatCompareWindow = Scene_Equip.prototype.createCompareWindow;
Scene_Equip.prototype.createCompareWindow = function() {
    Dora.Equip.Scene_Equip_creatCompareWindow.call(this);
    var wh = Graphics.boxHeight;// - wy;
};
*/

//#doranikofu edit
    Window_EquipCommand.prototype.lineHeight = function() {
        return 45;
    };
    Window_EquipSlot.prototype.lineHeight = function() {
        return 50;
    };
    Window_EquipItem.prototype.lineHeight = function() {
        return 50;
    };
//#######################
//=============================================================================


//=============================================================================
//#######################YEP_ItemCore.js edits
//#doranikofu edit add description text
Window_ItemList.prototype.drawEquippedActor = function(item, dx, dy, dw) {
    var carrier = null;
    for (var a = 0; a < $gameParty.members().length; ++a) {
      var actor = $gameParty.members()[a];
      if (!actor) continue;
      if (actor.equips().contains(item)) carrier = actor;
    };
    if (Yanfly.Param.ItemQuantitySize) {
      this.contents.fontSize = Yanfly.Param.ItemQuantitySize;
    }
    var text = Yanfly.Param.EquipActorText + " " + carrier.name();
    this.drawText(text, dx, dy, dw, 'right');
    this.resetFontSettings();
};

//#doranikofu edit
    Window_ItemCategory.prototype.lineHeight = function() {
        return 45;
    };

//#doranikofu edit remove black bg
Window_ItemStatus.prototype.refresh = function() {
    this.contents.clear();
//    this.drawDarkRectEntries();
    if (!this._item) return;
    this.contents.fontSize = Yanfly.Param.ItemFontSize;
    this.drawItemEntry();
};

//#doranikofu edit adjust new icon for items
Window_ItemStatus.prototype.getRectPosition = function(rect, i) {
    if (i % 2 === 0) {
      if (eval(Yanfly.Param.ItemShowIcon)) {
        rect.x = 225;//Window_Base._faceWidth;
      } else {
        rect.x = 0;
      }
      rect.y = i / 2 * this.lineHeight();
    } else {
      if (eval(Yanfly.Param.ItemShowIcon)) {
        rect.x = 225 + rect.width;//Window_Base._faceWidth + rect.width;
      } else {
        rect.x = rect.width;
      }
    }
    return rect;
};

//# doranikofu edit
// use note in item/equip: tag: item_picture
Window_ItemStatus.prototype.drawLargeIcon = function() {
	if (DataManager.isItem(this._item))	{
		var bitmapName = $dataItems[this._item.id].meta.item_picture;
		}
	if (DataManager.isWeapon(this._item))	{
		var bitmapName = $dataWeapons[this._item.id].meta.item_picture;
		}
	if (DataManager.isArmor(this._item))	{
		var bitmapName = $dataArmors[this._item.id].meta.item_picture;
		}
   // var bitmap = bitmapName ? ImageManager.loadNormalBitmap("img/item/" + bitmapName) : null;
	if (bitmapName == null)
	{
	    var bitmap = ImageManager.loadSystem('IconSet');
		var iconIndex = this._item.iconIndex;
	    var pw = Window_Base._iconWidth;
		var ph = Window_Base._iconHeight;
		var sx = iconIndex % 16 * pw;
		var sy = Math.floor(iconIndex / 16) * ph;
	} else {
//		var bitmap = ImageManager.loadPicture(bitmapName);
		var	bitmap = ImageManager.loadNormalBitmap("img/item/" + bitmapName + ".png");
		//console.log(bitmap.width);
	    var pw = 144;//Yanfly.Param.ItemIconSize;
		var ph = 144;//Yanfly.Param.ItemIconSize;
		var sx = 0;
		var sy = 0;
	}
	bitmap.addLoadListener(function() {
	this.contents.blt(bitmap, sx, sy, pw, ph, 40, 0, 144, 144);	
	  }.bind(this));

};


//#doranikofu edit
Window_ItemStatus.prototype.drawEquipInfo = function(item) {
    var rect = new Rectangle();
    if (eval(Yanfly.Param.ItemShowIcon)) {
//      rect.width = (this.contents.width - Window_Base._faceWidth) / 2;
      rect.width = (this.contents.width - 225) / 2;
    } else {
      rect.width = this.contents.width / 2;
    }
    for (var i = 0; i < 8; ++i) {
      rect = this.getRectPosition(rect, i);
      var dx = rect.x + this.textPadding();
      var dw = rect.width - this.textPadding() * 2;
      this.changeTextColor(this.systemColor());
      this.drawText(TextManager.param(i), dx, rect.y, dw);
      this.changeTextColor(this.paramchangeTextColor(item.params[i]));
      var text = Yanfly.Util.toGroup(item.params[i]);
      if (item.params[i] >= 0) text = '+' + text;
      if (text === '+0') this.changePaintOpacity(false);
      this.drawText(text, dx, rect.y, dw, 'right');
      this.changePaintOpacity(true);
    }
};
//#doranikofu edit
Window_ItemStatus.prototype.drawItemInfo = function(item) {
    var rect = new Rectangle();
    if (eval(Yanfly.Param.ItemShowIcon)) {
//      rect.width = (this.contents.width - Window_Base._faceWidth) / 2;
      rect.width = (this.contents.width - 225) / 2;
    } else {
      rect.width = this.contents.width / 2;
    }
    for (var i = 0; i < 8; ++i) {
      rect = this.getRectPosition(rect, i);
      var dx = rect.x + this.textPadding();
      var dw = rect.width - this.textPadding() * 2;
      this.changeTextColor(this.systemColor());
      var text = this.getItemInfoCategory(i);
      this.drawText(text, dx, rect.y, dw);
      this.drawItemData(i, dx, rect.y, dw);
    }
};

//##############rewrite item info display for menu
// remove the default info text from the action menu
Window_ItemInfo.prototype.refresh = function() {
    this.contents.clear();
    var dy = 0;
    if (!this._item) return dy;
    this.preInfoEval();
    dy = this.drawPreItemInfo(dy);
    dy = this.drawItemInfo(dy);
 //   dy = this.drawItemInfoA(dy);
 //   dy = this.drawItemInfoB(dy);
 //   dy = this.drawItemInfoC(dy);
 //   dy = this.drawItemInfoD(dy);
 //   dy = this.drawItemInfoE(dy);
 //   return this.drawItemInfoF(dy);
};


Window_ItemStatus.prototype.getItemInfoCategory = function(i) {
	//load description text top and bottom
	var item = this._item;
	var info1 = '';
	if (item.infoTextTop != '') {
		info1 = item.infoTextTop.split(/[\r\n]+/);
	}
	var info2 = '';
	if (item.infoTextBottom != '') {
		info2 = item.infoTextBottom.split(/[\r\n]+/);
	}
	if (info1 == ''){
		if (i === 0) return Yanfly.Param.ItemAddBuff;
		if (i === 1) return Yanfly.Param.ItemRemoveBuff;
	} else {
	    if (i === 0) return info1[0];//load top text line 1;
	    if (i === 1) return info1[2];//load top text line 3;
		if (i === 2) return info1[1];//load top text line 2;
		if (i === 3) return info1[3];//load top text line 4;
	}
    if (i === 4) return Yanfly.Param.ItemAddState;
    if (i === 5) return Yanfly.Param.ItemRemoveState;
    if (i === 6) return info2[0];
    if (i === 7) return info2[1];
    return '';
};

Window_ItemStatus.prototype.drawItemData = function(i, dx, dy, dw) {
    if (!this._item) return;
    var effect;
    var value = '---';
    var pre = '';
    var text = '';
    var icons = [];
    if (i < 4 || i > 5) {
		value = '';
    }
    if (i === 4 || i === 5) {
      icons = this.getItemIcons(i, icons);
    }
    this.changeTextColor(this.normalColor());
    if (value === '---') {
      this.changePaintOpacity(false);
    }
    if (icons.length > 0) {
      this.changePaintOpacity(true);
      dx = dx + dw - icons.length * Window_Base._iconWidth;
      dx += this.textPadding() - 2;
      for (var j = 0; j < icons.length; ++j) {
        var icon = icons[j];
        this.drawIcon(icon, dx, dy + 2);
        dx += Window_Base._iconWidth;
      }
    } else {
      text = pre + value + text;
      this.drawText(text, dx, dy, dw, 'right');
      this.changePaintOpacity(true);
    }
};
//#######################


//##############replace shop menu with the same function
Window_ShopInfo.prototype.refresh = function() {
    this.contents.clear();
//    this.drawDarkRectEntries();
    if (!this._item) return;
    this.contents.fontSize = Yanfly.Param.ItemFontSize;
    this.drawItemEntry();
};

Window_ShopInfo.prototype.getRectPosition = function(rect, i) {
    if (i % 2 === 0) {
      if (eval(Yanfly.Param.ItemShowIcon)) {
        rect.x = 225;//Window_Base._faceWidth;
      } else {
        rect.x = 0;
      }
      rect.y = i / 2 * this.lineHeight();
    } else {
      if (eval(Yanfly.Param.ItemShowIcon)) {
        rect.x = 225 + rect.width;//Window_Base._faceWidth + rect.width;
      } else {
        rect.x = rect.width;
      }
    }
    return rect;
};

Window_ShopInfo.prototype.drawLargeIcon = function() {
	if (DataManager.isItem(this._item))	{
		var bitmapName = $dataItems[this._item.id].meta.item_picture;
		}
	if (DataManager.isWeapon(this._item))	{
		var bitmapName = $dataWeapons[this._item.id].meta.item_picture;
		}
	if (DataManager.isArmor(this._item))	{
		var bitmapName = $dataArmors[this._item.id].meta.item_picture;
		}
   // var bitmap = bitmapName ? ImageManager.loadNormalBitmap("img/item/" + bitmapName) : null;
	if (bitmapName == null)
	{
	    var bitmap = ImageManager.loadSystem('IconSet');
		var iconIndex = this._item.iconIndex;
	    var pw = Window_Base._iconWidth;
		var ph = Window_Base._iconHeight;
		var sx = iconIndex % 16 * pw;
		var sy = Math.floor(iconIndex / 16) * ph;
	} else {
//		var bitmap = ImageManager.loadPicture(bitmapName);
		var	bitmap = ImageManager.loadNormalBitmap("img/item/" + bitmapName + ".png");
		//console.log(bitmap.width);
	    var pw = 144;//Yanfly.Param.ItemIconSize;
		var ph = 144;//Yanfly.Param.ItemIconSize;
		var sx = 0;
		var sy = 0;
	}
	bitmap.addLoadListener(function() {
	this.contents.blt(bitmap, sx, sy, pw, ph, 30, 0, 144, 144);	
	  }.bind(this));

};


//#doranikofu edit
Window_ShopInfo.prototype.drawEquipInfo = function(item) {
    var rect = new Rectangle();
    if (eval(Yanfly.Param.ItemShowIcon)) {
//      rect.width = (this.contents.width - Window_Base._faceWidth) / 2;
      rect.width = (this.contents.width - 225) / 2;
    } else {
      rect.width = this.contents.width / 2;
    }
    for (var i = 0; i < 8; ++i) {
      rect = this.getRectPosition(rect, i);
      var dx = rect.x + this.textPadding();
      var dw = rect.width - this.textPadding() * 2;
      this.changeTextColor(this.systemColor());
      this.drawText(TextManager.param(i), dx, rect.y, dw);
      this.changeTextColor(this.paramchangeTextColor(item.params[i]));
      var text = Yanfly.Util.toGroup(item.params[i]);
      if (item.params[i] >= 0) text = '+' + text;
      if (text === '+0') this.changePaintOpacity(false);
      this.drawText(text, dx, rect.y, dw, 'right');
      this.changePaintOpacity(true);
    }
};
//#doranikofu edit
Window_ShopInfo.prototype.drawItemInfo = function(item) {
    var rect = new Rectangle();
    if (eval(Yanfly.Param.ItemShowIcon)) {
//      rect.width = (this.contents.width - Window_Base._faceWidth) / 2;
      rect.width = (this.contents.width - 225) / 2;
    } else {
      rect.width = this.contents.width / 2;
    }
    for (var i = 0; i < 8; ++i) {
      rect = this.getRectPosition(rect, i);
      var dx = rect.x + this.textPadding();
      var dw = rect.width - this.textPadding() * 2;
      this.changeTextColor(this.systemColor());
      var text = this.getItemInfoCategory(i);
      this.drawText(text, dx, rect.y, dw);
      this.drawItemData(i, dx, rect.y, dw);
    }
};


Window_ShopInfo.prototype.getItemInfoCategory = function(i) {
	//load description text top and bottom
	var item = this._item;
	var info1 = '';
	if (item.infoTextTop != '') {
		info1 = item.infoTextTop.split(/[\r\n]+/);
	}
	var info2 = '';
	if (item.infoTextBottom != '') {
		info2 = item.infoTextBottom.split(/[\r\n]+/);
	}
	if (info1 == ''){
		if (i === 0) return Yanfly.Param.ItemAddBuff;
		if (i === 1) return Yanfly.Param.ItemRemoveBuff;
	} else {
	    if (i === 0) return info1[0];//load top text line 1;
	    if (i === 1) return info1[2];//load top text line 3;
		if (i === 2) return info1[1];//load top text line 2;
		if (i === 3) return info1[3];//load top text line 4;
	}
    if (i === 4) return Yanfly.Param.ItemAddState;
    if (i === 5) return Yanfly.Param.ItemRemoveState;
    if (i === 6) return info2[0];
    if (i === 7) return info2[1];
    return '';
};

Window_ShopInfo.prototype.drawItemData = function(i, dx, dy, dw) {
    if (!this._item) return;
    var effect;
    var value = '---';
    var pre = '';
    var text = '';
    var icons = [];
    if (i < 4 || i > 5) {
		value = '';
    }
    if (i === 4 || i === 5) {
      icons = this.getItemIcons(i, icons);
    }
    this.changeTextColor(this.normalColor());
    if (value === '---') {
      this.changePaintOpacity(false);
    }
    if (icons.length > 0) {
      this.changePaintOpacity(true);
      dx = dx + dw - icons.length * Window_Base._iconWidth;
      dx += this.textPadding() - 2;
      for (var j = 0; j < icons.length; ++j) {
        var icon = icons[j];
        this.drawIcon(icon, dx, dy + 2);
        dx += Window_Base._iconWidth;
      }
    } else {
      text = pre + value + text;
      this.drawText(text, dx, dy, dw, 'right');
      this.changePaintOpacity(true);
    }
};

//shop menu edit for actor display mode
Window_ShopStatus.prototype.drawActorData = function() {
    var actor = this.getActor();
    this.drawActorDisplayed(actor);
   // this.drawDarkRectEntries();
    this.drawActorStatInfo(actor);
};


//=============================================================================


//=============================================================================
//#######################YEP_ItemUpgradeSlots.js edits
//#doranikofu edit change display of text
/*
Window_ItemInfo.prototype.drawSlotsInfo = function(dy) {
    var item = this._item;
    var baseItem = DataManager.getBaseItem(item);
    if (!item.slotsApplied) ItemManager.initSlotUpgradeNotes(item);
    if (!DataManager.isIndependent(item)) return dy;
    if (baseItem.upgradeSlots <= 0) return dy;
    if (Yanfly.Param.IUSSlotsText === '') return dy;
    var dx = this.textPadding();
//    var dw = this.contents.width - this.textPadding() * 2;
	var dw = 250 - this.textPadding() * 2;
    this.resetFontSettings();
    this.changeTextColor(this.systemColor());
    var text = Yanfly.Param.IUSSlotsText;
    this.drawText(text, dx, dy, dw);
    if (item.originalUpgradeSlots) {
      text = '/' + Yanfly.Util.toGroup(item.originalUpgradeSlots);
    } else {
      text = '/' + Yanfly.Util.toGroup(baseItem.upgradeSlots);
    }
    this.changeTextColor(this.normalColor());
    this.drawText(text, dx, dy, dw, 'right');
    dw -= this.textWidth(text);
    text = Yanfly.Util.toGroup(item.upgradeSlots);
    if (item.upgradeSlots <= 0) this.changeTextColor(this.powerDownColor());
    this.drawText(text, dx, dy, dw, 'right');
    return dy + this.lineHeight();
};
*/
//change display and hiding of windows for use/augment, copied from Yanfly and core

Scene_Item.prototype.onActionCancel = function() {
    this._itemActionWindow.hide();
    this._itemActionWindow.deactivate();
    this._itemWindow.activate();
	this._infoWindow.show();//
};

Scene_Item.prototype.onItemOk = function() {
    var item = this.item();
    this._itemActionWindow.setItem(item);
	this._infoWindow.hide();//
};

Scene_Item.prototype.onItemCancel = function() {
    this._itemWindow.deselect();
    this._categoryWindow.activate();
    this._statusWindow.setItem(null);
    this._infoWindow.setItem(null);//
};



//#######################
//=============================================================================

//=============================================================================
//########################battle menu edit
Window_ActorCommand.prototype.windowWidth = function() {
    return 280;
};

Window_ActorCommand.prototype.numVisibleRows = function() {
    return 20;
};


//=======================replace battler status window based on party size

Window_BattleStatus.prototype.initialize = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight*0.3;
    var y = Graphics.boxHeight - Graphics.boxHeight*0.28;
    var x = Graphics.boxWidth*(4-this.maxItems())/8;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.openness = 0;
    this.opacity = 0;
};

    var _Scene_Battle_AcotrWindow_create = Scene_Battle.prototype.createActorWindow;
Scene_Battle.prototype.createActorWindow = function() {
	_Scene_Battle_AcotrWindow_create.call(this);
    this._actorWindow.x = this._statusWindow.x ;
};
// omit for row formation plugin
  Sprite_Actor.prototype.setActorHome = function(index) {
    // set two anchor point
    var x1 = 700;
	var x2 = 950;
	var y1 = 330;
    var y2 = 480;
	var num = $gameParty.battleMembers().length;
    // apply option values
    switch(num) {
    case 1:
      x = (x1+x2)/2;
      y = (y1+y2)/2;
      break;
    case 2:
      x = x1+ (1+2*index)*(x2-x1)/4;
      y = y1+ (1+2*index)*(y2-y1)/4;
      break;
    case 3:
      x = x1+ index*(x2-x1)/2;
      y = y1+ index*(y2-y1)/2;
      break;
    case 4:
      x = x1+ index*(x2-x1)/3;
      y = y1+ index*(y2-y1)/3;
    }
    // set position
    this.setHome(x, y);
  };

//==========================================



//===============thicker boarder

Window_Base.prototype.drawGauge = function(dx, dy, dw, rate, color1, color2) {
  var color3 = this.gaugeBackColor();
  var fillW = Math.floor(dw * rate).clamp(0, dw);
  var gaugeH = this.gaugeHeight();
  var gaugeY = dy + this.lineHeight() - gaugeH - 2;
  if (eval(Yanfly.Param.GaugeOutline)) {
    color3.paintOpacity = this.translucentOpacity();
    this.contents.fillRect(dx, gaugeY, dw, gaugeH, color3);
    fillW = Math.max(fillW - 4, 0);
    gaugeH -= 4;
	gaugeY += 2;
    dx += 2;
	this.contents.fillRect(dx-1, gaugeY-1, dw - 2, gaugeH+2, '#bacebe');
	this.contents.fillRect(dx, gaugeY, dw - 4, gaugeH, '#19221a');
  } else {
    var fillW = Math.floor(dw * rate);
    var gaugeY = dy + this.lineHeight() - gaugeH - 2;
    this.contents.fillRect(dx, gaugeY, dw, gaugeH, color3);
  }
    this.contents.gradientFillRect(dx, gaugeY, fillW, gaugeH, color1, color2);
};



//#############################################
//============edits to save screen layout

DataManager.maxSavefiles = function() {
    return 100;
};

Window_SavefileList.prototype.maxVisibleItems = function() {
    return 4;
};

Window_SavefileList.prototype.drawFileId = function(id, x, y) {
	this.changeTextColor(this.systemColor());
	if (id == 1)	{
	this.drawText(Yanfly.Param.SaveText2, x + 530, y + 12, 180, 'right');
	} else {
		var text = id - 1;
    this.drawText(TextManager.file + ' ' + text, x + 530, y + 12, 180, 'right');
	}
	this.resetTextColor();
};

Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
    var bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        if (valid) {
            this.drawPartyCharacters(info, rect.x, rect.y + 12);
			this.drawPlaytime(info, rect.x + 192, rect.y + 12, rect.width - 192);

        }
    }
    var lineHeight = this.lineHeight();
    var y2 = bottom - lineHeight;
    if (y2 >= lineHeight) {
        this.drawGameTitle(info, rect.x, y2, rect.width);
					this.drawText(info.place, rect.x, y2-48, rect.width, 'right');
    }
};

Window_SavefileList.prototype.drawGameTitle = function(info, x, y, width) {
    if (info.title) {
        this.drawText(info.title, x, y-12, width, 'right');
    }
};

Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
        if (info && info.faces) {
            for (var i = 0; i < info.faces.length; i++) {
                var data = info.faces[i];
                this.drawFace(data[0], data[1], x + i * 150, y-6, 144, 120);
				this.contents.fontSize = 20;
                this.drawText(TextManager.levelA, x  + i * 150, y - 4, 48);
                this.drawText(data[2], x + 48 + i * 150, y - 4, 48);
				this.resetFontSettings();
            }
        }
};

Window_SavefileList.prototype.drawPlaytime = function(info, x, y, width) {
    if (info.playtime) {
        this.drawText(Yanfly.Param.SaveText1, x - 130, y, width, 'right');
        this.drawText(info.playtime, x, y, width, 'right');
    }
};


// add new content for confirmation window


Yanfly.Param.SaveConfirmDelTx = String(Yanfly.Parameters['Delete Text']);
Yanfly.Param.SaveConfirmNo = String(Yanfly.Parameters['Confirm No']);
Yanfly.Param.SaveConfirmYes = String(Yanfly.Parameters['Confirm Yes']);
Yanfly.Param.SaveConfirmDel = String(Yanfly.Parameters['Confirm Del']);
//=============================================================================
// Window_SaveConfirm
//=============================================================================

function Window_SaveConfirm() {
    this.initialize.apply(this, arguments);
}

Window_SaveConfirm.prototype = Object.create(Window_Command.prototype);
Window_SaveConfirm.prototype.constructor = Window_SaveConfirm;

Window_SaveConfirm.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.openness = 0;
};

    Window_SaveConfirm.prototype.lineHeight = function() {
        return 72;
    };
	
Window_SaveConfirm.prototype.makeCommandList = function() {
    this.addCommand(Yanfly.Param.SaveConfirmYes, 'confirm');
    this.addCommand(Yanfly.Param.SaveConfirmNo, 'cancel');
	this.addCommand(Yanfly.Param.SaveConfirmDel, 'delete');
};

Window_SaveConfirm.prototype.setData = function(text) {
    this._text = text;
    var ww = this.textWidthEx(this._text) + this.standardPadding() * 2;
    ww += this.textPadding() * 2;
    this.width = ww;
    this.refresh();
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
    this.drawTextEx(this._text, this.textPadding(), 0);
};

Window_SaveConfirm.prototype.itemTextAlign = function() {
    return 'center';
};

Window_SaveConfirm.prototype.windowHeight = function() {
    return this.fittingHeight(4);
};

Window_SaveConfirm.prototype.itemRect = function(index) {
    var rect = Window_Selectable.prototype.itemRect.call(this, index);
    rect.y += this.lineHeight();
    return rect;
};

Scene_Save.prototype.create = function() {
    Scene_File.prototype.create.call(this);
    this.createConfirmWindow();
};

Scene_Save.prototype.createConfirmWindow = function() {
    this._confirmWindow = new Window_SaveConfirm();
    var win = this._confirmWindow;
    win.setHandler('confirm', this.onConfirmOk.bind(this));
    win.setHandler('cancel',  this.onConfirmCancel.bind(this));
	win.setHandler('delete',  this.onConfirmDel.bind(this));
    this.addWindow(this._confirmWindow);
};

Scene_Save.prototype.startConfirmWindow = function(text) {
    SoundManager.playOk();
    this._confirmWindow.setData(text);
    this._confirmWindow.open();
    this._confirmWindow.activate();
    this._confirmWindow.select(0);
};

Scene_Save.prototype.performActionSave = function() {
    $gameSystem.onBeforeSave();
    if (DataManager.saveGame(this.savefileId())) {
      this.onSaveSuccess();
    } else {
      this.onSaveFailure();
    }
};

Scene_Save.prototype.performActionDelete = function() {
    //AudioManager.playSe("earth",150,150,0);
    StorageManager.remove(this.savefileId());

    this._listWindow.refresh();
	this._listWindow.activate();
};

Scene_Save.prototype.onConfirmOk = function() {
    this._confirmWindow.deactivate();
    this._confirmWindow.close();
      setTimeout(this.performActionSave.bind(this), 200);
};

Scene_Save.prototype.onConfirmCancel = function() {
    this._confirmWindow.deactivate();
    this._confirmWindow.close();
	this._listWindow.activate();
};

Scene_Save.prototype.onConfirmDel = function() {
    this._confirmWindow.deactivate();
    this._confirmWindow.close();
      setTimeout(this.performActionDelete.bind(this), 200);
};

Scene_Save.prototype.onSavefileOk = function() {
    Scene_File.prototype.onSavefileOk.call(this);
  if (StorageManager.exists(this.savefileId())) {
	this.startConfirmWindow(Yanfly.Param.SaveConfirmDelTx);
	this._confirmWindow.activate();
  } else {
    this.performActionSave();
  }

};

// end of new content for confirmation window

DataManager.makeSavefileInfo = function() {
    var info = {};
    info.globalId   = this._globalId;
    info.title      = $gameSystem.saveTitle();
    info.characters = $gameParty.charactersForSavefile();
    info.faces      = $gameParty.facesForSavefile();
    info.playtime   = $gameSystem.playtimeText();
    info.timestamp  = Date.now();
    info.place	  = $gameMap.displayName();
    return info;
};


/*
//optimize loading, reduce file checking
DataManager.loadGlobalInfo = function() {
    var json;
    try {
        json = StorageManager.load(0);
    } catch (e) {
        console.error(e);
        return [];
    }
    if (json) {
        var globalInfo = JSON.parse(json);
   //     for (var i = 1; i <= this.maxSavefiles(); i++) {
   //         if (!StorageManager.exists(i)) {
   //             delete globalInfo[i];
   //         }
   //     }
        return globalInfo;
    } else {
        return [];
    }
};

//new function to remove bad saves only load at creation
DataManager.checkGlobalInfo = function() {
    var json;
    try {
        json = StorageManager.load(0);
    } catch (e) {
        console.error(e);
        return [];
    }
    if (json) {
        var globalInfo = JSON.parse(json);
        for (var i = 1; i <= this.maxSavefiles(); i++) {
            if (!StorageManager.exists(i)) {
                delete globalInfo[i];
            }
        }
        return globalInfo;
    } else {
        return [];
    }
};
//only check global save at start
Scene_File.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
	DataManager.checkGlobalInfo();
    this._listWindow.refresh();
};
*/
//skip autosave for checking last save file
DataManager._lastAccessedId = 2;

DataManager.saveGameWithoutRescue = function(savefileId) {
    var json = JsonEx.stringify(this.makeSaveContents());
    if (json.length >= 200000) {
        console.warn('Save data too big!');
    }
    StorageManager.save(savefileId, json);
	if (savefileId > 1) {  
		this._lastAccessedId = savefileId;
	}
    var globalInfo = this.loadGlobalInfo() || [];
    globalInfo[savefileId] = this.makeSavefileInfo();
    this.saveGlobalInfo(globalInfo);
    return true;
};

DataManager.loadGameWithoutRescue = function(savefileId) {
    var globalInfo = this.loadGlobalInfo();
    if (this.isThisGameFile(savefileId)) {
        var json = StorageManager.load(savefileId);
        this.createGameObjects();
        this.extractSaveContents(JsonEx.parse(json));
		if (savefileId > 1) {  //skip the autosave
		this._lastAccessedId = savefileId;
		}
        return true;
    } else {
        return false;
    }
};

DataManager.selectSavefileForNewGame = function() {
    var globalInfo = this.loadGlobalInfo();
    this._lastAccessedId = 2;
    if (globalInfo) {
        var numSavefiles = Math.max(0, globalInfo.length - 1);
        if (numSavefiles < this.maxSavefiles()) {
            this._lastAccessedId = numSavefiles + 1;
        } else {
            var timestamp = Number.MAX_VALUE;
            for (var i = 2; i < globalInfo.length; i++) {
                if (!globalInfo[i]) {
                    this._lastAccessedId = i;
                    break;
                }
                if (globalInfo[i].timestamp < timestamp) {
                    timestamp = globalInfo[i].timestamp;
                    this._lastAccessedId = i;
                }
            }
        }
    }
};

DataManager.latestSavefileId = function() {
    var globalInfo = this.loadGlobalInfo();
    var savefileId = 2;
    var timestamp = 0;
    if (globalInfo) {
        for (var i = 2; i < globalInfo.length; i++) {
            if (this.isThisGameFile(i) && globalInfo[i].timestamp > timestamp) {
                timestamp = globalInfo[i].timestamp;
                savefileId = i;
            }
        }
    }
    return savefileId;
};
///------
Game_Party.prototype.facesForSavefile = function() {
    return this.battleMembers().map(function(actor) {
        return [actor.faceName(), actor.faceIndex(), actor.level];
    });
};


//custom hiding of formation window
//use switch 4 to open

Window_MenuCommand.prototype.addFormationCommand = function() {
	if ($gameSwitches.value(4)){
	if (this.needsCommand('formation')) {
        var enabled = this.isFormationEnabled();
        this.addCommand(TextManager.formation, 'formation', enabled);
    }}
//	this.addRowCommand();
};


//fix party gauge height

Window_Base.prototype.drawPartyLimitIcon = function(unit, x, y, w, h) {
    var icon = unit.partyLimitGaugeIcon();
    if (icon <= 0) return;
    var size = h;
    if (unit.partyLimitGaugeIconAlign() === 'center') {
      x += (w - size) / 2;
    } else if (unit.partyLimitGaugeIconAlign() === 'right') {
      x += w - size;
    }
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = icon % 16 * pw;
    var sy = Math.floor(icon / 16) * ph;
    this.contents._context.imageSmoothingEnabled = true;//false;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, size, size);
    this.contents._context.imageSmoothingEnabled = true;
};

Window_Base.prototype.drawPartyLimitGauge = function(unit, x, y, w) {
    var gauges = unit.partyLimitGaugeIncrements();
    var rates = unit.partyLimitGaugeLastRates();
    var c1 = this.textColor(unit.partyLimitGaugeColor1());
    var c2 = this.textColor(unit.partyLimitGaugeColor2());
    var gw = Math.floor(w / gauges);
    if (gw >= 5) {
      for (var i = 0; i < gauges; ++i) {
        var rate = rates[i] || 0;
        this.drawGauge(x, y, gw, rate, c1, c2);
        x += gw;
      }
    } else {
      var rate = unit.partyLimitGaugeRate();
      this.drawGauge(x, y, w, rate, c1, c2);
    }
};

Window_Base.prototype.drawPartyLimitSet = function(unit, x, y, w, h) {
    //var height = Math.min(Window_Base._iconHeight * 2, h);
    this.drawPartyLimitIcon(this._unit, x-36, y+9, w, 54);
    this.drawPartyLimitValue(this._unit, x-40, y+8, w, 48);
//    this.drawPartyLimitGauge(this._unit, x, h - this.lineHeight(), w);
	this.drawPartyLimitGauge(this._unit, x+8, 10, w - 90);
};

/*
//SE for critical
Sprite_Damage.prototype.setupCriticalEffect = function() {
    this._flashColor = [255, 0, 0, 160];
    this._flashDuration = 60;
	var value = result.hpDamage;
	if (value > 0) {
		AudioManager.playSe("Clip10",100,100,0);
	} else if (value < 0) {
		AudioManager.playSe("swd3e_0490_6024h",100,100,0);
	};
};
*/


//do not remove reviving flag state upon death
/*
Game_BattlerBase.prototype.die = function() {
    this._hp = 0;
	if (this.isStateAffected(112))
	{
	    this.clearStates();
		this.clearBuffs();	
		if (this.isActor()) {
		this.performCollapse();
		this.startAnimation(321, true);
		} else {
		this.performCollapse();
		this.startAnimation(321, false);
		}
		BattleManager.actionWaitForAnimation();
		this.gainHp(this.mhp);
	} else {
	    this.clearStates();
		this.clearBuffs();
	}
};
*/



//change encounter formula
Game_Player.prototype.makeEncounterCount = function() {
    var n = $gameMap.encounterStep();
    this._encounterCount = Math.floor(2.2*n + Math.randomInt(n)*0.4 + 1);
};
//lower encounter rate for mobile deployment 130%


//custom attack skill for double attack
/*
Game_BattlerBase.prototype.attackSkillId = function() {
	if (this.isStateAffected(87)){
		if (this.isStateAffected(28)||this.isStateAffected(52)){
			return 5;
		} else {
			return 3;
		}
 	} else if (this.isStateAffected(28)||this.isStateAffected(52)){
		return 4;
	} else {
	    return 1;
	}
};
*/
Game_BattlerBase.prototype.attackSkillId = function() {
	if (this.isStateAffected(87)){
		return 3;
	} else {
	    return 1;
	}
};


//fix floating issue

Game_Enemy.prototype.isFloating = function() {
    if (this.isDead() && this.collapseType()<3) return false;
    return this.enemy().sideviewFloating;
};




// modify item random variance to reduce negative values
ItemManager.randomizeInitialStats = function(baseItem, newItem) {
    if (baseItem.randomVariance <= 0) return;
    var randomValue = baseItem.randomVariance * 1.1 + 1;
    var offset = baseItem.randomVariance*0.1;
    for (var i = 0; i < 8; ++i) {
      if (newItem.params[i] === 0) continue;
      newItem.params[i] += Math.floor(Math.random() * randomValue - offset);
      if (!Yanfly.Param.ItemNegVar && baseItem.params[i] >= 0) {
        newItem.params[i] = Math.max(newItem.params[i], 0);
      }
    }
};


//buff icon
Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
        return 0;
};


Window_ItemActionCommand.prototype.makeCommandList = function() {
    if (!this._item) return;
    if (DataManager.isItem(this._item)){
    this.addUseCommand();}
    this.addCustomCommandsA();
    this.addCustomCommandsB();
    this.addCustomCommandsC();
    this.addCustomCommandsD();
    this.addCustomCommandsE();
    this.addCustomCommandsF();
    this.addCancelCommand();
};


//fix to life steal plugin and drain(default)
Game_Action.prototype.performLifeSteal = function(damage, target, value) {
	if (this._reflectionTarget == undefined) {
    this.performHpLifeSteal(damage, target, value);
    this.performMpLifeSteal(damage, target, value);
	}
};

Game_Action.prototype.gainDrainedHp = function(value) {
    if (this.isDrain()) {
       var gainTarget = this.subject();
       if (this._reflectionTarget == undefined) {
		gainTarget.gainHp(value);
       }
    }
};

Game_Action.prototype.gainDrainedMp = function(value) {
    if (this.isDrain()) {
       var gainTarget = this.subject();
       if (this._reflectionTarget !== undefined) {
       gainTarget.gainMp(value);
       }
    }
};



//rewrite Yanfly function battle core engine
//custom add state for certain hit skills, count target state rates

Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
    var stateId = effect.dataId;
    var chance = effect.value1;
    //if (!this.isCertainHit()) { //change from certain hit to very high rate setting
	if (chance < 9) { //set rate >=900% to skip
      chance *= target.stateRate(stateId);
      chance *= this.lukEffectRate(target);
    }
    if (Math.random() < chance) {
      if (stateId === target.deathStateId()) {
        if (target.isImmortal()) target.removeImmortal();
      }
      target.addState(stateId);
      this.makeSuccess(target);
    }
};
//increase luck effect
Game_Action.prototype.lukEffectRate = function(target) {
    return Math.max(1.0 + (this.subject().luk - target.luk) * 0.003, 0.001);
};


//remove attack motion to avoid jump between actor sprites when there is abnormal state
Game_Actor.prototype.performAttack = function() {

};

//remove YEP battle show dead enemy when select
Window_EnemyVisualSelect.prototype.isShowWindow = function() {
    var scene = SceneManager._scene;
    if (!scene._enemyWindow) return false;
    var enemyWindow = scene._enemyWindow;
    if (!enemyWindow.active) return false;
    if (!this._battler.isAppeared()) return false;
   // if (this._battler.isDead()) {
   //   return enemyWindow._selectDead;
   // }
    return enemyWindow._enemies.contains(this._battler);
};


//move actor further down
Game_Actor.prototype.performEscapeSuccess = function() {
    if (this.battler()) {
      this.performEscape();
      this.battler().startMove(500, 0, 40);
    }
};

