//===========================trigger action for diagonal
//===========================char direction for diagonal
Game_Character.prototype.turnTowardCharacter = function(character) {
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
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
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
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
 * ==============================================================================
 * ** Victor Engine MV - Diagonal Movement
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.12.15 > First release.
 * ==============================================================================

 *------------------------------------------------------------------------------ 
 * @plugindesc v1.00 - Allows diagonal movement for player and events.
 * @author Victor Sant
 * editted by doranikofu, only used the mouse control script for diagonal move
 */ 

	Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
			var x2 = $gameMap.roundXWithDirection(x, horz);
			var y2 = $gameMap.roundYWithDirection(y, vert);
			return (this.canPass(x, y, vert) && this.canPass(x, y2, horz) &&
					this.canPass(x, y, horz) && this.canPass(x2, y, vert))
	};	

	//=============================================================================
	// Game_Character
	//=============================================================================
		
	Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
		var searchLimit = this.searchLimit();
		var mapWidth = $gameMap.width();
		var nodeList = [];
		var openList = [];
		var closedList = [];
		var start = {};
		var best = start;
		if (this.x === goalX && this.y === goalY) return 0;
		start.parent = null;
		start.x = this.x;
		start.y = this.y;
		start.g = 0;
		start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
		nodeList.push(start);
		openList.push(start.y * mapWidth + start.x);
		while (nodeList.length > 0) {
			var bestIndex = 0;
			for (var i = 0; i < nodeList.length; i++) {
				if (nodeList[i].f < nodeList[bestIndex].f) bestIndex = i;
			}
			var current = nodeList[bestIndex];
			var x1 = current.x;
			var y1 = current.y;
			var pos1 = y1 * mapWidth + x1;
			var g1 = current.g;
			nodeList.splice(bestIndex, 1);
			openList.splice(openList.indexOf(pos1), 1);
			closedList.push(pos1);
			if (current.x === goalX && current.y === goalY) {
				best = current;
				goaled = true;
				break;
			}
			if (g1 >= searchLimit) continue;
			var list = [2, 4, 6, 8, 1, 3, 7, 9,];
			for (var i = 0; i < list.length; i++) {
				var direction = list[i]
				if (direction % 2 == 0) {
					var x2 = $gameMap.roundXWithDirection(x1, direction);
					var y2 = $gameMap.roundYWithDirection(y1, direction);
				} else {
					var horz = ((direction === 1 || direction === 7) ? 4 : 6);
					var vert = ((direction === 1 || direction === 3) ? 2 : 8);
					var x2 = $gameMap.roundXWithDirection(x1, horz);
					var y2 = $gameMap.roundYWithDirection(y1, vert);
				}
				var pos2 = y2 * mapWidth + x2;
				if (closedList.contains(pos2)) continue;
				if (!this.canPassFindDirection(x1, y1, direction)) continue;	
				var g2 = g1 + ((direction % 2 === 0) ? 1 : 1.4);
				var index2 = openList.indexOf(pos2);
				if (index2 < 0 || g2 < nodeList[index2].g) {
					var neighbor;
					if (index2 >= 0) {
						neighbor = nodeList[index2];
					} else {
						neighbor = {};
						nodeList.push(neighbor);
						openList.push(pos2);
					}
					neighbor.parent = current;
					neighbor.x = x2;
					neighbor.y = y2;
					neighbor.g = g2;
					neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
					if (!best || neighbor.f - neighbor.g < best.f - best.g) best = neighbor;
				}
			}
		}
		var node = best;
		while (node.parent && node.parent !== start) node = node.parent;
		var deltaX1 = $gameMap.deltaX(node.x, start.x);
		var deltaY1 = $gameMap.deltaY(node.y, start.y);
		if (deltaX1 !== 0 && deltaY1 !==  0) {
			if (deltaX1 < 0 && deltaY1 > 0) return 1;
			if (deltaX1 > 0 && deltaY1 > 0) return 3;
			if (deltaX1 < 0 && deltaY1 < 0) return 7;
			if (deltaX1 > 0 && deltaY1 < 0) return 9;
		};
		if (deltaY1 > 0) {
			return 2;
		} else if (deltaX1 < 0) {
			return 4;
		} else if (deltaX1 > 0) {
			return 6;
		} else if (deltaY1 < 0) {
			return 8;
		}
		var deltaX2 = this.deltaXFrom(goalX);
		var deltaY2 = this.deltaYFrom(goalY);
		if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
			return deltaX2 > 0 ? 4 : 6;
		} else if (deltaY2 !== 0) {
			return deltaY2 > 0 ? 8 : 2;
		}
		return 0;
	};


	Game_CharacterBase.prototype.canPassFindDirection = function(x, y, d) {
		if (d % 2 !== 0) {
			var horz = ((d === 1 || d === 7) ? 4 : 6);
			var vert = ((d === 1 || d === 3) ? 2 : 8);
			return this.canPassDiagonally(x, y, horz, vert);
		} else {
			return this.canPass(x, y, d);
		}
	};

