import { faMinus, faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import PopUpComponent from "./PopUpComponent"

function IngredientUserComponent({ingredient, isSelected=false, currentQuantity, onRemoveClick, onQuantityChange, onDragStart, onDragEnd}){
    // const [ingredientPrice, setIngredientPrice] = useState(ingredient.ingredientPrice)
    // const [selectedQuantity, setSelectedQuantity] = useState(ingredient.currQuantity)
    const [popupMessage, setPopupMessage] = useState('')
    // const [popupColor, setPopupColor] = useState('amber')
    const [allowPopup, setAllowPopup] = useState(false)

    const handlePlusQuantity = () => {
        if(currentQuantity<3){
            onQuantityChange(ingredient._id, currentQuantity+1)
        }
    }

    const handleMinusQuantity = () => {
        if(currentQuantity>1){
            onQuantityChange(ingredient._id, currentQuantity-1)
        }
    }

    const handleIngredientClick = () => {
        setPopupMessage('Please drang and drop the ingredient');
        setAllowPopup(true)
    }

    useEffect(() => {
        if(allowPopup){
            setTimeout(() => {
                setAllowPopup(false)
                setTimeout(() => {
                    setPopupMessage('')
                }, 150);
            }, 4000);
        }
    }, [allowPopup])

    return (
        <>
            <PopUpComponent message={popupMessage} allowed={allowPopup} />
            <div className="py-3 rounded-full flex cursor-pointer"
                style={{ boxShadow: '3px 0px 8px rgba(225, 113, 0, 0.5), -3px 0px 8px rgba(225, 113, 0, 0.5)' }}
                draggable={!isSelected}
                onDragStart={() => onDragStart(ingredient)}
                onDragEnd={onDragEnd}
                onClick={() => {
                    if(!isSelected) {
                        handleIngredientClick();
                    }
                }}
            >
                <p className="px-4 text-amber-600 font-bold border-r-[1px] border-black">{ingredient.ingredientName}</p>
                {!isSelected
                    ? <>
                        <div className="px-4 border-r-[1px] border-black flex">
                            <p>{ingredient.ingredientQuantity}</p>
                            <p>{ingredient.ingredientUnit}</p>
                        </div>
                        <div className="px-4 text-purple-800 font-semibold flex gap-1">
                            <p>&#8377; </p>
                            <p>{ingredient.ingredientPrice}</p>
                        </div>
                    </>
                    : <>
                        {/* <div className="px-4 border-r-[1px] border-black flex">
                            <p>{ingredient.ingredientQuantity}</p>
                            <p>{ingredient.ingredientUnit}</p>
                        </div> */}
                        <div className="px-4 text-purple-800 font-semibold border-r-[1px] border-black flex gap-2">
                            <p onClick={handleMinusQuantity} className={`${currentQuantity <= 1 ? 'text-purple-400' : ''}`}><FontAwesomeIcon icon={faMinus}/></p>
                            <p className="cursor-default">{currentQuantity}x</p>
                            <p onClick={handlePlusQuantity} className={`${currentQuantity >= 3 ? 'text-purple-400' : ''}`}><FontAwesomeIcon icon={faPlus}/></p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faXmark} className="px-4" onClick={() => onRemoveClick(ingredient)} />
                        </div>
                    </>
                }
                {/* <div className="px-4 border-r-[1px] border-black flex">
                    <p>{ingredient.ingredientQuantity}</p>
                    <p>{ingredient.ingredientUnit}</p>
                </div>
                <div className="px-4 text-purple-800 font-semibold flex gap-1">
                    <p>&#8377; </p>
                    <p>{ingredient.ingredientPrice}</p>
                </div> */}
                {/* <div>
                    <FontAwesomeIcon icon={faTrash} className="px-4" onClick={() => onRemoveClick(ingredient._id)} />
                </div> */}
                
            </div>
        </>
    )
}

export default IngredientUserComponent