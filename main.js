// first step, we need to  attach event  (submit) listener to the form  to get user data

// attach event (click) listers to each "game box"

// next, initialize game

// next,  we need to check  which gamemode we're playing 

//we need to set win  conditions 

// we need to  determine current player 

//after each move, check win  conditions and if not met, set othet player  as active

//human vs human, next implement easy  AI, next impossible AI

const winnigConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
];

const form = document.querySelector("#myForm");

form.addEventListener("submit", (event) => {
    //prevent page refresh
    event.preventDefault();

    //initialize user form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    document.querySelector(".modal-wrapper").setAttribute("hidden", true);
    initializeGame(data)
});

const initializeVariables = (data) => {
    data.choice =  +data.choice;
    data.board = [0,1,2,3,4,5,6,7,8]
    data.player1 = "X";
    data.player2 = "O";
    data.round = 0;
    data.currentPlayer = "x";
    data.gameOver = false;
}

const  addEventListenersToGameBoard = (data) => {
    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', (event) => {
            playMove(event.target, data)
        })
    })
}

const initializeGame = (data) => {
    //initialize game  variables
    initializeVariables(data);

   
    //add  event listeners to the gameboard
    addEventListenersToGameBoard(data);
};

const playMove = (box,data) => {
    //is game over? If game over,  don't  do anyhting
    if (data.gameOver || data.round >=8) {
        return
    }
    // check if the game box  has a latter  in it, if so, don't do anything
    if(data.board[box.id] === "X" || data.board[box.id] === "O") {
    return;
    }

    //adjust the DOM for player move, and then check win conditions

    data.board[box.id] =  data.currentPlayer;
    box.textContent = data.currentPlayer;
    box.classList.add( data.currentPlayer === "X" ? "player1" : "player2");
    //increase the round #
    data.round++
    console.log(box,data);

    //check end  conditions
    if(endConditions(data)) {
        //adjust  dom to  reflect endconditions
    }
};

    const endconditions = (data) => {

    }