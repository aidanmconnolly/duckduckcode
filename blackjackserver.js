// A server for a multi-player tic tac toe game. Loosely based on an example in
// Deitel and Deitel’s “Java How to Program” book. For this project I created a
// new application-level protocol called TTTP (for Tic Tac Toe Protocol), which
// is entirely plain text. The messages of TTTP are:
//
// Client -> Server
//     MOVE <n>
//     QUIT
//
// Server -> Client
//     WELCOME <char>
//     VALID_MOVE
//     OTHER_PLAYER_MOVED <n>
//     OTHER_PLAYER_LEFT
//     VICTORY
//     DEFEAT
//     TIE
//     MESSAGE <text>

const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 58901 });

var games = [];

(() => {
    // When null, we are waiting for the first player to connect, after which we will
    // create a new game. After the second player connects, the game can be fully set
    // up and played, and this variable immediately set back to null so the future
    // connections make new games.
    //let g = null;s
    let key = null;

    server.on('connection', (ws, req) => {
        console.log('Connection from', req.connection.remoteAddress);
        
        //console.log("Key: ", key)
        //console.log(key)
        /*let tempPlayer = */new Player(null, ws, 0, key);
        //let added = false;
        getRoomKey(ws);
        //console.log
        //tempPlayer.key = 
        //tempPlayer.key = tempPlayer.getRoomKey2(ws);
        //console.log("tempPlayer.key: " + tempPlayer.key);
        /*for(var i = 0; i < games.length; i++) {
            if(games[i].key === tempPlayer.key && games[i].open) {
                tempPlayer.mark = games[i].players.length;
                tempPlayer.game = games[i];
                games[i].addPlayer(tempPlayer);
                added = true;
            }
        }
        if(!added) {
            let gamee = new Game(tempPlayer.key, tempPlayer);
            games.push(gamee);
            //gamee.addPlayer(tempPlayer)
            tempPlayer.game = gamee;
        }*/
        //if(waitingPlayers.length === 0) {
        //    waitingPlayers.add
        //}
        //getRoomKey(ws);
        //if (game === null) {
        //    game = new Game();
        //    game.playerX = new Player(game, ws, 'X');
        //} else {
        //    game.playerO = new Player(game, ws, 'O');
        //    game = null;
        //}
        console.log(games);
    });
    console.log('The Blackjack server is running...');
})();

function getRoomKey(socket) {
    let message = 'REQUEST RK';
    try {
        socket.send(`${message}\n`);
    } catch (e) {
    console.error(e);
    }
}

class Game {
    // A board has nine squares. Each square is either unowned or it is owned by a
    // player. So we use a simple array of player references. If null, the corresponding
    // square is unowned, otherwise the array cell stores a reference to the player that
    // owns it.
    constructor(key, host) {
        this.deck = [];
        this.makeDeck();
        this.key = key;
        this.players = [host];
        this.turn = 0;
        this.open = true;
    }

    makeDeck() {
        //let card = 0;
        //for(let i = 0; i < 52; i++) {
        //   if (i % 4 === 0) {
        //       card += 1
        //   }
        //   this.deck[i] = card;
        //}
        //this.shuffle(this.deck);
        let card = 0;
         for(let i = 0; i < 52; i++) {
             this.deck[i] = card;
             card++;
         }
        this.shuffle(this.deck);
    }

    shuffle(a) {
        // code taken from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        console.log(a);
        return a;
    }


    move(hit, player, recursion) {
        if(this.deck.length === 52 && recursion === false) {
            this.open = false;
            for(var i = 0; i < this.players.length; i++) {
                this.players[i].send("START The game has started. Wait for your turn.");
                this.move(1, this.players[i], true);
                this.move(1, this.players[i], true);
                console.log("mark: " + this.players[i].mark);
                //this.players[i].showCards();
            }
            console.log("turn:" + this.turn);
        }
        else {
            console.log(hit);
            if(recursion === false) {
                if (this.turn !== player.mark) {
                    throw new Error('Not your turn. It is ' + this.players[this.turn].name + "'s turn.");
                } else if (this.players.length === 1) {
                    throw new Error('You don’t have an opponent yet');
                }
            }

            if (hit === 1) {
                let num = this.deck.pop();
                //console.log("Num: ", num);
                //let suit = Math.floor(num / 13);
                player.cardsPlayed.push(num);
                num = Math.floor(num % 13) + 1;
                if(num > 10) {
                    num = 10;
                    //console.log("NewNum: ", num);
                }

                player.num += num;
                player.showCards();
            }
            console.log(player.num);
        }

    }

    addPlayer(player) {
        this.players.push(player)
    }
}

class Player {
    constructor(game, socket, mark, key) {
        //Object.assign(this, {game, socket, mark, key});
        this.game = game;
        this.socket = socket;
        this.mark = mark;
        this.key = key;
        this.num = 0;
        this.cardsPlayed = [];
        this.send(`WELCOME ${mark}`);
        if (mark === 0) {
            this.send('MESSAGE Waiting for opponent to connect');
        } //else {
            //this.opponent = game.playerX;
            //this.opponent.opponent = this;
            //this.send('MESSAGE Your opponent will move first');
            //this.opponent.send('MESSAGE Your move');
        //}

        socket.on('message', (buffer) => {
            const command = buffer.toString('utf-8').trim();
            console.log(`Received ${command}`);
            /*if(this.cardsPlayed.length < 2) {
                game.move(1, this);
                game.move(1, this.opponent);
                game.move(1, this);
                game.move(1, this.opponent);
            }
            else*/ 
            if(game === null && command.startsWith('KEY')) {
                //console.log("GOOD");
                //console.log(command.substring(4));
                this.key = command.substring(4);
                let added = false;
                for(var i = 0; i < games.length; i++) {
                    if(games[i].key === this.key && games[i].open) {
                        this.mark = games[i].players.length;
                        this.game = games[i];
                        games[i].addPlayer(this);
                        added = true;
                    }
                }
                if(!added) {
                    let gamee = new Game(this.key, this);
                    games.push(gamee);
                    //gamee.addPlayer(tempPlayer)
                    this.game = gamee;
                }
                //console.log(this.key);
            }
            else if (command === 'QUIT') {
                socket.close();
            } else if (command === "HIT") {
                try {
                    this.game.move(1, this, false);
                    //this.opponent.send(`OPPONENT_HIT`);
                    if (this.lost()) {
                        this.send(`MESSAGE BUST Your number is now ${this.num}. Wait for your opponent to play.`);
                        //if(this.opponent.num !== 0) {
                        if(this.game.turn === this.game.players.length-1) {
                            this.whoWon();
                        }
                        else {
                            this.game.turn = (this.game.turn+1)%this.game.players.length;
                            this.game.players[this.game.turn].send('MESSAGE Your move')
                            //this.game.move(0, this);
                            //this.game.players[(this.game.turn+1)%this.game.players.length].send('MESSAGE Your move')
                        }
                    }
                    else {
                        if(this.num < 12 && (this.cardsPlayed.includes(0) || this.cardsPlayed.includes(13) || this.cardsPlayed.includes(26) || this.cardsPlayed.includes(39))) {
                            this.send(`MESSAGE Your number is now ${this.num} or ${this.num+10}`);
                        }
                        else {
                            this.send(`MESSAGE Your number is now ${this.num}`);
                        }
                    }
                } catch (e) {
                    console.trace(e);
                    this.send(`MESSAGE ${e.message}`);
                }
            } else if (command === "STAY") {
                if(this.num < 12 && (this.cardsPlayed.includes(0) || this.cardsPlayed.includes(13) || this.cardsPlayed.includes(26) || this.cardsPlayed.includes(39))) {
                    this.num = this.num + 10;
                }
                try {
                    if(this.mark === this.game.players.length-1) {
                        this.whoWon();
                    }
                    else {
                        this.game.move(0, this, false);
                        this.send(`MESSAGE Your number is now ${this.num}. Wait for your opponent to play.`);
                        this.game.turn = (this.game.turn+1)%this.game.players.length;
                        this.game.players[this.game.turn].send('MESSAGE Your move')
                    }
                } catch (e) {
                    console.trace(e);
                    this.send(`MESSAGE ${e.message}`);
                }
            }
            else if (command === "SPLIT") {

            }
            else if (command === "PLAY AGAIN") {
                this.game.makeDeck();
                for(var i = 0; i < this.game.players.length; i++) {
                    this.game.players[i].num = 0;
                    this.game.players[i].cardsPlayed = [];
                    this.game.players[i].send('PLAY AGAIN');
                    if(i === 0) {
                        this.game.players[0].send('MESSAGE Your move');
                    }
                    else {
                        this.game.players[i].send('Message Your opponent will move first');
                    }
                }
                this.game.turn = 0;
            }
        });

        socket.on('close', () => {
            for(var i = 0; i < this.game.players.length; i++) {
                if(this.game.players[i] != this.mark) {
                    try { this.game.players[i].send(`PLAYER_${this.mark+1}_LEFT`); } catch (e) {}
                }
            }
            //try { this.opponent.send('OTHER_PLAYER_LEFT'); } catch (e) {}
        });
    }

    whoWon(){
        var allBusted = true;
        for(var i = 0; i < this.game.players.length; i++) {
            if(this.game.players[i].num <= 21) {
                allBusted = false;
            }
        }
        if(allBusted) {
            for(var i = 0; i < this.game.players.length; i++) {
                this.game.players[i].send('YOU TIED! All players went over 21');
            }
        }
        if(!allBusted) {
            var highest = 0;
            var highestIndex = [0];
            for(var i = 0; i < this.game.players.length; i++) {
                if(this.game.players[i].num > highest && this.game.players[i].num <= 21) {
                    highest = this.game.players[i].num;
                    highestIndex = [i];
                }
                else if(this.game.players[i].num === highest) {
                    highestIndex.push(i);
                }
            }
            console.log('---------------');
            console.log(highestIndex);
            if(highestIndex.length > 1) {
                for(var i = this.game.players.length-1; i >= 0; i--) {
                    if(i === highestIndex[highestIndex.length-1]) {
                        this.game.players[i].send(`YOU TIED! You got ${highest}!`);
                        highestIndex.pop();
                    }
                    else {
                        this.game.players[i].send(`YOU LOST! You got ${this.game.players[i].num} and winning score was ${highest}`);
                    }
                }
            }
            else {
                for(var i = 0; i < this.game.players.length; i++) {
                    if(i === highestIndex[0]) {
                        this.game.players[i].send(`YOU WON! You got ${highest}!`);
                    }
                    else {
                        this.game.players[i].send(`YOU LOST! You got ${this.game.players[i].num} and winning score was ${highest}`);
                    }
                } 
            }
        }
    }

    showCards() {
        this.send("CARDS " + this.cardsPlayed);
    }

    lost() {
        return this.num > 21;
    }

    send(message) {
        try {
            this.socket.send(`${message}\n`);
        } catch (e) {
            console.error(e);
        }
    }

    /*getRoomKey2(socket) {
        let message = 'REQUEST RK';
        while(this.key === null) {
            //console.log("key:" + this.key);
            try {
                socket.send(`${message}\n`);
            } catch (e) {
            console.error(e);
            }
        }
        return this.key;
    }*/
}