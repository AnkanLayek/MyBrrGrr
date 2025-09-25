import BGImg from "../assets/MyBrrGrrBG.png"
import GreenTick from "../assets/GreenTick.png"
import itemsUsed  from "../assets/ingredientsUsed.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight, faPencil } from "@fortawesome/free-solid-svg-icons"
import { useLocation, useNavigate } from "react-router-dom"

function DetailedItemComponent ({role='visitor', item}) {
    const location = useLocation();
    const userRole = location.state?.role || role;
    const navigate = useNavigate()

    return(
        <>
            <div className="w-full min-h-80 flex rounded-xl
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
                        <h3 className="text-3xl text-amber-600 font-bold ">{item.itemName}</h3>
                        {/* <button className="p-2 text-white bg-amber-600 rounded-md">Customize</button> */}
                        <button
                            className="p-2 text-white bg-amber-600 rounded-md cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                userRole == 'admin' ? navigate(`/itemForm/${item._id}`) : navigate(`/create?itemId=${item._id}`);
                            }}
                        >
                            {userRole=='admin'
                                ? <><FontAwesomeIcon icon={faPencil}/> Edit</>
                                : <>Customize</>
                            }
                            
                        </button>
                    </div>
                    
                    <p className="mt-3">{item.itemDescription}</p>
                    
                    <hr className="mt-3 lg:mt-6" />

                    <div className="mt-3 lg:mt-6">
                        <h4 className="text-xl font-semibold">Ingredients Used</h4>
                        <ul className="mt-2 flex flex-wrap gap-7 ">
                            {item.ingredients.map((eachIngredient, idx) => (
                                <div key={idx} className="flex items-center">
                                    <img src={GreenTick} alt="" className="h-5" />
                                    <li>{eachIngredient.ingredientName}</li>
                                </div>
                            ))}
                        </ul>
                    </div>

                    <hr className="mt-3 lg:mt-6" />

                    <div className="mt-3 flex justify-between items-center flex-wrap
                                    lg:mt-6"
                    >
                        <p className="font-semibold text-xl text-purple-800"><b>Price : </b> &#8377; {item.itemPrice}</p>
                            {userRole=='user' || userRole=='visitor'
                            ? <button className="p-2 text-white bg-purple-800 rounded-md cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/order", { state: item })
                                }}
                            >
                                Order <FontAwesomeIcon icon={faAngleRight}/>
                            </button>
                            : <></>
                        }
                    </div>

                </div>

            </div>
        </>
    )
}

export default DetailedItemComponent