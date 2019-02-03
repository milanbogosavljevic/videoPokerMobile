
this.system = this.system || {};
(function(){
    "use strict";

    const GambleComponent = function(game, startingCard){
        this.Container_constructor();
        this.init(game, startingCard);
    };

    const p = createjs.extend(GambleComponent,createjs.Container);

    p._game = null;
    p._leftCard = null;
    p._rightCard = null;
    p._rightCardOverlay = null;
    p._buttonHigh = null;
    p._buttonLow = null;
    p._overlay = null;
    p._previousCards = null;
    p._atlas = null;
    p._json = null;
    p._animationInterval = null;
    p._pauseInterval = null;
    p._buttonsOverlay = null;
    p._isEnabled = null;

    p.init = function (game, startingCard) {
        this._atlas = system.CustomMethods.makeImage('cardsAtlas', true);
        this._json = queue.getResult("cardsJson");
        this._game = game;
        this._previousCards = [];
        this._pauseInterval = false;
        this._isEnabled = false;
        const back = system.CustomMethods.makeImage('gambleBackground', false);
        this.addChild(back);

        this._setButtons();
        this._setCards(startingCard);
        this._enableButtons(false);

        const overlay = this._overlay = system.CustomMethods.makeImage('gambleOverlay', false);
        this.addChild(overlay);
    };

    p._setCards = function(startingCard) {
        const imgName = startingCard.number + startingCard.symbol;
        const left = this._leftCard = system.CustomMethods.makeImageFromAtlas(this._atlas, this._json, imgName, false);
        left.regX = left.sourceRect.width/2;
        left.regY = left.sourceRect.height/2;
        left.x = 70;
        left.y = 93;
        this.addChild(left);

        const right = this._rightCard = system.CustomMethods.makeImageFromAtlas(this._atlas, this._json, '5diamonds', false);
        right.regX = right.sourceRect.width/2;
        right.regY = right.sourceRect.height/2;
        right.x = right.startX = 306;
        right.y = left.y;
        right.visible = false;

        const rightOverlay = this._rightCardOverlay = system.CustomMethods.makeImage('gambleCard', false, true);
        rightOverlay.x = right.x;
        rightOverlay.y = right.y;

        this.addChild(rightOverlay);
        this.addChild(right);

        const prevousCardsNum = 8;
        const spacing = 43;
        const startX = 21;
        const yPos = 178;
        for(let i = 0; i < prevousCardsNum; i++){
            let previousCard = system.CustomMethods.makeImageFromAtlas(this._atlas, this._json, '14diamonds', false);
            previousCard.scale = 0.3;
            previousCard.x = startX + (i * spacing);
            previousCard.y = yPos;
            this._previousCards.push(previousCard);
            this.addChild(previousCard);
        }
    };

    p._setButtons = function() {
        let img = system.CustomMethods.makeImage('highButton', true);
        const high = this._buttonHigh = new system.Button(img);
        high.x = 188;
        high.y = 45;
        high.on('click', ()=>{
            this.onButton('High');
        });
        this.addChild(high);

        img = system.CustomMethods.makeImage('lowButton', true);
        const low = this._buttonLow = new system.Button(img);
        low.x = high.x;
        low.y = 140;
        low.on('click', ()=>{
            this.onButton('Low');
        });
        this.addChild(low);

        const overlay = this._buttonsOverlay = system.CustomMethods.makeImage('gambleButtonsOverlay', false, true);
        overlay.x = high.x;
        overlay.y = high.y;
        this.addChild(overlay);
    };

    p.onButton = function(clickedValue) {
        this._game.onGambleButton(clickedValue);
        const clickedButton = '_button' + clickedValue;
        this._pauseInterval = true;
        this._buttonsOverlay.y = this[clickedButton].y;
    };

    p._enableButtons = function(enable) {
        this._isEnabled = enable;
        this._buttonHigh.enableClick(enable);
        this._buttonLow.enableClick(enable);
    };

    p.isEnabled = function() {
        return this._isEnabled;
    };

    p.revealCard = function(card, previousCards, win) {
        system.SoundManager.pause('gambleTensionSound', true);
        this._enableButtons(false);
        const imgName = card.number + card.symbol;
        const imgPropsIndex = this._json.animations[imgName];
        const imgProps = this._json.frames[imgPropsIndex];

        createjs.Tween.get(this._rightCardOverlay).to({skewY:10,scaleX:0},200,createjs.Ease.getPowInOut(2)).call(()=> {
            this._rightCardOverlay.visible = false;
            this._rightCard.sourceRect = new createjs.Rectangle(imgProps[0],imgProps[1],imgProps[2],imgProps[3]);
            this._rightCard.skewY = 10;
            this._rightCard.scaleX = 0;
            this._rightCard.visible = true;
            createjs.Tween.get(this._rightCard).to({skewY:0,scaleX:1},200,createjs.Ease.getPowInOut(2)).call(()=>{
                this._rightCardOverlay.skewY = 0;
                this._rightCardOverlay.scaleX = 1;
                this._rightCardOverlay.visible = true;

                let soundId = win === '0.00' ? 'gambleLoseSound' : 'gambleWinSound';
                system.SoundManager.play(soundId);
                const duration = Math.round(system.SoundManager.getDuration(soundId));

                createjs.Tween.get(this._rightCard).wait(duration).to({x:this._leftCard.x},500).call(()=>{
                    this._leftCard.sourceRect = this._rightCard.sourceRect;
                    this._rightCard.x = this._rightCard.startX;
                    this._rightCard.visible = false;
                    this._updatePreviousCards(previousCards);
                    if(win === '0.00'){
                        this._game.gambleLost();
                    }else{
                        this._enableButtons(true);
                    }
                    this._pauseInterval = false;
                    system.SoundManager.pause('gambleTensionSound', false);
                });
            });
        });
    };

    p._updatePreviousCards = function(arr) {
        const previousCards = arr;
        for(let i = 0; i < previousCards.length; i++) {
            const imgName = previousCards[i].number + previousCards[i].symbol;
            const imgPropsIndex = this._json.animations[imgName];
            const imgProps = this._json.frames[imgPropsIndex];
            this._previousCards[i].sourceRect = new createjs.Rectangle(imgProps[0],imgProps[1],imgProps[2],imgProps[3]);
        }
    };

    p._activateAnimation = function(activate) {
        if(activate === true) {
            this._animationInterval = setInterval(()=>{
                if(this._pauseInterval === false){
                    this._buttonsOverlay.y = this._buttonsOverlay.y === this._buttonHigh.y ? this._buttonLow.y : this._buttonHigh.y;
                }
            },300);
        }else {
            clearInterval(this._animationInterval);
            this._animationInterval = null;
        }
    };

    p.activateGamble = function(activate) {
        this._overlay.visible = !activate;
        this._activateAnimation(activate);
        this._enableButtons(activate);
        if(activate === true){
            system.SoundManager.play('gambleTensionSound', 0.5, -1);
        }else{
            system.SoundManager.stop('gambleTensionSound');
        }

    };

    system.GambleComponent = createjs.promote(GambleComponent,"Container");
})();


