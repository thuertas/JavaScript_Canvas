//https://www.youtube.com/watch?v=yq2au9EfeRQ
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

//The canvas fills all the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//This event is intended to update the size of the canvas each time the browser is resized
//AddEventListener found in: https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event
window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

//created the variables globally (for the mouse)
let mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener("mousemove", function(e) {
    mouse.x = event.x;//to save the x position of the mouse
    mouse.y = event.y;//to save the y position of the mouse
});

class Bubble {
    constructor(x, y, dx, dy, radius, opacity) {
        this.x = x;//position in x
        this.y = y;//position in y
        this.dx = dx;// x velocity
        this.dy = dy;// y velocity
        this.radius = radius;//radius
        this.minWidth = radius;//min radius
        this.maxWidth = radius * 3;//max radius
        this.opacity = opacity;//transparency
        let colorArray = ["#E6D7CC", "#EC8D4D", "#F29863", "#F2845C", "#D9564A"];//Colors that match the hue of the sunset (background image)
        this.color = colorArray[Math.floor(Math.random() * colorArray.length)];//this will select a random color from the colorArray

        //***Had to put the functions draw and update inside the constructor to make it work in Safari
        //found solution: https://stackoverflow.com/questions/60026651/safari-unexpected-token-expected-an-opening-before-a-methods-paramet
        this.draw = function() {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);//draws the bubble
            context.closePath();
            context.globalAlpha = this.opacity;//to make them "transparent"
            context.fillStyle = this.color;
            context.fill();
            this.update();
        };

        this.update = function() {
            //if the bubble reaches one of the width limits (window's width and 0)
            if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
                this.dx = -this.dx; //changes the direction of the velocity
            }

            //if the bubble reaches one of the height limits (window's height and 0)
            if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
                this.dy = -this.dy; //changes the direction of the velocity
            }

            //This is to increment the position of Bubble with the velocities
            this.x += this.dx;
            this.y += this.dy;

            // interactivity with the mouse
            if (mouse.x - this.x < 60 && mouse.x - this.x > -60 && mouse.y - this.y < 60 && mouse.y - this.y > -60 && this.radius < this.maxWidth) {
                this.radius += 1;
                this.x -= 1;
                this.y -= 1;
            } else if (this.radius > this.minWidth) {
                this.radius -= 1;
                this.x += 1;
                this.y += 1;
            }
        };
    }
}

let bubbleArray = [];
//this For is to create each bubbles (max number of bubbles is 300)
for (let i = 0; i < 300; i++) {
    var radius = Math.random() * 10 + 5;//radious of the circle
    var x = Math.random() * canvas.width;//random number between 0 to the width of the canvas
    var y = Math.random() * canvas.height;//random number between 0 to the height of the canvas
    var dx = (Math.random() - 0.5) * 2;//the x velocity: randon number between -1 and 1 --> velocity can be negative so that the bubble moves backwards
    var dy = (Math.random() - 0.5) * 1;//the y velocity: random number between -0.5 and 0.5 
    var opacity = Math.random() * 0.8 + 0.1;//generates an opacity between 0.1 and 0.9
    bubbleArray.push(new Bubble(x, y, dx, dy, radius, opacity));//sends the bubbleArray to create a new bubble each time
}

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);//this is to clean the screen
    bubbleArray.forEach(bubble => {bubble.draw()});
}

animate();