const BLOCKS = [
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 1],
        [1, 1]
    ]
]

const COLORS = [
    '#ffffff', //white
    '#4deeed', //lightblue
    '#0000ff', //blue
    '#ffa500', //orange
    '#21eb21', //green
    '#820382', //purple
    '#ff0000', //red
    '#f0f018'  //yellow
]

const ROWS = 20;
const COLS = 10;


let start = false;

let btn = document.getElementById('start');

btn.addEventListener('click', () => {
    btn.style.visibility = 'hidden';
    start = true;
    setInterval(startGame, 500);
});

let scoreboard = document.querySelector('h2');
let canvas = document.querySelector('#tetris');
let context = canvas.getContext('2d');
context.scale(30, 30);

let score = 0;
let block_obj = null;
let grid = generateGrid();

function startGame(){
    if (start){
        checkRow();
        if (block_obj == null){
            block_obj = generateRandomBlock();
            renderBlock();
        }
        goDown();
    }
}

// let drawRect = (x, y, width, height, color) => {
//     context.fillStyle = color;
//     context.fillRect(x, y, width, height);
// };

// drawBackground();
// function drawBackground(){
//     drawRect(0, 0, 300, 600, '#bcbcbc');
//     for (let i = 0; i < 10 + 1; i++){
//         drawRect(30 * i - 4, 0, 4, 600, 'red')
//     }
//     for (let j = 0; j < 20 + 1; j++){
//         drawRect(0, 30 * j - 4, 300, 4, 'white')
//     }
// }

function generateRandomBlock(){
    let random = Math.floor(Math.random()*7);
    // console.log(BLOCKS[random]);
    let block = BLOCKS[random];
    let block_color = random + 1;
    // x, y = coordinates where each block appears
    let x = 4; 
    let y = 0;
    
    return {block, block_color, x, y};
}


// console.log(block_obj.block.length)

function renderBlock(){
    if (block_obj != null){
        let block = block_obj.block;
        for (let i = 0; i < block.length; i++){
            for (let j = 0; j < block[i].length; j++){
                if (block[i][j] == 1){
                    context.fillStyle = COLORS[block_obj.block_color];
                    context.fillRect(block_obj.x + j, block_obj.y + i, 1, 1);
                }
            }
        }
    }
}

function collision(x, y, rotated_block){
    let block = rotated_block || block_obj.block;
    for (let i = 0; i < block.length; i++){
        for (let j = 0; j < block[i].length; j++){
            if (block[i][j] == 1){
                let p = x + j;
                let q = y + i;
                if (p >= 0 && p < COLS && q >= 0 && q < ROWS){
                    if (grid[q][p] > 0){
                        return true;
                    }
                }
                else{
                    return true;
                }
            }
        }
    }
    return false;
}

function rotate(){
    let rotated_block = [];
    let block = block_obj.block;
    for (let i = 0; i < block.length; i++){
        rotated_block.push([]);
        for (let j = 0; j < block[i].length; j++){
            rotated_block[i].push(0);
        }
    }
    for (let i = 0; i < block.length; i++){
        for (let j = 0; j < block[i].length; j++){
            rotated_block[i][j] = block[j][i];
        }
    }
    for (let i = 0; i < rotated_block.length; i++){
        rotated_block[i] = rotated_block[i].reverse();
    }
    if(!collision(block_obj.x, block_obj.y, rotated_block)){
        block_obj.block = rotated_block;
    }
    renderGrid()
}

function checkRow(){
    let counter = 0;
    for (let i = 0; i < grid.length; i++){
        let row_full = true
        for (let j = 0; j < grid[i].length; j++){
            if (grid[i][j] == 0){
                row_full = false;
            }
        }
        if (row_full == true){
            grid.splice(i, 1);
            grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            counter++;
        }
    }
    if (counter == 1){
        score += 10;
    }
    else if (counter == 2){
        score += 30;
    }
    else if (counter == 3){
        score += 60;
    }
    else if (counter > 3){
        score += 120;
    }
    scoreboard.innerHTML = 'Score: ' + score;
}

function goDown(){
    if (!collision(block_obj.x, block_obj.y + 1)){
        block_obj.y += 1;
    }
    else{
        for (let i = 0; i < block_obj.block.length; i++){
            for (let j = 0; j < block_obj.block[i].length; j++){
                if (block_obj.block[i][j] == 1){
                    let p = block_obj.x + j;
                    let q = block_obj.y + i;
                    grid[q][p] = block_obj.block_color;
                }
            }
        }
        if (block_obj.y == 0){
            alert('Game over!');
            grid = generateGrid();
            score = 0;
            start = false;
            btn.style.visibility = 'visible';
        }
        block_obj = null;
    }
    renderGrid();
}

function goLeft(){
    if (!collision(block_obj.x - 1, block_obj.y))
        block_obj.x -= 1;
    renderGrid();
}

function goRight(){
    if (!collision(block_obj.x + 1, block_obj.y))
        block_obj.x += 1;
    renderGrid();
}

function generateGrid(){
    let grid = [];
    for (let i = 0; i < ROWS; i++){
        grid.push([]);
        for (let j = 0; j < COLS; j++){
            grid[i].push(0);
        }
    }
    return grid;
}

function renderGrid(){
    for (let i = 0; i < grid.length; i++){
        for (let j = 0; j < grid[i].length; j++){
            context.fillStyle = COLORS[grid[i][j]];
            context.fillRect(j, i, 1, 1);
        }
    }
    renderBlock();
}

document.addEventListener('keydown', function(a){
    let key = a.code;
    if (key == 'ArrowDown'){
        if (block_obj != null){
            goDown();
        }
    }
    else if (key == 'ArrowUp'){
        if (block_obj != null){
            rotate();
        }           
    }
    else if (key == 'ArrowLeft'){
        if (block_obj != null){
            goLeft();
        }            
    }
    else if (key == 'ArrowRight'){
        if (block_obj != null){
            goRight();
        }
    }
})