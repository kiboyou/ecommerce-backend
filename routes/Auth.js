const router = require("express").Router()
const User = require("../models/User")
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')


//REGISTER

router.post("/register", async(req, res) => {


    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: cryptoJs.AES.encrypt(req.body.password, process.env.CRYPTO_PASS).toString(),
            //crypto-Js to secure password in DB
    })
    try {
        const saveduser = await newUser.save()
        res.status(201).json(saveduser),
            res.json("ok:ok")

    } catch (err) {
        res.status(401).send(err)

    }
})



//LOGIN

router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json('user doen\'t exist ')

        const hashedpassword = cryptoJs.AES.decrypt(user.password, process.env.CRYPTO_PASS);

        const Originalpassword = hashedpassword.toString(cryptoJs.enc.Utf8);
        Originalpassword !== req.body.password && res.status(401).json('wrong password')



        const accesstoken = jwt.sign(

            {
                id: user._id,
                isAdmin: user.isAdmin,
            }, process.env.JWT_SEC, { expiresIn: "3d" });

        const {
            password,
            ...others
        } = user._doc


        res.status(201).json({...others, accesstoken })

    } catch (err) {
        res.status(404).json(err)
    }



})


module.exports = router;