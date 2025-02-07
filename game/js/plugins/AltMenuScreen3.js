//=============================================================================
// AltMenuScreen3.js
//=============================================================================

/*:
 * @plugindesc Yet Another menu screen layout.
 * @author Sasuke KANNAZUKI, Yoji Ojima
 * 
 * @default 
 * @param bgBitmapMenu
 * @desc background bitmap file at menu scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapItem
 * @desc background bitmap file at item scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapSkill
 * @desc background bitmap file at skill scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapEquip
 * @desc background bitmap file at equip scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapStatus
 * @desc background bitmap file at status scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapOptions
 * @desc background bitmap file at option scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapFile
 * @desc background bitmap file at save/load scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapGameEnd
 * @desc background bitmap file at gameEnd scene. put at img/pictures.
 * @default 
 * 
 * @param maxColsMenu
 * @desc max column at menu window
 * @default 4
 * 
 * @param commandRows
 * @desc number of visible rows at command window
 * @default 2
 *
 * @param isDisplayStatus
 * @desc whether display status or not. (1 = yes, 0 = no)
 * @default 1
 * @param masterOpacity
 * @desc changes opacity of all menu fills for testing purposes
 * @default 100
 * 
 * @help This plugin does not provide plugin commands.
 *  The differences with AltMenuscreen are follows:
 *   - windows are transparent at all menu scene.
 *   - it can set the background bitmap for each scenes at menu.
 *   - picture is actors' original
 *
 * Actor' note:
 * <stand_picture:filename> set actor's standing picture at menu.
 *   put file at img/pictures.
 *
 * preferred size of actor's picture:
 * width: 174px(maxColsMenu=4), 240px(maxColsMenu=3)
 * height: 408px(commandRows=2), 444px(commandRows=1)
 */

/*:ja
 * @plugindesc レイアウトの異なるメニュー画面
 * @author 神無月サスケ, Yoji Ojima
 * 
 * @param bgBitmapMenu
 * @desc メニュー背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapItem
 * @desc アイテム画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapSkill
 * @desc スキル画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapEquip
 * @desc 装備画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapStatus
 * @desc ステータス画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapOptions
 * @desc オプション画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapFile
 * @desc セーブ／ロード画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapGameEnd
 * @desc ゲーム終了画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param maxColsMenu
 * @desc アクターを表示するウィンドウの1画面の登録最大数です。
 * @default 4
 * 
 * @param commandRows
 * @desc コマンドウィンドウの行数です。
 * @default 2
 *
 * @param isDisplayStatus
 * @desc ステータスを表示するかしないかを選びます。(1 = yes, 0 = no)
 * @default 1
 * 
 * @help このプラグインには、プラグインコマンドはありません。
 *
 *  AltMenuscreen との違いは以下です:
 *  - メニュー画面すべてのウィンドウが透明です
 *  - メニューそれぞれのシーンに背景ビットマップを付けることが出来ます。
 *  - アクターに立ち絵を利用します。
 *
 * アクターのメモに以下のように書いてください:
 * <stand_picture:ファイル名> ファイル名が、そのアクターの立ち絵になります。
 *   ファイルは img/pictures に置いてください。
 *
 * 望ましいアクター立ち絵のサイズ：
 * 幅：3列:240px, 4列：174px
 * 高さ： コマンドウィンドウ 1行:444px 2行:408px
 *
 */

(function() {

    // set parameters
    var parameters = PluginManager.parameters('AltMenuScreen3');
    var bgBitmapMenu = parameters['bgBitmapMenu'] || '';
    var bgBitmapItem = parameters['bgBitmapItem'] || '';
    var bgBitmapSkill = parameters['bgBitmapSkill'] || '';
    var bgBitmapEquip = parameters['bgBitmapEquip'] || '';
    var bgBitmapStatus = parameters['bgBitmapStatus'] || '';
    var bgBitmapOptions = parameters['bgBitmapOptions'] || '';
    var bgBitmapFile = parameters['bgBitmapFile'] || '';
    var bgBitmapGameEnd = parameters['bgBitmapGameEnd'] || '';
    var maxColsMenuWnd = Number(parameters['maxColsMenu'] || 4);
    var rowsCommandWnd = Number(parameters['commandRows'] || 2);
    var isDisplayStatus = !!Number(parameters['isDisplayStatus']);
    var masterOpacity = Number(parameters['masterOpacity'] || 100);
   //
   // make transparent windows for each scenes in menu.
   //
    var _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
        // make transparent for all windows at menu scene.
        this._statusWindow.opacity = masterOpacity;
        this._goldWindow.opacity = masterOpacity;
        this._commandWindow.opacity = masterOpacity;

		//# reposition adapted from YEP_MainMenu, combine here to minimize conflicts
      this._commandWindow.x = Graphics.boxWidth - 200;
      this._commandWindow.y = 0;
      this._commandWindow.height = Graphics.boxHeight*0.9;
      this._commandWindow.width = 200;
      this._goldWindow.x = Graphics.boxWidth - 240;
      this._goldWindow.y = Graphics.boxHeight - 72;
      this._goldWindow.height = 72;
	  this._goldWindow.width = 240;
      this._statusWindow.x = 0;
      this._statusWindow.y = 0;
      this._statusWindow.height = Graphics.boxHeight;
      this._statusWindow.width = Graphics.boxWidth - 200;

    };

    var _Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function() {
        _Scene_Item_create.call(this);
        this._helpWindow.opacity = masterOpacity;
        this._categoryWindow.opacity = masterOpacity;
        this._itemWindow.opacity = masterOpacity;
        this._actorWindow.opacity = masterOpacity;
        this._infoWindow.opacity = masterOpacity;
        this._statusWindow.opacity = masterOpacity;
        this._itemActionWindow.opacity = masterOpacity;
      
		// item window shows the list of items in the party
		this._itemWindow.x = Graphics.boxWidth*0.44;
		this._itemWindow.y = Graphics.boxHeight*0.46;
		this._itemWindow.width = Graphics.boxWidth*0.51;
		this._itemWindow.height = Graphics.boxHeight*0.53;
		// info window shows what can be done
        this._infoWindow.x = Graphics.boxWidth*0.08;
        this._infoWindow.y = Graphics.boxHeight*0.49;
        this._infoWindow.width = Graphics.boxWidth*0.3;
        this._infoWindow.height = Graphics.boxHeight*0.47;
		// action window shows action to item, overlay with info
        this._itemActionWindow.x = this._infoWindow.x;
        this._itemActionWindow.y = this._infoWindow.y;//+80;
        this._itemActionWindow.width = this._infoWindow.width;
        this._itemActionWindow.height = this._infoWindow.height;//-80;
		// list for items that can be used to upgrade weapon
		/*
		this._upgradeListWindow.opacity = masterOpacity;
        this._upgradeListWindow.x = this._infoWindow.x;
        this._upgradeListWindow.y = this._infoWindow.y;
        this._upgradeListWindow.width = this._infoWindow.width;
        this._upgradeListWindow.height = this._infoWindow.height;
		*/
		// list for items that can be used to attach to equipment
		this._augmentListWindow.x = this._infoWindow.x;
        this._augmentListWindow.y = this._infoWindow.y;
        this._augmentListWindow.width = this._infoWindow.width;
        this._augmentListWindow.height = this._infoWindow.height;
        this._augmentListWindow.opacity = masterOpacity;
				// status window shows all the effects of item with the icon
        this._statusWindow.x = 0;
        this._statusWindow.y = this._helpWindow.height;
        this._statusWindow.width = Graphics.boxWidth*0.78;
        this._statusWindow.height = Graphics.boxHeight*0.28;
		// help window on top
		this._helpWindow.width = Graphics.boxWidth*0.77;
		this._helpWindow.height = Graphics.boxHeight*0.167;
		this._helpWindow.x = 0;
		this._helpWindow.y = 0;
		// category is the menu selection window
		this._categoryWindow.width = Graphics.boxWidth*0.23;
		this._categoryWindow.height = Graphics.boxHeight*0.45;
		this._categoryWindow.x = Graphics.boxWidth*0.77;
		this._categoryWindow.y = 0;
    };


    var _Scene_Skill_create = Scene_Skill.prototype.create;
    Scene_Skill.prototype.create = function() {
        _Scene_Skill_create.call(this);
        this._helpWindow.opacity = masterOpacity;
        this._skillTypeWindow.opacity = masterOpacity;
        this._statusWindow.opacity = masterOpacity;
        this._itemWindow.opacity = masterOpacity;
        this._actorWindow.opacity = masterOpacity;
		// help window on top
		this._helpWindow.width = Graphics.boxWidth*0.77;
		this._helpWindow.height = Graphics.boxHeight*0.167;
		this._helpWindow.x = 0;
		this._helpWindow.y = 0;
		// category selection window
		this._skillTypeWindow.width = Graphics.boxWidth*0.23;
		this._skillTypeWindow.height = Graphics.boxHeight*0.3;
		this._skillTypeWindow.x = Graphics.boxWidth*0.77;
		this._skillTypeWindow.y = Graphics.boxHeight*0.05;
		// status window shows all the effects of item with the icon
        this._statusWindow.x = 0;
        this._statusWindow.y = this._helpWindow.height;
        this._statusWindow.width = Graphics.boxWidth*0.78;
        this._statusWindow.height = Graphics.boxHeight*0.28;
		// action window shows action to item, overlay with info
        this._itemWindow.x = Graphics.boxWidth*0.06;
        this._itemWindow.y = Graphics.boxHeight*0.46;
        this._itemWindow.width = Graphics.boxWidth*0.89;
        this._itemWindow.height = Graphics.boxHeight*0.53;

    };

    var _Scene_Equip_create = Scene_Equip.prototype.create;
    Scene_Equip.prototype.create = function() {
        _Scene_Equip_create.call(this);
        this._helpWindow.opacity = masterOpacity;
        this._statusWindow.opacity = masterOpacity;
        this._commandWindow.opacity = masterOpacity;
        this._slotWindow.opacity = masterOpacity;
        this._itemWindow.opacity = masterOpacity;
        this._compareWindow.opacity = masterOpacity;
		// help window location
		this._helpWindow.width = Graphics.boxWidth*0.77;
		this._helpWindow.height = Graphics.boxHeight*0.167;
		this._helpWindow.x = 0;
		this._helpWindow.y = 0;
		// command 
		this._commandWindow.width = Graphics.boxWidth*0.23;
		this._commandWindow.height = Graphics.boxHeight*0.45;
		this._commandWindow.x = Graphics.boxWidth*0.77;
		this._commandWindow.y = 0;
		// status window 
        this._statusWindow.x = 0;
        this._statusWindow.y = this._helpWindow.height;
        this._statusWindow.width = Graphics.boxWidth*0.78;
        this._statusWindow.height = Graphics.boxHeight*0.28;
		// current equip
		this._itemWindow.x = Graphics.boxWidth*0.55;
		this._itemWindow.y = Graphics.boxHeight*0.46;
		this._itemWindow.width = Graphics.boxWidth*0.4;
		this._itemWindow.height = Graphics.boxHeight*0.53;
		this._slotWindow.x = this._itemWindow.x;
		this._slotWindow.y = this._itemWindow.y;
		this._slotWindow.width = this._itemWindow.width;
		this._slotWindow.height = this._itemWindow.height;
		// compare window showing how it updates
        this._compareWindow.x = Graphics.boxWidth*0.01;
        this._compareWindow.y = Graphics.boxHeight*0.48;
        this._compareWindow.width = Graphics.boxWidth*0.48;
        this._compareWindow.height = Graphics.boxHeight*0.52;

    };


//item synthesis
    var _Scene_Synthesis_create = Scene_Synthesis.prototype.create;
    Scene_Synthesis.prototype.create = function() {
        _Scene_Synthesis_create.call(this);
        this._helpWindow.opacity = masterOpacity;
        this._statusWindow.opacity = masterOpacity;
        this._commandWindow.opacity = masterOpacity;
        this._listWindow.opacity = masterOpacity;
        this._goldWindow.opacity = masterOpacity;
        this._ingredientsWindow.opacity = masterOpacity;
		this._numberWindow.opacity = masterOpacity;
		// help window location
        this._helpWindow.x = 250;
        this._helpWindow.y = 0;
        this._helpWindow.width = 774;
        this._helpWindow.height = 120;
		// command 
		this._commandWindow.x = 0
		this._commandWindow.y = 0
		this._commandWindow.width = 240;
		this._commandWindow.height = 160;
		// status window  hide outside window
        this._statusWindow.x = Graphics.boxWidth;
        this._statusWindow.y = Graphics.boxHeight;
		// list window
		this._listWindow.x = 60
		this._listWindow.y = 210
		this._listWindow.width = 360;
		this._listWindow.height = 410;
		// list window
		this._ingredientsWindow.x = 500
		this._ingredientsWindow.y = 130
		//this._ingredientsWindow.width = 480;
		//this._ingredientsWindow.height = 630;
		// number window
		
		this._numberWindow.x = 500
		this._numberWindow.y = 180
	//	this._numberWindow.width = 470;
		this._numberWindow.height = 380;
    };


	Scene_Synthesis.prototype.createIngredientsWindow = function() {
    var wx = this._listWindow.width;
    var wy = this._listWindow.y;
    var ww = 460;
    var wh = 450;
    this._ingredientsWindow = new Window_SynthesisIngredients(wx, wy, ww, wh);
    this._listWindow._ingredients = this._ingredientsWindow;
    this.addWindow(this._ingredientsWindow);
};

    var _Scene_Synthesis_createBackground = Scene_Synthesis.prototype.createBackground;
    Scene_Synthesis.prototype.createBackground = function(){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadSystem('menu_craft');
            this.addChild(this._backgroundSprite);
            return;
    };

/*
	var _Scene_Status_create = Scene_Status.prototype.create;
    Scene_Status.prototype.create = function() {
        _Scene_Status_create.call(this);
        this._statusWindow.opacity = 0;
    };

    var _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.call(this);
        this._optionsWindow.opacity = 0;
    };

    var _Scene_GameEnd_create = Scene_GameEnd.prototype.create;
    Scene_GameEnd.prototype.create = function() {
        _Scene_GameEnd_create.call(this);
        this._commandWindow.opacity = 0;
    };
*/

    var _Scene_File_create = Scene_File.prototype.create;
    Scene_File.prototype.create = function() {
        _Scene_File_create.call(this);
        this._helpWindow.opacity = 0;
        this._listWindow.opacity = 0;
    };
    //
    // load bitmap that set in plugin parameter
    //
    var _Scene_Menu_createBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function(){
        if(bgBitmapMenu){
            this._backgroundSprite = new Sprite();
//            this._backgroundSprite.bitmap =
//             ImageManager.loadPicture(bgBitmapMenu);
            this._backgroundSprite.bitmap =
             ImageManager.loadSystem(bgBitmapMenu);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Menu_createBackground.call(this);
    };

    var _Scene_Item_createBackground = Scene_Item.prototype.createBackground;
    Scene_Item.prototype.createBackground = function(){
        if(bgBitmapItem){
            this._backgroundSprite = new Sprite();
//            this._backgroundSprite.bitmap =
//             ImageManager.loadPicture(bgBitmapItem);
            this._backgroundSprite.bitmap =
             ImageManager.loadSystem(bgBitmapItem);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Item_createBackground.call(this);
    };

    var _Scene_Skill_createBackground = Scene_Skill.prototype.createBackground;
    Scene_Skill.prototype.createBackground = function(){
        if(bgBitmapSkill){
            this._backgroundSprite = new Sprite();
//            this._backgroundSprite.bitmap =
//             ImageManager.loadPicture(bgBitmapSkill);
            this._backgroundSprite.bitmap =
             ImageManager.loadSystem(bgBitmapSkill);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Skill_createBackground.call(this);
    };

    var _Scene_Equip_createBackground = Scene_Equip.prototype.createBackground;
    Scene_Equip.prototype.createBackground = function(){
        if(bgBitmapEquip){
            this._backgroundSprite = new Sprite();
//            this._backgroundSprite.bitmap =
//             ImageManager.loadPicture(bgBitmapEquip);
            this._backgroundSprite.bitmap =
             ImageManager.loadSystem(bgBitmapEquip);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Equip_createBackground.call(this);
    };

    var _Scene_Status_createBackground =
     Scene_Status.prototype.createBackground;
    Scene_Status.prototype.createBackground = function(){
        if(bgBitmapStatus){
            this._backgroundSprite = new Sprite();
//            this._backgroundSprite.bitmap =
//             ImageManager.loadPicture(bgBitmapStatus);
            this._backgroundSprite.bitmap =
             ImageManager.loadSystem(bgBitmapStatus);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Status_createBackground.call(this);
    };

    var _Scene_Options_createBackground =
     Scene_Options.prototype.createBackground;
    Scene_Options.prototype.createBackground = function(){
        if(bgBitmapOptions){
            this._backgroundSprite = new Sprite();
//            this._backgroundSprite.bitmap =
//             ImageManager.loadPicture(bgBitmapOptions);
            this._backgroundSprite.bitmap =
             ImageManager.loadSystem(bgBitmapOptions);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Options_createBackground.call(this);
    };

    var _Scene_File_createBackground = Scene_File.prototype.createBackground;
    Scene_File.prototype.createBackground = function(){
        if(bgBitmapFile){
            this._backgroundSprite = new Sprite();
//            this._backgroundSprite.bitmap =
//             ImageManager.loadPicture(bgBitmapFile);
            this._backgroundSprite.bitmap =
             ImageManager.loadSystem(bgBitmapFile);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_File_createBackground.call(this);
    };

    var _Scene_GameEnd_createBackground =
     Scene_GameEnd.prototype.createBackground;
    Scene_GameEnd.prototype.createBackground = function(){
        if(bgBitmapGameEnd){
            this._backgroundSprite = new Sprite();
//            this._backgroundSprite.bitmap =
//             ImageManager.loadPicture(bgBitmapGameEnd);
            this._backgroundSprite.bitmap =
             ImageManager.loadSystem(bgBitmapGameEnd);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_GameEnd_createBackground.call(this);
    };

    //
    // alt menu screen processes
    //
/*
    Window_MenuCommand.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_MenuCommand.prototype.maxCols = function() {
        return 4;
    };

    Window_MenuCommand.prototype.numVisibleRows = function() {
        return rowsCommandWnd;
    };
*/
    Window_MenuCommand.prototype.lineHeight = function() {
        return 60;
    };

    Window_SkillType.prototype.lineHeight = function() {
        return 64;
    };

	Window_MenuCommand.prototype.itemTextAlign = function() {
		return "center";
	};

	Window_MenuCommand.prototype.windowWidth = function() {
	   return 200;
	};

    Window_MenuStatus.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_MenuStatus.prototype.windowHeight = function() {
   //     var h1 = this.fittingHeight(1);
   //    var h2 = this.fittingHeight(rowsCommandWnd);
        return Graphics.boxHeight; // - h1 - h2;
    };

    Window_MenuStatus.prototype.maxCols = function() {
        return maxColsMenuWnd;
    };

    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 1;
    };
//limit to first 4
//	Window_MenuStatus.prototype.maxItems = function() {
//    return Math.min(4,$gameParty.size());
//	};
//limit item/skill effect to battle members
Scene_ItemBase.prototype.itemTargetActors = function() {
    var action = new Game_Action(this.user());
    action.setItemObject(this.item());
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return $gameParty.battleMembers();  //limit to battle only
    } else {
        return [$gameParty.members()[this._actorWindow.index()]];
    }
};	

Window_MenuStatus.prototype.loadImages = function() {
    $gameParty.members().forEach(function(actor) {
        ImageManager.loadFace(actor.faceName());
		//preload stand pic
		  var bitmapName = $dataActors[actor.actorId()].meta.stand_picture;
		  if (bitmapName) {
			  ImageManager.loadSystem(bitmapName);
		  }
    }, this);
};

//copy preload function

	
    Window_MenuStatus.prototype.drawItemImage = function(index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        // load stand_picture
        var bitmapName = $dataActors[actor.actorId()].meta.stand_picture;
//        var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
		        var bitmap = bitmapName ? ImageManager.loadSystem(bitmapName) : null;
        var w = Math.min(rect.width, (bitmapName ? bitmap.width : 144));
        var h = Math.min(rect.height, (bitmapName ? bitmap.height : 144));
        var lineHeight = this.lineHeight();
        
        if(bitmap){
            var sx = (bitmap.width > w) ? (bitmap.width - w) / 2 : 0;
            var sy = (bitmap.height > h) ? (bitmap.height - h) / 2 : 0;
            var dx = (bitmap.width > rect.width) ? rect.x :
                rect.x + (rect.width - bitmap.width) / 2;
            var dy = (bitmap.height > rect.height) ? rect.y :
                rect.y + (rect.height - bitmap.height) / 2;
			bitmap.addLoadListener(function() {
				this.contents.blt(bitmap, sx, sy, w, h, dx, dy);
			}.bind(this));		
		//this.changePaintOpacity(actor.isBattleMember());            
        } else { // when bitmap is not set, do the original process.
            this.drawActorFace(actor, rect.x, rect.y + lineHeight * 2.5, w, h);
        }
        this.changePaintOpacity(true);
		   

    };
	
    Window_MenuStatus.prototype.drawItemStatus = function(index) {
        if(!isDisplayStatus){
            return;
        }
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        var x = rect.x ;
        var y = rect.y ;
        var width = rect.width;
		var dx = 132;
        var bottom = y + rect.height;
        var lineHeight = 30;//this.lineHeight();
        //this.drawActorName(actor, x, y + lineHeight * 0, width);
        this.drawActorLevelBG(actor, x + 0.5* width -110, y + lineHeight * 1 - 14, width);
      //  this.drawActorClass(actor, x, bottom - lineHeight * 4, width);
       this.drawActorEXP2(actor, x+ 0.5* width -65, bottom - lineHeight * 5, dx);
        this.drawActorHp(actor, x + 0.5* width -65, bottom - lineHeight * 4, dx);
        this.drawActorTp(actor, x+ 0.5* width -65, bottom - lineHeight * 3, dx);
        this.drawActorMp(actor, x+ 0.5* width -65, bottom - lineHeight * 2, dx);
    //    this.drawActorIcons(actor, x, bottom - lineHeight * 1, width);
		this.drawActorIconsM(actor, x+ 0.5* width -69, y +62, Window_Base._iconWidth*3);
    };

    var _Window_MenuActor_initialize = Window_MenuActor.prototype.initialize;
    Window_MenuActor.prototype.initialize = function() {
        _Window_MenuActor_initialize.call(this);
        this.y = 0;//this.fittingHeight(2);
    };






//shop menu

    var _Scene_Shop_createBackground = Scene_Shop.prototype.createBackground;
    Scene_Shop.prototype.createBackground = function(){
            this._backgroundSprite = new Sprite();
//            this._backgroundSprite.bitmap =
//             ImageManager.loadPicture(bgBitmapFile);
            this._backgroundSprite.bitmap =
             ImageManager.loadSystem('menu_shop');
            this.addChild(this._backgroundSprite);
            return;

    };


    var _Scene_Shop_create = Scene_Shop.prototype.create;
    Scene_Shop.prototype.create = function() {
        _Scene_Shop_create.call(this);
         this._helpWindow.opacity = masterOpacity;
		 this._commandWindow.opacity = masterOpacity;
		 this._goldWindow.opacity = masterOpacity;
		 this._buyWindow.opacity = masterOpacity;
		 this._sellWindow.opacity = masterOpacity;
		 this._categoryWindow.opacity = masterOpacity;
		 this._infoWindow.opacity = masterOpacity;
 		 this._dummyWindow.opacity = masterOpacity;
  		// this._actorWindow.opacity = masterOpacity;
		 this._statusWindow.opacity = masterOpacity;
		 this._numberWindow.opacity = masterOpacity;
		// command window for list of commands
		this._commandWindow.x = 0
		this._commandWindow.y = 0
		this._commandWindow.width = 240;
		this._commandWindow.height = 250;
/*
	  this._goldWindow.x = Graphics.boxWidth - 240;
      this._goldWindow.y = Graphics.boxHeight - 72;
      this._goldWindow.height = 72;
	  this._goldWindow.width = 240;
*/
		//category
        this._categoryWindow.x = this._commandWindow.x;
        this._categoryWindow.y = this._commandWindow.y;
        this._categoryWindow.width = this._commandWindow.width;
        this._categoryWindow.height = this._commandWindow.height;
		// info window for description
        this._helpWindow.x = 250;
        this._helpWindow.y = 0;
        this._helpWindow.width = 774;
        this._helpWindow.height = 120;
		// info window detailed
        this._infoWindow.x = 235;
        this._infoWindow.y = 105;
        this._infoWindow.width = 789;
        this._infoWindow.height = 200;
		// dummy window for location
        this._dummyWindow.x = 50;
        this._dummyWindow.y = 290;
        this._dummyWindow.width = 540;
        this._dummyWindow.height = 340;
		// dummy window for status
        this._statusWindow.x = 610;
        this._statusWindow.y = 300;
        this._statusWindow.width = 410;
        this._statusWindow.height = 320-40;
		// buy/sell window for location
        this._buyWindow.x = this._dummyWindow.x;
        this._buyWindow.y = this._dummyWindow.y;
        this._buyWindow.width = this._dummyWindow.width;
        this._buyWindow.height = this._dummyWindow.height;
        this._sellWindow.x = this._dummyWindow.x;
        this._sellWindow.y = this._dummyWindow.y;
        this._sellWindow.width = this._dummyWindow.width;
        this._sellWindow.height = this._dummyWindow.height;
        this._numberWindow.x = this._dummyWindow.x;
        this._numberWindow.y = this._dummyWindow.y;
        this._numberWindow.width = this._dummyWindow.width;
        this._numberWindow.height = this._dummyWindow.height;

    };



})();

Window_ShopNumber.prototype.windowWidth = function() {
    return 540;
};
Window_ShopCommand.prototype.lineHeight = function() {
        return 45;
};
Window_ShopStatus.prototype.drawActorEquipInfo = function(x, y, actor) {
    var enabled = actor.canEquip(this._item);
    this.changePaintOpacity(enabled);
    this.resetTextColor();
    this.resetFontSettings();
    this.contents.fontSize = Yanfly.Param.ShopStatFontSize;
    this.drawText(actor.name(), x, y, this.contents.width - x);
    var item1 = this.currentEquippedItem(actor, this._item.etypeId);
    if (enabled) {
      this.contents.fontSize = Yanfly.Param.ShopStatFontSize;
      this.drawActorParamChange(x, y, actor, item1);
    } else {
      this.contents.fontSize = Yanfly.Param.ShopCantSize;
      var ww = this.contents.width - this.textPadding();
      this.drawText(Yanfly.Param.ShopCantEquip, x, y, ww, 'right');
    }
    this.changePaintOpacity(true);
};