const Cart = require("../models/Cart");
const { verifyTokenAndAuthorization, verifyToken, verifyisAdmin } = require("./verifyToken");

const router = require("express").Router()


//ici le panier

//create

router.post('/', verifyToken, async(req, res) => {
    const newcart = new Cart(req.body)


    try {
        savedcart = await newcart.save()
        res.status(200).json(savedcart)
    } catch (err) {
        res.status(401).json(err)
    }
})


//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async(req, res) => {


    try {
        const CartUpdated = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true }, );

        res.status(200).json(CartUpdated)


    } catch (err) {
        res.status(500).json(err)
    }
})


// //delete

router.delete("/:id", verifyTokenAndAuthorization, async(req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(201).json("delete with succeSs")
    } catch (err) {
        res.status(400).json(err)
    }
})





// //GET User Cart


router.get("/find/:userId", verifyTokenAndAuthorization, async(req, res) => {
    try {
        const allCarts = await Cart.findOne({ userId: req.params.userId })

        res.status(200).json(allCarts)
    } catch (err) {
        res.status(400).json(err)
    }
})


// GET ALL CARTS (l'dministrateur réçois la liste de toytes les paniers(cart))

router.get('/', verifyisAdmin, async(req, res) => {
    try {
        const carts = await Cart.find(
            res.status(200).json(carts)
        )
    } catch (err) {
        res.status(400).json(carts)
    }
})


module.exports = router