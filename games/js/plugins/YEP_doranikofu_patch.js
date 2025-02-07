//=============================================================================
 /*:
 * @plugindesc custom patch to yanfly battle plugins, custom layout
 */

Window_CTBIcon.prototype.initialize = function(mainSprite) {
    this._mainSprite = mainSprite;
    var width = this.iconWidth() + 8 + this.standardPadding() * 2;
    var height = this.iconHeight() + 8 + this.standardPadding() * 2;
	var y = Yanfly.Param.CTBTurnPosY - this.standardPadding();
    this._redraw = false;
    this._position = Yanfly.Param.CTBTurnPosX.toLowerCase();
    this._direction = Yanfly.Param.CTBTurnDirection.toLowerCase();
    Window_Base.prototype.initialize.call(this, 0, y, width, height);
    this.opacity = 0;
    this.contentsOpacity = 0;
};


Window_VictoryTitle.prototype.windowWidth = function() {
    return Graphics.boxWidth*0.5;
};

Window_VictoryExp.prototype.windowWidth = function() {
    return Graphics.boxWidth*0.5;
};

Window_VictoryDrop.prototype.initialize = function(titleWindow) {
    var wy = titleWindow.height;
    var ww = Graphics.boxWidth*0.5;
    var wh = Graphics.boxHeight - wy;
	var wx = Graphics.boxWidth*0.25
    Window_ItemList.prototype.initialize.call(this, wx, wy, ww, wh);
    this.openness = 0;
    this.refresh();
};

var _scene_battle_create_victory_title = Scene_Battle.prototype.createVictoryTitle;
Scene_Battle.prototype.createVictoryTitle = function() {
	_scene_battle_create_victory_title.call(this);
    this._victoryTitleWindow.x = Graphics.boxWidth*0.25;
};

var _scene_battle_create_victory_exp = Scene_Battle.prototype.createVictoryExp;
Scene_Battle.prototype.createVictoryExp = function() {
	_scene_battle_create_victory_exp.call(this);
    this._victoryExpWindow.x = Graphics.boxWidth*0.25;
};

Window_VictoryExp.prototype.gaugeRect = function(index) {
    var rect = this.itemRect(index);
    var fw = Window_Base._faceWidth;
    rect.x += fw + this.standardPadding() * 2;
    rect.width -= fw + this.standardPadding() * 3;
    return rect;
};

Window_VictoryExp.prototype.drawLevel = function(actor, rect) {
	var wx = rect.x + 2 + rect.width*0.55;
    if (this.actorExpRate(actor) >= 1.0) {
      var text = Yanfly.Util.toGroup(actor._postVictoryLv);
    } else {
      var text = Yanfly.Util.toGroup(actor._preVictoryLv);
    }
    this.drawText(text, wx, rect.y, rect.width*0.4, 'right');
    var ww = rect.width*0.4 - 4 - this.textWidth('0' +
      Yanfly.Util.toGroup(actor.maxLevel()));
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.levelA, wx , rect.y, ww, 'left');
};

Window_VictoryExp.prototype.drawExpGained = function(actor, rect) {
    var wy = rect.y;
	var wx = rect.x + 2;
	var ww = rect.width*0.5 - 4;
    this.changeTextColor(this.systemColor());
    this.drawText(Yanfly.Param.VAGainedExp, wx - 40, wy, ww,
      'left');
    var bonusExp = 1.0 * actor._expGained * this._tick /
      Yanfly.Param.VAGaugeTicks;
    var expParse = Yanfly.Util.toGroup(parseInt(bonusExp));
    var expText = Yanfly.Param.VAGainedExpfmt.format(expParse);
    this.changeTextColor(this.normalColor());
    this.drawText(expText, wx, wy, ww, 'right');
};

Window_VictoryExp.prototype.drawGainedSkills = function(actor, rect) {
    if (actor._victorySkills.length <= 0) return;
    if (!this.meetDrawGainedSkillsCondition(actor)) return;
    var wy = rect.y + 2*this.lineHeight();
    var wx = rect.x - 40;
    for (var i = 0; i < actor._victorySkills.length; ++i) {
      if (wy + this.lineHeight() > rect.y + rect.height) break;
      var skillId = actor._victorySkills[i];
      var skill = $dataSkills[skillId];
      if (!skill) continue;
      var text = skill.name;
      if (i == 0) text = TextManager.obtainSkill.format(text);
      var ww = this.textWidthEx(text);
      this.drawTextEx(text, wx, wy);
      wx += ww + 32;
    }
};


Window_VictoryExp.prototype.drawActorGauge = function(actor, index) {
    this.clearGaugeRect(index);
    var rect = this.gaugeRect(index);
    this.changeTextColor(this.normalColor());
   // this.drawActorName(actor, rect.x + 2, rect.y);
    this.drawLevel(actor, rect);
    this.drawExpGauge(actor, rect);
    this.drawExpValues(actor, rect);
    this.drawExpGained(actor, rect);
    this.drawGainedSkills(actor, rect);
};

Window_VictoryDrop.prototype.drawGold = function(item, index) {
    if (item !== 'gold') return;
    var rect = this.itemRect(index);
    rect.width -= this.textPadding();
    var value = BattleManager._rewards.gold;
    var currency = TextManager.currencyUnit;
      this.drawIcon(Yanfly.Icon.Gold, rect.x, rect.y + 2);
	  this.drawText(value, rect.x - 36, rect.y, rect.width - 4, 'right');
      this.changeTextColor(this.systemColor());
      this.drawText(currency, rect.x, rect.y, rect.width - 4, 'right');
      this.resetFontSettings();
};


// change reflection ani
Window_BattleLog.prototype.displayReflection = function(target) {
    if (eval(Yanfly.Param.BECShowRflText)) {
      this.addText(TextManager.magicReflection.format(target.name()));
    }
    target.performReflection();
   // var animationId = BattleManager._action.item().animationId;
    this.showNormalAnimation([BattleManager._subject], 309);
    this.waitForAnimation();
};


//only allow 1 move for substitute
Sprite_Battler.prototype.stepToSubstitute = function(focus) {
    var target = focus.battler();
	if (this.x == this._homeX && this.y == this._homeY)	{
    var targetX = (this.x - this._homeX) + (target._homeX - this._homeX);
    var targetY = (this.y - this._homeY) + (target._homeY - this._homeY);;
    if (focus.isActor()) targetX -= this._mainSprite.width / 2;
    if (focus.isEnemy()) targetX += this.width / 2;
    this.startMove(targetX, targetY, 1);
	}
};


//HP gauge display
Game_Battler.prototype.hpGaugeWidth = function() {
		var width = Math.max(this.spriteWidth()*0.75, Yanfly.Param.VHGMinHpWidth);
		return (width & 1) ? width + 1 : width;
};

Game_Enemy.prototype.hpGaugeWidth = function() {
		if (this.enemy().hpGaugeWidth > 0) {
			var width = this.enemy().hpGaugeWidth;
		} else {
			var width = this.spriteWidth()*0.75;
		}
		width = Math.max(width,	Yanfly.Param.VHGMinHpWidth);
		return (width & 1) ? width + 1 : width;
};

Window_VisualHPGauge.prototype.updateWindowPosition = function() {
    if (!this._battler) return;
    var battler = this._battler;
    this.x = battler.spritePosX();
    this.x -= Math.ceil(this.width / 2); 
    this.x = this.x.clamp(this._minX, this._maxX);
    this.y = battler.spritePosY();
    if (Yanfly.Param.VHGGaugePos) {
      this.y -= battler.spriteHeight();
    } else {
      this.y -= this.standardPadding();
    }
	    this.y += Yanfly.Param.VHGBufferY;
    this.y = this.y.clamp(this._minY, this._maxY);

};


//fix to life steal plugin
Game_Action.prototype.performLifeSteal = function(damage, target, value) {
    this.performHpLifeSteal(damage, target, value);
    this.performMpLifeSteal(damage, target, value);
};

//fix to drop item rate with difficulty mode
Yanfly.Util = Yanfly.Util || {};

Yanfly.Util.getCount = function(value, arr){
    var occur = 0;
    for(var i = 0; i < arr.length; i++){
        if (arr[i] === value) {
			occur++;
			if ($gameVariables.value(61)>=2) occur++;
		}
    }
    return occur;
};