/*:
-------------------------------------------------------------------------
@title Save Title
@author Hime --> HimeWorks (http://himeworks.com)
@version 1.0
@date Dec 31, 2015
@filename HIME_SaveTitle.js
@url http://himeworks.com/2015/12/save-title/

If you enjoy my work, consider supporting me on Patreon!

* https://www.patreon.com/himeworks

If you have any questions or concerns, you can contact me at any of
the following sites:

* Main Website: http://himeworks.com
* Facebook: https://www.facebook.com/himeworkscom/
* Twitter: https://twitter.com/HimeWorks
* Youtube: https://www.youtube.com/c/HimeWorks
* Tumblr: http://himeworks.tumblr.com/

-------------------------------------------------------------------------------
@plugindesc v1.0 - allows you to customize the title of the game that is
displayed in the save file.
@help 
-------------------------------------------------------------------------------
== Description ==

By default, when you save a game, the title that is used is the title of
the game.

However, this isn't very useful. It would be better to show something more
relevant to the actual save file, such as a map location, or the current
chapter, or anything else.

With this plugin, you can use events to determine what the current save title
should be.

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Contact me for commercial use

== Change Log ==

1.0 - Dec 31, 2015
 - initial release

== Usage ==

To set the save title, use the script call

  TH.setSaveTitle( TITLE )
  
Where TITLE is any valid string. For example, if you want to set the save
title to "Chapter 1" you can write

  TH.setSaveTitle("Chapter 1")
  
Then when you save the game, that will be the title that is shown.

-------------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.TH_saveTitle = 1;
TH.saveTitle = TH.saveTitle || {};

(function ($) {

  var TH_GameSystem_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    TH_GameSystem_initialize.call(this);
    this._saveTitle = $dataSystem.gameTitle;
  };

  Game_System.prototype.setSaveTitle = function(title) { 
    this._saveTitle = title
  };

  Game_System.prototype.saveTitle = function() {
    return this._saveTitle;
  };

  TH.setSaveTitle = function(title) {
    $gameSystem.setSaveTitle(title);
  };
  /*
  var TH_DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
  DataManager.makeSavefileInfo = function() {
    var info = TH_DataManager_makeSavefileInfo.call(this);
    info.title = $gameSystem.saveTitle();
    return info
  };
  */

})(TH.saveTitle);