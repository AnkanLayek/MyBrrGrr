// const mongoose = require("mongoose");
const ingredientModel = require("../models/ingredientModel");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");

class orderController {
    async createOrder (req, res) {
        try {
            const { orderName, itemId, noOfItems, orderIngredients, orderIngredientsQuantities, orderMessage, orderPrice, orderedBy, paymentType } = req.body;

            const orderedByUser = await userModel.findById(orderedBy);

            if(!orderedByUser){
                return res.status(404).json({message: 'User not found'})    // 404: Not found
            }
    
            const createdOrder = await orderModel.create({
                orderName,
                itemId,
                noOfItems,
                orderIngredients,
                orderIngredientsQuantities,
                orderMessage,
                orderPrice,
                orderedBy,
                paymentType
            });
    
            if(createdOrder){
                await Promise.all(orderIngredients.map((eachIngredient) => {
                    return ingredientModel.findOneAndUpdate(
                        {_id: eachIngredient._id},
                        {$inc: {ingredientQuantity: - orderIngredientsQuantities[eachIngredient._id] * eachIngredient.ingredientQuantityPerBurger * createdOrder.noOfItems}},
                        {new: true}
                    )
                }))
                orderedByUser.orders.push(createdOrder._id)
                await orderedByUser.save()

                const populatedOrder = await orderModel.findById(createdOrder._id).populate('orderedBy').populate("orderIngredients");

                if(populatedOrder) {
                    return res.status(201).json({message: "Order has been registered", order: populatedOrder});    // 201: Created
                }

                return res.status(201).json({message: "Order has been registered", order: createdOrder});    // 201: Created
            }
    
            return res.status(500).json({message : "Failed to register order"});    // 500: Internal server error
            
        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }

    async editOrder (req, res) {
        try {
            const { _id, orderStatus } = req.body;

            if((!_id) || (_id == '')){
                return res.status(400).json({message: "Item's id is required"});    // 400: Bad request
            }
            if((!orderStatus) || (orderStatus == '')) {
                return res.status(400).json({message: "Please select a status to update"});    // 400: Bad request
            }
            const editedOrder = await orderModel.findOneAndUpdate({ _id }, { orderStatus }, { new: true });

            if(editedOrder) {
                return res.status(200).json({message: "Order status edited successfully", order: editedOrder});    // 200: Success
            }

            return res.status(500).json({message: "Failed to edit item"})    // 500: Internal server error

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }

    async getOrders(req, res) {
        try {
            const { _id } = req.body
            const { orderStatus, populateUser, populateIngredients } = req.query

            let orders
            if(orderStatus){
                orders = await orderModel.find({orderStatus})
            }
            else if(populateUser == 'true' && populateIngredients == 'true'){
                orders = await orderModel.find().populate('orderedBy').populate('orderIngredients')
            }
            else if(populateUser == 'true'){
                orders = await orderModel.find().populate('orderedBy')
            }
            else if(populateIngredients == 'true'){
                orders = await orderModel.find().populate('orderIngredients')
            }
            else{
                orders = await orderModel.find()
            }

            if(orders.length > 0){
                return res.status(200).json({message: "Orders fetched successfully", orders})
            }
            return res.status(200).json({message: "No orders yet", orders: []})

        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }
}

module.exports = new orderController()