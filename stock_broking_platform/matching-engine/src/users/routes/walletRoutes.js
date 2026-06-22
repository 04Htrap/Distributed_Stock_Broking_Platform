const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/walletController');

router.get('/', auth, controller.getWallet);
router.post('/deposit', auth, controller.deposit);

module.exports = router;