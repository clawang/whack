import { quotes, palettes } from './variables.js';

var canvas = document.getElementById('lyrics');
var ctx = canvas.getContext('2d');
let pxScale = window.devicePixelRatio;
var width = 368;
var height = 654;
var ratio = 1;
var mood = -1; // 0 is happy, 1 is empowering, 2 is upbeat, 3 is dramatic

function getRandom(min, max) {
    let index = Math.floor(Math.random() * (max - min)) + min;
    return index;
}

async function loadFonts() {
    const font1 = new FontFace("Archivo Black", "url(./assets/ArchivoBlack-Regular.ttf)", {
        style: "normal",
        weight: "400",
    });

    // wait for font to be loaded
    await font1.load();
    document.fonts.add(font1);
}

function setup() {
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    canvas.width = width * pxScale;
    canvas.height = height * pxScale;

    // normalize the coordinate system
    ctx.scale(pxScale, pxScale);
}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push({ text: currentLine, width: ctx.measureText(currentLine).width });
            currentLine = word;
        }
    }
    let width = ctx.measureText(currentLine).width;
    lines.push({ text: currentLine, width });
    return lines;
}

function downloadImage() {
    var link = document.createElement('a');
    link.download = 'whack.png';
    link.href = document.getElementById('lyrics').toDataURL()
    link.click();
}

function drawCanvas() {
    setup();
    let palette = palettes[getRandom(0, palettes.length)];

    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, width, height);

    var lyric = quotes[mood][getRandom(0, quotes[mood].length)];
    var lyricLines = lyric.split("\n");

    ctx.fillStyle = palette[1];
    var fontSize = lyric.length > 39 ? 30 : 40;
    ctx.textAlign = "center";
    ctx.font = `${fontSize}px Archivo Black`;
    ctx.textBaseline = "top";
    
    var lines = [];
    lyricLines.forEach(lyricLine => {
        lines = lines.concat(getLines(ctx, lyricLine, (width - 40) * ratio));
    });

    var startHeight = (height - lines.length * fontSize) / 2 * ratio;
    lines.forEach((line, i) => {
        ctx.fillText(line.text, width / 2 * ratio, startHeight * ratio + fontSize * i);
    });

    ctx.font = `22px Archivo Black`;
    ctx.fillText("WHACK", width / 2 * ratio, (height - 40) * ratio);

    var src = document.getElementById('lyrics').toDataURL();
    document.getElementById('wallpaper').src = src;
}

function chooseMood(index) {
    mood = index;
    document.querySelector('.selection-screen').classList.add("hide");
    document.querySelector('.loading').classList.add("show");
    setTimeout(() => {
        drawCanvas();
        document.querySelector('.container').classList.add("hide");
        document.querySelector('.lyric-container').classList.add("show");
    }, 1000);
}

// wait for DOM to load before drawing to the canvas
window.addEventListener('load', async () => {
    await loadFonts();
    document.getElementById('empowering').addEventListener('click', () => chooseMood(0), false);
    document.getElementById('dramatic').addEventListener('click', () => chooseMood(1), false);
    document.getElementById('uplifting').addEventListener('click', () => chooseMood(2), false);
    document.getElementById('whacky').addEventListener('click', () => chooseMood(3), false);
    var regenerate = document.getElementById('regenerate');
    regenerate.addEventListener('click', drawCanvas, false);
    var download = document.getElementById('download');
    download.addEventListener('click', downloadImage, false);
});