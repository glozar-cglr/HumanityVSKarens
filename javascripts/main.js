// 1. Start with the basics
let canvas  = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//2. Will place here the variables to use along the code

let frames = 0;
let karens = [];
const energy = 50;
const vaccines = [];
let countVaccines = 0;
let score = 0;
let interval;
let requestId;
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
        this.type = "vaccine";

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
        };
    };

    draw() {
        this.move();
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    };

    collision (karen){
        return(this.x<karen.x+karen.width && 
            this.x + this.width > karen.x &&
            this.y < karen.y + karen.height &&
            this.y + this.height > karen.y)

        
    };



    hit (object){
        object.life -= this.power
    };

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
        this.type = "shooter"

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

    collision (karen){
        return(this.x<karen.x+karen.width && 
            this.x + this.width > karen.x &&
            this.y < karen.y + karen.height &&
            this.y + this.height > karen.y) 
    };

}

const doctor = new Shooter()


// 4. Defining the aspects of the karens


const karenTypes = [
    {
        img: "./images/characters/Karen1.png",
        life: 10,
        power: 2,
        resistance: 1,
        speed: -1
    },
    {
        img: "./images/characters/Karen 2.png",
        life: 20,
        power: 4,
        resistance: 2,
        speed: -2
    },
    {
        img: "./images/characters/Karen3.png",
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
        this.width = 100;
        this.height = 200;
        this.speed = object.speed
        this.life = object.life;
        this.power = object.power;
        this.resistance = object.resistance;
        this.type = "karen";
        this.img = new Image();
        this.img.src= object.img;
    };

    move() {
        this.x -= 3;
    };

    draw() {
        this.move();
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    };

}

// Functions to draw and generate

//     Function to draw the vaccines 



// Generate and draw Karens
function generateKarens () {
    const y = Math.floor(Math.random()*6)
    const karentype = karenTypes[Math.floor(Math.random()*3)]
    const karen = new Karen(canvas.width,y*60,karentype);
    if(frames % 100 == 0) {
        karens.push(karen);
    }
}

function drawKarens () {
    karens.forEach(function(karen, idKaren){
        if (karen.life <=0) {
            karens.splice(idKaren,1)
        } if (karen.x+ karen.width < 0){
            karens.splice(idKaren,1)
        }
        if (doctor.collision(karen)) {
            console.log("se acaba el juego")
            requestId = undefined
        }
        karen.draw();
        vaccines.forEach(function (vaccine, iV) {
            if (vaccine.collision(karen)) {
                vaccines.splice(iV,1);
                vaccine.hit(karen);
            };
            vaccine.draw();
        })
    });
};

function start() {
        frames++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.drawMovable();
        background.drawFixed();
        doctor.draw();
        generateKarens();
        drawKarens();
        if (!requestId) {return false} else {
            requestId = requestAnimationFrame(start)
        }
};

addEventListener("keydown", function (event) {
    event.preventDefault()
    if (event.keyCode === 87 || event.keyCode === 83) {
        doctor.move(event.keyCode)
    } if (event.keyCode === 32) {
        doctor.shoot();
    } if (event.keyCode === 13){
        requestId = requestAnimationFrame(start)
    }
}) 

