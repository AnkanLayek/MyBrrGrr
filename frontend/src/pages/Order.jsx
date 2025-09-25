import { useLocation, useNavigate } from "react-router-dom"
import NavBarComponent from "../components/NavBarComponent"
import BGImg from "../assets/MyBrrGrrBG.png"
import { useEffect, useState } from "react"
import GreenTick from "../assets/GreenTick.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight, faCheck, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import PopUpComponent from "../components/PopUpComponent"
import { useOrders } from "../context/AllOrdersContext"
import { PulseLoader } from "react-spinners"

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const razorpay_key_id = import.meta.env.VITE_RAZORPAY_KEY_ID;

function Order () {
    const [orderMessage, setOrderMessage] = useState('')
    const [orderPrice, setOrderPrice] = useState('')
    const [paymentType, setPaymentType] = useState('')
    const [orderedBy, setOrderedBy] = useState('')
    const [noOfItems, setNoOfItems] = useState(1)
    const [popupMessage, setPopupMessage] = useState('')
    const [popupColor, setPopupColor] = useState('amber')
    const [allowPopup, setAllowPopup] = useState(false)
    const [isOrderPlaced, setIsOrderPlaced] = useState(false)
    const [isLoadingPlaceOrder, setIsLoadingPlaceOrder] = useState(false)

    const {insertOrder} = useOrders()

    const navigate = useNavigate()

    const location = useLocation()
    const item = location.state

    const fetchVisitorDetails = async () => {
        try {
            const response = await fetch(`${backendUrl}/visitorDetails/get`, {
                method: 'GET',
                credentials: "include"
            })

            const data = await response.json();
            if(response.ok){
                setOrderedBy(data.visitor)
            }
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    }

    const handleNOofItemChange = (action) => {
        if(action == 'plus') {
            setNoOfItems(prev => prev+1)
        }
        else {
            setNoOfItems((prev) => {
                if(prev>1){
                    return prev-1
                }
                return prev
            })
        }
    }

    const handleMessageChange = (e) => {
        setOrderMessage(e.target.value)
    }
    
    const handlePaymentTypeChange = (e) => {
        setPaymentType(e.target.value)
    }

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;

            script.onload = () => {
                resolve(true);
            }

            script.onerror = () => {
                resolve(false);
            }

            document.body.appendChild(script);
        })
    }

    const displayRazorpay = async () => {
        setIsLoadingPlaceOrder(true)
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        setIsLoadingPlaceOrder(false)

        if(!res) {
            setPopupMessage('Razorpay SDK failed to load')
            setPopupColor('red')
            setAllowPopup(true)

            return false;
        }

        // creating new payment order
        const response = await fetch(`${backendUrl}/razorpay/createOrder`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amount: orderPrice
            })
        });

        const data = await response.json();

        if(!response.ok) {
            console.log(data.error)
            setPopupMessage("Failed to create Razorpay order");
            setPopupColor('red');
            setAllowPopup(true);
            
            return false;
        }

        const {amount, id: order_id, currency} = data.paymentOrder;

        return new Promise((resolve) => {
            const options = {
                key: razorpay_key_id,
                amount: amount.toString(),
                currency,
                name: 'MyBrrGrr',
                description: 'Payment for ordering burger',
                order_id,
                handler: async (response) => {
                    const verificationResponse = await fetch(`${backendUrl}/razorpay/verifyPayment`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            orderCreationId: order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature
                        })
                    });

                    const data = await verificationResponse.json();

                    setPopupMessage(data.message);
                    setAllowPopup(true);
                    if(verificationResponse.ok) {
                        setPopupColor('green');
                        resolve(true);
                    }
                    else {
                        setPopupColor('red');
                        resolve(false);
                    }
                },
                prefill: {
                    name: orderedBy.fullName,
                    email: orderedBy.email,
                },
                notes: {
                    order: "Payment for " + item.itemName + " by " + orderedBy.fullName + " at " + new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString(),
                },
                theme: {
                    color: "#e17100",
                }
            }

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        })
    }

    // orderName, itemId, orderIngredients, orderMessage, orderPrice, orderedBy, paymentType
    const handleOrder = async () => {
        if(paymentType == '') {
            setPopupMessage('Select a payment type')
            setPopupColor('red')
            setAllowPopup(true)

            return;
        }

        // if(orderedBy == ''){
        //     fetchVisitorDetails()
        // }

        if(paymentType == 'online') {
            const isRazorpayVerified = await displayRazorpay();
            if(!isRazorpayVerified) {
                return;
            }
        }
        
        setIsLoadingPlaceOrder(true)
        try {
            const response = await fetch(`${backendUrl}/order/create`, {
                method: 'POST',
                body: JSON.stringify({
                    orderName: item.itemName,
                    itemId: item._id,
                    noOfItems,
                    orderIngredients: item.ingredients,
                    orderIngredientsQuantities: item.ingredientsQuantities,
                    ingredientsQuantities: item.ingredientsQuantities,
                    orderMessage,
                    orderPrice,
                    orderedBy: orderedBy._id,
                    paymentType
                }),
                headers: {
                    'Content-Type' : 'application/json'
                },
                credentials: "include"
            })

            const data = await response.json()

            if(response.ok){
                insertOrder(data.order)
                setIsOrderPlaced(true)
                setPopupColor('green')
            }
            else{
                setPopupColor('red')
            }
            setPopupMessage(data.message)
            setAllowPopup(true)
        } catch (error) {
            console.log(error.message)
        }
        setIsLoadingPlaceOrder(false)
    }

    useEffect(() => {
        if(allowPopup){
            setTimeout(() => {
                setAllowPopup(false)
                setTimeout(() => {
                    setPopupColor('amber')
                    setPopupMessage('')
                }, 150);
            }, 4000);
        }
    }, [allowPopup])

    useEffect(() => {
        if(item){
            setOrderPrice(Number(Number((item.itemPrice)*1.22*noOfItems).toFixed(2)))
            if(!item.ingredientsQuantities) {
                const quantities = {};
                item.ingredients.map((eachIngredient) => {
                    quantities[eachIngredient._id] = 1;
                })
                item.ingredientsQuantities = quantities;
            }
        }
    }, [item, noOfItems])

    useEffect(() => {
        if(isOrderPlaced) {
            const timer = setTimeout(() => {
                navigate("/placedOrders", {replace: true})
            }, 4000);

            return () => clearTimeout(timer)
        }
    }, [isOrderPlaced])

    useEffect(() => {
        fetchVisitorDetails()
    }, [])

    return (
        <>
            <div className="fullPage w-screen relative">
                {/* <header>
                    <NavBarComponent/>
                </header> */}

                <main>
                    <div className="relative w-screen min-h-[calc(100vh-4rem)] bg-gray-300 flex justify-center">
                        <PopUpComponent message={popupMessage} color={popupColor} allowed={allowPopup} />

                        <div className="previewContainer w-full bg-white p-10 flex flex-col justify-between
                                        md:w-[44rem]"
                        >
                            {!item
                                ? <>Please select an item to order</>
                                : <>
                                    <div className="flex items-center gap-10">
                                        <div className="w-[40%] sm:w-[20%] aspect-square rounded-2xl overflow-hidden">
                                            <img src={BGImg} alt="" />
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <h2 className="text-3xl text-amber-600 font-bold
                                                        sm:text-4xl"
                                            >
                                                {item.itemName}
                                            </h2>
                                            <div className="text-xl flex font-semibold gap-3 text-purple-800">
                                                <p>No. of items : </p>
                                                <div className="px-2 rounded-sm flex items-center gap-2 bg-purple-100">
                                                    <p
                                                        className={`text-sm cursor-pointer
                                                                    ${noOfItems<=1 ? 'text-purple-400' : ''}`}
                                                        onClick={() => handleNOofItemChange('minus')}
                                                    >
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </p>
                                                    <p>{noOfItems}</p>
                                                    <p
                                                        className="text-sm cursor-pointer"
                                                        onClick={() => handleNOofItemChange('plus')}
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </p>
                                                </div> 
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <ul className="mt-2 flex flex-wrap gap-x-7 gap-y-2">
                                            {item.ingredients.map((eachIngredient, idx) => (
                                                <li key={idx} className="flex gap-1 items-center">
                                                    <img src={GreenTick} alt="" className="h-5" />
                                                    <span>{eachIngredient.ingredientName}</span>
                                                    {item.ingredientsQuantities && item.ingredientsQuantities[eachIngredient._id]>1 &&
                                                        <span>({item.ingredientsQuantities[eachIngredient._id]}x)</span>
                                                    }
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-semibold">Order Message</h3>
                                        <textarea name="orderMessage" id="orderMessage" placeholder="Any message with the order (Optional)" value={orderMessage} maxLength={100}
                                            className="w-full p-3 mt-2 outline-none bg-gray-200 rounded resize-none"
                                            onChange={handleMessageChange}
                                        >
                                        </textarea>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-semibold">Price Breakdown</h3>
                                        <div className="px-4 py-2">
                                            <div className="flex justify-between">
                                                <p>Item Price</p>
                                                <p>&#8377; {item.itemPrice} x {noOfItems}</p>
                                            </div>

                                            <div className="flex justify-between">
                                                <p>GST (18%)</p>
                                                <p>&#8377; {Number(Number((item.itemPrice)*0.18).toFixed(2))} x {noOfItems}</p>
                                            </div>

                                            <div className="flex justify-between">
                                                <p>Labor Charge</p>
                                                <p>&#8377; {Number(Number((item.itemPrice)*0.04).toFixed(2))} x {noOfItems}</p>
                                            </div>

                                            {/* <div className="flex justify-between">
                                                <p>Delivery Charge</p>
                                                <p>&#8377; 10</p>
                                            </div> */}

                                            <div className="mt-2 text-purple-800 font-bold flex justify-between">
                                                <p>Total</p>
                                                <p>&#8377; {Number(Number((item.itemPrice)*1.22*noOfItems).toFixed(2))}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="text-xl font-semibold">Payment Option</h4>
                                            <select
                                                className="px-3 py-2 mt-1 bg-gray-200 rounded-md"
                                                defaultValue={''}
                                                onChange={handlePaymentTypeChange}
                                            >
                                                <option value='' disabled>Select</option>
                                                <option value="online">Online</option>
                                                <option value="onTable">On Table</option>
                                            </select>
                                        </div>

                                        <button
                                            className="h-fit w-32 p-2 text-white rounded-md cursor-pointer bg-purple-800"
                                            disabled={isLoadingPlaceOrder || isOrderPlaced}
                                            onClick={handleOrder}
                                        >
                                            {isLoadingPlaceOrder
                                                ? <PulseLoader
                                                    size={10}
                                                    margin={4}
                                                    color="#fff"
                                                />
                                                : <>{isOrderPlaced
                                                    ? <><span className="mr-2">Placed</span> <FontAwesomeIcon icon={faCheck}/></>
                                                    : <>Place Order <FontAwesomeIcon icon={faAngleRight}/></>
                                                }</>
                                                
                                            }
                                        </button>
                                    </div>
                                </>
                            }
                            
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default Order