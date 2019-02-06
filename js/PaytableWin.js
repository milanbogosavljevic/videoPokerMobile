
this.system = this.system || {};
(function(){
    "use strict";

    const PaytableWin = function(type,multiplier,string){
        this.Container_constructor();
        this.init(type,multiplier,string);
    };

    const p = createjs.extend(PaytableWin,createjs.Container);
    
    p.winType = null;
    p._winTypeText = null;
    p._winValueText = null;
    p._winMultiplier = null;

    p.init = function (type,multiplier,string) {
        this.winType = type;
        this._winMultiplier = multiplier;

        this._winTypeText = system.CustomMethods.makeText(string, '15px Russo', '#56ea4c', 'left', 'hanging');
        system.CustomMethods.cacheText(this._winTypeText);
        this._winValueText = system.CustomMethods.makeText('0.00', '15px Russo', '#56ea4c', 'right', 'hanging');
        this._winValueText.x = 344;
        system.CustomMethods.cacheText(this._winValueText);

        this.addChild(this._winTypeText, this._winValueText);
    };

    p.updateWinValue = function(currentBet) {
        this._winValueText.uncache();
        this._winValueText.text = (currentBet * this._winMultiplier).toFixed(2);
        system.CustomMethods.cacheText(this._winValueText);
    };

    system.PaytableWin = createjs.promote(PaytableWin,"Container");
})();


