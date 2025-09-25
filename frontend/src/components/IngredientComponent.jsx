import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import PopUpComponent from "./PopUpComponent"
import { Oval } from "react-loader-spinner"

function IngredientComponent({ingredient, onDeleteClick, onDragStart, onDragEnd, loadingDelete}){
    const [popupMessage, setPopupMessage] = useState('')
    // const [popupColor, setPopupColor] = useState('amber')
    const [allowPopup, setAllowPopup] = useState(false)

    const handleIngredientClick = () => {
        setPopupMessage('Please drang and drop the ingredient');
        setAllowPopup(true)
    }
    
    useEffect(() => {
        if(allowPopup){
            setTimeout(() => {
                setAllowPopup(false)
                setTimeout(() => {
                    // setPopupColor('amber')
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
                draggable
                onDragStart={() => onDragStart(ingredient)}
                onDragEnd={onDragEnd}
                onClick={handleIngredientClick}
            >
                <p className="px-4 text-amber-600 font-bold border-r-[1px] border-black">{ingredient.ingredientName}</p>
                <div className="px-4 border-r-[1px] border-black flex">
                    <p>{ingredient.ingredientQuantity}</p>
                    <p>{ingredient.ingredientUnit}</p>
                </div>
                <div className="px-4 text-purple-800 font-semibold border-r-[1px] border-black flex gap-1">
                    <p>&#8377; </p>
                    <p>{ingredient.ingredientPrice}</p>
                </div>
                <div>
                    {loadingDelete
                        ? <>
                            <Oval
                                height={24}
                                width={46}
                                strokeWidth="7"
                                color="#000"
                                secondaryColor="#696969"
                            />
                        </>
                        : <>
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="px-4"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteClick(ingredient._id)
                                }}
                            />
                        </>
                    }
                    
                </div>
                
            </div>
        </>
    )
}

export default IngredientComponent