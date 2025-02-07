// ------------------------------------------------------------------------------------
// SOUL_MV Destination Cursor.js
// ------------------------------------------------------------------------------------
/*:
* @plugindesc Changes your white blinking cursor into an image during mouse movement.
* @author Soulpour777 - soulxregalia.wordpress.com
* 
* @help

SOUL_MV Destination Cursor.js
Author: Soulpour777

This plugin does not have any Plugin Commands.

All images must be inside img / system folder.

* @param Cursor Image
* @desc Image name of the cursor sprite you are using. (img / system)
* @default destination_cursor
*
* @param Cursor Width
* @desc Width of the cursor.
* @default 48
*
* @param Cursor Height
* @desc Height of the cursor.
* @default 48
*
* @param Blink Speed
* @desc Speed of the blinking behavior for the cursor.
* @default 20
*
* @param Fade Effect
* @desc Do you want to use the fade in / fade out effect in the cursor when active?
* @default false
*
* @param Fade Speed
* @desc Speed of the fade behavior for the cursor.
* @default 20
*
* @param Scale Value
* @desc Scale value of the cursor when it appears. (1 + this._frameCount / Scale Value).
* @default 20
*
*/
(function(){
	var SOUL_MV = SOUL_MV || {};
	SOUL_MV.DestinationCursor = {};
	SOUL_MV.DestinationCursor.cursorImage = PluginManager.parameters('SOUL_MV Destination Cursor')['Cursor Image'] || 'destination_cursor';
	SOUL_MV.DestinationCursor.cursorWidth = Number(PluginManager.parameters('SOUL_MV Destination Cursor')['Cursor Width'] || 48);
	SOUL_MV.DestinationCursor.cursorHeight = Number(PluginManager.parameters('SOUL_MV Destination Cursor')['Cursor Height'] || 48);
	SOUL_MV.DestinationCursor.blinkSpeed = Number(PluginManager.parameters('SOUL_MV Destination Cursor')['Blink Speed'] || 20);
	SOUL_MV.DestinationCursor.horzScale = Number(PluginManager.parameters('SOUL_MV Destination Cursor')['Scale Value'] || 20);
	SOUL_MV.DestinationCursor.fadeSpeed = Number(PluginManager.parameters('SOUL_MV Destination Cursor')['Fade Speed'] || 20);
	SOUL_MV.DestinationCursor.fadeEffect = PluginManager.parameters('SOUL_MV Destination Cursor')['Fade Effect'] === "true" ? true : false;
	Sprite_Destination.prototype.createBitmap = function() {
	    var tileWidth = SOUL_MV.DestinationCursor.cursorWidth;
	    var tileHeight = SOUL_MV.DestinationCursor.cursorHeight;
	    this.bitmap = new Bitmap(tileWidth, tileHeight);
	    this.bitmap = ImageManager.loadSystem(SOUL_MV.DestinationCursor.cursorImage);
	    this.anchor.x = 0.5;
	    this.anchor.y = 0.5;
	    this.blendMode = Graphics.BLEND_ADD;
	};
	Sprite_Destination.prototype.updateAnimation = function() {
	    this._frameCount++;
	    this._frameCount %= SOUL_MV.DestinationCursor.blinkSpeed;
	    if (SOUL_MV.DestinationCursor.fadeEffect) {
	    	this.opacity = (SOUL_MV.DestinationCursor.fadeSpeed - this._frameCount) * 6;
	    }
	    this.scale.x = 1 + this._frameCount / SOUL_MV.DestinationCursor.horzScale;
	    this.scale.y = this.scale.x;
	};
})();