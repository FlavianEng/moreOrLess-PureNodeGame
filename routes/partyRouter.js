const express = require('express');
const partyCtrl = require('../controllers/partyController');
const router = express.Router();

router.get('/', partyCtrl.welcome);
router.get('/scores', partyCtrl.getScores);

router.route('/party/current')
  .get(partyCtrl.getLastNumbersPlayed)
  .put(partyCtrl.updateParty);

router.post('/party', partyCtrl.createParty);
router.post('/rematch', partyCtrl.rematch);

router.all('/tuto', partyCtrl.getTuto);
router.all('/secret', partyCtrl.getSuperDuperSecret);

router.all('*', partyCtrl.getLost);



module.exports = router;
