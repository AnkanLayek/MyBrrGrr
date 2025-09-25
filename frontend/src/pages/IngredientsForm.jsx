import { useEffect, useRef, useState } from "react"
import PopUpComponent from "../components/PopUpComponent"
import NavBarComponent from "../components/NavBarComponent"
import IngredientComponent from "../components/IngredientComponent"
import ConfirmationPopupComponent from "../components/ConfirmationPopupComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { HashLoader } from "react-spinners"

const backend_url = import.meta.env.VITE_BACKEND_URL;

function IngredientsForm () {
    const [currIngredient, setCurrIngredient] = useState({})
    const [ingredientId, setIngredientId] = useState(null)
    const [ingredientName, setIngredientName] = useState('')
    const [ingredientQuantity, setIngredientQuantity] = useState(0)
    const [ingredientUnit, setIngredientUnit] = useState('')
    const [ingredientQuantityPerBurger, setIngredientQuantityPerBurger] = useState(1)
    const [ingredientPrice, setIngredientPrice] = useState(0)
    const [allIngredients, setAllIngredients] = useState([])
    const [popupMessage, setPopupMessage] = useState('')
    const [popupColor, setPopupColor] = useState('amber')
    const [allowPopup, setAllowPopup] = useState(false)
    const [allowConfirmationPopup, setAllowConfirmationPopup] = useState(false)
    const [confirmationPopupBtnReturn, setConfirmationPopupBtnReturn] =useState(null)
    const [ingredientsLoading, setIngredientsLoading] = useState(false)
    const [ingredientDeleteLoading, setIngredientDeleteLoading] = useState(false);

    const formRef = useRef()


    useEffect(() => {
        console.log(allowConfirmationPopup)
    }, [allowConfirmationPopup])

    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    const handleNameChange = (e) => {
        setIngredientName(e.target.value)
    }

    const handleQuantityChange = (e) => {
        setIngredientQuantity(e.target.value)
    }

    const handleUnitChange = (e) => {
        setIngredientUnit(e.target.value)
    }

    const handleQPBChange = (e) => {
        setIngredientQuantityPerBurger(e.target.value)
    }

    const handlePriceChange = (e) => {
        setIngredientPrice(e.target.value)
    }

    const handleBtnClick = (btnReturn) => {
        setConfirmationPopupBtnReturn(btnReturn)
    }

    const addNewIngredient = async (e) => {
        e.preventDefault()

        try {
            const responce = await fetch(`${backend_url}/ingredient/create`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    ingredientName,
                    ingredientQuantity,
                    ingredientUnit,
                    ingredientQuantityPerBurger,
                    ingredientPrice
                }),
                credentials: "include"
            })

            const data = await responce.json();

            if(responce.ok){
                setAllIngredients(prev => [...prev, data.ingredient])
                setIngredientName('')
                setIngredientQuantity(0)
                setIngredientUnit('')
                setIngredientQuantityPerBurger(1)
                setIngredientPrice(0)
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
    }

    const editIngredient = async (e) => {
        e.preventDefault()

        try {
            const responce = await fetch(`${backend_url}/ingredient/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    _id : ingredientId,
                    ingredientName,
                    ingredientQuantity,
                    ingredientUnit,
                    ingredientPrice
                })
            })

            const data = await responce.json();

            if(responce.ok){
                navigate(`/ingredientForm`)
                fetchAllIngredients()
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
    }

    const deleteIngredient = async (_id) => {
        setIngredientDeleteLoading(true)
        try {
            // setAllowConfirmationPopup(true)

            // if(confirmationPopupBtnReturn == 'yes'){
                const responce = await fetch(`${backend_url}/ingredient/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({ _id }),
                    credentials: "include"
                })
    
                const data = await responce.json()
                if(responce.ok){
                    setAllIngredients((prev) => prev.filter((each) => each._id != data.ingredient._id))
                    setPopupColor('green')
                }
                else{
                    setPopupColor('red')
                }
                setPopupMessage(data.message)
                setAllowPopup(true)
            // }
            // setAllowConfirmationPopup(false)
            // setConfirmationPopupBtnReturn(null)
            
        } catch (error) {
            console.log(error.message)
        }
        setIngredientDeleteLoading(false)
    }

    const clearForm = (e) => {
        e.preventDefault()

        if(!ingredientId){
            setIngredientName('')
            setIngredientQuantity(0)
            setIngredientUnit('')
            setIngredientQuantityPerBurger(1)
            setIngredientPrice(0)
        }

        navigate(`/ingredientForm`)
    }

    const openDeleteIngredientPopup = async (_id) => {
        setAllowConfirmationPopup(true)

        const checkResponse = () => {
            console.log("checkResponse entered")
            return new Promise((resolve, reject) => {
                setInterval(() => {
                    if(confirmationPopupBtnReturn){
                        resolve(confirmationPopupBtnReturn)
                    }
                }, 100);
                
                console.log("checkResponse exited")
            })
        }
        console.log("**1**")
        const responce = await checkResponse()
        console.log(responce)
        console.log("**2**")
        if(responce == 'yes'){
            deleteIngredient(_id)
        }
        setAllowConfirmationPopup(false)
        console.log("**3**")
    }

    const fetchAllIngredients = async () => {
        setIngredientsLoading(true)

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
        
        setIngredientsLoading(false)
    }

    const handleIngredientDragStart = (ingredient) => {
        setCurrIngredient(ingredient)
        // formRef.current.style.backgroundColor = 'red'
    }

    const handleIngredientDragEnd = () => {
        setCurrIngredient({})
        // formRef.current.style.backgroundColor = 'transparent'
    }

    const handleFormDragOver = (e) => {
        e.preventDefault()
    }

    const handleIngredientDrop = (e) => {
        navigate(`/ingredientForm?_id=${currIngredient._id}`, { replace: true })
        setIngredientName(currIngredient.ingredientName)
        setIngredientQuantity(currIngredient.ingredientQuantity)
        setIngredientUnit(currIngredient.ingredientUnit)
        setIngredientQuantityPerBurger(currIngredient.ingredientQuantityPerBurger)
        setIngredientPrice(currIngredient.ingredientPrice)
    }

    useEffect(() => {
        navigate("/ingredientForm", { replace: true });
    }, [navigate]);

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
        const ingredientId = searchParams.get("_id");
        setIngredientId(ingredientId)
    }, [useLocation().search])

    useEffect(() => {
        if(ingredientId == null){
            setIngredientName('')
            setIngredientQuantity(0)
            setIngredientUnit('')
            setIngredientQuantityPerBurger(1)
            setIngredientPrice(0)
        }
    }, [ingredientId])

    useEffect(() => {
        fetchAllIngredients()
    }, [])

    return (
        <>
            <div className="fullPage w-screen relative overflow-x-hidden">
                {/* <header>
                    <NavBarComponent/>
                </header> */}

                <main>
                    <div className="min-h-[calc(100vh-4rem)]">
                        <div className={`w-screen h-[calc(100vh-4rem)] top-16 absolute`}
                                        // ${allowConfirmationPopup ? 'block' : 'hidden'}`}
                        >
                            <ConfirmationPopupComponent
                                allowed={allowConfirmationPopup}
                                onBtnClick={handleBtnClick}
                            />
                        </div>
                        <div className={`relative
                                        p-7
                                        sm:p-10`}
                        >
                            <PopUpComponent message={popupMessage} color={popupColor} allowed={allowPopup} />
                            
                            <h2 className="text-3xl font-bold
                                            mb-5
                                            sm:mb-10"
                            >
                                Manage Ingredients
                            </h2>
                            <div className="rounded-xl
                                            p-5
                                            sm:p-8"
                                style={{ boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)' }}
                            >
                                <form action=""
                                    className="manageIngredientForm text-lg flex flex-wrap gap-5 "
                                    ref={formRef}
                                    onDragOver={handleFormDragOver}
                                    onDrop={handleIngredientDrop}
                                >
                                    <div className="text-amber-600 font-bold flex-1 shrink flex flex-col gap-2">
                                        <label htmlFor="ingredientName">Name</label>
                                        <input className="p-2 outline-none border-2 border-amber-600 rounded-md"
                                            type="text" id="ingredientName" name="ingredientName" value={ingredientName}
                                            onChange={handleNameChange}
                                        />
                                    </div>

                                    <div className="font-bold flex-1 shrink flex flex-col gap-2">
                                        <label htmlFor="ingredientQuantity">Quantity</label>
                                        <input className="p-2 outline-none border-2 border-black rounded-md"
                                            type="number" id="ingredientQuantity" name="ingredientQuantity" value={ingredientQuantity}
                                            onChange={handleQuantityChange}
                                        />
                                    </div>

                                    <div className="font-bold flex-1 shrink flex flex-col gap-2">
                                        <label htmlFor="ingredientUnit">Quantity Unit</label>
                                        <input className=" p-2 outline-none border-2 border-black rounded-md"
                                            type="text" id="ingredientUnit" name="ingredientUnit" value={ingredientUnit}
                                            onChange={handleUnitChange}
                                        />
                                    </div>

                                    <div className="font-bold flex-1 shrink flex flex-col gap-2">
                                        <label htmlFor="ingredientQuantityPerBurger">Quantity/Burger</label>
                                        <input className=" p-2 outline-none border-2 border-black rounded-md"
                                            type="text" id="ingredientQuantityPerBurger" name="ingredientQuantityPerBurger" value={ingredientQuantityPerBurger}
                                            onChange={handleQPBChange}
                                        />
                                    </div>

                                    <div className="text-purple-800 font-bold flex-1 shrink flex flex-col gap-2">
                                        <label htmlFor="ingredientPrice">Price Rate</label>
                                        <input className="p-2 outline-none border-2 border-purple-800 rounded-md"
                                            type="number" id="ingredientPrice" name="ingredientPrice" value={ingredientPrice}
                                            onChange={handlePriceChange}
                                        />
                                    </div>

                                    <div className="buttonPanel flex-1 shrink flex gap-3 justify-end items-end">
                                        <button className="px-3 py-2 text-white bg-purple-800 rounded-md flex items-center gap-1 cursor-pointer"
                                            onClick={ingredientId ? editIngredient : addNewIngredient}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                            <p>Save</p>
                                        </button>
                                        <button className="px-3 py-2 text-white bg-red-600 rounded-md flex items-center gap-1 cursor-pointer"
                                            onClick={clearForm}
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                            <p>Cancel</p>
                                        </button>
                                    </div>
                                </form>
                                
                                <hr className="my-5
                                            sm:my-10"
                                />

                                {ingredientsLoading
                                    ? <div className="flex flex-col justify-center items-center">
                                        <HashLoader
                                            color="#e17100"
                                            size={40}
                                        />
                                        <p className="text-2xl text-amber-600 mt-5 font-serif">Loading Ingredients...</p>
                                    </div>
                                    : <>
                                        {allIngredients.length == 0
                                            ? <div className="h-12 text-amber-600 flex justify-center items-center" >
                                                No ingredients yet
                                            </div>
                                            : <div className="allIngredientsContainer flex flex-wrap gap-8">
                                                {allIngredients.map((eachIngredient, idx) => (
                                                    <IngredientComponent 
                                                        key={idx} ingredient={eachIngredient}
                                                        onDeleteClick={deleteIngredient}
                                                        onDragStart={handleIngredientDragStart}
                                                        onDragEnd={handleIngredientDragEnd}
                                                        loadingDelete={ingredientDeleteLoading}
                                                    />
                                                ))}
                
                                            </div>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default IngredientsForm