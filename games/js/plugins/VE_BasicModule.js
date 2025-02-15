/*
 * ==============================================================================
 * ** Victor Engine MV - Basic Module
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.11.26 > First release.
 *  v 1.01 - 2015.11.29 > Added function to get database objects.
 *  v 1.02 - 2015.12.07 > Added function to get multiples elements.
 *                      > Added check for plugin correct order.
 *  v 1.03 - 2015.12.13 > Added function to get page comments.
 *  v 1.04 - 2015.12.21 > Added function to check only relevant objects.
 *  v 1.05 - 2015.12.25 > Added check to wait bitmap loading.
 *  v 1.06 - 2015.12.31 > Added rgb to hex and hex to rgb functions.
 *                      > Added function to get plugins parameters.     
 *  v 1.07 - 2016.01.07 > Fixed issue with plugin order checks.
 *  v 1.08 - 2016.01.17 > Added function to get BattleLog method index.
 *                      > Added function to insert methods on BattleLog.
 *  v 1.09 - 2016.01.24 > Added function to set wait for animations.
 *  v 1.10 - 2016.02.05 > Added function to get values from regex.
 *  v 1.11 - 2016.02.10 > Added function to capitalize texts.
 *                      > Added Plugin Parameter to set trait display names.
 *  v 1.12 - 2016.02.18 > Added function to get parameter names.
 *  v 1.13 - 2016.02.26 > Added functions to setup battler direction.
 *  v 1.14 - 2016.03.15 > Added functions to check opponents.
 *  v 1.15 - 2016.03.18 > Added function for compatibility with YEP.
 *  v 1.16 - 2016.03.23 > Added function to replace mathods.
 *                        Added functions for dynamic motions.
 *  v 1.17 - 2016.04.01 > Fixed issue with battler sprite check.
 *  v 1.18 - 2016.04.21 > Fixed issue with damage popup on action user.
 *  v 1.19 - 2016.04.30 > Added function to get evaluated font color.
 *  v 1.20 - 2016.05.12 > Added function to get width of text with escape codes.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Basic Module'] = '1.20';

var VictorEngine = VictorEngine || {};
VictorEngine.BasicModule = VictorEngine.BasicModule || {};

(function() {
	
	VictorEngine.BasicModule.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.BasicModule.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Basic Module');
	};
	
	PluginManager.requiredPlugin = function(name, required, version) {
		VictorEngine.BasicModule.checkPlugins(name, required, version);
	};

})();

/*:
 * ------------------------------------------------------------------------------
 * @plugindesc v1.20 - Plugin with base code required for all Victor Engine plugins.
 * @author Victor Sant
 *
 * @param == Trait Names ==
 *
 * @param Hit Rate Name
 * @desc 'Hit Rate' Ex-Parameter name shown on windows.
 * @default Hit
 *
 * @param Evasion Rate Name
 * @desc 'Evasion Rate' Ex-Parameter name shown on windows.
 * @default Evasion 
 *
 * @param Critical Rate Name
 * @desc 'Critical Rate' Ex-Parameter name shown on windows.
 * @default Critical
 *
 * @param Critical Evasion Name
 * @desc 'Critical Evasion' Ex-Parameter name shown on windows.
 * @default C. Evasion
 *
 * @param Magic Evasion Name
 * @desc 'Magic Evasion' Ex-Parameter name shown on windows.
 * @default M. Evasion
 *
 * @param Magic Reflection Name
 * @desc 'Magic Reflection' Ex-Parameter name shown on windows.
 * @default M. Reflection
 *
 * @param Counter Attack Name
 * @desc 'Counter Attack' Ex-Parameter name shown on windows.
 * @default Counter
 *
 * @param HP Regeneration Name
 * @desc 'HP Regeneration' Ex-Parameter name shown on windows.
 * @default HP Regen
 *
 * @param MP Regeneration Name
 * @desc 'MP Regeneration' Ex-Parameter name shown on windows.
 * @default MP Regen
 *
 * @param TP Regeneration Name
 * @desc 'TP Regeneration' Ex-Parameter name shown on windows.
 * @default TP Regen
 *
 * @param Target Rate Name
 * @desc 'Target Rate' Sp-Parameter name shown on windows.
 * @default Target Rate
 *
 * @param Guard Rate Name
 * @desc 'Guard Rate' Sp-Parameter name shown on windows.
 * @default Guard Rate
 &
 * @param Recovery Effect Name
 * @desc 'Recovery Effect' Sp-Parameter name shown on windows.
 * @default Recovery
 *
 * @param Pharmacology Name
 * @desc 'Pharmacology' Sp-Parameter name shown on windows.
 * @default Pharmacology
 *
 * @param MP Cost Rate Name
 * @desc 'MP Cost Rate' Sp-Parameter name shown on windows.
 * @default MP Cost
 *
 * @param TP Charge Rate Name
 * @desc 'TP Charge Rate' Sp-Parameter name shown on windows.
 * @default TP Charge
 *
 * @param Physical Damage Name
 * @desc 'Physical Damage' Sp-Parameter name shown on windows.
 * @default Physical Damage
 *
 * @param Magical Damage Name
 * @desc 'Magical Damage' Sp-Parameter name shown on windows.
 * @default Magical Damage
 *
 * @param Floor Damage Name
 * @desc 'Floor Damage' Sp-Parameter name shown on windows.
 * @default Floor Damage
 *
 * @param Experience Rate Name
 * @desc 'Experience Rate' Sp-Parameter name shown on windows.
 * @default Exp. Rate
 *
 * ------------------------------------------------------------------------------
 * @help 
 * ------------------------------------------------------------------------------
 * Install this plugin above any other Victor Engine plugin.
 * ------------------------------------------------------------------------------
 */
 
(function() {
			
	//=============================================================================
	// Parameters
	//=============================================================================
	
	VictorEngine.getPluginParameters = function() {
		var script = document.currentScript || (function() {
			var scripts = document.getElementsByTagName('script');
			return scripts[scripts.length - 1];
		})();
		var start = script.src.lastIndexOf('/') + 1;
		var end   = script.src.indexOf('.js');
		return PluginManager.parameters(script.src.substring(start, end));
	}

	var parameters = VictorEngine.getPluginParameters();
	VictorEngine.Parameters = VictorEngine.Parameters || {};
	VictorEngine.Parameters.BasicModule = {};
	VictorEngine.Parameters.BasicModule.hit = String(parameters["Hit Rate Name"]).trim();
	VictorEngine.Parameters.BasicModule.eva = String(parameters["Evasion Rate Name"]).trim();
	VictorEngine.Parameters.BasicModule.cri = String(parameters["Critical Rate Name"]).trim();
	VictorEngine.Parameters.BasicModule.cev = String(parameters["Critical Evasion Name"]).trim();
	VictorEngine.Parameters.BasicModule.hev = String(parameters["Magic Evasion Name"]).trim();
	VictorEngine.Parameters.BasicModule.mrf = String(parameters["Magic Reflection Name"]).trim();
	VictorEngine.Parameters.BasicModule.cnt = String(parameters["Counter Attack Name"]).trim();
	VictorEngine.Parameters.BasicModule.hrg = String(parameters["HP Regeneration Name"]).trim();
	VictorEngine.Parameters.BasicModule.mrg = String(parameters["MP Regeneration Name"]).trim();
	VictorEngine.Parameters.BasicModule.trg = String(parameters["TP Regeneration Name"]).trim();
	VictorEngine.Parameters.BasicModule.tgr = String(parameters["Target Rate Name"]).trim();
	VictorEngine.Parameters.BasicModule.grd = String(parameters["Guard Rate Name"]).trim();
	VictorEngine.Parameters.BasicModule.rec = String(parameters["Recovery Effect Name"]).trim();
	VictorEngine.Parameters.BasicModule.pha = String(parameters["Pharmacology Name"]).trim();
	VictorEngine.Parameters.BasicModule.mcr = String(parameters["MP Cost Rate Name"]).trim();
	VictorEngine.Parameters.BasicModule.tcr = String(parameters["TP Charge Rate Name"]).trim();
	VictorEngine.Parameters.BasicModule.pdr = String(parameters["Physical Damage Name"]).trim();
	VictorEngine.Parameters.BasicModule.mdr = String(parameters["Magical Damage Name"]).trim();
	VictorEngine.Parameters.BasicModule.fdr = String(parameters["Floor Damage"]).trim();
	VictorEngine.Parameters.BasicModule.ext = String(parameters["Experience"]).trim();
	
	//=============================================================================
	// DataManager
	//=============================================================================

	VictorEngine.BasicModule.isDatabaseLoaded = DataManager.isDatabaseLoaded;
	DataManager.isDatabaseLoaded = function() {
		if (!VictorEngine.BasicModule.isDatabaseLoaded.call(this)) return false;
		VictorEngine.loadParameters();
		VictorEngine.loadNotetags();
		return ImageManager.isReady();
	};

	//=============================================================================
	// VictorEngine
	//=============================================================================
	
	VictorEngine.BasicModule.checkPlugins = function(name, req, ver) {
		var msg = '';
		this.loadedPlugins = this.loadedPlugins || {};
		if (ver && req && (!Imported[req] || Number(Imported[req]) < Number(ver))) {
			msg += 'The plugin ' + name + ' requires the plugin ' + req;
			msg += ' v' + ver + ' or higher installed to work properly'
			if (Number(Imported[req]) < Number(ver)) {
				msg += '. Your current version is v' + Imported[req];
			}
			msg += '. Go to http://victorenginescripts.wordpress.com/'
			msg += 'to download the updated plugin.';
			throw msg;
		} else if (!ver && req && this.loadedPlugins[req] === true) {
			msg += 'The plugin ' + name + ' requires the plugin ' + req;
			msg += ' to be placed bellow it. Open the Plugin Manager and place';
			msg += ' the plugins in the correct order.';
			throw msg;
		} else if (req && Imported['VE - Basic Module'] && !this.loadedPlugins['VE - Basic Module']) {
			msg += 'The plugin ' + name + ' must be placed bellow the plugin ' + req;
			msg += '. Open the Plugin Manager and place';
			msg += ' the plugins in the correct order.';
			throw msg;
		} else {
			this.loadedPlugins[name] = true
		}
	};

	VictorEngine.loadNotetags = function() {
		if (VictorEngine.BasicModule.loaded) return;
		VictorEngine.BasicModule.loaded = true;
		var list = [$dataActors, $dataClasses, $dataSkills, $dataItems, $dataWeapons, 
					$dataArmors, $dataEnemies, $dataStates];
		list.forEach(function(objects, index) { this.processNotetags(objects, index) }, this);
	};
	
	VictorEngine.processNotetags = function(objects, index) {
		objects.forEach(function(data) {
			if (data) this.loadNotetagsValues(data, index);
		}, this);
	};
	
	VictorEngine.objectSelection = function(index, list) {
		var objects = ['actor', 'class', 'skill', 'item', 'weapon', 'armor', 'enemy', 'state'];
		return list.contains(objects[index]);
	};
	
	VictorEngine.loadNotetagsValues = function(data, index) {
	};
	
	VictorEngine.loadParameters = function() {
	};
	
	VictorEngine.getNotesValues = function(value1, value2) {
		if (!value2) value2 = value1;
		return new RegExp('<' + value1 + '>([\\s\\S]*?)<\\/' + value2 + '>', 'gi');
	};

	VictorEngine.getPageNotes = function(event) {
		var result = (event instanceof Game_CommonEvent) || event.page();
		if (!result || !event.list()) return "";
		return event.list().reduce(function(r, cmd) {
			var valid   = (cmd.code === 108 || cmd.code === 408);
			var comment = valid ? cmd.parameters[0] + "\r\n" : "";
			return r + comment;
		}, "");
	};
	
	VictorEngine.getAllElements = function(subject, item) {
		if (item.damage.elementId < 0) {
			return subject.attackElements();
		} else {
			return [item.damage.elementId];
		}
	};
	
	VictorEngine.getAllStates = function(subject, item) {
		var result;
		return item.effects.reduce(function(r, effect) {
			if (effect.code === 21) {
				if (effect.dataId === 0) {
					result = subject.attackStates();
				} else {
					result = [effect.dataId];
				};
			} else {
				result = [];
			};
            return r.concat(result);
        }, []);
	};
	
	VictorEngine.getNumberValue = function(match, type, base) {
		var regex = new RegExp(type + '[ ]*:[ ]*([+-.\\d]+)', 'gi');
		var value = regex.exec(match);
		return value ? Number(value[1]) : base;
	};

	VictorEngine.getStringValue = function(match, type, base) {
		var regex = new RegExp(type + "[ ]*:[ ]*([\\w ]+)", 'gi');
		var value = regex.exec(match);
		return value ? value[1].trim() : base;
	};
		
	VictorEngine.getAnyValue = function(match, type, base) {
		var regex = new RegExp(type + "[ ]*:[ ]*('[^\']+'|\"[^\"]+\")", 'gi');
		var value = regex.exec(match);
		return value ? value[1].slice(1, -1) : base;
	};
	
	VictorEngine.getNumberValues = function(match, type) {
		var regex  = new RegExp(type + '[ ]*:[ ]*((?:[+-.\\d]+[ ]*,?[ ]*)+)', 'gi');
		var value  = regex.exec(match)
		var result = value ? value[1].match(/\d+/gi) : []
		return result.map(function(id) { return Number(id) });
	};
		
	VictorEngine.getStringValues = function(match, type) {
		var regex  = new RegExp(type + '[ ]*:[ ]*((?:[\\w ]+[ ]*,?[ ]*)+)', 'gi');
		var value  = regex.exec(match)
		var result = value ? value[1].match(/\d+/gi) : []
		return result.map(function(id) { return value[1].trim() });
	};
	
	VictorEngine.captalizeText = function(text) {
		return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	};
	
	VictorEngine.replaceZeros = function(text, value) {
		value = value || '';
		return text.replace(/\b(0(?!\b))+/g, function(a) { return a.replace(/0/g, value); });
	};
	
	VictorEngine.rgbToHex = function(r, g, b) {
		r = Math.floor(r).toString(16).padZero(2);
		g = Math.floor(g).toString(16).padZero(2);
		b = Math.floor(b).toString(16).padZero(2);
		return '#' + r + g + b;
	}
	
	VictorEngine.hexToRgb = function(hex) {
		var r = parseInt(hex[1] + hex[2], 16);
		var g = parseInt(hex[3] + hex[4], 16);
		var b = parseInt(hex[5] + hex[6], 16);
		return [r, g, b];
	}
		
	VictorEngine.methodIndex = function(methods, name) {
		for (var i = 0; i < methods.length; i++) {
			if (methods[i] && methods[i].name === name) return i;
		}
		return null;
	}
	
	VictorEngine.removeMethod = function(methods, name) {
		var index = this.methodIndex(methods, name)
		if (index !== null) methods.splice(index, 1);
	}
	
	VictorEngine.insertMethod = function(methods, index, name, params) {
		if (index !== null) methods.splice(index, 0, { name: name, params: params });
	}
	
	VictorEngine.replaceMethod = function(methods, index, name, params) {
		if (index !== null) methods.splice(index, 1, { name: name, params: params });
	}
	
	VictorEngine.waitAnimation = function(animationId) {
		var animation = $dataAnimations[animationId];
		return (animation) ? animation.frames.length * 4 + 1 : 0;
	};
	
	VictorEngine.params = function() {
		return ['hp', 'mp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
	};
	
	VictorEngine.xparams = function() {
		return ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'];
	};
	
	VictorEngine.sparams = function() {
		return ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'prd', 'mrd', 'frd', 'exr'];
	};
	
	VictorEngine.allParams = function() {
		return this.params().concat(this.xparams(), this.sparams())
	};
	
	VictorEngine.paramName = function(paramId) {
		return this.params()[paramId];
	};
	
	VictorEngine.xparamName = function(xparamId) {
		return this.xparams()[xparamId];
	};
	
	VictorEngine.sparamName = function(sparamId) {
		return this.sparams()[sparamId];
	};
	
	VictorEngine.paramText = function(name) {
		switch (name.toLowerCase()) {
		case 'hit': case 'eva': case 'cri': case 'cev': case 'mev':
		case 'mrf':	case 'cnt': case 'hrg': case 'mrg': case 'trg':
		case 'tgr': case 'grd':	case 'rec': case 'pha': case 'mcr':
		case 'tcr': case 'pdr': case 'mdr':	case 'fdr': case 'ext':
			return this.Parameters.BasicModule[name.toLowerCase()];
		case 'hp': case 'atk': case 'def': case 'agi': 
		case 'mp': case 'mat': case 'mdf': case 'luk': 
			var paramId = this.params().indexOf(name.toLowerCase());
			return TextManager.param(paramId)
		default:
			return this.captalizeText(name.toLowerCase());
		}
	};
	
	//=============================================================================
	// BattleManager
	//=============================================================================
	
	BattleManager.updateStackAction = function(index, subject, target) {
		this._logWindow.saveMethodsStack(index);
		this.clearTargets(target);
        this.invokeAction(subject, target);
		this._logWindow.restoreMethodsStack(index);
	};

	BattleManager.clearTargets = function(target) {
		for (var i = 0; i < this._targets.length; i++) {
			if (this._targets[i] === target) {
				this._targets.splice(i, 1);
				i--;
			}
		}
	};
	
	/* Compatibility with YEP_BattleEngineCore */
	BattleManager.starttActionYEP = function(targets) {
		if (Imported.YEP_BattleEngineCore) {
			this.setTargets(targets);
			this._allTargets = targets.slice();
			this._individualTargets = targets.slice();
			this._phase = 'phaseChange';
			this._phaseSteps = ['setup', 'whole', 'target', 'follow', 'finish'];
			this._returnPhase = '';
			this._actionList = [];
		}
	}
	
	/* Compatibility with YEP_BattleEngineCore */
	BattleManager.removeFinishActionYEP = function() {
		if (Imported.YEP_BattleEngineCore) {
			var index = this._phaseSteps.indexOf('finish');
			this._phaseSteps.splice(index, 1);
		}
	}
	
	//=============================================================================
	// Window_Base
	//=============================================================================
	
	Window_Base.prototype.getFontColor = function(color) {
		if (color.match(/^\#[abcdef\d]{6}/i)) {
			return '"' + color + '"';
		} else {
			return color;
		}
	};
	
	//=============================================================================
	// Game_Unit
	//=============================================================================
	
	Game_Unit.prototype.averageX = function() {
		return this.aliveMembers().reduce(function(r, member) {
			return r + member.screenX();
		}, 0) / this.aliveMembers().length;
	};
	
	//=============================================================================
	// Game_Player
	//=============================================================================
	
	Game_Player.prototype.follower = function(index) {
		return index === 0 ? this : this.followers().follower(index - 1);
	};
	
	//=============================================================================
	// Game_BattlerBase
	//=============================================================================
	
	Game_BattlerBase.prototype.idleMotions = function() {
		return ['wait', 'idle', 'dying', 'abnormal', 'guard', 'chant', 'sleep', 'victory', 'dead'];
	};
	
	Game_BattlerBase.prototype.isIdleMotion = function(motionType) {
		return this.idleMotions().contains(motionType);
	};
	
	Game_BattlerBase.prototype.isFacingDown = function() {
		return this.battlerDirection() === 'down';
	};
	
	Game_BattlerBase.prototype.isFacingLeft = function() {
		return this.battlerDirection() === 'left';
	};
	
	Game_BattlerBase.prototype.isFacingRight = function() {
		return this.battlerDirection() === 'right';
	};
	
	Game_BattlerBase.prototype.isFacingUp = function() {
		return this.battlerDirection() === 'up';
	};
	
	Game_BattlerBase.prototype.faceDown = function() {
		this._battlerDirection = 'down';
	};
	
	Game_BattlerBase.prototype.faceLeft = function() {
		this._battlerDirection = 'left';
	};
	
	Game_BattlerBase.prototype.faceRight = function() {
		this._battlerDirection = 'right';
	};
	
	Game_BattlerBase.prototype.faceUp = function() {
		this._battlerDirection = 'up';
	};
	
	Game_BattlerBase.prototype.opponents = function() {
		return this.isEnemy() ? $gameParty : $gameTroop;
	};
	
	Game_BattlerBase.prototype.isOpponent = function(battler) {
		return this.isEnemy() === !battler.isEnemy();
	};
	
	Game_BattlerBase.prototype.lookForward = function() {
		if (this.screenX() > Graphics.width / 2) {
			this.faceLeft();
		} else {
			this.faceRight();
		}
	};
	
	Game_BattlerBase.prototype.lookBehind = function() {
		if (this.screenX() < Graphics.width / 2) {
			this.faceLeft();
		} else {
			this.faceRight();
		}
	};
	
	Game_BattlerBase.prototype.facePosition = function(position) {
		if (this.screenX() < position) this.faceRight();
		if (this.screenX() > position) this.faceLeft();
	};
	
	Game_BattlerBase.prototype.isBehind = function(target) {
		return (target.isFacingRight() && this.screenX() < target.screenX()) ||
			   (target.isFacingLeft()  && this.screenX() > target.screenX());
	};
	
	Game_BattlerBase.prototype.faceOpponents = function() {
		this.facePosition(this.opponents().averageX());
	};
	
	//=============================================================================
	// Game_Actor
	//=============================================================================
	
	Game_Actor.prototype.screenX = function() {
		return this._screenX || 600 + this.index() * 32;;
	};
	
	Game_Actor.prototype.screenY = function() {
		return this._screenY || 280 + this.index() * 48;
	};
	
	Game_Actor.prototype.battleSprite = function() {
		var spriteset = SceneManager._scene._spriteset;
		if (spriteset) {
			var sprites = spriteset._actorSprites || [];
			return sprites.filter(function(sprite) {
				return sprite && sprite._actor === this;
			}, this)[0];
		} else {
			return null;
		}
	};
	
	Game_Actor.prototype.battlerDirection = function() {
		return this._battlerDirection || 'left';
	};
	
	//=============================================================================
	// Game_Enemy
	//=============================================================================
	
	Game_Enemy.prototype.battleSprite = function() {
		var spriteset = SceneManager._scene._spriteset;
		if (spriteset) {
			var sprites = spriteset._enemySprites || [];
			return sprites.filter(function(sprite) {
				return sprite && sprite._enemy === this;
			}, this)[0];
		} else {
			return null;
		}
	};
	
	Game_Enemy.prototype.battlerDirection = function() {
		return this._battlerDirection || ($gameSystem.isSideView() ? 'right' : 'left');
	};
	
	Game_Enemy.prototype.attackAnimationId1 = function() {
		return  0;
	};

	Game_Enemy.prototype.attackAnimationId2 = function() {
		return  0;
	};
	
	//=============================================================================
	// Sprite_Battler
	//=============================================================================

	Object.defineProperties(Sprite_Battler.prototype, {
		z: { get: function() { return 3; }, configurable: true },
		h: { get: function() { return this.y; }, configurable: true }
	});
	
	Sprite_Battler.prototype.isEnemy = function() {
		return this._battler && this._battler.isEnemy();
	};
	
	Sprite_Battler.prototype.isVisible = function() {
		return this.visible && this.opacity > 0;
	};
	
	Sprite_Battler.prototype.isDisabledMotion = function() {
		var motion = Sprite_Actor.MOTIONS;
		return this._motion === motion['dead'] || this._motion === motion['sleep'];
	};
	
	//=============================================================================
	// Sprite_Actor
	//=============================================================================
	
	Sprite_Actor.prototype.updateBattlerDirection = function() {
		if (this._battler && !this.isDisabledMotion()) {
			if ((this._battler.isFacingLeft()  && this.scale.x < 0) ||
				(this._battler.isFacingRight() && this.scale.x > 0)) {
				this.scale.x *= -1;
			}
		}
	};
	
	Sprite_Actor.prototype.center = function() {
		var x = this._mainSprite._frame.width  / 2 || 0;
		var y = this._mainSprite._frame.height / 2 || 0;
		return {x: x, y: y};
	};
	
	//=============================================================================
	// Sprite_Enemy
	//=============================================================================
		
	Sprite_Enemy.prototype.updateBattlerDirection = function() {
		if (this._battler && !this.isDisabledMotion()) {
			if ((this._battler.isFacingLeft()  && this.scale.x > 0) ||
				(this._battler.isFacingRight() && this.scale.x < 0)) {
				this.scale.x *= -1;
			}
		}
	};
	
	Sprite_Enemy.prototype.center = function() {
		var x = this._frame.width  / 2 || 0;
		var y = this._frame.height / 2 || 0;
		return {x: x, y: y};
	};
	
	//=============================================================================
	// Sprite_Damage
	//=============================================================================

	Object.defineProperties(Sprite_Damage.prototype, {
		z: { get: function() { return 10; }, configurable: true }
	});
	
	//=============================================================================
	// Spriteset_Battle
	//=============================================================================

	Spriteset_Battle.prototype.sortBattleSprites = function() {
		if (this._sortChildrenFrame !== Graphics.frameCount) {
			this._battleField.children.sort(this.compareBattleSprites.bind(this));;
			this._sortChildrenFrame = Graphics.frameCount;
		}
	};
	
	Spriteset_Battle.prototype.compareBattleSprites = function(a, b) {
		if (a.z !== b.z) {
			return (a.z || 0) - (b.z || 0);
		} else if (a.h !== b.h) {
			return (a.h || 0) - (b.h || 0);
		} else if (a.y !== b.y) {
			return (a.y || 0) - (b.y || 0);
		} else {
			return a.spriteId - b.spriteId;
		}
	};
	
	Spriteset_Battle.prototype.updateZCoordinates = function() {
		this.sortBattleSprites();
	};

	//=============================================================================
	// Window_Base
	//=============================================================================
	
	Window_Base.prototype.textWidthEx = function(text) {
		if (text) {
			var state  = {index: 0, x: 0};
			state.text = this.convertEscapeCharacters(text);
			while (state.index < state.text.length) { this.processCharacter(state) };
			return state.x;
		} else {
			return 0;
		}
	};
/*			
	//=============================================================================
	// Window_BattleLog
	//=============================================================================
	
	Window_BattleLog.prototype.waitForBattleAnimation = function(animationId, speed) {
		var speed = Math.max(speed, 1) || 1;
		this.waitForTime(VictorEngine.waitAnimation(animationId) / speed);
	};
	
	Window_BattleLog.prototype.waitForTime = function(time) {
		this._waitCount = time;
	};
	
	Window_BattleLog.prototype.setupStartAction = function(subject, action, targets) {
		if (this._setupStartActionFrame !== Graphics.frameCount && !Imported.YEP_BattleEngineCore) {
			VictorEngine.removeMethod(this._methods, 'showAnimation');
			VictorEngine.removeMethod(this._methods, 'waitForBattleAnimation');
			this.push('prepareAction', subject, action, targets);
			this._setupStartActionFrame = Graphics.frameCount;
		}
	};
	
	Window_BattleLog.prototype.uniqueActionEnabled = function() {
		return false;
	};
	
	Window_BattleLog.prototype.initializeMethodsStack = function() {
		this._stackWaitCount = [];
		this._stackWaitMode = [];
		this._throwingStack = [];
		this._methodsStack  = [];
		this._stackIndex = 0;
	};
	
	Window_BattleLog.prototype.prepareAction = function(subject, action, targets) {
		var item   = action.item();
		var length = this._methodsStack.length + 1;
		this.uniqueTargets(targets).forEach(function(unique, index)  {	
			this._stackIndex = length + index;
			this.prepareUniqueAction(subject, item, unique.target, unique.repeat)
		}, this)
		this._stackIndex = 0;
	};
	
	Window_BattleLog.prototype.prepareUniqueAction = function(subject, item, target, repeat) {
		this.prepareUniqueActionStep1(subject, item, target, repeat);
		this.prepareUniqueActionStep2(subject, item, target, repeat);
		this.prepareUniqueActionStep3(subject, item, target, repeat);
	};
	
	Window_BattleLog.prototype.prepareUniqueActionStep1 = function(subject, item, target, repeat) {
		this.push('showAnimation', subject, [target], item.animationId);
	};
	
	Window_BattleLog.prototype.prepareUniqueActionStep2 = function(subject, item, target, repeat) {
		var animId = this.uniqueActionAnimationId(subject, item) 
		this.push('waitForBattleAnimation', animId);
	};
	
	Window_BattleLog.prototype.prepareUniqueActionStep3 = function(subject, item, target, repeat) {
		for (var i = 0; i < repeat; i++) {
			if (i > 0) this.push('wait');
			this.push('updateStackAction', this._stackIndex, subject, target);
		}
	};
	
	Window_BattleLog.prototype.uniqueActionAnimationId = function(subject, item) {
		if (item.animationId < 0) {
			return subject.attackAnimationId1();
		} else {
			return item.animationId;
		}
	}

	Window_BattleLog.prototype.uniqueTargets = function(targets) {
		var repeats = [];
		targets.forEach(function(target, i) {
			var index = targets.indexOf(target);
			if (index === i) {
				repeats[index] = {target: target, repeat: 1};
			} else {
				repeats[index].repeat++;
			}
		})
		return repeats.filter(function(repeat) { return !!repeat });
	}
	
	Window_BattleLog.prototype.updateMethodsStack = function() {
		var methods = this._methodsStack;
		for (var i = 0; i < methods.length; i++) {
			if (methods[i] && methods[i].length > 0) {
				if (methods[i].length > 0 && !this.updateStackWait(i)) {
					this.callNextStackMethod(i);
				}
			}
		}
		if (this.isStachEmpty()) this._methodsStack = [];
	};
	
	Window_BattleLog.prototype.isStachEmpty = function() {
		return this._methodsStack.every(function(methods) { 
			return !methods || methods.length === 0;
		})
	};
	
	Window_BattleLog.prototype.callNextStackMethod = function(index) {
		var method = this._methodsStack[index].shift();
		if (method.name && this[method.name]) {
			this[method.name].apply(this, method.params);
		} else {
			throw new Error('Method not found: ' + method.name);
		}
	};
	
	Window_BattleLog.prototype.saveMethodsStack = function(index) {
		this._saveStackIndex   = this._stackIndex;
		this._saveMethodsStack = this._methodsStack[index].clone();
		this._stackIndex = index;
		this._methodsStack[index] = [];
	};
	
	Window_BattleLog.prototype.restoreMethodsStack = function(index) {
		this._methodsStack[index] = this._methodsStack[index].concat(this._saveMethodsStack);
		this._stackIndex = this._saveStackIndex;
	};
	
	Window_BattleLog.prototype.methodStackActive = function() {
		return this._methodsStack.length > 0;
	};
	
	Window_BattleLog.prototype.updateStackAction = function(index, subject, target) {
		BattleManager.updateStackAction(index, subject, target);
	};
	
	Window_BattleLog.prototype.pushMethodsStack = function(methodName) {
		var index = this._stackIndex || 0;
		var methodArgs = Array.prototype.slice.call(arguments, 1);
		if (methodName === 'wait') {
			methodName = 'stackWait';
			methodArgs.unshift(index);
		} else if (methodName === 'waitForTime') {
			methodName = 'stackWaitForTime';
			methodArgs.unshift(index);
		} else if (methodName === 'waitForBattleAnimation') {
			methodName = 'stackWaitFoAnimation';
			methodArgs.unshift(index);
		} else if (methodName === 'updateWaitMode') {
			methodName = 'updateStackWaitMode';
			methodArgs.unshift(index);
		} else if (methodName === 'setWaitMode') {
			methodName = 'setStackWaitMode';
			methodArgs.unshift(index);
		}
		this._methodsStack[index] = this._methodsStack[index] || [];
		this._methodsStack[index].push({ name: methodName, params: methodArgs });
	};
	
	Window_BattleLog.prototype.updateStackWait = function(index) {
		return this.updateStackWaitCount(index) || this.updateStackWaitMode(index);
	};

	Window_BattleLog.prototype.updateStackWaitCount = function(index) {
		if (this._stackWaitCount[index] && this._stackWaitCount[index] > 0) {
			this._stackWaitCount[index]--;
			return true;
		}
		return false;
	};
	
	Window_BattleLog.prototype.stackWait = function(index) {
		this.stackWaitForTime(index, this.messageSpeed());
	};

	Window_BattleLog.prototype.stackWaitFoAnimation = function(index, animationId, speed) {
		var speed = Math.max(speed, 1) || 1;
		this.stackWaitForTime(index, VictorEngine.waitAnimation(animationId) / speed);
	};
	
	Window_BattleLog.prototype.stackWaitForTime = function(index, time) {
		this._stackWaitCount[index] = time;
	};
	
	Window_BattleLog.prototype.updateStackWaitMode = function(index) {
		var waiting = false;
		switch (this._stackWaitMode[index]) {
		case 'effect':
			waiting = this._spriteset.isEffecting();
			break;
		case 'movement':
			waiting = this._spriteset.isAnyoneMoving();
			break;
		}
		if (!waiting) this._stackWaitMode[index] = '';
		return waiting;
	};

	Window_BattleLog.prototype.setStackWaitMode = function(index, waitMode) {
		this._stackWaitMode[index] = waitMode;
	};

	Window_BattleLog.prototype.isThrowing = function(index) {
		return this._spriteset.isThrowing(this._throwingStack[index]);
	};
*/
})();