import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight, faArrowRight, faPencil, faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { Oval } from "react-loader-spinner"
import BG from "../assets/MyBrrGrrBG.png"

function ItemComponent ({role='visitor', item, onItemClick, onDeleteClick = () => {}, loadingDelete}) {

    const navigate = useNavigate();

    return(
        <>
            <div className="group p-4 rounded-2xl transition-all duration-200
                            hover:scale-[107%] hover:bg-amber-600"
                style={{boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)'}}
                onClick={onItemClick}
            >
                <div className="h-48 rounded-xl overflow-hidden">
                    <img src={BG} alt="" />
                </div>
                <div className=" mt-2 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-amber-600
                                    group-hover:text-white"
                    >
                        {item.itemName}
                    </h3>
                    <button
                        className="p-2 text-white bg-amber-600 rounded-md cursor-pointer
                                 group-hover:bg-white group-hover:text-amber-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            role == 'admin' ? navigate(`/itemForm/${item._id}`) : navigate(`/create?itemId=${item._id}`);
                        }}
                    >
                        {role=='admin'
                            ? <><FontAwesomeIcon icon={faPencil}/> Edit</>
                            : <>Customize</>
                        }
                        
                    </button>
                </div>
                <p className="min-h-20 flex items-center mt-1 group-hover:text-white">{item.itemDescription}</p>
                <div className="mt-2  flex justify-between items-center">
                    <p className="font-semibold text-purple-800">&#8377; {item.itemPrice}</p>
                    <button className="p-2 text-white bg-purple-800 rounded-md cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            role == 'admin' ? onDeleteClick(item._id) : navigate("/order", { state: item });
                        }}
                    >
                        {role=='admin'
                            ? <>
                                {loadingDelete
                                    ? <>
                                        <Oval
                                            height={24}
                                            width={64}
                                            strokeWidth="7"
                                            color="#fff"
                                            secondaryColor="#fff"
                                        />
                                    </>
                                    : <><FontAwesomeIcon icon={faTrash} /> Delete</>
                                }
                            </>
                            : <>Order <FontAwesomeIcon icon={faAngleRight}/></>
                        }
                    </button>
                    
                </div>
            </div>
        </>
    )
}

export default ItemComponent