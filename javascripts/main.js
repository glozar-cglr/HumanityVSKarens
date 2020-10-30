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
const yOffSet = canvas.height *0.15
const numRows = 6;
const height = canvas.height*0.85
const boxSize = height/numRows;
const row = [
    {y: yOffSet-boxSize*0.3,
    characters: []},
    {y: yOffSet+boxSize-boxSize*0.3,
    characters: []},
    {y: yOffSet+boxSize*2-boxSize*0.3,
    characters: []},
    {y: yOffSet+boxSize*3-boxSize*0.3,
    characters: []},
    {y: yOffSet+boxSize*4-boxSize*0.3,
    characters: []},
    {y: yOffSet+boxSize*5-boxSize*0.3,
    characters: []}
]
const charHeight = boxSize*1.2

//3. Setting the background correctly

class Background {
    constructor() {
        this.x = 0;
        this.speed = -1;
        
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
            ctx.fillRect(x,yOffSet,boxSize,height);
            x+=boxSize
        };
        let y = yOffSet;
        while (y<canvas.height) {
            ctx.fillStyle = 'rgba(167,185,204,0.2)';
            ctx.fillRect(0,y,canvas.width,boxSize);
            y+= boxSize*2
        };
    }

    drawMovable () {
        this.move();
        ctx.drawImage(this.imageMovable, this.x, 0, canvas.width*0.6, yOffSet);
        ctx.drawImage(this.imageMovable, this.x+canvas.width*0.6, 0, canvas.width*0.6, yOffSet);
        ctx.drawImage(this.imageMovable, this.x+canvas.width*1.2, 0, canvas.width*0.6, yOffSet);
    }

    drawFixed () {
        ctx.drawImage(this.imageFixed, 0, yOffSet, canvas.width, (canvas.height-yOffSet));
        this.grid();
    }
}

const background = new Background();

class Vaccine {
    constructor(x,y,loc) {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.width = 40;
        this.height = 10;
        this.power = 2;

        const img = new Image ();
        img.src = "./images/characters/vaccine.png";
        img.addEventListener("load", () => {
            this.img = img;
            this.draw();
        });

        row[loc].characters.push(this);
        this.rowId = row[loc].characters.lenght -1
    }

    move() {
        this.x += this.speed;
        if (this.x > canvas.width) {
            vaccines.splice(vaccines.indexOf(this),1);
            row[loc].characters.splice(rowId,1);;
        };
    };

    draw() {
        this.move();

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    };

    collision (){
        row[loc].characters.forEach(e => {

        })
    }

}


// Function to draw the vaccines 

function drawVaccines () {
    vaccines.forEach(function (vaccine, iV) {
        vaccine.draw()
    })
}

// Working on the Shooter

class Shooter {
    constructor() {
        this.y = row[3].y;
        this.row = 3
        this.x = 0;
        this.width = boxSize;
        this.height = boxSize*1.2;
        this.life = 20;

        const img = new Image ();
        img.src = "./images/characters/sniper.png";
        img.addEventListener("load", () => {
            this.img = img;
            this.draw();
        })
        
        row[3].characters.push(this)
    };

    move(event) {
        switch (event) {
            case 87:
                if (this.row > 0) {
                    row[this.row].characters.shift();
                    this.row--;
                    this.y = row[this.row].y;
                    row[this.row].characters.unshift(this);
                }
                break;
            case 83: 
                if (this.row < 5) {
                    row[this.row].characters.shift();
                    this.row++;
                    this.y = row[this.row].y;
                    row[this.row].characters.unshift(this);
            }
                break;
        }
    };

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    };

    shoot() {
        vaccines.push(new Vaccine(this.x + boxSize*0.2,this.y + this.height/2,this.row));
    };

}

const doctor = new Shooter()


// 4. Defining the aspects of the karens

const imgKaren1 = new Image(),
imgKaren2 = new Image(),
imgKaren3 = new Image();

imgKaren1.src = "./images/characters/Karen1.png";
imgKaren2.src = "./images/characters/Karen 2.png";
imgKaren3.src = "./images/characters/Karen3.png";

const Karens = [
    {
        img: imgKaren1,
        life: 10,
        power: 2,
        resistance: 1,
        speed: -1
    },
    {
        img: imgKaren2,
        life: 20,
        power: 4,
        resistance: 2,
        speed: -2
    },
    {
        img: imgKaren3,
        life: 30,
        power: 6,
        resistance: 2,
        speed: -3
    }
];

class Karen {
    constructor (x, y, object) {
        this.x = x;
        this.y = y;
        this.life = object.life;
        this.power = object.power;
        this.resistance = object.resistance;
        object.img.addEventListener("load", () => {
            this.img = object.img;
            this.draw();
        })
    };

    move() {
        this.x += this.speed;
    };

    draw() {
        this.move();
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    };

    attach(affected){}
    
}

function start() {

    interval = setInterval(() => {
        frames++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.drawMovable();
        background.drawFixed();
        doctor.draw();
        drawVaccines();
    }, 1000/120);
};

addEventListener("keydown", function (event) {
    if (event.keyCode === 87 || event.keyCode === 83) {
        doctor.move(event.keyCode)
    } else if (event.keyCode === 32) {
        doctor.shoot();
    }

}) 

start();