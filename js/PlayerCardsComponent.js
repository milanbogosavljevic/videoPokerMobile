
this.system = this.system || {};
(function(){
    "use strict";

    const PlayerCardsComponent = function(cards){
        this.Container_constructor();
        this.init(cards);
    };

    const p = createjs.extend(PlayerCardsComponent,createjs.Container);

    p._cardsInHand = null;
    p._cardsTochange = null;
    p._cardsAtlas = null;
    p._cardsJson = null;

    p.init = function (cards) {
        this._cardsInHand = [];
        this._cardsTochange = [];
        this._cardsAtlas = system.CustomMethods.makeImage('cardsAtlas', true);
        this._cardsJson = queue.getResult("cardsJson");

        this._makeCardObjects(cards);

/*        this.on('tick', ()=>{
            console.log(this._cardsInHand.length);
        })*/
    };

    p._makeCardObjects = function(cards) {
        for(let i = 0; i < cards.length; i++){
            let number = cards[i].number;
            let symbol = cards[i].symbol;
            let cardName = number + symbol;
            let cardImage = system.CustomMethods.makeImageFromAtlas(this._cardsAtlas, this._cardsJson, cardName, true);
            let card = new system.Card(cardImage, number, symbol);
            //card.name = cardName;
            card.x = i * 150;

            this._cardsInHand.push(card);
            this.addChild(card);
        }
    };

    p.setStartCards = function(cards) {
        for(let i = 0; i < cards.length; i++){
            this._cardsInHand[i].updateCard(cards[i], this._cardsJson);
        }
    };

    p.getCardsToChange = function() {
        for(let i = 0; i < this._cardsInHand.length; i++){
            if(this._cardsInHand[i].isForchange()){
                this._cardsTochange.push(this._cardsInHand[i]);
            }
        }

        return this._cardsTochange;
    };

    p.updateCards = function(changedCards) {
        for(let i = 0; i < changedCards.length; i++){
            this._cardsTochange[i].updateCard(changedCards[i], this._cardsJson);
        }
        this._unholdCards();
    };

    p._unholdCards = function() {
        for(let i = 0; i < this._cardsInHand.length; i++){
            this._cardsInHand[i].unholdCard();
        }
    };

    p.resetCards = function() {
        this._cardsTochange = [];
        const resetCardObj = {number:'card',symbol:'Back'};
        for(let i = 0; i < this._cardsInHand.length; i++){
            this._cardsInHand[i].updateCard(resetCardObj, this._cardsJson);
        }
    };

    p.selectCardByKeyboard = function(index) {
        this._cardsInHand[index].toggleHold();
    };

    p.enableCardsClick = function(enable) {
        this.mouseEnabled = enable;
    };

    p.isEnabled = function() {
        return this.mouseEnabled;
    };

    system.PlayerCardsComponent = createjs.promote(PlayerCardsComponent,"Container");
})();


