
this.system = this.system || {};
(function(){
    "use strict";

    const Button = function(img){
        this.Container_constructor();
        this._init(img);
    };

    const p = createjs.extend(Button,createjs.Container);

    p._body = null;
    p._text = null;

    p._init = function (img) {
        this._body = img;
        this._body.regX = img.image.width/2;
        this._body.regY = img.image.height/2;
        this.addChild(this._body);
    };

    p.addText = function(text) {
        this._text = text;
        this.addChild(this._text);
    };

    p.centerText = function() {
        this._text.x = this._body.x;
        this._text.y = this._body.y;
    };

    p.updateText = function(text) {
        this._text.text = text;
    };

    p.setTextposition = function(x, y) {
        this._text.x = x;
        this._text.y = y;
    };

    p.getButtonDimensions = function() {
        return {
            width:this._body.image.width,
            height:this._body.image.height
        }
    };

    p.doScaleAnimation = function() {
        createjs.Tween.get(this).to({scale:0.8},50).to({scale:1},50);
    };

    p.enableClick = function(enabled) {
        this.mouseEnabled = enabled;
    };

    p.isEnabled = function() {
        return this.mouseEnabled;
    };

    system.Button = createjs.promote(Button,"Container");
})();


