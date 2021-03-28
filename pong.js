var canvas = document.getElementById("pong");
var context = canvas.getContext("2d");
context.fillStyle = "black";
context.fillRect(100, 200, 50, 75);
context.fillStyle = "red";
context.beginPath();
context.arc(300, 350, 100, 0, Math.PI * 2, false);

let rectX = 0;
// create user paddle
const user = {
    x: 0,
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
};
// create com paddle
const com = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
};
// create ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
}
//rect
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
};
//create the net
const net = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "WHITE",

};
//draw net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }

};
//circle
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
};
//text
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "45px fantasy";
    context.fillText(text, x, y);
};
// end text
// render function
function render() {
    // clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");

    //draw net

    // draw score
    drawText(user.score, canvas.width / 4, canvas.height / 5, "WHITE");
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");

    // draw paddels
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);



    rectX = rextX + 100;
};


//control the user paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height
}



// collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;


    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
};

// reset
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2
    ball.speed = 8;
    ball.velocityX = -ball.velocityX;
};

// update 
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //simple ai to control com paddle
    let computerLevel = 0.2;
    com.y += (ball.y - (com.y + com.height / 2)) * computerLevel


    if (ball.y + ball.radius > canvas.height ||
        ball.y - ball.radius < 0) {
        ball.velocityY = - ball.velocityY;
    };

    let player = (ball.x < canvas.width / 2) ? user : com;
    if (collision(ball, player)) {
        //where ball hit the player
        let collidePoint = (ball.y - (player.y + player.height / 2));

        // normilization
        collidePoint = collidePoint / (player.height / 2);

        //calculate angle in radian
        let angleRad = (Math.PI / 4) * collidePoint;

        //change direction
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        // change velocity x and y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);



        // ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        // ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += .5;
    };

    // update score

    if (ball.x - ball.radius < 0) {
        // com score
        com.score++;
        resetBall();
        if (com.score === 10){
            alert("Computer Wins! Try again?")
            com.score = 0;
            user.score = 0;
        }
    } else if (ball.x + ball.radius > canvas.width) {
        //player score
        user.score++;
        resetBall();
        if (user.score === 10){
            alert("You Win! Try again?")
            com.score = 0;
            user.score = 0;
        }
    };


};





// game
function game() {
    update();
    render();
}

//loop
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);




