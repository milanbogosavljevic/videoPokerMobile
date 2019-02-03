
this.system = this.system || {};
(function(){
    "use strict";

    const PaytableComponent = function(paytableArr){
        this.Container_constructor();
        this.init(paytableArr);
    };

    const p = createjs.extend(PaytableComponent,createjs.Container);

    p._winFields = null;
    p._winMarker = null;
    p._bonusWin = null;

    p.init = function (paytableArr) {
        this._winFields = [];
        const back = system.CustomMethods.makeImage('paytableBackground', false);
        this.addChild(back);
        this._winMarker = system.CustomMethods.makeImage('paytableMarker', false);
        this._winMarker.x = 9;
        this._winMarker.visible = false;
        this.addChild(this._winMarker);
        const startY = 12;
        const spacing = 22;
        for(let i = 0; i < paytableArr.length; i++){
            const type = paytableArr[i].winType;
            const multiplier = paytableArr[i].multiplier;
            const string = this.getStringForPaytableItem(type);
            const paytableWin = new system.PaytableWin(type, multiplier, string);
            paytableWin.x = 15;
            paytableWin.y = startY + (i * spacing);
            this._winFields.push(paytableWin);
            this.addChild(paytableWin);
        }
        const bonusWinLabel = system.CustomMethods.makeText('BONUS WIN', '18px Russo One', '#dcf799', 'left', 'hanging');
        bonusWinLabel.x = 68;
        bonusWinLabel.y = 214;
        system.CustomMethods.cacheText(bonusWinLabel);
        this.addChild(bonusWinLabel);

        const bonusWin = this._bonusWin = system.CustomMethods.makeText('0.00', '17px Russo One', '#dcf799', 'center', 'middle');
        bonusWin.x = 280;
        bonusWin.y = 222;
        system.CustomMethods.cacheText(bonusWin);
        this.addChild(bonusWin);
    };

    p.getStringForPaytableItem = function(type) {
        let string;
        switch (type){
            case 'pair':
                string = 'PAIR';
                break;
            case 'twoPairs':
                string = 'TWO PAIRS';
                break;
            case 'threeOfKind':
                string = 'THREE OF KIND';
                break;
            case 'straight':
                string = 'STRAIGHT';
                break;
            case 'flush':
                string = 'FLUSH';
                break;
            case 'full':
                string = 'FULL HOUSE';
                break;
            case 'poker':
                string = 'POKER';
                break;
            case 'straightFlush':
                string = 'STRAIGHT FLUSH';
                break;
            case 'royalFlush':
                string = 'ROYAL FLUSH';
                break;
        }
        return string;
    };

    p.updateForBet = function(bet) {
        this._winFields.forEach((field)=>{
            field.updateWinValue(bet);
        });
    };

    p.updateForWin = function(win) {
        if(win === 'noWin'){
            this._winMarker.visible = false;
        }else{
            let paytableWin = this._winFields.find((winField)=> {
                return winField.winType === win;
            });
            this._winMarker.y = paytableWin.y - 5;
            this._winMarker.visible = true;
        }
    };

    p.updateBonusWin = function(win) {
        this._bonusWin.uncache();
        this._bonusWin.text = win;
        system.CustomMethods.cacheText(this._bonusWin);
    };

    system.PaytableComponent = createjs.promote(PaytableComponent,"Container");
})();


