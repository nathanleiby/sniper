
// data model for game state
// - player locations
// - map (layout, obstacles)

// ablilty to draw map

// State machine

// Start
// - Generate Map
// Game
// - while >1 player is alive...
//     player A turn -> A action -> player B turn -> B action -> (loop, unless player dies)
// End

// player actions
// - move
// - scope/binoculars
// - shoot


var    query = require('cli-interact').getYesNo;
var stateMachine = {
    state: "gameStart",
    currentPlayer: 0,
    numPlayers: 0,
    playersAlive: [], // bool T/F for each player
    winningPlayer: 0,
};

var states = [
    "gameStart",
    "gameInProgress",
    "gameEnd",
];

stateMachine.state = "gameStart";

function getUserAction() {
    console.log("Valid actions:");
    console.log("- [m]ove");
    // console.log("- [a]im");
    // console.log("- [s]hoot");

    var c = query("Move?");
    if (c == true) {
        return 'move';
    } else {
        return 'shoot';
    }
    // var c = "boop";
    // if c == 'm' {
    //     return 'move';
    // } else if c == 'a' {
    //     return 'aim'
    // }
    // else if c == 's' {
    //     return 'shoot';
    // } else {
    //     return null;
    // }
}

function nextPlayerTurn() {
    stateMachine.currentPlayer = (stateMachine.currentPlayer + 1) % stateMachine.numPlayers;
}

function gameLoop() {

    while (true) {
        if (stateMachine.state == 'gameStart') {
            stateGameStart();
            stateMachine.state = 'gameInProgress';
        } else if (stateMachine.state == 'gameInProgress') {
            stateGameInProgress()
        } else if (stateMachine.state == 'gameEnd') {
            stateGameEnd();
            break;
        } else {
            throw("invalid game state:" + stateMachine.state);
        }
    }
}

function stateGameStart() {
    console.log("STATE: gameStart");
    stateMachine.currentPlayer = 0;
    numPlayers = 3;
    stateMachine.numPlayers = numPlayers;
    stateMachine.playersAlive = Array(numPlayers).fill(true);
}


// checks if game is Over. side-effect sets `gameEnd` state and `winningPlayer`
function gameOver() {
    // if not all players are alive, game over!
    var totalPlayersAlive = 0;
    var winningPlayer = -1;
    for (var i=0; i < stateMachine.playersAlive.length; i ++) {
        if (stateMachine.playersAlive[i]) {
            totalPlayersAlive++;
            winningPlayer = i;
        }
    }
    if (totalPlayersAlive == 1) {
        // which player won?
        stateMachine.state = 'gameEnd';
        stateMachine.winningPlayer = winningPlayer;
        return true;
    }
    return false;
}

// kills the next player
function shoot() {
    var nextPlayer = (stateMachine.currentPlayer + 1) % stateMachine.numPlayers

    // TODO:: random hit/miss
    console.log("hit player " + nextPlayer + "!");
    stateMachine.playersAlive[nextPlayer] = false;
}

function stateGameInProgress() {
    console.log("STATE: gameInProgress");
    while (true) {
        console.log("");
        if (gameOver()) {
            break;
        }
        // only do the turn if player is alive
        if (stateMachine.playersAlive[stateMachine.currentPlayer]) {
            console.log("Current Player: ", stateMachine.currentPlayer);
            var userAction = getUserAction();
            if (userAction == 'move') {
                console.log("you moved!");
            } else if (userAction == 'shoot') {
                console.log("you shot!");
                shoot();
            } else {
                throw("Unknown user action");
            }
        }

        nextPlayerTurn();
    }
}

function stateGameEnd() {
    console.log("STATE: gameEnd");

    // who won?
    console.log("The winner was player " + stateMachine.winningPlayer + "!");
}


gameLoop();
