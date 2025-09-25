const ingredientModel = require("../models/ingredientModel");

class ingredientController {
    async createIngredient(req, res){
        try {
            const { ingredientName, ingredientQuantity, ingredientUnit, ingredientQuantityPerBurger, ingredientPrice } = req.body

            if((!ingredientName) || (ingredientName == '')){
                return res.status(400).json({message: "Ingredient's name is required"});    // 400: Bad request
            }

            const createdIngredient = await ingredientModel.create({
                ingredientName,
                ingredientQuantity,
                ingredientUnit,
                ingredientQuantityPerBurger,
                ingredientPrice
            })

            if(createdIngredient){
                return res.status(201).json({message: "New ingredient added successfully", ingredient: createdIngredient});    // 201: Created
            }

            return res.status(500).json({message: "Failed to add new ingredient"})    // 500: Internal server error

        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
        
    }

    async editIngredient(req, res){
        try {
            const { _id, ingredientName, ingredientQuantity, ingredientUnit, ingredientQuantityPerBurger, ingredientPrice } = req.body

            if((!_id) || (_id == '')){
                return res.status(400).json({message: "Ingredient's id is required"});    // 400: Bad request
            }
            if((!ingredientName) || (ingredientName == '')){
                return res.status(400).json({message: "Ingredient's name is required"});    // 400: Bad request
            }

            const editedIngredient = await ingredientModel.findOneAndUpdate({_id}, {
                ingredientName,
                ingredientQuantity,
                ingredientUnit,
                ingredientQuantityPerBurger,
                ingredientPrice
            }, {new: true})

            if(editedIngredient){
                return res.status(200).json({message: "Ingredient edited successfully", ingredient: editedIngredient});    // 200: Success
            }

            return res.status(404).json({message: "No such ingredient found to edit"})    // 500: Internal server error
            
        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }

    async getIngredients(req, res){
        try {
            const { _id } = req.body

            if(_id){
                const ingredient = await ingredientModel.findOne({_id, ingredientState: {$ne: 'deleted'}})

                if(ingredient){
                    return res.status(200).json({message: "Ingredient fetched successfully", ingredient})
                }

                return res.status(404).json({message: "No such ingredient found"})
            }

            const ingredients = await ingredientModel.find({ingredientState: {$ne: 'deleted'}})

            if(ingredients.length > 0){
                return res.status(200).json({message: "Ingredients fetched successfully", ingredients})
            }

            return res.status(200).json({message: "No ingredient is present yet", ingredients: []})
            
        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }

    async deleteIngredient(req, res) {
        try {
            const { _id } = req.body

            if((!_id) || (_id == '')){
                return res.status(400).json({message: "Ingredient's id is required"});    // 400: Bad request
            }

            const deletedIngredient = await ingredientModel.findOneAndUpdate(
                {_id},
                {ingredientState: 'deleted'},
                {new: true}
            )

            if(deletedIngredient){
                return res.status(200).json({message: "Ingredient deleted successfully", ingredient: deletedIngredient});    // 200: Success
            }

            return res.status(404).json({message: "No such ingredient found to delete"})    // 500: Internal server error

        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }
}

module.exports = new ingredientController()