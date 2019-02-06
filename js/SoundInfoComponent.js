
this.system = this.system || {};
(function(){
    "use strict";

    const SoundInfoComponent = function(game){
        this.Container_constructor();
        this._init(game);
    };

    const p = createjs.extend(SoundInfoComponent,createjs.Container);
    p._game = null;
    p._background = null;
    p._soundButton = null;
    p._infoButton = null;

    p._init = function (game) {
        this._game = game;
        const background = this._background = system.CustomMethods.makeImage('soundInfoBackground', false);
        this.addChild(background);

        const soundImage = system.CustomMethods.makeImage('soundButton', true);
        const soundButton = this._soundButton = new system.Button(soundImage);
        soundButton.x = 26;
        soundButton.y = 24;
        soundButton.on('click', (e)=>{
            this._game.onSoundButton();
            soundButton.alpha = createjs.Sound.muted === true ? 0.6 : 1;
        });
        this.addChild(soundButton);

        const infoImage = system.CustomMethods.makeImage('infoButton', true);
        const infoButton = this._infoButton = new system.Button(infoImage);
        infoButton.x = 88;
        infoButton.y = 25;
        infoButton.on('click', (e)=>{
            this._game.onInfoButton();
        });
        this.addChild(infoButton);

        const buttonImage = system.CustomMethods.makeImage('showSoundInfoComponentButton', true);
        const button = new system.Button(buttonImage);
        button.x = background.image.width/2;
        button.y = 64;
        button.on('click', (e)=>{
            this._game.showHideSoundInfoComponent();
        });
        this.addChild(button);
    };

    p.show = function(visibility) {
        this._background.visible = this._soundButton.visible = this._infoButton.visible = visibility;
    };

    system.SoundInfoComponent = createjs.promote(SoundInfoComponent,"Container");
})();


