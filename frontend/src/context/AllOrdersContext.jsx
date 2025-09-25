import React, { useContext } from "react";
import { create } from 'zustand';
import { userContext } from "./ContextProvider";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useOrders = create((set) => ({
    allOrders: [],
    loadingOrders: false,
    insertOrder: (newOrder) => {
        set((state) => (
            {allOrders: [...state.allOrders, newOrder]}
        ))
    },
    changeOrderStatus: async (selectedOrder, newStatus) => {
        if(selectedOrder.orderStatus == newStatus) {
            return;
        }
        try {
            const response = await fetch(`${backendUrl}/order/edit`, {
                method: 'POST',
                body: JSON.stringify({
                    _id: selectedOrder._id,
                    orderStatus: newStatus
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(response.ok){
                set((state) => (
                    {allOrders: state.allOrders.map((eachOrder) => {
                        if(eachOrder._id == selectedOrder._id) {
                            return {...eachOrder, orderStatus: newStatus}
                        }
                        return eachOrder;
                    })}
                ))
            }
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}))

export const fetchAllOrders = async (role, currentUser = null) => {
    useOrders.setState({ loadingOrders: true })
    try{
        const responce = await fetch(`${backendUrl}/order/getOrders?populateUser=true&populateIngredients=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await responce.json();
        
        if(responce.ok){
            if(role == 'user') {
                useOrders.setState({ allOrders: data.orders.filter((eachOrder) => currentUser.orders.includes(eachOrder._id)) })
            }
            else if(role == 'admin'){
                useOrders.setState({ allOrders: data.orders })
            }
        }
    } catch (error) {
        console.log(error)
    }
    useOrders.setState({ loadingOrders: false })
}