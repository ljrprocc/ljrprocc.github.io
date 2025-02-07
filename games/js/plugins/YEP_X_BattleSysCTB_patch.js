//=============================================================================
 /*:
 * @plugindesc custom patch to yanfly CTB, custom layout
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

//change average to sum
/*
BattleManager.averageBaseAgi = function() {
    if (this._averageBaseAgi) return this._averageBaseAgi;
    var agi = 0;
    for (var i = 0; i < $gameParty.battleMembers().length; ++i) {
      var battler = $gameParty.battleMembers()[i];
      if (battler) agi += battler.agi;
    }
    for (var i = 0; i < $gameTroop.members().length; ++i) {
      var battler = $gameTroop.members()[i];
      if (battler) agi += battler.agi;
    }
    var sum = $gameParty.battleMembers().length;
   // sum += $gameTroop.members().length;
    this._averageBaseAgi = agi;/// sum;
    return this._averageBaseAgi;
};
*/
//disable escape if partymember dead
BattleManager.processEscapeCTB = function() {
  $gameParty.performEscape();
  SoundManager.playEscape();
  var success = this._preemptive ? true : (Math.random() < this._escapeRatio);
  if ($gameParty.deadMembers().length>0)
  { success = false; };
  if (success) {
      $gameParty.removeBattleStates();
      $gameParty.performEscapeSuccess();
      this.displayEscapeSuccessMessage();
      this._escaped = true;
      this.processAbort();
  } else {
      this.actor().spriteStepBack();
      this.actor().clearActions();
      this.displayEscapeFailureMessage();
      this._escapeRatio += this._escapeFailBoost;
      this.startTurn();
      this.processFailEscapeCTB();
  }
  return success;
};