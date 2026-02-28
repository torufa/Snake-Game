const modal = document.querySelector(".modal");
const startModal = document.querySelector(".start-game");
const restartModal = document.querySelector(".game-over");
const startBtn = document.querySelector(".btn-start");
const restartBtn = document.querySelector(".btn-restart");
const board = document.querySelector(".board");

let highScoreElement = document.querySelector("#high_score span");
let scoreElement = document.querySelector("#score span");
let timeElement = document.querySelector("#time span");

highScore = localStorage.getItem("High Score") || 0;
score = 0;
time = `00-00`;
highScoreElement.innerText = highScore;
let timeInterval = null;

const blockWidth = 60;
const blockheight = 60;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockheight);
let interval = null;
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

const blocks = [];
let snake = [{ x: 1, y: 3 },{ x: 1, y: 2 },{ x: 1, y: 1 },];
let direction = "bottom";

for (let row = 0; row < rows; row++) {
  for (col = 0; col < cols; col++) {
    let block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}
function render() {
  let head = null;
  blocks[`${food.x}-${food.y}`].classList.add("food");
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  }
  if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  }
  if (direction === "top") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }
  if (direction === "bottom") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }
//wall collision logic
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
    clearInterval(interval);

    modal.style.display = "flex";
    startModal.style.display = "none";
    restartModal.style.display = "flex";

    return;
  }

//food conusme logic
  if (food.x === head.x && food.y === head.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);

    // scoring
    score += 10;
    scoreElement.innerText = score;
    if(score>highScore){
      highScore = score;
      localStorage.setItem('High Score', highScore)
      highScoreElement.innerText= highScore;
    }
  }
  

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  snake.unshift(head);
  snake.pop();
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    direction = "top";
  } else if (event.key === "ArrowDown") {
    direction = "bottom";
  } else if (event.key === "ArrowLeft") {
    direction = "left";
  } else if (event.key === "ArrowRight") {
    direction = "right";
  }
});

//buttons logic
startBtn.addEventListener("click", () => {
  modal.style.display = "none";
  interval = setInterval(() => {render()}, 300);

  // time
  timeInterval = setInterval(()=>{
    let [minutes, seconds] = time.split('-').map(Number);
    seconds+=1;
    if(seconds >= 60){
      minutes+=1;
      seconds=0;
    }
     let formattedMinutes = String(minutes).padStart(2, "0");
     let formattedSeconds = String(seconds).padStart(2, "0");
     time = `${formattedMinutes}-${formattedSeconds}`;

    timeElement.innerText = time;
  },1000)
});

restartBtn.addEventListener("click", restartGame);
function restartGame() {
  clearInterval(interval);
  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  
  modal.style.display = "none";
  direction = "bottom";
  snake = [
    { x: 1, y: 3 },
    { x: 1, y: 2 },
    { x: 1, y: 1 },
  ];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  interval = setInterval(() => {
    render();
  }, 300);
  scoreElement.innerText = 0;
  // highScoreElement.innerText = 0;
  score = 0;
  time = `00-00`;
  timeElement.innerText = time;
  
}