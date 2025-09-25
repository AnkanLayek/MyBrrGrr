import BGImg from "../assets/MyBrrGrrBG.png"
import GreenTick from "../assets/GreenTick.png"
import ingredientsUsed  from "../assets/ingredientsUsed.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import NavBarComponent from "../components/NavBarComponent.jsx"
import PopUpComponent from "../components/PopUpComponent.jsx"
import { ClockLoader, SyncLoader } from "react-spinners"

const backend_url = import.meta.env.VITE_BACKEND_URL;

function ItemForm() {
    const [itemName, setItemName] = useState("")
    const [itemDescription, setItemDescription] = useState("")
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [allIngredients, setAllIngredients] = useState([])
    const [itemPrice, setItemPrice] = useState(0)
    const [popupMessage, setPopupMessage] = useState('')
    const [popupColor, setPopupColor] = useState('amber')
    const [allowPopup, setAllowPopup] = useState(false)
    const [loadingDetails, setLoadingDetails] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false)
    const [loadingIngredients, setLoadingIngredients] = useState(false)

    const { itemId } = useParams()
    const itemDescriptionRef = useRef();

    const fetchAllIngredients = async () => {
        setLoadingIngredients(true)

        try {
            const responce = await fetch(`${backend_url}/ingredient/get`, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                },
                credentials: "include"
            })

            const data = await responce.json()

            if(responce.ok){
                setAllIngredients(data.ingredients)
            }
        } catch (error) {
            console.log(error.message)
        }
        
        setLoadingIngredients(false)
    }

    const fetchItemDetails = async () => {
        setLoadingDetails(true)
        try {
            const responce = await fetch(`${backend_url}/item/getItems/${itemId}`, {
                method: 'GET',
            })

            const data = await responce.json();

            if(responce.ok){
                console.log(data.item)
                setItemName(data.item.itemName)
                setItemDescription(data.item.itemDescription)
                setSelectedIngredients(data.item.ingredients)
                setItemPrice(data.item.itemPrice)
            }
        } catch (error) {
            console.log(error)
        }
        setLoadingDetails(false)
    }

    // if(itemId){
    //     setCurrItemId(itemId)
        
    // }

    const handleNameChange = (e) => {
        setItemName(e.target.value)
    }

    // Item Description Text Area's height adjustment
    const handleDescriptionChange = (e) => {
        setItemDescription(e.target.value)

        // height adjustment
        if(itemDescriptionRef.current){
            itemDescriptionRef.current.style.height = 'auto'
            itemDescriptionRef.current.style.height = `${itemDescriptionRef.current.scrollHeight}px`
        }
    }

    const handleCheckboxChange = (e, ingredient) => {
        const {value, checked} = e.target

        if(checked){
            setSelectedIngredients((prev) => [...prev, value])
            setItemPrice(prev => Number((Number(prev+ingredient.ingredientPrice)).toFixed(2)))
        }
        else{
            setSelectedIngredients((prev) => prev.filter((item) => item != value))
            setItemPrice(prev => Number((Number(prev-ingredient.ingredientPrice)).toFixed(2)))
        }
    }

    const addNewItem = async (e) => {
        e.preventDefault()

        setLoadingSave(true)

        try {
            const response = await fetch(`${backend_url}/item/create`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({itemName, itemDescription, ingredients : selectedIngredients, itemPrice})
            })

            const data = await response.json();
            console.log(response.status)
            if(response.ok){
                setPopupColor('green')
            }
            else{
                setPopupColor('red')
            }
            setPopupMessage(data.message)
            setAllowPopup(true)
        } catch (error) {
            setPopupColor('red')
            setPopupMessage(data.message)
            setAllowPopup(true)
        }
        setLoadingSave(false);
    }

    const editItem = async (e) => {
        e.preventDefault()

        setLoadingSave(true)

        try {
            const response = await fetch(`${backend_url}/item/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({_id : itemId, itemName, itemDescription, ingredients : selectedIngredients, itemPrice})
            })

            const data = await response.json();
            console.log(response.status)
            if(response.ok){
                setPopupColor('green')
            }
            else{
                setPopupColor('red')
            }
            setPopupMessage(data.message)
            setAllowPopup(true)
        } catch (error) {
            setPopupColor('red')
            setPopupMessage(data.message)
            setAllowPopup(true)
        }
        setLoadingSave(false)
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
        fetchAllIngredients()
        if(itemId){
            fetchItemDetails()
        }
    }, [])

    useEffect(() => {
        console.log(selectedIngredients)
    }, [selectedIngredients])

    return(
        <>
            <div className="fullPage w-screen overflow-x-hidden">
                {/* <header>
                    <NavBarComponent/>
                </header> */}

                <main>
                    <div className={`relative
                                       p-7
                                    sm:p-10
                                    ${(loadingDetails || loadingIngredients) ? 'overflow-hidden' : ''}`}
                    >
                        {loadingDetails || loadingIngredients
                            ? <div className="w-full h-[calc(100vh-4rem)] top-0 left-0 backdrop-blur-md bg-[rgba(255,255,255,0.2)] flex flex-col justify-center items-center gap-4 absolute">
                                <SyncLoader
                                    size={20}
                                    color="#e17100"
                                    speedMultiplier={0.8}
                                />
                                <p className="text-4xl text-amber-600 mt-5 font-serif">Getting Details...</p>
                            </div>
                            : <div className="hidden"></div>
                        }

                        <PopUpComponent message={popupMessage} color={popupColor} allowed={allowPopup} />
                        <h2 className="text-3xl font-bold
                                           mb-5
                                        sm:mb-10"
                        >
                            {itemId ? <>Edit Item</> : <>Add New Item</> }
                        </h2>
                        <div className="flex flex-col gap-10">
                            <form className="w-full min-h-80 flex rounded-xl
                                            flex-col    gap-5     p-5
                                            sm:flex-row sm:gap-10 sm:p-8 sm:items-center"
                                style={{ boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)' }}
                            >
                                <div className="DetailedItemImgContainer overflow-hidden flex justify-center items-center
                                                max-h-[10rem]
                                                sm:max-h-[20rem] sm:w-[33%]"
                                >
                                    <img src={BGImg} alt="" />
                                </div>

                                <div className="   h-[60%]
                                                sm:h-full sm:w-[67%]"
                                >
                                    <div className="flex flex-wrap justify-between">
                                        <input
                                            className="p-2 text-3xl text-amber-600 font-bold outline-none border-b-[1px]
                                                        max-w-full
                                                        sm:max-w-auto"
                                            name="itemName"
                                            placeholder="Item Name"
                                            value={itemName}
                                            onChange={handleNameChange}
                                            required
                                        />
                                        {/* <button className="p-2 text-white bg-amber-600 rounded-md">Customize</button> */}
                                    </div>
                                    
                                    <textarea className="w-full mt-7 p-2 outline-none border-b-[1px] resize-none "
                                        rows={1}
                                        name="itemDescription"
                                        placeholder="Description"
                                        ref={itemDescriptionRef}
                                        value={itemDescription}
                                        onChange={handleDescriptionChange}
                                        required
                                    />
                                    
                                    {/* <hr className="mt-3 lg:mt-6" /> */}

                                    <div className="mt-3 lg:mt-6">
                                        <h4 className="text-xl font-semibold">Ingredients Used</h4>
                                        <div className="mt-2 flex flex-wrap gap-10">
                                            {allIngredients.map((eachIngredient, idx) => (
                                                <div key={idx} className="flex items-center">
                                                    <input
                                                        type="checkbox" id={`${eachIngredient.ingredientName}`} value={eachIngredient._id}
                                                        checked={selectedIngredients.includes(eachIngredient._id)}
                                                        onChange={(e) => handleCheckboxChange(e, eachIngredient)}
                                                    />
                                                    <label htmlFor={`${eachIngredient.ingredientName}`} className="ml-1">{eachIngredient.ingredientName}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* <hr className="mt-3 lg:mt-6" /> */}

                                    <div className="mt-3 flex justify-between items-center flex-wrap
                                                    lg:mt-6"
                                    >
                                        <p className="font-semibold text-xl text-purple-800">
                                            <b className="mr-2">Price :</b> &#8377; 
                                            <div className="inline num outline-none ml-1 w-20">
                                                {itemPrice}
                                            </div>
                                        </p>
                                        <button className={`p-2 text-white rounded-md cursor-pointer
                                                            ${loadingSave ? ' bg-purple-600' : ' bg-purple-800'}`}
                                            onClick={itemId ? editItem : addNewItem}
                                            disabled={loadingSave}
                                        >
                                            {loadingSave
                                                ? <div className="flex items-center gap-2">
                                                    <ClockLoader color="#fff" size={24} /> Saving...
                                                </div>
                                                : <div><FontAwesomeIcon icon={faPlus}/> Save</div>
                                            }
                                            
                                        </button>
                                    </div>

                                </div>

                            </form>
                        </div>
                    </div>
                </main>
            </div>
            
        </>
    )
    
}

export default ItemForm