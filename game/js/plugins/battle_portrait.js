//##############doranikofu edits, relocate the gauges and show actor portrait
 /*:
 * @plugindesc custom menu layout and battler portait
*/


//**********************menu show portrait
//=======================
// edited from  * @plugindesc Display Battlers Portraits * @author Michael Dionne
//=======================

	Window_BattleStatus.prototype.drawItem = function(index)
	{
		var actor = $gameParty.battleMembers()[index];
		this.drawBasicArea(this.basicAreaRect(index), actor);
		this.drawGaugeArea(this.gaugeAreaRect(index), actor);
	};

	Window_BattleStatus.prototype.itemRect = function(index) {
		var rect = new Rectangle();
		rect.width = 240;
		rect.height = 160;
		rect.x = index * (10+rect.width);
		rect.y = 0;
		return rect;
	};

	
	Window_BattleStatus.prototype.basicAreaRect = function(index)
	{
		var rect = this.itemRect(index);
		rect.width -= this.gaugeAreaWidth() + 15;
		return rect;
	};

	
	Window_BattleStatus.prototype.numVisibleRows = function()
	{
		return 1;
	};

	
	Window_BattleStatus.prototype.maxCols = function()
	{
		return 4;
	};

	
	Window_BattleStatus.prototype.gaugeAreaRect = function(index)
	{
		var rect = this.itemRect(index);
		rect.x += rect.width - this.gaugeAreaWidth() + 10;
		rect.width = this.gaugeAreaWidth();
		return rect;
	};


	Window_BattleStatus.prototype.gaugeAreaWidth = function()
	{
		return 330;
	};

Window_BattleStatus.prototype.drawFaceB = function(actor, x, y, width, height) {
    width = width || 160;
    height = height || 160;
	var faceIndex = actor.faceIndex();
    var bitmap = ImageManager.loadFace("battleFace");
    var pw = 160;
    var ph = 160;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

	Window_BattleStatus.prototype.drawBasicArea = function(rect, actor)
	{
		this.drawFaceB(actor, rect.x, rect.y-5, 160, 160);
	//	this.drawActorName(actor, rect.x+6, rect.y + 4, 120);
		this.drawActorIcons(actor, rect.x+10, rect.y + 6, 220);
		
	};
/*
	Window_BattleStatus.prototype.drawGaugeArea = function(rect, actor)
	{
		this.drawGaugeAreaWithTp(rect, actor);
	};
*/
//#######################
//=============================================================================



Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
    var totalArea = this.gaugeAreaWidth();
		var lineHeight = 32;
		this.drawActorHp(actor, rect.x+192, 6+rect.y + lineHeight * 1, 120);
		this.drawActorTp(actor, rect.x+192, 6+rect.y + lineHeight * 2, 120);
		this.drawActorMp(actor, rect.x+192, 6+rect.y + lineHeight * 3, 120);
};


//===============================fix window position
Scene_Battle.prototype.updateWindowPositions = function() {
};