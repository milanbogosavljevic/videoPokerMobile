this.system = this.system || {};

(function() {
    "use strict";

    const CustomMethods = function() {};

    CustomMethods.makeText = function (txt,font,color,align,baseline) {
        const textField = new createjs.Text(txt, font, color);
        textField.textAlign = align;
        textField.textBaseline = baseline;
        textField.mouseEnabled = false;
        textField.tickEnabled = false;
        return textField;
    };

    CustomMethods.cacheText = function(text) {
        const align = text.textAlign;
        const baseline = text.textBaseline;
        const cacheWidth = text.getBounds().width;
        const cacheHeight = text.getBounds().height;

        let cacheX;
        let cacheY;

        switch (align){
            case 'left':
                cacheX = 0;
                break;
            case 'right':
                cacheX = cacheWidth * -1;
                break;
            case 'center':
                cacheX = (cacheWidth / 2) * -1;
                break;
        }

        switch (baseline){
            case 'alphabetic':
                cacheY = (cacheHeight * -1);
                break;
            case 'middle':
                cacheY = (cacheHeight / 2) * -1;
                break;
            case 'hanging':
                cacheY = 0;
                break;
        }

        text.cache(cacheX, cacheY, cacheWidth, cacheHeight);
    };

    CustomMethods.makeImage = function (id , clickable, centerImage) {
        const img = new createjs.Bitmap(queue.getResult(id));
        img.mouseEnabled = clickable;
        img.tickEnabled = false;
        if(centerImage === true){
            img.regX = img.image.width/2;
            img.regY = img.image.height/2;
        }
        return img;
    };

    CustomMethods.swapImages = function(original , newImage , updateRegX , updateRegY){
        original.image = queue.getResult(newImage);
        if(updateRegX === true){original.regX = original.image.width/2;}
        if(updateRegY === true){original.regY = original.image.height/2;}
    };

    CustomMethods.makeImageFromAtlas = function (atlas , json , imgName, clickable) {
        const imgPropsIndex = json.animations[imgName];
        const imgProps = json.frames[imgPropsIndex];
        const img = atlas.clone();
        img.sourceRect = new createjs.Rectangle(imgProps[0],imgProps[1],imgProps[2],imgProps[3]);
        img.mouseEnabled = clickable;
        img.tickEnabled = false;
        return img;
    };

/*    CustomMethods.playSound = function (id , vol , loop) {
        loop = loop || 0;
        vol = vol || 1;
        return createjs.Sound.play(id, {loop:loop, volume:vol});
    };*/

    CustomMethods.getLastChar = function (str) {
        return str.charAt(str.length - 1);
    };

    CustomMethods.makeAnimation = function (img,framesNum,fps,loop) {
        const sheet = queue.getResult(img);
        const singleWidth = sheet.width/framesNum;
        const singleHeight = sheet.height;
        const frames = framesNum - 1;
        const data = {
            images: [sheet],
            frames: {regX:singleWidth/2 , regY:singleHeight/2 ,width: singleWidth, height: singleHeight, count:framesNum},
            animations: {
                animate: [0, frames , loop]
            },
            framerate:fps
        };
        const bmpAnimation = new createjs.SpriteSheet(data);
        const animation = new createjs.Sprite(bmpAnimation);
        animation.mouseEnabled = false;
        return animation;
    };

    CustomMethods.getRandomNumberFromTo = function (from , to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    };

    CustomMethods.getRandomBool = function () {
        return Math.random() > 0.5;
    };

    CustomMethods.shuffleArr = function (arr) {
        arr.sort(function(a, b){return 0.5 - Math.random()});
        return arr;
    };

    CustomMethods.formatTime = function (timeInSeconds) {
        let secondsLeft = timeInSeconds;

        let hours = Math.floor(timeInSeconds/3600);
        secondsLeft -= (hours * 3600);

        let minutes = Math.floor(secondsLeft/60);
        secondsLeft -= (minutes * 60);

        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        secondsLeft = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;

        return `${hours} : ${minutes} : ${secondsLeft}`;
    };

    system.CustomMethods = CustomMethods;
})();