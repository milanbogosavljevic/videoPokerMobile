
this.system = this.system || {};
(function(){
    "use strict";

    const VideoPokerGame = function(){
        this.Container_constructor();
        this._init();
    };

    const p = createjs.extend(VideoPokerGame,createjs.Container);

    p._paytableComponent = null;// container
    p._controlboardComponent = null;// container
    p._playerCardsComponent = null;// container
    p._gambleComponent = null;// container
    p._communicator = null;//prototype
    p._state = null;
    p._keyboardEnabled = null;
    p._infoPanel = null;
    p._soundInfoComponent = null;
    p._logo = null;
    p._messagesComponent = null;

    p._init = function () {
        this._registerSounds();

        const back = system.CustomMethods.makeImage('background', false);
        this.addChild(back);

        const logo = this._logo = system.CustomMethods.makeImage('logo', false);
        logo.regX = logo.image.width/2;
        logo.x = 479;
        logo.y = 93;
        this.addChild(logo);

        this._communicator = new system.Communicator();

        this._state = 'draw';

        const cards = [{number:'10',symbol:'hearts'},{number:'11',symbol:'hearts'},{number:'12',symbol:'hearts'},{number:'13',symbol:'hearts'},{number:'14',symbol:'hearts'}];

        const playerCards = this._playerCardsComponent = new system.PlayerCardsComponent(cards);
        playerCards.x = 180;
        playerCards.y = 285;
        playerCards.enableCardsClick(false);

        const response = this._communicator.getStartingInfo();

        const controlboard = this._controlboardComponent = new system.ControlboardComponent(this,response.betLevels, response.balance);
        controlboard.y = 465;
        this.addChild(controlboard);

        const paytable = this._paytableComponent = new system.PaytableComponent(response.paytableInfo);
        paytable.x = 29;
        paytable.y = 29;
        paytable.updateForBet(1);
        this.addChild(paytable);

        const gamble = this._gambleComponent = new system.GambleComponent(this, response.gambleCard);
        gamble.x = 555;
        gamble.y = 29;
        this.addChild(gamble);

        this.addChild(playerCards);

        const messagesComponent = this._messagesComponent = new system.MessagesComponent();
        messagesComponent.x = 480;
        messagesComponent.y = 270;
        messagesComponent.scale = 0;
        this.addChild(messagesComponent);

        this._infoPanel = system.CustomMethods.makeImage('infoPanel', false);
        this._infoPanel.visible = false;
        this.addChild(this._infoPanel);

        const soundInfoComponent = this._soundInfoComponent = new system.SoundInfoComponent(this);
        soundInfoComponent.x = 422;
        soundInfoComponent.y = -49;
        this.addChild(soundInfoComponent);

        document.onkeydown = (e)=>{
            this._handleKeydown(e.key);
        };
        this._enableKeyboard(true);
    };

    p._registerSounds = function() {
        system.SoundManager.registerSound('betSound');
        system.SoundManager.registerSound('collectSound');
        system.SoundManager.registerSound('hasWinSound');
        system.SoundManager.registerSound('gambleWinSound');
        system.SoundManager.registerSound('gambleLoseSound');
        system.SoundManager.registerSound('drawChangeCollectButtonSound');
        system.SoundManager.registerSound('selectCardSound');
        system.SoundManager.registerSound('gambleTensionSound');
        system.SoundManager.registerSound('collectDone');
    };

    p._enableKeyboard = function(enabled) {
        this._keyboardEnabled = enabled;
    };

    p._handleKeydown = function(keyPressed) {
        if(this._keyboardEnabled === true){
            switch (keyPressed){
                case 'Enter':
                    this._drawChangeCollectByKeyboard();
                    break;
                case '+':
                    this._gambleByKeyboard('High');
                    break;
                case '-':
                    this._gambleByKeyboard('Low');
                    break;
                case 'ArrowUp':
                    this._betByKeyboard();
                    break;
                case '1':
                    this._selectCardByKeyboard(0);
                    break;
                case '2':
                    this._selectCardByKeyboard(1);
                    break;
                case '3':
                    this._selectCardByKeyboard(2);
                    break;
                case '4':
                    this._selectCardByKeyboard(3);
                    break;
                case '5':
                    this._selectCardByKeyboard(4);
                    break;
            }
        }
    };

    p._betByKeyboard = function() {
        if(this._controlboardComponent.betButtonIsEnabled() === true){
            this._controlboardComponent.onBet();
        }
    };

    p._drawChangeCollectByKeyboard = function() {
        if(this._controlboardComponent.drawChangeCollectButtonIsEnabled() === true){
            this._controlboardComponent.onDrawChangeCollect();
        }
    };

    p._gambleByKeyboard = function(value) {
        if(this._gambleComponent.isEnabled() === true){
            this._gambleComponent.onButton(value);
        }
    };

    p._selectCardByKeyboard = function(index) {
        if(this._playerCardsComponent.isEnabled() === true){
            this._playerCardsComponent.selectCardByKeyboard(index);
        }
    };

    p._draw = function() {
        this._controlboardComponent.enableBetButton(false);
        this._controlboardComponent.enableDrawChangeCollectButton(false);
        this._enableKeyboard(false);

        const response = this._communicator.getFirstDrawCards();
        if(response.message){
            this._onGameOver(response.message);
            return;
        }

        this._playerCardsComponent.resetCards();
        this._state = 'change';

        const cards = response.cards;
        const winType = response.winType;
        const balance = response.balance;
        const bonusWin = response.bonusWin;
        const totalWin = response.totalWin;

        setTimeout(()=>{ // todo ovo treba da se izvrsi kada se zavrsi animacija
            if(winType !== 'noWin'){
                //system.CustomMethods.playSound('hasWinSound');
                system.SoundManager.play('hasWinSound');
            }
            this._controlboardComponent.enableDrawChangeCollectButton(true);
            this._controlboardComponent.updateBalance(balance);
            this._controlboardComponent.updateWin(totalWin);

            this._playerCardsComponent.enableCardsClick(true);
            this._playerCardsComponent.setStartCards(cards);

            this._paytableComponent.updateForWin(winType);
            this._paytableComponent.updateBonusWin(bonusWin);

            this._enableKeyboard(true);
        },500);
    };

    p._onGameOver = function(message) {
        console.log('game over');
        this._messagesComponent.updateMessage(message);
        createjs.Tween.get(this._messagesComponent).to({scale:1}, 500, createjs.Ease.cubicIn).wait(2000).to({scale:0}, 500, createjs.Ease.cubicIn).call(()=>{
            this._controlboardComponent.enableBetButton(true);
            this._controlboardComponent.enableDrawChangeCollectButton(true);
            this._enableKeyboard(true);
        });
    };

    p._change = function() {
        // ne smeju da se salju bitmap objekti posto u server.js(180) radi concat i vraca objecte u cards niz , a taj niz je niz objekata samo sa informacijama , a ne niz displej objekata
        let cardsToChangeBitmaps = this._playerCardsComponent.getCardsToChange();
        let cardsToChange = [];
        cardsToChangeBitmaps.forEach((cardObject)=>{
            cardsToChange.push({
                number:cardObject.number,
                symbol:cardObject.symbol
            });
        });
        let response = this._communicator.changeCards(cardsToChange);
        const cards = response.cards;
        const win = response.winType;
        const bonusWin = response.bonusWin;
        const totalWin = response.totalWin;

        this._paytableComponent.updateForWin(win);
        this._paytableComponent.updateBonusWin(bonusWin);

        this._controlboardComponent.updateWin(totalWin);

        this._playerCardsComponent.enableCardsClick(false);
        this._playerCardsComponent.updateCards(cards);

        if(win === 'noWin'){
            this._state = 'draw';
            this._controlboardComponent.enableBetButton(true);
        }else{
            this._state = 'collect';
            this._gambleComponent.activateGamble(true);
        }
    };

    p._collect = function() {
        system.SoundManager.play('collectSound', 1, -1);
        this._state = 'draw';
        this._gambleComponent.activateGamble(false);
        const response = this._communicator.collectWin();
        const newBalance = response.balance;

        this._controlboardComponent.animateCollect();

        const afterCollect = (e)=>{
            system.SoundManager.stop('collectSound');
            e.remove();
            this.off('collectingDone', listener);
            this._controlboardComponent.updateBalance(newBalance);
            this._controlboardComponent.updateWin('0.00');
            this._controlboardComponent.enableBetButton(true);

            this._paytableComponent.updateForWin('noWin');
            this._paytableComponent.updateBonusWin('0.00');
            this._animateLogo();
        };

        const listener = this.on('collectingDone', afterCollect);
    };

    p._animateLogo = function() {
        createjs.Tween.get(this._logo).to({alpha:0.4},100).to({alpha:1},100).to({alpha:0.4},100).to({alpha:1},100).call(()=>{
            system.SoundManager.play('collectDone', 0.2);
        });
    };

    p.showHideSoundInfoComponent = function() {
        this._soundInfoComponent.show(true);
        const yPos = this._soundInfoComponent.y === 0 ? -49 : 0;
        createjs.Tween.get(this._soundInfoComponent).to({y:yPos}, 500, createjs.Ease.cubicIn).call(()=>{
            if(this._soundInfoComponent.y === -49){
                this._soundInfoComponent.show(false);
            }
        })
    };

    p.onInfoButton = function() {
        system.SoundManager.play('drawChangeCollectButtonSound');
        this._infoPanel.visible = !this._infoPanel.visible;
    };

    p.onSoundButton = function() {
        system.SoundManager.play('drawChangeCollectButtonSound');
        system.SoundManager.muteAllSounds();
    };

    p.onGambleButton = function(choosenValue) {
        const response = this._communicator.onGamble(choosenValue);
        const enableButton = response.totalWin !== '0.00';
        this._controlboardComponent.enableDrawChangeCollectButton(enableButton);
        this._controlboardComponent.updateWin(response.totalWin);
        this._gambleComponent.revealCard(response.card, response.previousCards, response.totalWin);
    };

    p.gambleLost = function() {
        this._state = 'draw';
        this._gambleComponent.activateGamble(false);

        this._paytableComponent.updateForWin('noWin');
        this._paytableComponent.updateBonusWin('0.00');

        this._controlboardComponent.enableDrawChangeCollectButton(true);
        this._controlboardComponent.enableBetButton(true);
        this._controlboardComponent.updateDrawChangeCollectButtonText();
    };

    p.onDrawChangeCollect = function() {
        const method = '_' + this._state;
        this[method]();
    };

    p.getState = function() {
        return this._state;
    };

    p.betChanged = function(currentBet) {
        this._paytableComponent.updateForBet(currentBet);
        this._communicator.updateBet(currentBet);
    };

    p.render = function(e){
        stage.update(e);
    };

    system.VideoPokerGame = createjs.promote(VideoPokerGame,"Container");
})();


