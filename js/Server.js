
this.system = this.system || {};
(function(){
    "use strict";

    const Server = function(){
        this.init();
    };

    const p = Server.prototype;
    p._cards = null;
    p._gambleCards = null;
    p._gambleCardsPassed = null;
    p._playerCards = null;
    p._baseWin = null;
    p._bonusWin = null;
    p._totalWin = null;
    p._winType = null;
    p._isStraight = false;
    p._paytableInfo = null;
    p._balance = null;
    p._betLevels = null;
    p._currentBet = null;

    p.init = function () {
        this._cards = [];
        this._gambleCards = [];
        this._gambleCardsPassed = [];
        this._betLevels = [1, 5, 20, 50, 100];
        this._balance = 100;
        this._currentBet = this._betLevels[0];
        this._winType = 'noWin';
        this._baseWin = 0.00;
        this._bonusWin = 0.00;
        this._totalWin = 0.00;
        this._paytableInfo = [
            {winType:'royalFlush', multiplier:250},
            {winType:'straightFlush', multiplier:50},
            {winType:'poker', multiplier:25},
            {winType:'full', multiplier:8},
            {winType:'flush', multiplier:5},
            {winType:'straight', multiplier:4},
            {winType:'threeOfKind', multiplier:3},
            {winType:'twoPairs', multiplier:2},
            {winType:'pair', multiplier:1},
            ];
        
        const symbols = ['hearts', 'diamonds', 'spades', 'clubs']; // spade = list
        for(let i = 0; i < 4; i++){
            for(let j = 2; j < 15; j++){ // 11 = J / 12 = Q / 13 = K / 14 = A
                const card = {
                    symbol:symbols[i],
                    number:j
                };
                this._cards.push(card);
                this._gambleCards.push(card);
            }
        }
    };

    p.dealFirstDrawCards = function() {
        this._playerCards = [];
        if(this._balance < this._currentBet){
            // RESPONSE
            return {message:'Not enough money to play'}
        }
        this._balance -= this._currentBet;
        for(let i = 0; i < 5; i++){
            const numOfCards = this._cards.length - 1;
            let cardIndex = system.CustomMethods.getRandomNumberFromTo(1, numOfCards); // pocinje od 1 zato sto je index 0 cardBack slika
            const card = this._cards[cardIndex];
            this._playerCards.push(card);
            this._cards.splice(cardIndex,1);
        }

        this._checkForWinType();
        this._setWin();

        // RESPONSE
        const playerCards = this._playerCards.slice(0);
        const winType = this._winType;
        const newBalance = this._balance.toFixed(2);
        const bonusWin = this._bonusWin.toFixed(2);
        const totalWin = this._totalWin.toFixed(2);
        return {'cards':playerCards, 'winType':winType, 'balance':newBalance, 'bonusWin':bonusWin, 'totalWin':totalWin};
    };

    p._checkForWinType = function() {
        this._winType = 'noWin';
        this._checkSameNumbersWin();
        // ako postoji win u prvoj proveri nemoguce je da postoji i u nekoj od sledecih
        if(this._winType === 'noWin'){
            this._checkForStraight();
            this._checkForFlush();
        }
    };

    p._checkForFlush = function() {
        let playerCards = this._playerCards;

        let i;
        let numOfLoops = playerCards.length;
        let symbol = playerCards[0].symbol;
        for(i = 1; i < numOfLoops; i++){
            if(symbol !== playerCards[i].symbol){
                break;
            }
        }
        const isFlush = i === numOfLoops;
        if(isFlush === true){
            if(this._winType === 'straight'){
                if(this._playerCards[4].number === 14){
                    this._winType = 'royalFlush';
                }else {
                    this._winType = 'straightFlush';
                }
            }else{
                this._winType = 'flush';
            }
        }
    };

    p._checkForStraight = function() {
        let playerCardsCopy = this._playerCards.slice(0);
        playerCardsCopy.sort(function(a, b) {
            return a.number - b.number;
        });

        let i;
        let numOfLoops = playerCardsCopy.length-1;
        for(i = 0; i < numOfLoops; i++){
            let nextInd = i + 1;
            let nextNum = playerCardsCopy[nextInd].number;
            let currentNum = playerCardsCopy[i].number;
            if(currentNum !== (nextNum - 1)){
                break;
            }
        }
        this._winType = i === numOfLoops ? 'straight' : 'noWin';
    };

    p._checkSameNumbersWin = function() {
        let pairs = [];

        let playerCardsCopy = this._playerCards.slice(0);

        for(let i = playerCardsCopy.length-1; i > -1; i--){
            let card = playerCardsCopy[i];
            playerCardsCopy.splice(i,1);
            let twinsArr = [];

            for(let n = playerCardsCopy.length-1; n > -1; n--){
                let compareCard = playerCardsCopy[n];

                if(card.number === compareCard.number){
                    if(twinsArr.length === 0){
                        twinsArr.push(card);
                    }
                    twinsArr.push(compareCard);
                    playerCardsCopy.splice(n,1);
                    i--;
                }
            }
            if(twinsArr.length > 0){
                pairs.push(twinsArr);
            }
        }
        if(pairs.length === 1){
            switch (pairs[0].length){
                case 2:
                    this._winType = 'pair';
                    break;
                case 3:
                    this._winType = 'threeOfKind';
                    break;
                case 4:
                    this._winType = 'poker';
                    break;
            }
        }else if(pairs.length === 2){
            if(pairs[0].length === pairs[1].length){
                this._winType = 'twoPairs';
            }else{
                this._winType = 'full';
            }
        }
    };
    
    p._setWin = function() {
        this._baseWin = 0.00;
        this._bonusWin = 0.00;
        if(this._winType !== 'noWin'){
            let winObj = this._paytableInfo.find((win)=> {
                return win.winType === this._winType;
            });
            this._baseWin = this._currentBet * winObj.multiplier;
            this._playerCards.forEach((card)=>{
                this._bonusWin += card.number;
            });
            this._bonusWin = (this._bonusWin/100) * this._currentBet;
        }
        this._totalWin = this._baseWin + this._bonusWin;
    };

    p.getChangedCards = function(cardsArr) {
        const numOfCardsToChange = cardsArr.length;
        let playerCards = this._playerCards;
        let changedCards = [];
        // prvo treba da se izbace karte koje hocemo da menjamo iz niza
        for(let j = 0; j < cardsArr.length; j++){
            const cardToChange = cardsArr[j];
            for(let n = playerCards.length-1; n > -1; n--){
                if(cardToChange.symbol === playerCards[n].symbol && cardToChange.number === playerCards[n].number){
                    playerCards.splice(n,1);
                }
            }
        }
        // kada smo izbacili karte koje hocemo da menjamo iz niza playerCards dodajemo nove random karte
        for(let i = 0; i < numOfCardsToChange; i++){
            const numOfCardsInDeck = this._cards.length - 1;
            const cardIndex = system.CustomMethods.getRandomNumberFromTo(0, numOfCardsInDeck);
            const card = this._cards[cardIndex];
            playerCards.push(card);
            changedCards.push(card);
            this._cards.splice(cardIndex,1);
        }

        this._checkForWinType();
        this._setWin();
        // posto je u ovom trenutku igra gotova tj nema novih deljenja mozemo da vratimo sve karte u spil
        this._cards = this._cards.concat(cardsArr);
        this._cards = this._cards.concat(playerCards);

        // RESPONSE
        const winType = this._winType;
        const bonusWin = this._bonusWin.toFixed(2);
        const totalWin = this._totalWin.toFixed(2);
        return {'cards':changedCards, 'winType':winType, 'bonusWin':bonusWin, 'totalWin':totalWin};
    };

    p.setBet = function(bet) {
        this._currentBet = bet;
    };

    p.collectWin = function() {
        this._balance += this._totalWin;
        // RESPONSE
        const balance = this._balance.toFixed(2);
        return {balance:balance}
    };

    p.getGambleCard = function() {
        const numOfCards = this._gambleCards.length - 1;
        let cardIndex = system.CustomMethods.getRandomNumberFromTo(1, numOfCards); // pocinje od 1 zato sto je index 0 cardBack slika
        const card = this._gambleCards[cardIndex];
        this._gambleCardsPassed.unshift(card);
        this._gambleCards.splice(cardIndex,1);

        if(this._gambleCardsPassed.length > 20) { // 40 = proizvoljan broj , nema nekog posebnog razloga
            const cardsToGetBack = this._gambleCardsPassed.splice(8,20);
            this._gambleCards = this._gambleCards.concat(cardsToGetBack);
        }
        return card;
    };

    p.onGamble = function(gambleValue) {
        const currentCard = this._gambleCardsPassed[0];
        const newCard = this.getGambleCard();
        const method = '_checkFor' + gambleValue;
        // RESPONSE
        this[method](currentCard, newCard);
        return {
            card:newCard,
            totalWin:this._totalWin.toFixed(2),
            previousCards:this._gambleCardsPassed.slice(0,8) // 8 = broj koliko predhodnih karata prikazuje u gamble component
        }
    };

    p._checkForHigh = function(currentCard, newCard) {
        if(newCard.number > currentCard.number){
            this._totalWin *= 2;
        }else {
            this._totalWin = 0;
        }
    };

    p._checkForLow = function(currentCard, newCard) {
        if(newCard.number < currentCard.number){
            this._totalWin *= 2;
        }else {
            this._totalWin = 0;
        }
    };

    p.getStartingInfo = function() {
        // RESPONSE
        return {
            betLevels:this._betLevels,
            balance:this._balance.toFixed(2),
            paytableInfo:this._paytableInfo,
            gambleCard:this.getGambleCard()
        }
    };

    p.logCards = function() {
        if(this._gambleCards){
            console.log(this._gambleCards.length);
        }
    };

    system.Server = Server;
})();