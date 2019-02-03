this.system = this.system || {};

(function() {
    "use strict";

    const SoundManager = function() {};

    SoundManager.sounds = {};

    SoundManager.registerSound = function(id) {
        SoundManager.sounds[id] = createjs.Sound.createInstance(id);
    };

    SoundManager.play = function(id, volume, loop) {
        const vol = volume || 1;
        const looping = loop || 0;
        if(SoundManager.sounds[id].playState !== 'playFinished'){
            SoundManager.sounds[id].stop();
        }
        SoundManager.sounds[id].play({volume:vol, loop:looping});
    };

    SoundManager.stop = function(id) {
        SoundManager.sounds[id].stop();
    };

    SoundManager.pause = function(id, pause) {
        SoundManager.sounds[id].paused = pause;
    };

    SoundManager.getDuration = function(id) {
        return SoundManager.sounds[id].duration;
    };

    SoundManager.muteAllSounds = function() {
        createjs.Sound.muted = !createjs.Sound.muted;
    };

    system.SoundManager = SoundManager;
})();