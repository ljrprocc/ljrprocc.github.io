//===========================trigger action for diagonal
//===========================char direction for diagonal
Game_Character.prototype.turnTowardCharacter = function(character) {
    var sx = this.deltaXFrom(character._realX);
    var sy = this.deltaYFrom(character._realY);
	var radian = Math.atan2(sx,sy) + Math.PI;
	this.setDirection(
        radian < Math.PI / 8.0 *  1.0 ? 2 :
        radian < Math.PI / 8.0 *  3.0 ? 3 :
        radian < Math.PI / 8.0 *  5.0 ? 6 :
        radian < Math.PI / 8.0 *  7.0 ? 9 :
        radian < Math.PI / 8.0 *  9.0 ? 8 :
        radian < Math.PI / 8.0 * 11.0 ? 7 :
        radian < Math.PI / 8.0 * 13.0 ? 4 :
        radian < Math.PI / 8.0 * 15.0 ? 1 : 2
		);
};

Game_Character.prototype.turnAwayFromCharacter = function(character) {
    var sx = this.deltaXFrom(character._realX);
    var sy = this.deltaYFrom(character._realY);
	var radian = Math.atan2(sx,sy) + Math.PI;
	this.setDirection(
        radian < Math.PI / 8.0 *  1.0 ? 8 :
        radian < Math.PI / 8.0 *  3.0 ? 7 :
        radian < Math.PI / 8.0 *  5.0 ? 4 :
        radian < Math.PI / 8.0 *  7.0 ? 1 :
        radian < Math.PI / 8.0 *  9.0 ? 2 :
        radian < Math.PI / 8.0 * 11.0 ? 3 :
        radian < Math.PI / 8.0 * 13.0 ? 6 :
        radian < Math.PI / 8.0 * 15.0 ? 9 : 8
		);
};
/*
Game_Map.prototype.xWithDirection = function(x, d) {
    return x + (d%3 == 0 ? 1 : (d+2)%3 == 0 ? -1 : 0);
};

Game_Map.prototype.yWithDirection = function(y, d) {
    return y + (d < 4 ? 1 : d > 6 ? -1 : 0);
};
*/
 Game_Map.prototype.roundXWithDirection = function(x, d) {
    return this.roundX(x + (d%3 == 0 ? 1 : (d+2)%3 == 0 ? -1 : 0));
};

Game_Map.prototype.roundYWithDirection = function(y, d) {
    return this.roundY(y + (d < 4 ? 1 : d > 6 ? -1 : 0));
};


//expand trigger region, look to left
 Game_Map.prototype.roundXWithDirectionL = function(x, d) {
		switch(d) {
			case 1:    
				return this.roundX(x+1);
				break;
			case 2:   
				return this.roundX(x+1);
				break;
			case 8:   
				return this.roundX(x-1);
				break;
			case 9:   
				return this.roundX(x-1);
				break;
			default :
				return this.roundX(x);
		};
};

Game_Map.prototype.roundYWithDirectionL = function(y, d) {
		switch(d) {
			case 3:    
				return this.roundY(y-1);
				break;
			case 4:   
				return this.roundY(y+1);
				break;
			case 6:   
				return this.roundY(y-1);
				break;
			case 7:   
				return this.roundY(y+1);
				break;
			default :
				return this.roundY(y);
		};
};
//look to right
 Game_Map.prototype.roundXWithDirectionR = function(x, d) {
		switch(d) {
			case 2:    
				return this.roundX(x-1);
				break;
			case 3:   
				return this.roundX(x-1);
				break;
			case 7:   
				return this.roundX(x+1);
				break;
			case 8:   
				return this.roundX(x+1);
				break;
			default :
				return this.roundX(x);
		};
};

Game_Map.prototype.roundYWithDirectionR = function(y, d) {
		switch(d) {
			case 1:    
				return this.roundY(y-1);
				break;
			case 4:   
				return this.roundY(y-1);
				break;
			case 6:   
				return this.roundY(y+1);
				break;
			case 9:   
				return this.roundY(y+1);
				break;
			default :
				return this.roundY(y);
		};
};



Game_Player.prototype.checkEventTriggerHere = function(triggers) {
//			$gameVariables.setValue(30,this._realX*100);
//		$gameVariables.setValue(31,this._realY*100);
//		$gameVariables.setValue(32,this.x*100);
//		$gameVariables.setValue(33,this.y*100);
    if (this.canStartLocalEvents()) {
        this.startMapEvent(Math.round(this._realX), Math.round(this._realY), triggers, false);
    }
};
/*
Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
        var direction = this.direction();
        var x1 = Math.round(this._realX);
        var y1 = Math.round(this._realY);
        var x2 = Math.floor($gameMap.roundXWithDirection(x1, direction));
        var y2 = Math.floor($gameMap.roundYWithDirection(y1, direction));
        this.startMapEvent(x2, y2, triggers, true);
        if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
            var x3 = $gameMap.roundXWithDirection(x2, direction);
            var y3 = $gameMap.roundYWithDirection(y2, direction);
            this.startMapEvent(x3, y3, triggers, true);
        }
    }
};
*/

Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
        var direction = this.direction();
        var x1 = Math.round(this._realX);
        var y1 = Math.round(this._realY);
        var x2 = Math.floor($gameMap.roundXWithDirection(x1, direction));
        var y2 = Math.floor($gameMap.roundYWithDirection(y1, direction));
        this.startMapEvent(x2, y2, triggers, true);
        if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
            var x3 = Math.floor($gameMap.roundXWithDirectionL(x2, direction));
            var y3 = Math.floor($gameMap.roundYWithDirectionL(y2, direction));
            this.startMapEvent(x3, y3, triggers, true);
			if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x3, y3)) {
				var x4 = Math.floor($gameMap.roundXWithDirectionR(x2, direction));
				var y4 = Math.floor($gameMap.roundYWithDirectionR(y2, direction));
				this.startMapEvent(x4, y4, triggers, true);
			}
        }
    }
};

Game_Player.prototype.triggerTouchAction = function() {
    if ($gameTemp.isDestinationValid()){
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        var x3 = $gameMap.roundXWithDirectionL(x2, direction);
        var y3 = $gameMap.roundYWithDirectionL(y2, direction);
        var x4 = $gameMap.roundXWithDirectionR(x2, direction);
        var y4 = $gameMap.roundYWithDirectionR(y2, direction);
        var destX = $gameTemp.destinationX();
        var destY = $gameTemp.destinationY();
        if (destX === x1 && destY === y1) {
            return this.triggerTouchActionD1(x1, y1);
        } else if (destX === x2 && destY === y2) {
            return this.triggerTouchActionD2(x2, y2);
        } else if (destX === x3 && destY === y3) {
            return this.triggerTouchActionD3(x2, y2);
        } else if (destX === x4 && destY === y4) {
            return this.triggerTouchActionD3(x2, y2);
        }
    }
    return false;
};


/*
//set 8dir random move
Game_Character.prototype.moveRandom = function() {
    var d = 1 + Math.randomInt(8);
	if (d%2 == 0)
	{
	    if (this.canPass(this.x, this.y, d)) {
        this.moveStraight(d);
		}
	} else {
		var horz = 4;
		var vert = 2;
		switch (d){
		case 1: horz = 4; vert = 2;
		case 3: horz = 6; vert = 2;
		case 7: horz = 4; vert = 8;
		case 9: horz = 6; vert = 8;
		}
		if (this.canPassDiagonally(this.x, this.y, horz, vert){
			this.moveDiagonally(horz, vert);
		}
	}

};
*/