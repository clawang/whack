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
    stickerIndex = -1,
    stroke = 2,
    stickerSize = 80,
    stickerOn = false;

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
const stickers = ["1_mood_swing",
    "2_ms_behave",
    "3_chanel_pit",
    "4_numb",
    "5_burning_brains",
    "6_accessible",
    "7_imaginary_friends",
    "8_x",
    "9_moovies",
    "10_difficult",
    "11_shower_song",
    "12_invitation",
    "13_snake_eyes",
    "14_two_night",
    "15_27_club"
];
const stickerElements = [];

function changeActive(index, sticker) {
    stickerOn = sticker;
    for (let i = 0; i < colorElements.length; i++) {
        if (i === index && !sticker) {
            colorElements[i].classList.add("active");
        } else {
            colorElements[i].classList.remove("active");
        }
    }

    for (let i = 0; i < stickerElements.length; i++) {
        if (i === index && sticker) {
            stickerElements[i].div.classList.add("active");
        } else {
            stickerElements[i].div.classList.remove("active");
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
            changeActive(i, false);
        });
        container.appendChild(div);
        colorElements.push(div);
    });
    colorElements[0].classList.add("active");

    var container2 = document.getElementById("stickers");
    stickers.forEach((sticker, i) => {
        var div = document.createElement("div");
        div.classList.add("sticker-option");
        var img = document.createElement("img");
        img.src = `./assets/icons/${sticker}.png`;
        div.appendChild(img);
        div.addEventListener("click", (e) => {
            stickerIndex = i;
            changeActive(i, true);
        });
        container2.appendChild(div);
        stickerElements.push({ div, img });
    });
}

async function loadFonts() {
    const font1 = new FontFace("Archivo Black", "url(./assets/ArchivoBlack-Regular.ttf)", {
        style: "normal",
        weight: "400",
    });

    await font1.load();
    document.fonts.add(font1);
}

function drawSticker() {
    stickerElements[stickerIndex].img.fill = fillColor;
    ctx.drawImage(stickerElements[stickerIndex].img, currX - stickerSize/2*ratio, currY - stickerSize/2*ratio, stickerSize*ratio, stickerSize*ratio);
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = fillColor;
    ctx.lineWidth = stroke;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.getBoundingClientRect().left;
        currY = e.clientY - canvas.getBoundingClientRect().top;

        flag = true;
        dot_flag = true;
        if (dot_flag && stickerIndex < 0) {
            ctx.beginPath();
            ctx.fillStyle = fillColor;
            ctx.ellipse(currX, currY, stroke / 2, stroke / 2, 0, 0, 6);
            ctx.fill();
            ctx.closePath();
            dot_flag = false;
        } else if (stickerOn) {
            drawSticker();
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag && !stickerOn) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.getBoundingClientRect().left;
            currY = e.clientY - canvas.getBoundingClientRect().top;
            draw();
        }
    }
    if (res == 'touchmove') {
        if (flag && !stickerOn) {
            prevX = currX;
            prevY = currY;
            currX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
            currY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
            draw();
        }
    }
}

function resizeCanvas() {
    // console.log(window.innerWidth);
    let containerWidth = document.querySelector(".canvas-container").clientWidth;
    // if (containerWidth > 700 && containerWidth < 900) {
    //     ratio = 500 / 700;
    //     width = 500;
    //     height = 500;
    // }

    if (containerWidth < 700) {
        ratio = containerWidth / 700;
        width = containerWidth;
        height = containerWidth;
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
        stroke = e.target.value;
    });
    document.getElementById("sticker-size").addEventListener("change", (e) => {
        stickerSize = e.target.value;
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