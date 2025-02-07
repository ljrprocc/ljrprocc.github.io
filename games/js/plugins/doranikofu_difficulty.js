// doranikofu change enemy data based on difficulty setting
/*:
 * @plugindesc difficulty setting for battle
 *
*/

Game_Enemy.prototype.dropItemRate = function() {
	//read setting, lower rate if less than 1
	var ratio = 0.5 + 0.5*($gameVariables.value(61).clamp(0,1));
    return $gameParty.hasDropItemDouble() ? 2*ratio : ratio;
};

var _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
Game_Enemy.prototype.paramBase = function(paramId) {
	var value = _Game_Enemy_paramBase.call(this, paramId);
	var ratio = $gameVariables.value(61).clamp(0,2);
    switch (paramId) {
    case 0:  //mhp
        return Math.floor(value*(1+ratio*ratio*0.35));
    case 1:  //mmp
        return Math.floor(value*(1+ratio*0.5));
    case 2:  //atk
        return Math.floor(value*(1+ratio*0.3));
    case 3:  //def
        return Math.floor(value*(1+ratio*0.15));
    case 4:  //mat
        return Math.floor(value*(1+ratio*0.3));
    case 5:  //mdf
        return Math.floor(value*(1+ratio*0.5));
   case 6:  //agi
        return Math.floor(value*(1+ratio*ratio*0.1));			
	default:
		return value;
    }  
};

BattleManager.gainDropItems = function() {
    var items = this._rewards.items;
    items.forEach(function(item) {
		if ($gameVariables.value(61)>=2){
        $gameParty.gainItem(item, 2);}
		else {
		$gameParty.gainItem(item, 1);
		}
    });
};