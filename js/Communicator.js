
this.system = this.system || {};
(function(){
    "use strict";

    const Communicator = function(){
        this.init();
    };

    const p = Communicator.prototype;
    p._server = null;

    p.init = function () {
        this._server = new system.Server();
    };

    p.getFirstDrawCards = function() {
        return this._server.dealFirstDrawCards();
    };

    p.changeCards = function(cardsArr) {
        return this._server.getChangedCards(cardsArr);
    };

    p.getStartingInfo = function() {
        return this._server.getStartingInfo();
    };

    p.updateBet = function(bet) {
        this._server.setBet(bet);
    };

    p.collectWin = function() {
        return this._server.collectWin();
    };

    p.onGamble = function(buttonPressed) {
        return this._server.onGamble(buttonPressed);
    };

    p.logCards = function() {
        this._server.logCards();
    };

    system.Communicator = Communicator;

})();