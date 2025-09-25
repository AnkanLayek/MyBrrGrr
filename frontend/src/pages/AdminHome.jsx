import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import BGImg from "../assets/MyBrrGrrBG.png"
import ItemComponent from "../components/ItemComponent"
import NavBarComponent from "../components/NavBarComponent"
import { faAngleRight, faPlus } from "@fortawesome/free-solid-svg-icons"
import {faFacebook, faInstagram, faXTwitter} from "@fortawesome/free-brands-svg-icons"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { HashLoader } from "react-spinners"
import PopUpComponent from "../components/PopUpComponent"
import { useContext } from "react"
import { userContext } from "../context/ContextProvider"

const backend_url = import.meta.env.VITE_BACKEND_URL;

function AdminHome() {
    const [allItems, setAllItems] = useState([]);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupColor, setPopupColor] = useState('amber');
    const [allowPopup, setAllowPopup] = useState(false);
    const [menuLoading, setMenuLoading] = useState(false);
    const [itemDeleteLoading, setItemDeleteLoading] = useState(false);

    const {role} = useContext(userContext);

    const navigate = useNavigate();

    const fetchAllItems = async () => {
        setMenuLoading(true)
        try {
            const responce = await fetch(`${backend_url}/item/getItems`, {
                method: 'GET',
            })

            const data = await responce.json();

            if(responce.ok){
                console.log(data.items)
                setAllItems(data.items)
            }
        } catch (error) {
            console.log(error)
        }
        setMenuLoading(false)
    }

    const handleItemDelete = async (itemId) => {
        if(role != 'admin') {
            return;
        }

        setItemDeleteLoading(true);
        try {
            const response = await fetch(`${backend_url}/item/delete`, {
                method: 'DELETE',
                body: JSON.stringify({
                    _id: itemId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if(response.ok) {
                setPopupColor('green')
                setAllItems((prev) => (prev.filter((eachItem) => eachItem._id != itemId)))
            }
            else {
                setPopupColor('red')
            }

            setPopupMessage(data.message)
            setAllowPopup(true)
        } catch (error) {
            console.log(error)
        }
        setItemDeleteLoading(false);
    }

    useEffect(() => {
        fetchAllItems()
    }, [])

    return(
        <>
            <div className={`fullHome relative overflow-x-hidden`}>
                {/* <header>
                    <NavBarComponent/>
                </header> */}
                
                <main>
                    {/* BG Image setting */}
                    <div
                        className={`BGImg h-[50vh] w-screen bg-cover bg-center overflow-hidden relative`}
                        style={{backgroundImage: `url(${BGImg})`}}
                    >
                        <PopUpComponent message={popupMessage} color={popupColor} allowed={allowPopup} />
                        <h2 className="p-4 text-3xl text-white font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 flex absolute"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <pre className="font-sans">Welcome to </pre>
                            <div>MyBrrGrr</div>
                        </h2>
                        <div className="BGMask bg-gradient-to-t from-white to-transparent w-full h-1/2 absolute bottom-0"></div>
                    </div>

                    <div className="mt-8 p-5">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold sm:text-3xl">Explore Menu</h2>
                            <button className="p-2 text-white bg-amber-600 rounded-md cursor-pointer" onClick={() => navigate("/itemForm")}><FontAwesomeIcon icon={faPlus}/> Add Item</button>
                        </div>
                        <div className="mt-6 w-full">
                            {menuLoading
                                ? <div className="w-full m-12 flex flex-col items-center">
                                    <HashLoader
                                        color="#e17100"
                                    />
                                    <p className="text-3xl text-amber-600 mt-5 font-serif">Loading Menu...</p>
                                </div>
                                : <>
                                    {allItems.length == 0
                                        ? <div className="h-60 text-amber-600 flex justify-center items-center" >
                                            No items to show
                                        </div>
                                        : <div className="grid gap-6
                                                        sm:grid-cols-2
                                                        md:grid-cols-3
                                                        lg:grid-cols-4"
                                        >
                                            {[...allItems].reverse().map((eachItem, idx) => (
                                                <ItemComponent
                                                    key={idx}
                                                    role="admin"
                                                    item={eachItem}
                                                    onItemClick={() => navigate(`/menu?itemId=${eachItem._id}`, { state: {role: 'admin'} })}
                                                    onDeleteClick={handleItemDelete}
                                                    loadingDelete={itemDeleteLoading}
                                                />
                                            ))}
                                        </div>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </main>
                
                <footer>
                    <div className="w-screen p-3 bg-[#f5f5f5] flex flex-wrap justify-around">
                        <div className="mb-5 flex justify-center basis-1/3">
                            <div>
                                <h4 className="font-bold">Contact Us</h4>
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
                                <p>Email: ankanlayek4444@gmail.com</p>
                                <p>Phone: +911234567890</p>
                            </div>
                        </div>
                        <div className="mb-5 flex justify-center basis-1/3">
                            <div>
                                <h4 className="font-bold">Follow Us</h4>
                                <div className="flex gap-2">
                                    <FontAwesomeIcon icon={faFacebook}/>
                                    <FontAwesomeIcon icon={faInstagram}/>
                                    <FontAwesomeIcon icon={faXTwitter}/>
                                </div>
                            </div>
                        </div>
                        <div className=" mb-5 flex justify-center basis-1/3">
                            <div>
                                <h4 className="font-bold">Quick Links</h4>
                                <div className="flex flex-col">
                                    <Link to={"/adminHome"}>Admin Home</Link>
                                    <Link to={"/"}>User Home</Link>
                                    <Link to={"/create"}>Your Creativity</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default AdminHome