const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/portfolioController');

router.get('/', auth, controller.getPortfolio);
router.get('/:symbol', auth, controller.getHolding);

module.exports = router;