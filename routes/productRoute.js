const Product = require("../models/Product");
const { verifyTokenAndAuthorization, verifyToken, verifyisAdmin } = require("./verifyToken");

const router = require("express").Router()


//post

router.post('/', verifyisAdmin, async(req, res) => {
    const newproduct = new Product(req.body)


    try {
        savedproduct = await newproduct.save()
        res.status(200).json(savedproduct)
    } catch (err) {
        res.status(401).json(err)
    }
})


//UPDATE
router.put('/:id', verifyisAdmin, async(req, res) => {


    try {
        const productUpdate = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true }, );

        res.status(200).json(productUpdate)


    } catch (err) {
        res.status(500).json(err)
    }
})


// //delete

router.delete("/:id", verifyisAdmin, async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(201).json("delete with succeSs")
    } catch (err) {
        res.status(400).json(err)
    }
})

// //Get one or many


router.get("/find/:id", async(req, res) => {

    //s'il y a une 
    try {
        const anyProduct = await Product.findById(req.params.id)

        const {
            password,
            ...others
        } = anyProduct._doc


        res.status(201).json(others)

    } catch (err) {
        res.status(401).json(err)
    }
})

// //GET ALL Products


router.get("/", async(req, res) => {

    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json(products)
    } catch (err) {
        res.status(401).json(err)
    }
})




module.exports = router