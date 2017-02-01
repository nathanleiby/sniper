
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
    playerLocations: [],
    map: [],
    winningPlayer: 0,
    turns: 0,
};

var states = [
    "gameStart",
    "gameInProgress",
    "gameEnd",
];

stateMachine.state = "gameStart";

const AUTOMATED = true;

function getUserAction() {
    var c;
    if (AUTOMATED) {
        c = Math.random() >= 0.5
    } else {
        console.log("Valid actions:");
        console.log("- [m]ove");
        // console.log("- [a]im");
        // console.log("- [s]hoot");

        c = query("Move?");
    }

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
    stateMachine.turns++;
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

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function stateGameStart() {
    console.log("STATE: gameStart");

    numPlayers = 3;
    stateMachine.numPlayers = numPlayers;
    stateMachine.playersAlive = Array(numPlayers).fill(true);

    stateMachine.currentPlayer = 0;

    stateMachine.map = [
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
    ];
    for (var i=0; i < stateMachine.playersAlive.length; i ++) {
        while (true) {
            // assumes rectangular map
            var row = getRandomInt(0, stateMachine.map.length);
            var col = getRandomInt(0, stateMachine.map[0].length);
            if (stateMachine.map[row][col] == -1) {
                stateMachine.map[row][col] = i;
                console.log("Player " + i + " start position: row=" + row + ",col=" + col);
                break;
            }
        }
    };
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
    // choose a random square that's not the player's current square
    var row;
    var col;
    var targetPlayer;
    while (true) {
        // assumes rectangular map
        row = getRandomInt(0, stateMachine.map.length);
        col = getRandomInt(0, stateMachine.map[0].length);
        targetPlayer = stateMachine.map[row][col]
        if (targetPlayer != stateMachine.currentPlayer) {
            console.log("Player " + stateMachine.currentPlayer + " shoots @ row=" + row + ",col=" + col);
            break;
        }
    }

    if (targetPlayer == -1) {
        console.log("missed!");
    } else {
        console.log("hit player " + targetPlayer + "!");
        stateMachine.playersAlive[targetPlayer] = false;
    }

    return;
}

// returns [row, col] where player n is located
function getPlayerLocation(player) {
    var m = stateMachine.map;
    for (var row=0; row < m.length; row++) {
        for (var col=0; col < m[0].length; col++) {
            if (m[row][col] == player) {
                return [row, col];
            }
        }
    }
    throw("cannot getPlayerLocation for player " + player);
}

function move() {
    // choose a random adjacent square (or diagonally adjacent square) that doesn't contain a player
    var row;
    var col;
    while (true) {
        // assumes rectangular map
        row = getRandomInt(0, stateMachine.map.length);
        col = getRandomInt(0, stateMachine.map[0].length);
        var isEmpty = (stateMachine.map[row][col] == -1);
        var loc = getPlayerLocation(stateMachine.currentPlayer);
        var isAdjacent = Math.abs(row - loc[0]) <= 1 && Math.abs(col - loc[1]) <= 1 && !(row == loc[0] && col == loc[1]);
        if (isAdjacent && isEmpty) {
            console.log("Player " + stateMachine.currentPlayer + " moves to @ row=" + row + ",col=" + col);
            stateMachine.map[row][col] = stateMachine.currentPlayer;
            stateMachine.map[loc[0]][loc[1]] = -1;
            break;
        }
    }


}

function drawMap() {
    var m = stateMachine.map;
    output = ""
    for (var row=0; row < m.length; row++) {
        for (var col=0; col < m[0].length; col++) {
            if (m[row][col] == -1) {
                output += "-"
            } else {
                // player number
                output += m[row][col];
            }
        }
        output += "\n"
    }
    console.log(output);
}

function stateGameInProgress() {
    console.log("STATE: gameInProgress");
    while (true) {
        console.log("");
        console.log("Turn #" + stateMachine.turns);
        if (gameOver()) {
            break;
        }

        // only do player's turn if player is alive
        if (stateMachine.playersAlive[stateMachine.currentPlayer]) {
            console.log("Current Player: ", stateMachine.currentPlayer);

            drawMap();

            var userAction = getUserAction();
            if (userAction == 'move') {
                console.log("you moved!");
                move();
            } else if (userAction == 'shoot') {
                console.log("you shot!");
                shoot();
            } else {
                throw("Unknown user action");
            }
        } else {
            console.log("player " + stateMachine.currentPlayer + " is dead.")
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
