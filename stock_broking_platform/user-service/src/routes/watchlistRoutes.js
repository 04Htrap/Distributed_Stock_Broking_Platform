const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/watchlistController');

router.get('/', auth, controller.getAll);
router.post('/', auth, controller.add);
router.delete('/:symbol', auth, controller.remove);

module.exports = router;