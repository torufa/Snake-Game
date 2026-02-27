const modal = document.querySelector(".modal");
const startModal = document.querySelector(".start-game");
const restartModal = document.querySelector(".game-over");
const startBtn = document.querySelector(".btn-start");
const restartBtn = document.querySelector(".btn-restart");
const board = document.querySelector(".board");

let highScore = document.querySelector("#high_score span");
let scoreElement = document.querySelector("#score span");
let info = document.querySelector("#info span");

highScore = 0;
score = 0;
time = `00-00`;

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
    block.innerText = `${row}-${col}`;
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
    score += 10;
    scoreElement.innerText = score;
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

// interval = setInterval(() => {
//   render();
// }, 300);

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


startBtn.addEventListener("click", () => {
  modal.style.display = "none";
  interval = setInterval(() => {render()}, 300);
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
  
}