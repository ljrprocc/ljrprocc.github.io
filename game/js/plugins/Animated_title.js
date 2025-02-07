//----------------------------------------------------------
// Animated Title Cirno.js
//----------------------------------------------------------

// simplified by doranikofu, only keeping animated menu command
/*:
 * @plugindesc Animated Title Cirno
 * @author Soulpour777
 *
 * @help //----------------------------------------------------------
// [RMMV] Animated Title Cirno
// Version: 1.0
// Author: Soulpour777
//----------------------------------------------------------
 * @param TitleCommandImages
 * @desc The list contains the names of the images of your title command.
 * @default TitleMenu01, TitleMenu02, TitleMenu03
 *
 * 
 * @param ContinueDisabled
 * @desc The image displayed if there's no save data and its under continue mark.
 * @default TitleMenu02_B
 *   
 *    
 * @param TitleParticles
 * @desc Name of particle you are using.
 * @default Title_Particle
 * 
 * @param ParticleSpeed
 * @desc How fast the animation of the particle should go.
 * @default 0.9
 *
 * @param ImageTitle
 * @desc The title logo you are using.
 * @default Title
 * 
 * @param TitleLogoOpacityIncrease
 * @desc Speed of the logo's fade in when shown at the beginning of the title screen.
 * @default 1
 */

// Alias Methods
var _alias_soul_prototype_create_command_window = Scene_Title.prototype.createCommandWindow;
var _alias_soul_prototype_scene_title_update = Scene_Title.prototype.update;
var _alias_soul_prototype_scene_title_terminate = Scene_Title.prototype.terminate;
var _alias_soul_prototype_scene_title_start = Scene_Title.prototype.start;
var _alias_soul_prototype_scene_title_create = Scene_Title.prototype.create;

var Imported = Imported || {};
Imported.AnimatedTitleCirno = true;
var Soulpour777 = Soulpour777 || {};
Soulpour777.params = PluginManager.parameters('Animated_Title'); 

// Parameter call
// var params = PluginManager.parameters('Animated Title Cirno'); 

// Command Parameter
var title_images_list = Soulpour777.params['TitleCommandImages'].split(/\s*,\s*/).filter(function(value) { return !!value; });

// Continue Disabled Parameter
var continue_is_disabled = String(Soulpour777.params['ContinueDisabled'] || "TitleMenu02_B");

// Title Image Parameters
var titleImage = String(Soulpour777.params['ImageTitle'] || "Title");
var titleImageOpacity = Number(Soulpour777.params['TitleLogoOpacity'] || 10);
var titleImageOpacityIncreaseSpeed = Number(Soulpour777.params['TitleLogoOpacityIncrease'] || 1);

// Particle Parameters
var titleParticle = String(Soulpour777.params['TitleParticles'] || "Title_Particle");
var titleParticleSpeed = Number(Soulpour777.params['ParticleSpeed'] || 0.9);

Scene_Title.prototype.titleScreenCommand;
Scene_Title.prototype.particle1;
Scene_Title.prototype.title_image = titleImage;
Scene_Title.prototype.particle_image;

//Scene_Title.prototype.createForeground = function() {
//    this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
//    this.addChild(this._gameTitleSprite);
   // if (!disableDrawingTitle) {
   //     this.drawGameTitle();
   // }
//};

Scene_Title.prototype.create = function() {
    _alias_soul_prototype_scene_title_create.call(this);
    this._lastBitmapIndex = this._commandWindow._index;
	this._mouseClicked = false;
	this._fileDisabled = false;


};

Scene_Title.prototype.create_titleDrawing = function() {
    this._gameTitleImage = new Sprite();
    this._gameTitleImage.bitmap = ImageManager.loadSystem(this.title_image);
    this._gameTitleImage.opacity = titleImageOpacity;
    this.addChildAt(this._gameTitleImage, 2);
}

Scene_Title.prototype.create_particle = function() {
    this.particle_image = new TilingSprite();
    this.particle_image.move(0, 0, 1280, 640);
    this.particle_image.bitmap = ImageManager.loadSystem(titleParticle);
    this.particle_image.opacity = 255;//secondBackgroundOpacity;
    this.addChildAt(this.particle_image, 1);
}

Scene_Title.prototype.update_particle = function() {
    this.particle_image.origin.x -= titleParticleSpeed;
}

Scene_Title.prototype.createCommandWindow = function() {
	_alias_soul_prototype_create_command_window.call(this);
    this._commandWindow.x = -Graphics.width;
    this._commandWindow.y = -Graphics.height;
    this._commandWindow.visible = false;
	this._commandWindow.deactivate();


};

Window_TitleCommand.prototype.maxCols = function() {
        return 3;
};
Window_TitleCommand.prototype.maxRows = function() {
        return 3;
};

Window_TitleCommand.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        var lastIndex = this.index();
        if (Input.isRepeated('left')) {
            this.cursorRight(Input.isTriggered('right'));
        }
        if (Input.isRepeated('right')) {
            this.cursorLeft(Input.isTriggered('left'));
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
};


Scene_Title.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
    // this.centerSprite(this._backSprite1);
    // this.centerSprite(this._backSprite2);
    this.playTitleMusic();
    this.startFadeIn(this.fadeSpeed(), false);
    // new functions
    this.createCommandImages();
    this.create_titleDrawing();
    this.create_particle();

    if (DataManager.isAnySavefileExists()) {
		this._fileDisabled = false;
		this.titleScreenCommand.bitmap = ImageManager.loadSystem(title_images_list[this._commandWindow._index]);
    } else {
		this._fileDisabled = true;
        if (this._commandWindow._index == 1) {
            this.titleScreenCommand.bitmap = ImageManager.loadSystem(continue_is_disabled);
        } else {
            this.titleScreenCommand.bitmap = ImageManager.loadSystem(title_images_list[this._commandWindow._index]);
        }
    }   

};

Scene_Title.prototype.update = function() {
    _alias_soul_prototype_scene_title_update.call(this);



    this._lastBitmapIndex = this._commandWindow._index;

    if (this._gameTitleImage.opacity < 255) {
        this._gameTitleImage.opacity += titleImageOpacityIncreaseSpeed;
    }
    if (this.titleScreenCommand.opacity < 255) {
        this.titleScreenCommand.opacity += titleImageOpacityIncreaseSpeed;
    } else {


    if (!this._fileDisabled) {
        this.titleScreenCommand.bitmap = ImageManager.loadSystem(title_images_list[this._commandWindow._index]);
    } else {
        if (this._commandWindow._index == 1) {
            this.titleScreenCommand.bitmap = ImageManager.loadSystem(continue_is_disabled);
        } else {
            this.titleScreenCommand.bitmap = ImageManager.loadSystem(title_images_list[this._commandWindow._index]);
        }
    }  
    //update coordinates after opacity is done
	this._commandWindow.activate();
if(!this._mouseClicked){
    if(TouchInput.isTriggered() && TouchInput._x > 310 && TouchInput._x < 420 
        && TouchInput._y > Graphics.height*0.4 && TouchInput._y < Graphics.height*0.9) {
		this._mouseClicked = true;
        this._commandWindow._index = 0;  
        SoundManager.playCursor();
        this._commandWindow.processOk();
    
    }

    if(TouchInput.isTriggered() && TouchInput._x > 190 && TouchInput._x < 310 
        && TouchInput._y > Graphics.height*0.4 && TouchInput._y < Graphics.height*0.9) {
		//this._mouseClicked = true;
       // SoundManager.playCursor();
        this._commandWindow._index = 1;
        SoundManager.playCursor();
        this._commandWindow.processOk();
    }

    if(TouchInput.isTriggered() && TouchInput._x > 80 && TouchInput._x < 190 
        && TouchInput._y > Graphics.height*0.4 && TouchInput._y < Graphics.height*0.9) {
		//this._mouseClicked = true;
      //  SoundManager.playCursor();
        this._commandWindow._index = 2;
        SoundManager.playCursor();
        this._commandWindow.processOk();
    }
};

	}
    this.update_particle();
};





Scene_Title.prototype.terminate = function() {
	this.removeChild(this.titleScreenCommand);
    _alias_soul_prototype_scene_title_terminate.call(this);
    this.removeChild(this.particle_image);
};



Scene_Title.prototype.createCommandImages = function() {
	this.titleScreenCommand = new Sprite();
	this.titleScreenCommand.x = 0;
	this.titleScreenCommand.y = 0;
	this.titleScreenCommand.opacity = 0;
	this.addChildAt(this.titleScreenCommand, 3);
}

