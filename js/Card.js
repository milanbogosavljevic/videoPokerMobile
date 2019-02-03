
this.system = this.system || {};
(function(){
    "use strict";

    const Card = function(image, number, symbol){
        this.Container_constructor();
        this._init(image, number, symbol);
    };

    const p = createjs.extend(Card,createjs.Container);
    p._image = null;
    p._hold = null;
    p._holdMarker = null;
    p.number = null;
    p.symbol = null;

    p._init = function (image, number, symbol) {
        this._image = image;
        this._image.regX = image.sourceRect.width/2;
        this._image.regY = image.sourceRect.height/2;
        this._image.y = 80;

        this._holdMarker = system.CustomMethods.makeImage('holdMarker', false, true);
        this._holdMarker.y = 76;
        this._holdMarker.visible = false;

        this._hold = false;
        this.addChild(this._image, this._text, this._holdMarker);

        this.number = number;
        this.symbol = symbol;

        this.on('click', (e)=>{
            this.toggleHold();
        });
    };

    p.toggleHold = function() {
        //system.CustomMethods.playSound('selectCardSound');
        system.SoundManager.play('selectCardSound');
        this._hold = !this._hold;
        this._holdMarker.visible = this._hold;
    };

    p.isForchange = function() {
        return !this._hold;
    };

    p.updateCard = function(cardObj, cardsJson) {
        this.number = cardObj.number;
        this.symbol = cardObj.symbol;

        const imgName = this.number + this.symbol;
        const imgPropsIndex = cardsJson.animations[imgName];
        const imgProps = cardsJson.frames[imgPropsIndex];

        createjs.Tween.get(this._image).to({skewY:10,scaleX:0},200,createjs.Ease.getPowInOut(2)).call(()=> {
            this._image.sourceRect = new createjs.Rectangle(imgProps[0],imgProps[1],imgProps[2],imgProps[3]);
            createjs.Tween.get(this._image).to({skewY:0,scaleX:1},200,createjs.Ease.getPowInOut(2));
        });
    };

    p.unholdCard = function() {
        //this._hold = this._text.visible = false;
        this._hold = this._holdMarker.visible = false;
    };

    system.Card = createjs.promote(Card,"Container");
})();


