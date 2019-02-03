
this.system = this.system || {};
(function(){
    "use strict";

    const MessagesComponent = function(){
        this.Container_constructor();
        this._init();
    };

    const p = createjs.extend(MessagesComponent,createjs.Container);
    p._message = null;

    p._init = function () {
        const background = system.CustomMethods.makeImage('messagesBackground', false);
        this.addChild(background);

        this.regX = background.image.width/2;
        this.regY = background.image.height/2;

        this._message = system.CustomMethods.makeText('message', '22px Russo One', '#ec5750', 'center', 'middle');
        this._message.x = this.regX;
        this._message.y = this.regY;
        this.addChild(this._message);
        system.CustomMethods.cacheText(this._message);
    };

    p.updateMessage = function(text) {
        this._message.uncache();
        this._message.text = text;
        system.CustomMethods.cacheText(this._message);
    };

    system.MessagesComponent = createjs.promote(MessagesComponent,"Container");
})();


