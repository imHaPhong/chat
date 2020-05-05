const router = require('express').Router()

router.get('/index', (req, res) => {
    res.render('index')
})
router.get('/meeting', (req, res) => {
    res.render('meeting')
})

module.exports = router