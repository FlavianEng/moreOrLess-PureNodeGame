//Load HTTP module
const http = require('http');
const { cpuUsage } = require('process');
const url = require('url');
const port = 1117;
const baseURL = `http://localhost:${port}`;
const regex = new RegExp('^[0-9]+$');

// Activate console logs
const debug = false;

let startedGame = false;
let minValue = null;
let maxValue = null;
let numberValue = null;
let numberToGuess = null;
let numberValues = [];
let scores = [];

const msgWelcome = 'Welcome player ! \nTo start the game, type \'http://localhost:1117/party/?min=0&max=100\' [POST]\n\n(If you want to choose min and max, type \'http://localhost:1117/party/?min=YOURMIN&max=YOURMAX\' [POST] and replace YOURMIN and YOURMAX by your own values.) \nWARNING : YOURMIN can\'t be superior or equal to YOURMAX \n\nYou can also find a tutorial, type \'http://localhost:1117/tuto\' [ALL METHODS]';
const msgResume = 'To resume or continue the current game, type \'http://localhost:1117/party/current/?number=YOURNUMBER\' [PUT] ';
const msgRematch = 'You can replay by typing \'http://localhost:1117/rematch\' [GET]';

const getNumberToGuess = (min, max) => {
  min = Math.trunc(min);
  max = Math.trunc(max);

  minValue = min;
  maxValue = max;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const resetGame = () => {
  startedGame = false;
  numberToGuess = null;
  numberValues = [];
}

const startGame = () => {
  startedGame = true;
  numberToGuess = getNumberToGuess(minValue, maxValue);
  if (debug) {
    console.log("DEBUG ==> startedGame", startedGame);
    console.log("DEBUG ==> minValue", minValue);
    console.log("DEBUG ==> maxValue", maxValue);
    console.log("DEBUG ==> numberToGuess", numberToGuess);
  }
}

const sortArray = (anArray) => {
  return anArray.sort(function (a, b) {
    return a - b;
  });
}

const displayScore = () => {
  let scoreboard = '';
  sortArray(scores);

  for (let index = 0; index < 10; index++) {
    let score = scores[index];
    if (score === undefined) {
      score = '';
    }
    scoreboard += `${index} : ${score}\n`;
  }
  return scoreboard;
}


const server = http.createServer((req, res) => {
  const longUrl = new URL(`${baseURL}${req.url}`);
  const params = longUrl.searchParams;

  let lastUrl = url.parse(req.url).pathname;

  if (debug) {
    console.clear();
    console.log("DEBUG ==> req.url", req.url);
    console.log("DEBUG ==> lastUrl", lastUrl);
    console.log("DEBUG ==> method", req.method);
    console.log("DEBUG ==> startedGame", startedGame);
    console.log("DEBUG ==> minValue", minValue);
    console.log("DEBUG ==> maxValue", maxValue);
    console.log("DEBUG ==> numberToGuess", numberToGuess);
  };

  if (lastUrl === '/' && req.method === 'GET') {
    if (!startedGame) {
      res.end(`${msgWelcome}`);
      return;
    }
    res.end(`Come on guy ! A game is already underway ♡( ◡‿◡ ) \n${msgResume} `);
    return;
  }

  if (lastUrl === '/party/' && req.method === 'POST') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      minValue = params.get('min');
      maxValue = params.get('max');
      if (minValue < maxValue && minValue && maxValue) {
        startGame();
        res.end(`Perfect ! The game is ready ! \nThe number to be guessed is between ${minValue} included et ${maxValue} included \n${msgResume} `);
        return;
      }
      res.end('Something wrong happened (っ˘̩╭╮˘̩)っ \n\nYOURMIN can\'t be inferior or equal to YOURMAX and they have to be completed by a valid integer');
    });
    return;
  }

  if (lastUrl === '/party/current/' && req.method === 'PUT') {
    if (startedGame) {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      })
      req.on('end', () => {
        numberValue = params.get('number');
        numberValues.push(numberValue);

        if (regex.test(numberValue)) {
          if (numberValue > numberToGuess) {
            res.end('It\'s less !');
          } else if (numberValue < numberToGuess) {
            res.end('It\'s more !');
          } else {
            res.end(`Congrats (◕‿◕) \nThe number was ${numberToGuess} \n\n${msgRematch}`);
            scores.push(numberValues.length);
            resetGame();
          }
        } else {
          res.end(`The parameter passed have to be a valid integer`);
        }

      })
      return;
    }
    res.end(`${msgWelcome}`);
    return;
  }

  if (lastUrl === '/party/current' && req.method === 'GET') {
    if (numberValues.length) {
      res.end(`The number to be guessed is between ${minValue} included et ${maxValue} included \nThe last numbers plays was ${numberValues}`);
      return;
    }
    res.end(msgWelcome);
    return;
  }

  if (lastUrl === '/scores' && req.method === 'GET') {
    if (scores.length) {
      res.end(`Thank you for playing, I feel better now (❤ω❤) \nBy the way, here's your top 10 ! \nTo make the best scores, try \n\nSCOREBOARD :\n============\n\n${displayScore()}`)
      return;
    }
    res.end(`I feel alone ლ(ಠ_ಠ ლ) Play to make me feel better  \n\n\n\n${msgWelcome}`);
    return;
  }

  if (lastUrl === '/rematch' && req.method === 'POST') {
    if (startedGame) {
      resetGame();
      startGame();
      res.end(`Rematch is ready ! \nThe number to be guessed is between ${minValue} included et ${maxValue} included\n\n${msgResume}`);
      return;
    }
    res.end(`${msgWelcome}`);
    return;
  }

  if (lastUrl === '/tuto') {
    res.end(`*** Welcome in the tutorial ***\n 
    -------------------------------------- \n
    The purpose of the game is to guess the\n
    number. The fewer attempts, the better\n
    your score will be.\n\n 
    -> To start the game, type 'http://localhost:1117/party/?min=0&max=100' [POST]\n
    (If you want to choose min and max, type 'http://localhost:1117/party/?min=YOURMIN&max=YOURMAX' [POST] and replace YOURMIN and YOURMAX by your own values.)\n
    WARNING : YOURMIN can't be superior or equal to YOURMAX and both values has to be completed\n\n

    -> To resume or continue the current game, type 'http://localhost:1117/party/current/?number=YOURNUMBER' [PUT] \n\n
    Adjust the number depending the responve you received.\n\n

    -> To see numbers you already played in the current game, type 'http://localhost:1117/party/current' [GET]\n\n

    -> To rematch with the same minimum and maximum values,  type 'http://localhost:1117/party/rematch' [POST]\n\n
 
    -> To see your top 10, type 'http://localhost:1117/scores' [GET]\n
    NOTE: The fewer attempts, the better your score will be. \n\n

    Have fun and good luck (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
    `);
    return;
  }

  if (lastUrl === '/secret') {
    res.end(`
    Seems like there just dust and a spider here \n
    Seriously get a job instead of playing this game
    \n
    /╲/\\╭[☉﹏☉]╮/\\╱\\
    `);
    return;
  }

  res.end(`Seems like your lost ヽ(°〇°)ﾉ \nTo find your way back, type 'http://localhost:1117/tuto' [ALL METHODS]`);
});

server.listen(port, () => {
  console.log(`Server running at ${baseURL}`);
});