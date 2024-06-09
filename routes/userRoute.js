const { find } = require("../models/User");
const User = require("../models/User");
const { verifyTokenAndAuthorization, verifyToken, verifyisAdmin } = require("./verifyToken");

const router = require("express").Router()



//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async(req, res) => {
    if (req.body.password) {

        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_PASS).toString();
    }

    try {
        const userUpdate = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true }, );

        res.status(200).json(userUpdate)


    } catch (err) {
        res.status(500).json(err)
    }
})


//delete

router.delete("/:id", verifyisAdmin, async(req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(201).json("delete with succes")
    } catch (err) {
        res.status(400).json(err)
    }
})

//Get one or many


router.get("/finder/:id", verifyisAdmin, async(req, res) => {

    //s'il y a une 
    try {
        const anyUser = await User.findById(req.params.id)

        const {
            password,
            ...others
        } = anyUser._doc


        res.status(201).json(others)

    } catch (err) {
        res.status(401).json(err)
    }
})

//GET ALL USER


router.get("/users", verifyisAdmin, async(req, res) => {

    const query = req.query.new
    try {
        const AllUser = query ? await User.find().sort(({ _id: -1 })).limit(5) : await User.find();

        res.status(201).json(AllUser)

    } catch (err) {
        res.status(401).json(err)
    }
})

// GET User stat

router.get("/stats", verifyisAdmin, async(req, res) => {
    const date = new Date()
    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1))


    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastyear } } },

            { $project: { month: { $month: "$createdAt" } } },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            },
        ]);

        res.status(200).json(data)
    } catch (err) {
        res.status(400).json(err)
    }

})




module.exports = router