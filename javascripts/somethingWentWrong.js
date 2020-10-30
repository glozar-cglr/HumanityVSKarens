//1. Load all the images for the background and characters

//1.a. Get the background loaded

const imgBckgMove = new Image();
imgBckgMove.src = "./images/background/background.png";

//1.b. Get the road where the grid will be drawn

const imgBckgFixed = new Image();
imgBckgFixed.src = "./images/background/road.png"

//1.c. Get the image for the enemy Karens



//1.d. Get the images for the snipper/doctor and its bullet

const imgSniper = new Image(),
imgBullet = new Image();
imgSniper.src = "./images/characters/sniper.png";
imgBullet.src = "./images/characters/vaccine.png";

//1.e. Get the images for the helpful assets

const imgWall = new Image(),
imgCharger = new Image(),
imgEnergy = new Image(),
imgShotter = new Image();

imgWall.src = "./images/characters/manager.png";
imgCharger.src = "./images/characters/5gTower.png";
imgEnergy.src = "./images/characters/information.png";
imgShotter.src = "./images/characters/nurse.png";


//1.e Creating an array all the images from above of the potential characters
const imagesArray =  [imgBckgFixed,imgBckgMove, imgKaren1,imgKaren2, imgKaren3, imgShotter, imgSniper, imgWall, imgCharger, imgEnergy, imgBullet];
const loadedAssets = {
    counter: 0,
    totalImages: imagesArray.length,

    onloadCallback: function() {
        this.counter++;
    },

    allLoadedImgs: function() {
        imagesArray.forEach(e => e.onload = this.onloadCallback())
        if (this.counter == this.totalImages) {
            updateBackground();
        };
    }
};

//Staring the Interactions with the canvas .... Working on displaying the background

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d")

//2. Working directly with the background of the game

//   2.a. Setting what's needed for the movable background
const yOffsetBkg = canvas.height*0.1;
const movableBkg = {
    img: imgBckgMove,
    x: 0,
    speed : -2,

    move: function (){
        this.x += this.speed;
        this.x %= canvas.width;
    },

    draw: function () {
        ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.x, 0, canvas.width , yOffsetBkg);
    }
}

//    Setting the fixed background

const fixedBkg = {
    img: imgBckgFixed,
    x: 0,
    y: yOffsetBkg,
    
    draw: function (){
        ctx.drawImage(this.img,this.x, this.y, canvas.width, canvas.height)
    }
}

//    Drawing the grid that will appear up top

const numRows = 6;
const boxSize = (canvas.height-yOffsetBkg)/numRows
function drawGrid() {
    let x = 0;
    while (x<canvas.width) {
        x+= boxSize;
        ctx.fillStyle = 'rgba(146,163,179,0.2)';
        ctx.fillRect(x,0,boxSize,canvas.height);
        x+=boxSize
    };
    let y = 0;
    while (y<canvas.height) {
        ctx.fillStyle = 'rgba(167,185,204,0.2)';
        ctx.fillRect(0,y,canvas.width,boxSize);
        y+= boxSize*2
    };
}




//Defining the function that will be in charge of updating the background
function updateBackground () {
    movableBkg.draw();
    fixedBkg.draw();
    drawGrid();
}






