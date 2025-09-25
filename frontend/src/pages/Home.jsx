import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import BGImg from "../assets/MyBrrGrrBG.png"
import ItemComponent from "../components/ItemComponent"
import NavBarComponent from "../components/NavBarComponent"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import {faFacebook, faInstagram, faXTwitter} from "@fortawesome/free-brands-svg-icons"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Audio, BallTriangle, Bars, Circles, Grid, Hearts, Oval, TailSpin } from "react-loader-spinner"
import { ClimbingBoxLoader, HashLoader } from "react-spinners"

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Home() {
    const [allItems, setAllItems] = useState([]);
    const [menuLoading, setMenuLoading] = useState(false);

    const navigate = useNavigate();

    const fetchAllItems = async () => {
        setMenuLoading(true)
        try {
            const responce = await fetch(`${backendUrl}/item/getItems?populateIngredient=true`, {
                method: 'GET',
            })

            const data = await responce.json();

            if(responce.ok){
                setAllItems(data.items)
            }
        } catch (error) {
            console.log(error)
        }
        setMenuLoading(false)
    }

    useEffect(() => {
        fetchAllItems()
    }, [])

    return(
        <>
            <div className={`fullHome relative`}>
                {/* <header>
                    <NavBarComponent/>
                </header> */}
                
                <main>
                    {/* BG Image setting */}
                    <div
                        className={`BGImg h-[50vh] w-screen bg-cover bg-center overflow-hidden relative`}
                        style={{backgroundImage: `url(${BGImg})`}}
                    >
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
                            <button className="p-2 text-white bg-amber-600 rounded-md cursor-pointer" onClick={() => navigate("/menu")}>See All <FontAwesomeIcon icon={faAngleRight}/></button>
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
                                        ? <div className="h-60 text-amber-600 rounded-xl flex justify-center items-center"
                                            style={{boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)'}}
                                        >
                                            No items to show
                                        </div>
                                        : <div className="grid gap-6
                                                        sm:grid-cols-2
                                                        md:grid-cols-3
                                                        lg:grid-cols-4"
                                        >
                                            {allItems.slice(-4).reverse().map((eachItem, idx) => (
                                                <ItemComponent
                                                    key={idx}
                                                    role="user"
                                                    item={eachItem}
                                                    onItemClick={() => navigate(`/menu?itemId=${eachItem._id}`, { state: {role: 'user'} })}
                                                />
                                            ))}
                                        </div>
                                    }
                                </>

                                // : <div className="grid gap-6
                                //                 sm:grid-cols-2
                                //                 md:grid-cols-3
                                //                 lg:grid-cols-4"
                                // >
                                //     {allItems.length == 0
                                //         ? <div className="h-60 text-amber-600 flex justify-center items-center
                                //                           sm:col-span-2
                                //                           md:col-span-3
                                //                           lg:col-span-4">
                                //             No items to show
                                //         </div>
                                //         : <></>
                                //     }
                                //     {allItems.map((eachItem, idx) => (
                                //         <ItemComponent key={idx} role="user" item={eachItem} />
                                //     ))}

                                // </div>
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
                                    <Link to={"/"}>Home</Link>
                                    <Link to={"/create"}>Your Creativity</Link>
                                    <Link to={"/placedOrders"}>My Orders</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default Home