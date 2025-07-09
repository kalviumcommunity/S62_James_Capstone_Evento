const express = require('express')
const {signUp, signIn} = require('../controllers/auth.controller');
// const { default: SignIn } = require('../../../Frontend/Client/src/pages/SignInPage');
const router = express.Router()

router.post('/signUp', signUp);
router.post('/signIn',signIn)

module.exports = router;