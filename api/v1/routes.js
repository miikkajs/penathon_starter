const router = require('express').Router();
const homeController = require('./controllers/homeController');

router.get('/', (req, res, next) => {
  const ok = homeController.getOk();
  res.send("get index " + ok);
});

module.exports = router;
