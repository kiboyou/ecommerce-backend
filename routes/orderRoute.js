 const Order = require("../models/Order");
 const { verifyTokenAndAuthorization, verifyToken, verifyisAdmin } = require("./verifyToken");

 const router = require("express").Router()


 //ici l'ordre(commande)

 //create  tout le monde peut passer une commande

 router.post('/', verifyToken, async(req, res) => {
     const newOrder = new Order(req.body)


     try {
         savedOrder = await newOrder.save()
         res.status(200).json(savedOrder)
     } catch (err) {
         res.status(401).json(err)
     }
 })


 //UPDATE  seul l'administrateur peut mettre à jour une commande
 router.put('/:id', verifyisAdmin, async(req, res) => {


     try {
         const OrderUpdated = await Order.findByIdAndUpdate(req.params.id, {
             $set: req.body,
         }, { new: true }, );

         res.status(200).json(OrderUpdated)


     } catch (err) {
         res.status(500).json(err)
     }
 })


 // //delete  ( seul l'administration peut supprimer une commande)

 router.delete("/:id", verifyisAdmin, async(req, res) => {
     try {
         await Order.findByIdAndDelete(req.params.id)
         res.status(201).json(" Order delete with success")
     } catch (err) {
         res.status(400).json(err)
     }
 })





 // //GET User orders  (un utilisaeur authentifier peut voir ses propres commandes ainsi que l'administrateur )


 router.get("/find/:userId", verifyTokenAndAuthorization, async(req, res) => {
     try {
         const Oders = await Cart.find({ userId: req.params.userId })

         res.status(200).json(Oders)
     } catch (err) {
         res.status(400).json(err)
     }
 })


 // GET ALL ORDERS (l'dministrateur réçois la liste de toutes les commandes(Orders))

 router.get('/', verifyisAdmin, async(req, res) => {
     try {
         const Orders = await Orders.find(
             res.status(200).json(Orders)
         )
     } catch (err) {
         res.status(500).json(err)
     }
 })


 //GET STATS

 router.get("/OrderStat", verifyisAdmin, async(req, res) => {
     const date = new Date()
     const lastmonth = new Date(date.setMonth(date.getMonth() - 1))
     const previousMonth = new Date(new Date().setMonth(lastmonth.getMonth() - 1))

     try {
         const income = await Order.aggregate([{
             $match: { createdAt: { $gte: previousMonth } },


             $project: {
                 month: { $month: "$createdAt" },
                 sales: "$amount",
             },
             $group: {
                 _id: "$month",
                 total: { $sum: "$sales" }
             },
         }]);

         res.status(200).json(income)
     } catch (err) {
         res.status(500).json(err)
     }
 })



 module.exports = router