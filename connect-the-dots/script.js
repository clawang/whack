var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
let pxScale = window.devicePixelRatio;
var width = 700;
var height = 700;
var ratio = 1;
var prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    flag = false,
    dot_flag = false;
var fillColor = "black",
    fillIndex = 0,
    y = 2;

const colors = ["#000000", "#f14515",
    "#f6f30c",
    "#ad1396",
    "#004a16",
    "#c3cc6b",
    "#cf889d",
    "#249592",
    "#4ac9e3",
    "#79da7c",
    "#c88bdb",
    "#897422",
    "#78ab01",
    "#e4012b",
    "#307fe2"];
const colorElements = [];

function changeActive(index) {
    for (let i = 0; i < colorElements.length; i++) {
        if (i === index) {
            colorElements[i].classList.add("active");
        } else {
            colorElements[i].classList.remove("active");
        }
    }
}

function addColors() {
    var container = document.getElementById("colors");
    colors.forEach((color, i) => {
        var div = document.createElement("div");
        div.classList.add("color-option");
        div.style.backgroundColor = color;
        div.addEventListener("click", (e) => {
            fillColor = color;
            fillIndex = i;
            changeActive(i);
        });
        container.appendChild(div);
        colorElements.push(div);
    });
    colorElements[0].classList.add("active");
}

async function loadFonts() {
    const font1 = new FontFace("Archivo Black", "url(./assets/ArchivoBlack-Regular.ttf)", {
        style: "normal",
        weight: "400",
    });

    await font1.load();
    document.fonts.add(font1);
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = fillColor;
    ctx.lineWidth = y;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = fillColor;
            ctx.ellipse(currX, currY, y / 2, y / 2, 0, 0, 6);
            ctx.fill();
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
    if (res == 'touchmove') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.touches[0].clientX - canvas.offsetLeft;
            currY = e.touches[0].clientY - canvas.offsetTop;
            draw();
        }
    }
}

function resizeCanvas() {
    console.log(window.innerWidth);
    if (window.innerWidth > 700 && window.innerWidth < 900) {
        ratio = 500 / 700;
        width = 500;
        height = 500;
    }

    if (window.innerWidth < 700) {
        ratio = window.innerWidth / 700;
        width = window.innerWidth;
        height = window.innerWidth;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    canvas.width = width * pxScale;
    canvas.height = height * pxScale;

    // normalize the coordinate system
    ctx.scale(pxScale, pxScale);
}

function setup() {
    // set the CSS display size
    console.log(document.querySelector(".container").clientWidth);
    resizeCanvas();

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        findxy('touchmove', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("touchstart", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("touchend", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
    canvas.addEventListener("touchcancel", function (e) {
        findxy('out', e)
    }, false);

    document.getElementById("stroke").addEventListener("change", (e) => {
        y = e.target.value;
    });

    drawCanvas();
}

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
    drawCanvas();
}

function downloadImage() {
    var link = document.createElement('a');
    link.download = 'whack.png';
    link.href = document.getElementById('canvas').toDataURL()
    link.click();
}

function drawCanvas() {
    var image = document.getElementById("dots");
    ctx.drawImage(image, 0, 0, width, height);
}

// wait for DOM to load before drawing to the canvas
window.addEventListener('load', async () => {
    await loadFonts();
    addColors();
    setup();
    var download = document.getElementById('download');
    download.addEventListener('click', downloadImage, false);
    var clear = document.getElementById('clear');
    clear.addEventListener('click', clearCanvas, false);
});

// window.addEventListener('resize', (e) => {
//     resizeCanvas();
// });