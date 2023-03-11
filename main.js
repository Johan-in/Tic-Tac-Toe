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
    data.currentPlayer = "X";
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
    
    adjustDom('displayTurn', `${data.player1Name}'s turn`)
    initializeVariables(data);

   
    //add  event listeners to the gameboard
    addEventListenersToGameBoard(data);
};


const playMove = (box,data) => {
     //is game over? If game over,  don't  do anyhting
     if (data.gameOver || data.round > 8) {
        return
    }
    // check if the game box  has a latter  in it, if so, don't do anything
    if(data.board[box.id] === "X" || data.board[box.id] === "O") {
    return;
    }

    //adjust the DOM for player move, and then check win conditions

    data.board[box.id] =  data.currentPlayer;
    box.textContent = data.currentPlayer;
    box.classList.add(data.currentPlayer === "X" ? "player1" : "player2");
    //increase the round #
    data.round++;
    

    //check end  conditions
    if(endConditions(data)) {
        return;
    }

    //change current player
    //change  the  dom, and change date.currentplayer
    if(data.choice === 0) {
      changePlayer( data);
    } else if (data.choice === 1) {
        //easy ia
        easyAiMove (data);
        data.currentPlayer = "X"

        // change back  to player1
    } else if (data.choice === 2) {
       changePlayer(data)
       impossibleAIMove(data);
       if(endConditions(data)){
        return;
        }
       changePlayer(data);
       
    }
    
};

    const endConditions = (data) => {
      //3 potential options,
      //winner,
      //tie,
      //game not over yet
      if (checkWinner(data, data.currentPlayer)) {
        //adjust the dom to reflect  win
        let winnerName = 
         data.currentPlayer === "X" ? data.player1Name : data.player2Name;
        adjustDom("displayTurn", winnerName + " has won the  game");
        return true;
      } else if (data.round === 9) {
        adjustDom("displayTurn", "It's a Tie!");
        data.gameOver = true;
        //adjust the dom to reflect tie
        return true;
      }

      return false;
    };

    const checkWinner = (data, player) => {
      let  result = false; 
      winnigConditions.forEach (condition => {
        if(
            data.board[condition[0]] === player && 
            data.board[condition[1]] === player && 
            data.board[condition[2]] === player
            ) {
            
                result = true;
        }
      });
      return result;
    };

    const adjustDom = (className, textContent) => {
        const elem  = document.querySelector(`.${className}`);
        elem.textContent = textContent;
    };

    const changePlayer = (data) => {
        data.currentPlayer = data.currentPlayer === "X" ? "O" : "X";
        // adjust the dom
        let displayTurnText = 
        data.currentPlayer === "X" ? data.player1Name : data.player2Name
        adjustDom('displayTurn', `${displayTurnText}'s turn`);

    }

    const easyAiMove = (data) => {
        changePlayer(data);
        data.round++;
        let availableSpaces = data.board.filter (
            (space) => space !== "X" && space !== "O" 
            );
            let move = 
            availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
            console.log(move);
            data.board[move] = data.player2;
        setTimeout(() => {
            
            let box = document.getElementById(`${move}`);
            box.textContent = data.player2;
            box.classList.add("player2");
        }, 200);

            if(endConditions(data)){
                   return;
            }

            changePlayer(data);
    };

    const impossibleAIMove = (data) => {
        data.round++
        //get best possbile move rom minimax algorithm
        const move = minimax(data, "O").index;
        data.board[move] = data.player2;
        let box = document.getElementById(`${move}`);
        box.textContent = data.player2;
        box.classList.add("player2");
        

        
        

        console.log(data);
    };

    const minimax= (data, player) => {
        let availableSpaces = data.board.filter (
            (space) => space !== "X" && space !== "O" 
            );
            if(checkWinner(data, data.player1)) {
                return {
                    score: -100,
                }
            } else if (checkWinner(data, data.player2)) {
                return {
                    score: 100,
                }
            } else if (availableSpaces.length === 0) {
                return {
                    score: 0,
                };
            }
            //check if winner,if player1 wins  set score  to  -100
            // if tie, set score to 0
            //if  win, set score to 100
            const potentialMoves = [];
            //loop over available spaces to get list of all potential moves and check if  wins
            for (let i = 0; i < availableSpaces.length; i++) {
                let move = {};
                move.index = data.board[availableSpaces[i]];
                data.board[availableSpaces[i]]  = player;
                if(player === data.player2) {
                    move.score = minimax (data, data.player1).score;
                } else {
                    move.score = minimax (data, data.player2).score;
                }
                //reset the move to the board
                data.board[availableSpaces[i]] = move.index;
                //push the  potential move  to the array
                potentialMoves.push(move)
            }
            let bestMove = 0;
            if (player === data.player2) {
                let bestScore = -1000;
                for(let i = 0; i < potentialMoves.length; i++) {
                    if (potentialMoves[i].score > bestScore) {
                        bestScore = potentialMoves[i].score;
                        bestMove = i;
                    }
                }
            } else if (player === data.player1) {
                let bestScore = 1000;
                for(let i = 0; i < potentialMoves.length; i++) {
                    if (potentialMoves[i].score < bestScore) {
                        bestScore = potentialMoves[i].score
                        bestMove = i
                    }
                }
            }
        data.gameOver = false
        return potentialMoves[bestMove];
    };