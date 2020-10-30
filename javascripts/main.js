// 1. Start with the basics
let canvas  = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//2. Will place here the variables to use along the code

let frames = 0;
const karens = [];
const energy = 50;
const vaccines = [];
let countVaccines = 0;
let score = 0;
let interval;
const numRows = 6;
const height = canvas.height*0.85
const boxSize = height/numRows;

//3. Setting the background correctly

class Background {
    constructor() {
        this.x = 0;
        this.speed = -2;
        this.yOffSet = canvas.height * 0.15;
        
        const imageMovable = new Image();
        imageMovable.src = "./images/background/background.png";
        imageMovable.addEventListener("load", () =>{
            this.imageMovable = imageMovable;
            this.drawMovable();
        })

        const imageFixed = new Image();
        imageFixed.src = "./images/background/road.png"
        imageFixed.addEventListener("load", () => {
            this.imageFixed = imageFixed;
            this.drawFixed();
        })
    };

    move () {
        this.x += this.speed;
        this.x %= canvas.width*0.6;
    };

    grid () {
        let x = 0;
        while (x<canvas.width) {
            x+= boxSize;
            ctx.fillStyle = 'rgba(146,163,179,0.2)';
            ctx.fillRect(x,this.yOffSet,boxSize,height);
            x+=boxSize
        };
        let y = this.yOffSet;
        while (y<canvas.height) {
            ctx.fillStyle = 'rgba(167,185,204,0.2)';
            ctx.fillRect(0,y,canvas.width,boxSize);
            y+= boxSize*2
        };
    }

    drawMovable () {
        this.move();
        ctx.drawImage(this.imageMovable, this.x, 0, canvas.width*0.6, this.yOffSet);
        ctx.drawImage(this.imageMovable, this.x+canvas.width*0.6, 0, canvas.width*0.6, this.yOffSet);
    }

    drawFixed () {
        ctx.drawImage(this.imageFixed, 0, this.yOffSet, canvas.width, (canvas.height-this.yOffSet));
        this.grid();
    }
}

const background = new Background();

class Vaccine {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.width = 
    }
}


class Shotter {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.width = boxSize;
        this.height = boxSize*1.2;

        const img = new Image ();
        img.src = "./images/characters/sniper.png";
        img.addEventListener("load", () => {
            this.img = img;
            this.draw();
        })
    };

    move(event) {
        switch (event) {
            case 87:
                this.y > background.yOffSet ? this.y-boxSize : null;
                break;
            case 83: 
                this.y < canvas.height ? this.y+boxSize : null;
                break
        }
    }

    


}