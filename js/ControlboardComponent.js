
this.system = this.system || {};
(function(){
    "use strict";

    const ControlboardComponent = function(game, betLevels, balance){
        this.Container_constructor();
        this._init(game, betLevels, balance);
    };

    const p = createjs.extend(ControlboardComponent,createjs.Container);

    p._game = null;

    p._drawChangeCollectButton = null;
    p._betButton = null;

    p._betLevels = null;
    p._currentBetIndex = null;
    p._betMarker = null;

    p._balanceText = null;
    p._winText = null;

    p._init = function (game, betLevels, balance) {
        this._game = game;
        this._betLevels = betLevels;
        this._currentBetIndex = 0;

        const back = system.CustomMethods.makeImage('controlboardBackground', false);
        this.addChild(back);
        this._setButtons();
        this._setTextFields();
        this.updateBalance(balance);
    };

    p._setTextFields = function() {
        const betTextLabel = system.CustomMethods.makeText('BET', '15px Russo One', '#f8fffd', 'center', 'middle');
        betTextLabel.x = 180;
        betTextLabel.y = 15;
        system.CustomMethods.cacheText(betTextLabel);

        const betMarker = this._betMarker = system.CustomMethods.makeImage('betMarker', false, true);
        betMarker.x = 122;
        betMarker.y = 50;
        this.addChild(betMarker);


        let startX = 122;
        let spacing = 29;
        for(let i = 0; i < this._betLevels.length; i++){
            let betValue = system.CustomMethods.makeText(this._betLevels[i], '12px Russo One', '#5b8bff', 'center', 'middle');
            betValue.x = startX + (spacing * i);
            betValue.y = 51;
            system.CustomMethods.cacheText(betValue);
            this.addChild(betValue);
        }

        const winTextlabel = system.CustomMethods.makeText('WIN', '15px Russo One', '#f8fffd', 'center', 'middle');
        winTextlabel.x = 480;
        winTextlabel.y = 15;
        system.CustomMethods.cacheText(winTextlabel);

        let winValue = this._winText = system.CustomMethods.makeText('0.00', '18px Russo One', '#ec5750', 'center', 'middle');
        winValue.x = winTextlabel.x;
        winValue.y = 51;
        system.CustomMethods.cacheText(this._winText);

        const balanceTextLabel = system.CustomMethods.makeText('BALANCE', '15px Russo One', '#f8fffd', 'center', 'middle');
        balanceTextLabel.x = 780;
        balanceTextLabel.y = 15;
        system.CustomMethods.cacheText(balanceTextLabel);

        let balanceValue = this._balanceText = system.CustomMethods.makeText('0', '18px Russo One', '#ec5750', 'center', 'middle');
        balanceValue.x = balanceTextLabel.x;
        balanceValue.y = 51;
        system.CustomMethods.cacheText(this._balanceText);

        this.addChild(betTextLabel,winTextlabel,winValue,balanceTextLabel,balanceValue);
    };

    p._setButtons = function() {
        let img2 = system.CustomMethods.makeImage('button', true);
        const bet = this._betButton = new system.Button(img2);
        bet.x = 64;
        bet.y = -25;
        const betText = system.CustomMethods.makeText('BET', '15px Russo One', '#3f3f3f', 'center', 'middle');
        system.CustomMethods.cacheText(betText);
        bet.addText(betText);
        bet.centerText();
        bet.on('click', (e)=>{
            this.onBet();
        });
        this.addChild(bet);

        let img = system.CustomMethods.makeImage('button', true);
        const drawChangeCollect = this._drawChangeCollectButton = new system.Button(img);
        drawChangeCollect.x = 896;
        drawChangeCollect.y = -25;
        drawChangeCollect.on('click', (e)=>{
            this.onDrawChangeCollect();
        });
        const drawText = system.CustomMethods.makeText('DRAW', '15px Russo One', '#3f3f3f', 'center', 'middle');
        drawChangeCollect.addText(drawText);
        drawChangeCollect.centerText();
        this.addChild(drawChangeCollect);
    };

    p._updateBet = function() {
        this._currentBetIndex++;
        let maxIndex = this._betLevels.length - 1;
        if(this._currentBetIndex > maxIndex){
            this._currentBetIndex = 0;
        }
    };

    p._moveBetMarker = function() {
        this._betMarker.x = 122 + (this._currentBetIndex * 29);
    };

    p.onBet = function() {
        system.SoundManager.play('betSound', 0.2);
        this._updateBet();
        this._moveBetMarker();
        this._game.betChanged(this.getCurrentBet());
    };

    p.onDrawChangeCollect = function() {
        system.SoundManager.play('drawChangeCollectButtonSound');
        this._game.onDrawChangeCollect();
        this.updateDrawChangeCollectButtonText();
    };

    p.animateCollect = function() {
        let win = Number(this._winText.text);
        let balance = Number(this._balanceText.text);
        let valueToAdd = Number((win/10).toFixed(2));

        let collectiongInterval = setInterval(()=>{
            win -= valueToAdd;
            win = Number(win.toFixed(2));
            balance += valueToAdd;
            balance = Number(balance.toFixed(2));
            if(win > 0){
                this.updateWin(win);
                this.updateBalance(balance);
            }else{
                clearInterval(collectiongInterval);
                collectiongInterval = null;
                const event = new createjs.Event("collectingDone", true, true);
                this.dispatchEvent(event);
            }
        },100);
    };

    p.updateDrawChangeCollectButtonText = function() {
        let text = this._game.getState().toUpperCase();
        this._drawChangeCollectButton.updateText(text);
    };

    p.enableBetButton = function(enable) {
        this._betButton.enableClick(enable);
        this._betButton.alpha = enable === true ? 1 : 0.6;
    };

    p.enableDrawChangeCollectButton = function(enable) {
        this._drawChangeCollectButton.enableClick(enable);
        this._drawChangeCollectButton.alpha = enable === true ? 1 : 0.6;
    };

    p.getCurrentBet = function() {
        return this._betLevels[this._currentBetIndex];
    };

    p.updateWin = function(win) {
        this._winText.uncache();
        this._winText.text = win;
        system.CustomMethods.cacheText(this._winText);
    };

    p.updateBalance = function(balance) {
        this._balanceText.uncache();
        this._balanceText.text = balance;
        system.CustomMethods.cacheText(this._balanceText);
    };

    p.drawChangeCollectButtonIsEnabled = function() {
        return this._drawChangeCollectButton.isEnabled();
    };

    p.betButtonIsEnabled = function() {
        return this._betButton.isEnabled();
    };

    system.ControlboardComponent = createjs.promote(ControlboardComponent,"Container");
})();


