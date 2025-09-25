const itemModel = require("../models/itemModel");

class itemController {
    async createItem(req, res){
        try {
            const { itemName, itemDescription, ingredients, itemPrice } = req.body;

            if((!itemName) || (itemName == '')){
                return res.status(400).json({message: "Item's name is required"});    // 400: Bad request
            }
            if((!itemDescription) || (itemDescription == '')){
                return res.status(400).json({message: "Item's description is required"});    // 400: Bad request
            }

            const createdItem = await itemModel.create({
                itemName,
                itemDescription,
                ingredients,
                itemPrice
            })

            if(createdItem){
                return res.status(201).json({message: "New item added successfully", item: createdItem});    // 201: Created
            }

            return res.status(500).json({message: "Failed to add new item"})    // 500: Internal server error

        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }

    async editItem(req, res){
        try {
            const { _id ,itemName, itemDescription, ingredients, itemPrice } = req.body;
            
            if((!_id) || (_id == '')){
                return res.status(400).json({message: "Item's id is required"});    // 400: Bad request
            }
            if((!itemName) || (itemName == '')){
                return res.status(400).json({message: "Item's name is required"});    // 400: Bad request
            }
            if((!itemDescription) || (itemDescription == '')){
                return res.status(400).json({message: "Item's description is required"});    // 400: Bad request
            }

            const editedItem = await itemModel.findOneAndUpdate({_id}, {
                itemName,
                itemDescription,
                ingredients,
                itemPrice
            }, {new: true});

            if(editedItem){
                return res.status(200).json({message: "Item edited successfully", item: editedItem});    // 200: Success
            }

            return res.status(500).json({message: "Failed to edit item"})    // 500: Internal server error

        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }

    async getItems(req, res){
        try {
            const { _id } = req.params;
            const { populateIngredient } = req.query;

            // if item's _id is provided, then return that particular item
            if(_id){
                let item;
                if(populateIngredient == 'true'){
                    item = await itemModel.findOne({_id, itemState: {$ne: 'deleted'}}).populate( 'ingredients' );
                }
                else{
                    item = await itemModel.findOne({_id, itemState: {$ne: 'deleted'}});
                }

                if(item){
                    return res.status(200).json({message: "Item fetched successfully", item})
                }

                return res.status(404).json({message: "No such item found"})
            }

            // if no item's _id is provided, then return all the items
            let items;
            if(populateIngredient == 'true'){
                items = await itemModel.find({itemState: {$ne: 'deleted'}}).populate( 'ingredients' );
            }
            else{
                items = await itemModel.find(({itemState: {$ne: 'deleted'}}));
            }

            if(items.length > 0){
                return res.status(200).json({message: "Items fetched successfully", items})
            }

            return res.status(200).json({message: "No item is present yet", items: []})
            
        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }
 
    async deleteItem(req, res){
        try {
            const { _id } = req.body;

            if((!_id) || (_id == '')){
                return res.status(400).json({message: "Item's id is required"});    // 400: Bad request
            }

            const deletedItem = await itemModel.findOneAndUpdate(
                {_id},
                {itemState: 'deleted'},
                {new: true}
            );

            if(deletedItem){
                return res.status(200).json({message: "Item deleted successfully", item: deletedItem});    // 200: Success
            }

            return res.status(500).json({message: "Failed to delete item"})    // 500: Internal server error

        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }
}

module.exports = new itemController()