//#region variables
const regex = new RegExp('^[0-9]+$');

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

//#endregion

//#region functions
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
//#endregion

//#region core
const welcome = (req, res) => {
  if (!startedGame) {
    return res.end(`${msgWelcome}`);
  }
  return res.end(`Come on guy ! A game is already underway ♡( ◡‿◡ ) \n${msgResume} `);
};

const createParty = (req, res) => {
  const params = req.query;

  minValue = params.min;
  maxValue = params.max;
  if (minValue < maxValue && minValue && maxValue) {
    startGame();
    return res.status(200).send(`Perfect ! The game is ready ! \nThe number to be guessed is between ${minValue} included et ${maxValue} included \n${msgResume} `);
  }
  return res.status(400).send('Something wrong happened (っ˘̩╭╮˘̩)っ \n\nYOURMIN can\'t be inferior or equal to YOURMAX and they have to be completed by a valid integer');
};

const updateParty = (req, res) => {
  if (startedGame) {
    const params = req.query;

    numberValue = params.number;
    numberValues.push(numberValue);

    if (regex.test(numberValue)) {
      if (numberValue > numberToGuess) {
        return res.status(200).send('It\'s less !');
      } else if (numberValue < numberToGuess) {
        return res.status(200).send('It\'s more !');
      } else {
        res.status(200).send(`Congrats (◕‿◕) \nThe number was ${numberToGuess} \n\n${msgRematch}`);
        scores.push(numberValues.length);
        resetGame();
        return;
      }
    } else {
      return res.status(400).send(`The parameter passed have to be a valid integer`);
    }
  }
  return res.status(200).send(`${msgWelcome}`);
};

const getLastNumbersPlayed = (req, res) => {
  if (numberValues.length) {
    return res.status(200).send(`The number to be guessed is between ${minValue} included et ${maxValue} included \nThe last numbers plays was ${numberValues}`);
  }
  return res.status(200).send(msgWelcome);
};

const getScores = (req, res) => {
  if (scores.length) {
    return res.status(200).send(`Thank you for playing, I feel better now (❤ω❤) \nBy the way, here's your top 10 ! \nTry make the best scores \n\nSCOREBOARD :\n============\n\n${displayScore()}`)

  }
  return res.status(200).send(`I feel alone ლ(ಠ_ಠ ლ) Play to make me feel better  \n\n\n\n${msgWelcome}`);
};

const rematch = (req, res) => {
  if (minValue || minValue === 0 && maxValue) {
    resetGame();
    startGame();
    return res.status(200).send(`Rematch is ready ! \nThe number to be guessed is between ${minValue} included et ${maxValue} included\n\n${msgResume}`);
  }
  return res.status(200).send(`${msgWelcome}`);
};

const getTuto = (req, res) => {
  return res.status(200).send(`*** Welcome in the tutorial ***\n 
    -------------------------------------- \n
    The purpose of the game is to guess the number. The fewer attempts, the better your score will be.\n\n 
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
};

const getSuperDuperSecret = (req, res) => {
  return res.status(200).send(`
    Seems like there just dust and a spider here \n
    Seriously get a job instead of playing this game
    \n
    /╲/\\╭[☉﹏☉]╮/\\╱\\
    `);
};

const getLost = (req, res) => {
  return res.status(200).send(`Seems like your lost ヽ(°〇°)ﾉ \nTo find your way back, type 'http://localhost:1117/tuto' [ALL METHODS]`);
}
//#endregion


module.exports = {
  welcome,
  createParty,
  updateParty,
  getLastNumbersPlayed,
  getScores,
  rematch,
  getTuto,
  getSuperDuperSecret,
  getLost
};