// doranikofu edits to export file name parameters
/*:
 * @plugindesc manually fix export file loading format
 *
*/

AudioManager.audioFileExt = function() {
        return '.m4a';
};

Game_Interpreter.prototype.videoFileExt = function() {
        return '.mp4';
};
/*
Decrypter.extToEncryptExt = function(url) {
    var ext = url.split('.').pop();
    var encryptedExt = ext;

    if(ext === "ogg") encryptedExt = ".rpgmvo";
    else if(ext === "m4a") encryptedExt = ".rpgmvm";
    else if(ext === "png") encryptedExt = ".rpgmvp";
	else if(ext === "jpg") encryptedExt = ".rpgmvp"; //add jpg for encryption
    else encryptedExt = ext;

    return url.slice(0, url.lastIndexOf(ext) - 1) + encryptedExt;
};
*/

//remove F5 reset, and remove F8 debug for final
SceneManager.onKeyDown = function(event) {

};

Game_Player.prototype.isDebugThrough = function() {
    return false;
};

Scene_Map.prototype.updateCallDebug = function() {

};