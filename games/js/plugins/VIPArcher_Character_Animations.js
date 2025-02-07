//=============================================================================
// VIPArcher_Character_Animations.js edited by doranikofu
//=============================================================================
/*:
 * @plugindesc 行走图动画扩展，八方向|奔跑|待机|多帧
 * @author VIPArcher
 *
 * @param Dir8_Flag
 * @desc 素材使用该脚本的标志
 * @default %
 *
 * @param Frames_Flag
 * @desc 设置帧数的标志
 * @default #
 *
 * @param Stand_Wait
 * @desc 站立等待时长(帧)
 * @default 5
 *
 * @param Idle_Wait
 * @desc 待机动画开始等待时长(帧) 从站立等待之后开始计算 
 * @default 120
 *
 * @param SDir8_Flag
 * @desc 静态八向npc的图片标志
 * @default S8
 * @help 使用该脚本的行走图素材文件名前面添加一个标志：默认为 %
 * 文件名的名为规范(默认设置)如下：
 * %VIPArcher.png , 素材为2*4的标志素材
 * 第一行：第一个格子是四方向，第二个格子是四方向奔跑，第三个是四方向待机；//doranikofu edit 顺序改成：待机-行走-奔跑
 * 第二行：第一个格子是八方向，第二个格子是八方向奔跑，第三个是八方向待机；
 *
 * 使用多帧则名为(默认设置): 文件名#帧数,默认帧.png
 * 例如 %VIPArcher#6,3.png
 * //doranikofu edit
 * 默认帧设为0，单帧待机npc把默认帧设为最大帧数
 *
 * add another parameter to turn on/off walk/run animation
 * filename#x,y,z.png
 * only use idle z=0; use idle and walk z=1; use all z=2
 */
(function() {
    var parameters = PluginManager.parameters('VIPArcher_Character_Animations');
    var dir8_flag  = String(parameters['Dir8_Flag']   || '%');
    var frame_flag = String(parameters['Frames_Flag'] || '#');
    var stand_wait = String(parameters['Stand_Wait']  || '5');
    var idle_wait = String(parameters['Idle_Wait']  || '120');
    var sdir8_flag  = String(parameters['SDir8_Flag']   || 'S8');
    ImageManager.isDir8Character = function(filename) {
        var reg = new RegExp("^\[\\!\\$\\" + dir8_flag + ']+');
        var sign = filename.match(reg);
        return sign && sign[0].contains(dir8_flag);
    };
//doranikofu edit: new flag for stationary dir8 NPC
    ImageManager.isSD8Character = function(filename) {
        var reg = new RegExp("^\[\\!\\$\\" + sdir8_flag + ']+');
        var sign = filename.match(reg);
        return sign && sign[0].contains(sdir8_flag);
    };
    var _Game_CharacterBaseinitMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBaseinitMembers.call(this);
        this._standWait = 0;
		this._stepstop = false;	//doranikofu stop cylcing idle anime flag
       //doranikofu		this._isStand = false;
		this._isStand = true;
        this._isDir8Character = false;
        this._isSD8Character = false;
		//doranikofu
		this._isWalkRun = 0;
    };
    var _Game_CharacterBasesetImage = Game_CharacterBase.prototype.setImage;
    Game_CharacterBase.prototype.setImage = function(characterName, characterIndex) {
        _Game_CharacterBasesetImage.call(this, characterName, characterIndex);
        this.getCharacterMaxFrame(characterName);
        if (ImageManager.isDir8Character(characterName)) {
            this._characterIndex  = 0;
            this._isDir8Character = true;
        };
//doranikofu
        if (ImageManager.isSD8Character(characterName)) {
            this._isSD8Character = true;
        };
    };
    var _Game_CharacterBaseupdate = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        _Game_CharacterBaseupdate.call(this);
	  if (this._isWalkRun > 0 || $gameMap.menuCalling) { 
        if (this.isMoving()) {
            this._standWait = 0;
            this._isStand = false;
            if (this._isDir8Character) { this._stepAnime = false };
        } else { 
				this._standWait += 1;	
			if (this._standWait == parseInt(stand_wait)) {		//doranikofu
                this._isStand = true;							//
				this._pattern = this._formerPattern;			//reset to default frame after switching to idle to avoid big pose jumps
				this._stepstop = false;							// reset flag
			};													//

				if (this._formerPattern > 1 && this._isStand) {
					this._stepAnime = false;//true;
					this._pattern = this._formerPattern;
					if ($gameSwitches.value(5))
					{this._standWait = 0;}
				} else {
					if (this._standWait > parseInt(stand_wait) ) {
						if ($gameSwitches.value(5))	{//switch 5 to disable idle animation
							this._stepAnime = false;
							this._pattern = this._formerPattern;
							this._standWait = 0;
						} else {
							if (this._standWait > (parseInt(stand_wait) + parseInt(idle_wait))) {	//doranikofu add idle wait
								this._stepAnime = true;
								if (this._pattern == this._maxFrame - 1) this._stepstop = true;
								if (this._stepstop) this._pattern = this._maxFrame - 1;
								};
						};
					};
				};

        };
	  };
    };
    var _Game_CharacterBasemoveDiagonally = Game_CharacterBase.prototype.moveDiagonally;
    Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
        _Game_CharacterBasemoveDiagonally.call(this, horz, vert);
        if (horz > 5) {
            vert > 5 ? this.setDirection(9) : this.setDirection(3);
        } else {
            vert > 5 ? this.setDirection(7) : this.setDirection(1);
        };
    };
    Game_CharacterBase.prototype.getCharacterMaxFrame = function(characterName) {
        var framedate = characterName.match(new RegExp(frame_flag + "(\\d+)-(\\d+)-(\\d+)")); //add another parameter
        if (framedate) {
            this._maxFrame = parseInt(framedate[1]);
            this._formerPattern = parseInt(framedate[2]);
			//doranikofu
			this._isWalkRun = parseInt(framedate[3]);
        } else{
            this._maxFrame = 3;
            this._formerPattern = 1;
			this._isWalkRun = 0;
        };
    };
    Game_CharacterBase.prototype.pattern = function() {
        return this._pattern < this.maxFrame() ? this._pattern : this._formerPattern;
    };
    Game_CharacterBase.prototype.maxFrame = function() {
        return this._maxFrame;
    };
    Game_CharacterBase.prototype.maxPattern = function() {
        if (this._maxFrame === 3) {
            return 4;
        } else {
            return this._maxFrame;
        };
    };
//doranikofu, reduce empty file size to minimize memory use
    Game_CharacterBase.prototype.maxBlockX = function() {
        if (this._isDir8Character) {
            return (this._isWalkRun + 1);
        } else {
            return 4;
        };
    };

    Game_CharacterBase.prototype.isOriginalPattern = function() {
        return this.pattern() === this._formerPattern;
    };
    Game_CharacterBase.prototype.resetPattern = function() {
		//stationary dir8 used for storyline, do not need reset
		if (!this._isSD8Character) {
        this.setPattern(this._formerPattern);
		}
    };
    Game_CharacterBase.prototype.isFast = function() {
        return (this._standWait < 2 && (this.isDashing() || this._moveSpeed > 4)) && (this._isWalkRun > 1);
    };
    Game_CharacterBase.prototype.isStand = function() {
        return this._isStand;
    };

//doranikofu edit frame play speed, more frame faster play
Game_CharacterBase.prototype.updateAnimationCount = function() {
    if (this.isMoving() && this.hasWalkAnime()) {
        this._animationCount += (1.5 + (this.maxPattern()-4)/6);
    } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
        this._animationCount += (1 + (this.maxPattern()-4)/12);
    }
};
//

    Game_CharacterBase.prototype.setCharacterIndex = function(index) {
        this._characterIndex = index;
    };
    Game_Player.prototype.moveByInput = function() {
        if (!this.isMoving() && this.canMove()) {
            var direction = Input.dir8;
            if (direction > 0) {
                $gameTemp.clearDestination();
            } else if ($gameTemp.isDestinationValid()){
                var x = $gameTemp.destinationX();
                var y = $gameTemp.destinationY();
                direction = this.findDirectionTo(x, y);
            }
            if (direction > 0) {
                if (direction % 2 == 0){
                    this.moveStraight(direction);
                    return;
                }
                if (direction < 5){
                    this.moveDiagonally(direction + 3 , 2);
                } else {
                    this.moveDiagonally(direction - 3 , 8);
                }
            }
        }
    };
    var _Game_PlayermoveDiagonally = Game_Player.prototype.moveDiagonally;
    Game_Player.prototype.moveDiagonally = function(horz, vert) {
        if (!this.canPass(this._x, this._y, horz) && !this.canPass(this._x, this._y, vert)){
            this.setMovementSuccess(false);
            return;
        }
        if (this.canPass(this._x, this._y, horz) && !this.canPass(this._x, this._y, vert)){
            this.moveStraight(horz);
            return;
        }
        if (this.canPass(this._x, this._y, vert) && !this.canPass(this._x, this._y, horz)){
            this.moveStraight(vert);
            return;
        }
        if (!this.canPassDiagonally(this._x, this._y, horz, vert)) {
            if (Math.random() > 0.5){
                this.setDirection(vert); this.moveStraight(vert);
            } else {
                this.setDirection(horz); this.moveStraight(horz);
            }
            return;
        }
        _Game_PlayermoveDiagonally.call(this, horz, vert);
    };
    Sprite_Character.prototype.characterPatternY = function() {
        if (this._character.direction() % 2 == 0){
            if (this._character._isDir8Character){
                this._character.setCharacterIndex(this._character.isFast() ? 2 : this._character.isStand() ? 0 : 1);	//doranikofu changed index
            };
            return (this._character.direction() - 2) / 2;
        } else {
            if (this._character._isDir8Character){
                this._character.setCharacterIndex(this._character.isFast() ? 6 : this._character.isStand() ? 4 : 5);	//doranikofu changed index
			};
            return parseInt(this._character.direction() / 3);
        }
    };
    Sprite_Character.prototype.patternWidth = function() {
        if (this._tileId > 0) {
            return $gameMap.tileWidth();
        } else if (this._isBigCharacter) {
            return this.bitmap.width / this._character.maxFrame();
        } else {
            return this.bitmap.width / (this._character.maxFrame() * this._character.maxBlockX());	//doranikofu reduce file size
        }
    };
    Sprite_Character.prototype.characterBlockX = function() {
        if (this._isBigCharacter) {
            return 0;
        } else {
            var index = this._character.characterIndex();
            return (index % 4) * this._character.maxFrame();
        }
    };
//doranikofu edit, add for stationary dir8
Sprite_Character.prototype.characterBlockY = function() {
    if (this._isBigCharacter) {
        return 0;
    } else if (this._character._isSD8Character)
    {
        var index = this._character.direction();
		return (index%2 == 0 ? 0 : 4);
    } else {
		  var index = this._character.characterIndex();
		  return Math.floor(index / 4) * 4;
    }
};
})();