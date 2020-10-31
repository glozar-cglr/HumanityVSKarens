// 1. Start with the basics
let canvas  = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//2. Will place here the variables to use along the code

let frames = 0;
let karenFrameGeneration = 120
let energy = 50;
let karens = [];
const vaccines = [];
const colissions = [];
let countVaccines = 0;
let score = 0;
let interval;
let requestId;
const yOffSet = canvas.height *0.15
const numRows = 6;
const height = canvas.height*0.85
const boxSize = height/numRows;
const row = [
    {y: yOffSet-boxSize*0.3},
    {y: yOffSet+boxSize-boxSize*0.3},
    {y: yOffSet+boxSize*2-boxSize*0.3},
    {y: yOffSet+boxSize*3-boxSize*0.3},
    {y: yOffSet+boxSize*4-boxSize*0.3},
    {y: yOffSet+boxSize*5-boxSize*0.3}
]
const charHeight = boxSize*1.2;
let collisionImg = new Image();
collisionImg.src = "./images/characters/boom.png";
let vaccineImg = new Image();
vaccineImg.src = "./images/characters/vaccine.png";
let logoImg = new Image();
logoImg.src = "./images/logo.png";
let gameOverImg = new Image();
gameOverImg.src = "./images/otherAssets/gameOver.gif";
let enterKey = new Image();
enterKey.src = "./images/otherAssets/enterKey.png"

// Bringing the audios to be used in the game 

let audioBackground = new Audio();
audioBackground.loop = true;
audioBackground.src = "./audios/backgroundAudio.m4a";

let audioKarenDeath = new Audio();
audioKarenDeath.loop = false;
audioKarenDeath.stc = "./audios/karenDeath.mp3";

let audioKarenHit = new Audio();
audioKarenHit.loop = false;
audioKarenHit.src = "./audios/karenHit.mp3";

let audioGameOver = new Audio();
audioGameOver.loop = false;
audioGameOver.src = "./audios/GameOver.mp3"

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
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.width = 40;
        this.height = 10;
        this.power = 5;
        this.type = "vaccine";
        this.img = vaccineImg;

    }

    move() {
        this.x += this.speed;
    };

    draw() {
        this.move();
        if (this.x > canvas.width) {
            vaccines.splice(vaccines.indexOf(this),1);
        } else {ctx.drawImage(this.img, this.x, this.y, this.width, this.height)}
    };

    collision (karen){
        return(this.x<karen.rightLimit && 
            this.x + this.width > karen.leftLimit &&
            this.y < karen.y + karen.height &&
            this.y + this.height > karen.y)

    };

    hit (object){
        object.life -= this.power
    };

}

// Creating a Class that will allow me to show a boom when it collides

class BoomCollision {
    constructor (x, y, height, width) {
        this.count = 0;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.img = collisionImg;
    };

    draw () {
        this.count += 1;
        if (this.count > 15) {
            colissions.splice(colissions.indexOf(this),1);
        } else {ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    };
}

// Working on the Shooter

class Shooter {
    constructor() {
        this.y = row[3].y;
        this.row = 3
        this.x = 0;
        this.width = boxSize;
        this.height = charHeight;
        this.life = 20;
        this.type = "shooter";
        this.leftLimit = 5;
        this.rightLimit = boxSize - 25

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
            case 38:
                if (this.row > 0) {
                    this.row--;
                    this.y = row[this.row].y;
                }
                break;
            case 83: 
            case 40:
                if (this.row < 5) {
                    this.row++;
                    this.y = row[this.row].y;
            }
        }
    };

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    };

    shoot() {
        vaccines.push(new Vaccine(this.x + boxSize*0.2,this.y + this.height/2));
        console.log(vaccines);
    };

    collision (karen){
        return(this.leftLimit<karen.rightLimit && 
            this.rightLimit > karen.leftLimit &&
            this.y < karen.y + karen.height &&
            this.y + this.height > karen.y &&
            this.row == karen.row) 
    };

    printLife () {
        document.getElementById("printLife").innerHTML = this.life
    }

}

const doctor = new Shooter()
doctor.printLife();
window.addEventListener("load", () => {firstScreen();})

// 4. Defining the aspects of the karens


const karenTypes = [
    {
        img: "./images/characters/Karen3.png",
        life: 10,
        power: 2,
        speed: -1,
        leftStretch: boxSize/3,
        rightStretch: boxSize/4,
        score: 15
    },
    {
        img: "./images/characters/Karen 2.png",
        life: 20,
        power: 3,
        speed: -2,
        leftStretch: boxSize/4,
        rightStretch:boxSize/4,
        score: 25
    },
    {
        img: "./images/characters/Karen1.png",
        life: 30,
        power: 5,
        speed: -3,
        leftStretch: boxSize/5,
        rightStretch: boxSize/5,
        score: 50
    }
];

class Karen {
    constructor (loc, object) {
        this.x = canvas.width;
        this.y = row[loc].y;
        this.row = loc;
        this.width = boxSize;
        this.height = charHeight;
        this.speed = object.speed
        this.life = object.life;
        this.power = object.power;
        this.score = object.score;
        this.type = "karen";
        this.img = new Image();
        this.img.src= object.img;
        this.leftLimit = canvas.width + object.leftStretch;
        this.rightLimit = canvas.width + this.width - object.rightStretch;
    };

    move() {
        this.x += this.speed;
        this.leftLimit  += this.speed;
        this.rightLimit += this.speed;
    };

    draw() {
        this.move();
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    };

    attack(doctor){
        doctor.life -= this.power;
        colissions.push(new BoomCollision(this.x-boxSize/3, this.y + boxSize/4,boxSize/2,boxSize/2))
        this.x += 150
        this.leftLimit += 150;
        this.rightLimit += 150;
    }

}

// Functions to draw and generate


// Generate and draw Karens
function generateKarensLvl1 () {
    const loc = Math.floor(Math.random()*6)
    const karentype = karenTypes[Math.floor(Math.random()*2)]
    const karen = new Karen(loc,karentype);
    if(frames % karenFrameGeneration == 0) {
        console.log(karenFrameGeneration)
        karens.push(karen);
    }
}

function generateKarensLvl2 () {
    const loc = Math.floor(Math.random()*6)
    const karentype = karenTypes[Math.floor(Math.random()*3)]
    const karen = new Karen(loc,karentype);
    if(frames % karenFrameGeneration == 0) {
        karens.push(karen);
    }
}

function generateKarensLvl3 () {
    const loc = Math.floor(Math.random()*6)
    const karentype = karenTypes[Math.floor(Math.random()*2)+1]
    const karen = new Karen(loc,karentype);
    if(frames % karenFrameGeneration == 0) {
        karens.push(karen);
    }
}

function generateKarensLvl4 () {
    const loc = Math.floor(Math.random()*6)
    const karentype = karenTypes[3]
    const karen = new Karen(loc,karentype);
    if(frames % karenFrameGeneration == 0) {
        karens.push(karen);
    }
}

function generateKarens () {
    ctx.fillStyle = "red"
    ctx.font = "30px Fjalla One"
    ctx.textAlign = "center"
    frames % 1000 == 0? karenFrameGeneration -= 5 : null;
    frames < 1500 ? generateKarensLvl1() : 
    frames < 2000 ? ctx.fillText("The worst is yet to come...", canvas.width/2, yOffSet + 30) :
    frames < 3000 ? generateKarensLvl2() :
    frames < 3500 ? ctx.fillText("More are coming...", canvas.width/2, yOffSet + 30):
    frames < 4500 ? generateKarensLvl3() :
    frames < 5000 ? ctx.fillText("Your time to survive...", canvas.width/2, yOffSet + 30) :
    generateKarensLvl4();
}



function drawKarens () {
    karens.forEach(function(karen, idKaren){
        if (karen.life <=0) {
            score += karen.score;
            colissions.push(new BoomCollision(karen.x, karen.y, karen.height, karen.width));
            audioKarenDeath.play();
            karens.splice(idKaren,1)
        };
        karen.draw();
        if (karen.leftLimit < 0){
            karens.splice(idKaren,1)
            gameOver();
        }
        if (doctor.collision(karen)) {
            doctor.life
            karen.attack(doctor);
            doctor.life <= 0 ? gameOver() : null;
        }
        colissions.forEach(function (boom, iB){
            boom.draw();
        })

        vaccines.forEach(function (vaccine, iV) {
            if (vaccine.collision(karen)) {
                vaccines.splice(iV,1);
                vaccine.hit(karen);
            } else {vaccine.draw(
            )};
        })
        
        
    });
};

function printScore() {
    document.getElementById("printScore").innerHTML = score;
    document.getElementById("printLife").innerHTML = doctor.life
}

function gameOver() {
    audioBackground.pause();
    audioGameOver.play();
    console.log("se acaba el juego");
    ctx.fillStyle = "white"
    ctx.fillRect(canvas.width/8,yOffSet,canvas.width - canvas.width/4, canvas.height - yOffSet*2)
    ctx.drawImage(logoImg,canvas.width/4,yOffSet + 30,canvas.width - canvas.width/2, 150)
    ctx.drawImage(gameOverImg,canvas.width/3,yOffSet+150,canvas.width - canvas.width/1.5,120)
    ctx.font =  "20px Fjalla One"
    ctx.textAlign = "center";
    ctx.fillStyle = "#022737";
    ctx.fillText(`The Karens took over. You reached ${score} points`, canvas.width/2, yOffSet+300, canvas.width - canvas.width/3)
    requestId = undefined;
}

function firstScreen() {
    ctx.fillStyle = "white"
    ctx.fillRect(canvas.width/8,yOffSet,canvas.width - canvas.width/4, canvas.height - yOffSet*2)
    ctx.drawImage(logoImg,canvas.width/4,yOffSet + 30,canvas.width - canvas.width/2, 150)
    ctx.drawImage(enterKey,canvas.width/2.3,yOffSet+200,canvas.width - canvas.width/1.15,50)
    ctx.font =  "20px Fjalla One"
    ctx.textAlign = "center";
    ctx.fillStyle = "#022737";
    ctx.fillText(`Press ENTER to start`, canvas.width/2, yOffSet+300, canvas.width - canvas.width/3)
}

function start() {
    audioBackground.play();
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.drawMovable();
    background.drawFixed();
    doctor.draw();
    generateKarens();
    drawKarens();
    printScore();
    if (!requestId) {return false} else {
        requestId = requestAnimationFrame(start)
    }
};

addEventListener("keydown", function (event) {
    event.preventDefault()
    if (event.keyCode === 87 || event.keyCode === 83 || event.keyCode === 38 || event.keyCode === 40) {
        doctor.move(event.keyCode)
    } if (event.keyCode === 32) {
        doctor.shoot();
    } if (event.keyCode === 13){
        requestId = requestAnimationFrame(start)
    }
}) 


