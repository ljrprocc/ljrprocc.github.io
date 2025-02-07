//=============================================================================
 /*:
 * @plugindesc read parallax and char files at 200% for reduced file size
 * @author doranikofu	
 */
//=============================================================================

Spriteset_Map.prototype.createParallax = function() {
    this._parallax = new TilingSprite();
	this._parallax.scale.x = 2;
	this._parallax.scale.y = 2;
    this._parallax.move(0, 0, Graphics.width, Graphics.height);
    this._baseSprite.addChild(this._parallax);
};

//set up scroll in patch_analogmove Game_Map.prototype.parallaxOx  Oy
// also need to update scale for overlay plugin


Sprite_Character.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
	this.scale.x = 2;
	this.scale.y = 2;
    this._character = null;
    this._balloonDuration = 0;
    this._tilesetId = 0;
    this._upperBody = null;
    this._lowerBody = null;
};

//reduce animation grid 192 to 96, because all sprites in battle and on map are displayed at 200$, no need to change display zoom ratio for animation separately
Sprite_Animation.prototype.updateCellSprite = function(sprite, cell) {
    var pattern = cell[0];
    if (pattern >= 0) {
        var sx = pattern % 5 * 96;
        var sy = Math.floor(pattern % 100 / 5) * 96;
        var mirror = this._mirror;
        sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
        sprite.setFrame(sx, sy, 96, 96);
        sprite.x = cell[1];
        sprite.y = cell[2];
        if (this._mirror) {
            sprite.x *= -1;
        }
        sprite.rotation = cell[4] * Math.PI / 180;
        sprite.scale.x = cell[3] / 50;
        if ((cell[5] && !mirror) || (!cell[5] && mirror)) {
            sprite.scale.x *= -1;
        }
        sprite.scale.y = cell[3] / 50;
		if (!$gameParty.inBattle() && !this._animation.name.contains("LOOP"))	{
			sprite.x /= 2
			sprite.y /= 2
			sprite.scale.x /= 2;
			sprite.scale.y /= 2;
		};
        sprite.opacity = cell[6];
        sprite.blendMode = cell[7];
        sprite.visible = true;
    } else {
        sprite.visible = false;
    }
};

//increase exp gain in battle to compensate reduced battle encounter rate for mobile deployment
BattleManager.makeRewards = function() {
    this._rewards = {};
    this._rewards.gold = $gameTroop.goldTotal();
    this._rewards.exp = Math.floor($gameTroop.expTotal()*1.5);
    this._rewards.items = $gameTroop.makeDropItems();
};