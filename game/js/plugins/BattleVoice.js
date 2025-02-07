//=============================================================================
// BattleVoice.js
//=============================================================================

/*:
 * @plugindesc play voice SE at battle when actor does spcified action
 * @author Sasuke KANNAZUKI
 * 
 * @param pitch
 * @desc pitch of SEs. this setting is common among all voice SEs.
 * @default 100
 *
 * @param volume
 * @desc volume of SEs. this setting is common among all  voice SEs.
 * @default 90
 * 
 * @help This plugin does not provide plugin commands.
 * 
 * note specification:
 * write down each actor's note at following format to set SE filename.
 * <attackVoice:filename>  plays when actor does normal attack.
 * <recoverVoice:filename>   plays when actor uses HP recovering magic.
 * <friendMagicVoice:filename> plays when actor spells magic for friend
 *  except HP recovering. if this is not set but <skillVoice:filename> is set,
 *   it plays <magicVoice:filename> setting file.
 * <magicVoice:filename>   plays when actor spells magic(except for friend).
 * <skillVoice:filename>   plays when actor uses special skill except magic.
 * <damageVoice:filename>    plays when actor takes damage.
 * <defeatedVoice:filename>   plays when actor is died.
 * <victoryVoice:filename>   plays when battle finishes.
 *  if plural actors attend the battle, randomly selected actor's SE is adopted.
 *
 */
/*:ja
 * @plugindesc アクターの戦闘時の行動にボイスSEを設定します。
 * @author 神無月サスケ
 * 
 * @param pitch
 * @desc ボイスSEのピッチです。この設定が全てのボイスSEの共通となります。
 * @default 100
 *
 * @param volume
 * @desc ボイスSEのボリュームです。この設定が全てのボイスSEの共通となります。
 * @default 90
 * 
 * @help このプラグインには、プラグインコマンドはありません。
 * 
 * メモ設定方法:
 * それぞれのアクターのメモに以下の書式で書いてください。
 * filename はボイスSEのファイル名にしてください。
 *
 * <attackVoice:filename>  通常攻撃の時に再生されるボイスです。
 * <recoverVoice:filename>   HP回復魔法を使用した時に再生されるボイスです。
 * <friendMagicVoice:filename>   HP回復以外の味方向け魔法を使用した時に
 *  再生されるボイスです。省略された場合で<magicVoice:filename>が
 *  設定されている場合は、そちらが再生されます。
 * <magicVoice:filename> 味方向け以外の魔法を使用した時に再生されるボイスです。
 * <skillVoice:filename>   必殺技を使用した時に再生されるボイスです。
 * <damageVoice:filename>    ダメージを受けた時に再生されるボイスです。
 * <defeatedVoice:filename>   戦闘不能になった時に再生されるボイスです。
 * <victoryVoice:filename>   戦闘勝利時に再生されるボイスです。
 *  アクターが複数いる場合は、生きているアクターの中からランダムで再生されます。
 *
 */
(function() {

  //
  // process parameters
  //
  var parameters = PluginManager.parameters('BattleVoice');
  var pitch = Number(parameters['pitch']) || 100;
  var volume = Number(parameters['volume']) || 90;

  AudioManager.createAudioByFileame = function(name){
    var audio = {};
    audio.name = name;
    audio.pitch = pitch;
    audio.volume = volume;
    return audio;
  };

  //
  // play actor voice
  //
  SoundManager.playActorVoice = function(actor, type){
    var name = '';
    switch(type){
      case 'attack':
        name = actor.meta.attackVoice;
        break;
      case 'recover':
        name = actor.meta.recoverVoice;
        break;
      case 'friendmagic':
        name = actor.meta.friendMagicVoice || actor.meta.magicVoice;
        break;
      case 'magic':
        name = actor.meta.magicVoice;
        break;
      case 'skill':
        name = actor.meta.skillVoice;
        break;
      case 'damage':
        name = actor.meta.damageVoice;
        break;
      case 'dead':
        name = actor.meta.defeatedVoice;
        break;
      case 'victory':
        name = actor.meta.victoryVoice;
        break;
    }
    if(name){
      var audio = AudioManager.createAudioByFileame(name);
      AudioManager.playSe(audio);
    }
  };

  //
  // functions for call actor voice.
  //
  var _Game_Actor_performAction = Game_Actor.prototype.performAction;
  Game_Actor.prototype.performAction = function(action) {
    _Game_Actor_performAction.call(this, action);
    if (action.isAttack()) {
      SoundManager.playActorVoice(this.actor(), 'attack');
//    } else if (action.isMagicSkill() && action.isHpRecover()) {
//      SoundManager.playActorVoice(this.actor(), 'recover');
//    } else if (action.isMagicSkill() && action.isForFriend()) {
//      SoundManager.playActorVoice(this.actor(), 'friendmagic');
    } else if (action.isMagicSkill() || action.isItem()) {
      SoundManager.playActorVoice(this.actor(), 'magic');
//    } else if (action.isSkill() && !action.isGuard()) {
//      SoundManager.playActorVoice(this.actor(), 'skill');
    }
  };



//copy for enemy by doranikofu
	Game_Battler.prototype.parseAttackSounds = function(note) {
		var lines = note.split(/[\r\n]/);
		var regex = /<AttackSE:[ ]*(.+),[ ]*(\d+),[ ]*(\d+)>/i;
		var results = [];

		for (var i = 0; i < lines.length; i++) {
			var regexMatch = regex.exec(lines[i]);
			if (regexMatch)
			{
				results.push([regexMatch[1], Number(regexMatch[2]), Number(regexMatch[3])]);
			}
		};

		return results;
	};


	var _GameEnemy_setup = Game_Enemy.prototype.setup;
	Game_Enemy.prototype.setup = function(enemyId, x, y) {
		_GameEnemy_setup.call(this, enemyId, x, y);
		this._attackSounds = this.parseAttackSounds(this.enemy().note);
	};


  var _Game_Enemy_performAction = Game_Enemy.prototype.performAction;
  Game_Enemy.prototype.performAction = function(action) {
    _Game_Enemy_performAction.call(this, action);
    if (action.isAttack() || action.isSkill()) {


		if (this._attackSounds.length > 0)
		{
			var sound = AudioManager.makeEmptyAudioObject();
			var randomAttackSound = this._attackSounds[Math.floor(Math.random()*this._attackSounds.length)];
			sound.name = randomAttackSound[0];
			sound.volume = randomAttackSound[1];
			sound.pitch = randomAttackSound[2];
			AudioManager.loadStaticSe(sound);
			AudioManager.playStaticSe(sound);
		}
    }
  };

})();
