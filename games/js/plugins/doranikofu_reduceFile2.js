//=============================================================================
 /*:
 * @plugindesc read parallax and char files at 200% for reduced file size - 2nd part
 * @author doranikofu	
 */
//=============================================================================

/*
//scale enemy in YEP, replace original YEP functions
Game_Enemy.prototype.spriteScaleX = function() {
    if (this.hasSVBattler()) return this.enemy().spriteScaleX * -1;
    return this.enemy().spriteScaleX*2;
};

Game_Enemy.prototype.spriteScaleY = function() {
    return this.enemy().spriteScaleY*2;
};

//custom function
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
*/


//resize UI size for mobile touch

Window_SkillList.prototype.lineHeight = function() {
    return 56;
};
Window_ItemList.prototype.lineHeight = function() {
    return 56;
};

Window_ItemCategory.prototype.lineHeight = function() {
    return 48;
};

Window_EquipCommand.prototype.lineHeight = function() {
    return 60;
};

Window_EquipItem.prototype.lineHeight = function() {
    return 56;
};

Window_EquipSlot.prototype.lineHeight = function() {
    return 59;
};

Window_AugmentItemList.prototype.lineHeight = function() {
    return 50;
};

Window_ItemActionCommand.prototype.lineHeight = function() {
    return 50;
};

Window_PartyList.prototype.lineHeight = function() {
    return 48;
};

Window_PartyMenuCommand.prototype.lineHeight = function() {
    return 60;
};

Window_QuestBookList.prototype.lineHeight = function() {
    return 48;
};

Window_ShopCommand.prototype.lineHeight = function() {
    return 48;
};

Window_ShopBuy.prototype.lineHeight = function() {
    return 56;
};

Window_SynthesisList.prototype.lineHeight = function() {
    return 56;
};

Window_Options.prototype.lineHeight = function() {
    return 64;
};

Window_ChoiceList.prototype.lineHeight = function() {
    return 64;
};

Window_ShopStatus.prototype.lineHeight = function() {
    return 33;
};
// monsterbook, helpfile in plugin