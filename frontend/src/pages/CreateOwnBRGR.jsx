import { useEffect, useRef, useState } from "react"
import BGImg from "../assets/MyBrrGrrBG.png"
import NavBarComponent from "../components/NavBarComponent"
import PopUpComponent from "../components/PopUpComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight, faPlus } from "@fortawesome/free-solid-svg-icons"
import IngredientUserComponent from "../components/IngredientUserComponent"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ClockLoader, SyncLoader } from "react-spinners"

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function CreateOwnBRGR () {
    const [item, setItem] = useState({})
    const [itemName, setItemName] = useState("Customized")
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [selectedIngredientsQuantity, setSelectedIngredientsQuantity] = useState({})
    const [allIngredients, setAllIngredients] = useState([])
    const [itemPrice, setItemPrice] = useState(0)
    const [currIngredient, setCurrIngredient] = useState({})
    const [popupMessage, setPopupMessage] = useState('')
    const [popupColor, setPopupColor] = useState('amber')
    const [allowPopup, setAllowPopup] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false)
    const [loadingIngredients, setLoadingIngredients] = useState(false)
    const [loadingItemDetails, setLoadingItemDetails] = useState(false)
    
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get('itemId');

    const navigate = useNavigate()
    const orderMessageRef = useRef();


    const handleIngredientDragStart = (ingredient) => {
        setCurrIngredient(ingredient)
        // formRef.current.style.backgroundColor = 'red'
    }

    const handleIngredientDragEnd = () => {
        setCurrIngredient({})
        // formRef.current.style.backgroundColor = 'transparent'
    }

    const handleIngredientDrop = () => {
        // if(selectedIngredients.includes(currIngredient)){
        if(selectedIngredients.some((eachIngredient) => eachIngredient._id === currIngredient._id)){
            setPopupMessage(`${currIngredient.ingredientName} is already selected`)
            setPopupColor('red')
            setAllowPopup(true)
        }
        else{
            setSelectedIngredients(prev => [...prev, currIngredient])
            setSelectedIngredientsQuantity(prev => ( {...prev, [currIngredient._id]: 1} ))
            setAllIngredients((prev) => {
                return prev.map((eachIngredient) => {
                    if(eachIngredient._id == currIngredient._id){
                        return {...eachIngredient, ingredientQuantity: eachIngredient.ingredientQuantity-eachIngredient.ingredientQuantityPerBurger};
                    }
                    return eachIngredient;
                })
            })
            setItemPrice(prev => Number((Number(prev+currIngredient.ingredientPrice)).toFixed(2)))
        }
        setCurrIngredient({})
    }

    const handleIngredientQuantityChange = (id, newQuantity) => {
        setAllIngredients((prev) => {
            return prev.map((eachIngredient) => {
                if(eachIngredient._id == id){
                    const quantityChange = newQuantity - selectedIngredientsQuantity[eachIngredient._id];
                    return {...eachIngredient, ingredientQuantity: eachIngredient.ingredientQuantity - (quantityChange * eachIngredient.ingredientQuantityPerBurger)};
                }
                return eachIngredient;
            })
        })
        setSelectedIngredientsQuantity(prev => ( {...prev, [id]: newQuantity} ))
        selectedIngredients.forEach((eachIngredient) => {
            if(eachIngredient._id == id) {
                setItemPrice(prev => {
                    const priceChange = (eachIngredient.ingredientPrice * (newQuantity - selectedIngredientsQuantity[eachIngredient._id]));
                    return Number((Number(prev + priceChange)).toFixed(2))
                })
            }
        })
    }

    const handleRemoveSelection = (ingredient) => {
        setAllIngredients((prev) => {
            return prev.map((eachIngredient) => {
                if(eachIngredient._id == ingredient._id){
                    return {...eachIngredient, ingredientQuantity: eachIngredient.ingredientQuantity + (selectedIngredientsQuantity[eachIngredient._id] * eachIngredient.ingredientQuantityPerBurger)};
                }
                return eachIngredient;
            })
        })
        setSelectedIngredients((prev) => prev.filter((eachIngredient) => eachIngredient._id != ingredient._id))
        setItemPrice(prev => Number(Number(prev-(ingredient.ingredientPrice * selectedIngredientsQuantity[ingredient._id])).toFixed(2)))
        setSelectedIngredientsQuantity((prev) => {
            const { [ingredient._id]: _, ...rest } = prev;
            return rest;
        })
    }

    const handleOrder = (e) => {
        e.preventDefault();
        if(selectedIngredients.length == 0){
            setPopupMessage(`Please select few ingredients`)
            setPopupColor('red')
            setAllowPopup(true)
            return;
        }
        navigate("/order", { state: item })
    }

    const fetchAllIngredients = async () => {
        setLoadingIngredients(true)

        try {
            const responce = await fetch(`${backendUrl}/ingredient/get`, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                },
                credentials: "include"
            })

            const data = await responce.json()

            if(responce.ok){
                if(itemId){
                    await fetchItemDetails(data.ingredients)
                }
                else{
                    setItem({})
                    setItemName("Customized")
                    setItemPrice(0)
                    setSelectedIngredients([])
                    setSelectedIngredientsQuantity({})
                    setAllIngredients(data.ingredients)
                }
            }
        } catch (error) {
            console.log(error.message)
        }

        setLoadingIngredients(false)
    }

    const fetchItemDetails = async (ingredients) => {
        setLoadingItemDetails(true)

        const responce = await fetch(`${backendUrl}/item/getItems/${itemId}?populateIngredient=true`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });

        const data = await responce.json();
        if(responce.ok){
            const quantities = {};
            let ingredientsToSet = ingredients;
            const selectedIngs = data.item.ingredients.map((eachIngredient) => {
                quantities[eachIngredient._id] = 1;
                ingredientsToSet = ingredientsToSet.map((eachIng) => {
                    if(eachIng._id == eachIngredient._id){
                        return {...eachIng, ingredientQuantity: eachIng.ingredientQuantity - eachIng.ingredientQuantityPerBurger} 
                    }
                    else{
                        return eachIng;
                    }
                })
                return eachIngredient;
            })
            setAllIngredients(ingredientsToSet)
            setSelectedIngredientsQuantity(quantities)
            setSelectedIngredients(selectedIngs)
            setItemPrice(data.item.itemPrice)
            setItemName(`${data.item.itemName} - Customized`)
        }

        setLoadingItemDetails(false)
    }

    useEffect(() => {
        setItem({
            _id: null,
            itemName: itemName,
            ingredients: selectedIngredients,
            itemPrice: itemPrice,
            ingredientsQuantities: selectedIngredientsQuantity
        })
    }, [selectedIngredients, itemPrice, itemName])

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
        fetchAllIngredients();
    }, [itemId]);
    
    return(
        <>
            <div className="fullPage w-screen relative">
                {/* <header>
                    <NavBarComponent/>
                </header> */}

                <main>
                    <div className={`relative
                                       p-7
                                    sm:p-10
                                    ${loadingIngredients ? 'overflow-hidden' : ''}`}
                    >
                        <PopUpComponent message={popupMessage} color={popupColor} allowed={allowPopup} />

                        <h2 className="text-3xl font-bold
                                           mb-5
                                        sm:mb-10"
                        >
                            {itemId ? <>Customize In Your Own Way</> : <>Create Your Own Burger</>}
                        </h2>
                        <div className="flex flex-col gap-10">
                            <form className="w-full min-h-80 flex rounded-xl
                                               flex-col    gap-5     p-5
                                            sm:flex-row sm:gap-10 sm:p-8 sm:items-center"
                                style={{ boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)' }}
                            >
                                {loadingIngredients || loadingItemDetails
                                    ? <div className="w-full flex justify-center">
                                        <SyncLoader
                                            size={20}
                                            color="#e17100"
                                            speedMultiplier={0.8}
                                        />
                                    </div>
                                    : <>
                                        <div className="DetailedItemImgContainer overflow-hidden flex justify-center items-center
                                                        max-h-[10rem]
                                                        sm:max-h-[20rem] sm:w-[33%]"
                                        >
                                            <img src={BGImg} alt="" />
                                        </div>

                                        <div className="   h-[60%]
                                                        sm:h-full sm:w-[67%]"
                                        >
                                            {/* <div className="flex flex-wrap justify-between">
                                                <input
                                                    className="p-2 text-3xl text-amber-600 font-bold outline-none border-b-[1px]
                                                                max-w-full
                                                                sm:max-w-auto"
                                                    name="itemName"
                                                    placeholder="Item Name"
                                                    value={itemName}
                                                    // onChange={handleNameChange}
                                                    required
                                                />
                                            </div> */}
                                            
                                            {/* <textarea className="w-full p-2 outline-none border-b-[1px] resize-none "
                                                rows={1}
                                                name="orderMessage"
                                                placeholder="Order Message (Optional)"
                                                ref={orderMessageRef}
                                                value={orderMessage}
                                                onChange={handleMessageChange}
                                            /> */}
                                            
                                            {/* <hr className="mt-3 lg:mt-6" /> */}

                                            <div className="mt-3 lg:mt-6">
                                                <h4 className="text-xl font-semibold">Selected Ingredients</h4>
                                                <div className="allIngredientsContainer min-h-22 mt-4 p-5 rounded-lg flex flex-wrap gap-x-8 gap-y-5 inset-shadow-sm"
                                                    style={{ boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(0, 0, 0, 0.1)' }}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={handleIngredientDrop}
                                                >
                                                        {selectedIngredients.map((eachIngredient, idx) => (
                                                            <IngredientUserComponent 
                                                                key={idx} ingredient={eachIngredient}
                                                                isSelected={true}
                                                                currentQuantity={selectedIngredientsQuantity[eachIngredient._id]}
                                                                onQuantityChange={handleIngredientQuantityChange}
                                                                onRemoveClick={handleRemoveSelection}
                                                            />
                                                        ))}
                        
                                                    </div>
                                            </div>

                                            <hr className="mt-3 lg:mt-6" />

                                            <div className="mt-3 lg:mt-6">
                                                <h4 className="text-xl font-semibold">Available Ingredients</h4>
                                                <div className="allIngredientsContainer mt-4 flex flex-wrap gap-x-8 gap-y-5">
                                                    {allIngredients.map((eachIngredient, idx) => (
                                                        <IngredientUserComponent 
                                                            key={idx}
                                                            ingredient={eachIngredient}
                                                            onDragStart={handleIngredientDragStart}
                                                            onDragEnd={handleIngredientDragEnd}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* <hr className="mt-3 lg:mt-6" /> */}

                                            <div className="mt-3 flex justify-between items-center flex-wrap
                                                            lg:mt-6"
                                            >
                                                <p className="font-semibold text-xl text-purple-800">
                                                    <b>Price : </b> &#8377; {itemPrice}
                                                    {/* <input
                                                        className="num outline-none border-b-[1px] ml-2 p-2 w-20"
                                                        type="number"
                                                        value={itemPrice}
                                                        // onChange={handlePriceChange}
                                                    /> */}
                                                    
                                                </p>
                                                <button className="p-2 text-white bg-purple-800 rounded-md"
                                                    onClick={handleOrder}
                                                >
                                                    Order <FontAwesomeIcon icon={faAngleRight}/>
                                                </button>
                                            </div>

                                        </div>
                                    </>
                                }

                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default CreateOwnBRGR