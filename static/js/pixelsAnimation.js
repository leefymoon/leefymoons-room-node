const techContainer = document.getElementsByClassName('tech-category');
console.log(techContainer);

const containerWidth = 700;
const containerHeight = 140;
console.log(`the width is: ${containerWidth}px`);
console.log(`the height is: ${containerHeight}px`);

const numCols = containerWidth / 20;
const numRows = containerHeight / 20;
console.log(numCols);
console.log(numRows);
const numDivs = numCols * numRows;
console.log(numDivs);

for(let i = 0; i < techContainer.length; i++) {
    const pixelsContainer = document.createElement('div');
    pixelsContainer.className = 'pixels-container';

    pixelsContainer.style.position = 'absolute';
    pixelsContainer.style.right = '-1px';
    pixelsContainer.style.bottom = '-2px';
    pixelsContainer.style.width = containerWidth + 'px';
    pixelsContainer.style.height = containerHeight + 'px';

    techContainer[i].appendChild(pixelsContainer);
}

const pixelsContainer = document.getElementsByClassName('pixels-container');

console.log(pixelsContainer[2]);

for(let i = 0; i < numDivs; i++) {
    const pixelDiv = document.createElement('div');
    pixelDiv.className = 'pixel';
    pixelsContainer[0].appendChild(pixelDiv);
}

const pixelDiv = document.getElementsByClassName('pixel');

pixelsContainer[0].style.display = 'grid';
pixelsContainer[0].style.gridTemplateColumns = `repeat(${numCols}, 20px)`;
pixelsContainer[0].style.gridTemplateRows = `repeat(${numRows}, 20px)`;

let numColored = 0;

function genPixels() {
    const randPixelNum = Math.floor(Math.random() * pixelDiv.length);
    const randPixel = pixelDiv[randPixelNum];
    
    randPixel.style.background = '#8a2be2';
    numColored++;
}

function genLoop() {
    while (numColored < numDivs) {
        genPixels()
    }
}

setInterval(genLoop, 300)

console.log(numDivs);
console.log(numColored);