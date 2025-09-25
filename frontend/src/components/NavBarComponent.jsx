import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useState } from 'react'
import { userContext } from '../context/ContextProvider';
import PopUpComponent from './PopUpComponent';
import { useOrders } from '../context/AllOrdersContext';
import { Link, useLocation } from 'react-router-dom';

const backend_url = import.meta.env.VITE_BACKEND_URL;

function NavBarComponent () {
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [popupMessage, setPopupMessage] = useState('')
    const [popupColor, setPopupColor] = useState('amber')
    const [allowPopup, setAllowPopup] = useState(false)
    const [unseenOrdersCount, setUnseenOrdersCount] = useState(0);
    const [activeOrdersCount, setActiveOrdersCount] = useState(0);
    
    const location = useLocation();

    const {allOrders} = useOrders();

    const {role, authenticated, logoutVisitor} = useContext(userContext);

    const handleLogout = async () => {
        setLoadingLogout(true);
        try {
            const responce = await fetch(`${backend_url}/log/out`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            })

            const data = await responce.json();
            if(responce.ok) {
                logoutVisitor();
                setPopupColor("green");
            }
            setPopupMessage(data.message);
            setAllowPopup(true);
        }
        catch (error) {
            console.error("Failed to logout:", error);
            setPopupMessage("Failed to logout");
            setPopupColor("red");
            setAllowPopup(true);
        }
        setIsLogoutPopupOpen(false);
        setLoadingLogout(false);
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
        if (isLogoutPopupOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Clean up in case component unmounts
        return () => {
            document.body.style.overflow = '';
        };
    }, [isLogoutPopupOpen]);

    useEffect(() => {
        setUnseenOrdersCount(0);
        setActiveOrdersCount(0);

        allOrders.forEach(eachOrder => {
            if(eachOrder.orderStatus == 'unseen') {
                setUnseenOrdersCount(prev => prev+1);
            }
            else if(eachOrder.orderStatus == 'active') {
                setActiveOrdersCount(prev => prev+1);
            }
        });
    }, [allOrders])

    useEffect(() => {
        if(isMenuExpanded) {
            setIsMenuExpanded(false)
        }
    }, [location])

    return(
        <>
            <div className="h-16 w-screen px-5 flex justify-between items-center shadow-md relative z-20">
                <h3 className="text-amber-600 text-3xl font-[Lucida_Handwriting]">MyBrrGrr</h3>

                {role == 'admin'
                    ? <div className='flex items-center
                                         gap-5
                                      sm:gap-10'
                    >
                        <Link to={"/placedOrders"} className="group relative">
                            {activeOrdersCount>0 && (
                                <>
                                    <div className={`activeOrderCounter h-5 w-5 text-white text-sm flex justify-center items-end bg-green-600 border-[2px] border-white rounded-full absolute right-0 translate-x-1/2 -translate-y-1/2
                                                     ${unseenOrdersCount>0 ? 'group-hover:animate-[mySlide_2s_ease-in-out_infinite]' : ''}`}
                                    >
                                        {activeOrdersCount}
                                    </div>
                                    {unseenOrdersCount==0 && (
                                        <div className={`animate-ping h-5 w-5 bg-green-600 rounded-full absolute right-0 translate-x-1/2 -translate-y-1/2`}></div>
                                    )}
                                </>
                            )}
                            {unseenOrdersCount>0 && (
                                <>
                                    <div className={`unseenOrderCounter h-5 w-5 text-white text-sm flex justify-center items-end bg-red-600 border-[2px] border-white rounded-full absolute right-0 translate-x-1/2 -translate-y-1/2
                                                     ${activeOrdersCount>0 ? 'group-hover:animate-[-mySlide_2s_ease-in-out_infinite]' : ''}`}
                                    >
                                        {unseenOrdersCount}
                                    </div>
                                    <div className={`animate-ping h-5 w-5 bg-red-600 rounded-full absolute right-0 translate-x-1/2 -translate-y-1/2
                                                     ${activeOrdersCount>0 ? 'group-hover:hidden' : ''}`}>
                                    </div>
                                </>
                            )}
                            Orders
                        </Link>
                        <div className='w-5 text-amber-600 text-2xl cursor-pointer'
                            onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                        >
                            {isMenuExpanded
                                ? <FontAwesomeIcon icon={faXmark} />
                                : <FontAwesomeIcon icon={faBars} />
                            }
                            
                        </div>
                        <div
                            className={`bg-white gap-5 absolute flex flex-col p-3 top-[4.5rem] right-2 rounded-md transition-all duration-300
                                        ${isMenuExpanded ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'}`}
                                        // sm:bg-transparent sm:gap-10 sm:relative sm:flex-row sm:top-0 sm:right-0 sm:p-0`}
                                        style={{boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)'}}
                        >
                            <Link to="/adminHome">Admin Home</Link>
                            <Link to="/">User Home</Link>
                            <Link to="/ingredientForm">Manage Ingredients</Link>
                            <div className='cursor-pointer' onClick={() => setIsLogoutPopupOpen(true)}>Logout</div>
                        </div>
                    </div>
                    : <>
                        <div className='w-5 text-amber-600 text-2xl
                                        sm:hidden'
                            onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                        >
                            {isMenuExpanded
                                ? <FontAwesomeIcon icon={faXmark} />
                                : <FontAwesomeIcon icon={faBars} />
                            }
                            
                        </div>
                        <div
                            className={`bg-white gap-5 absolute flex flex-col p-3 rounded-md transition-all duration-300 shadow-xl
                                        ${isMenuExpanded ? 'top-[4.5rem] right-2' : 'top-[4.5rem] -right-[8.5rem]'}
                                        sm:bg-transparent sm:gap-10 sm:relative sm:flex-row sm:top-0 sm:right-0 sm:p-0 sm:shadow-none`}
                                        // style={{boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)'}}
                        >
                            <Link to="/">Home</Link>
                            <Link to="/placedOrders">Your Orders</Link>
                            <Link to="/create">Your Creativity</Link>
                            {authenticated
                                ? <div className='cursor-pointer' onClick={() => setIsLogoutPopupOpen(true)}>Logout</div>
                                : <Link to="/login">Login</Link>
                            }
                            
                        </div>
                    </>
                }
            </div>

            <div className='relative'>
                <PopUpComponent message={popupMessage} color={popupColor} allowed={allowPopup} />
            </div>

            {/* Log out confirmation popup */}
            <div className={`absolute p-7 bg-white rounded-lg left-1/2 top-[50vh] -translate-1/2 flex-col gap-7 z-40
                             ${isLogoutPopupOpen ? 'flex' : 'hidden'}`}
            >
                <h3 className='text-xl font-semibold'>Are you sure you want to log out?</h3>
                <div className='w-full flex justify-between'>
                    <button
                        className='w-36 p-3 rounded-full text-white bg-purple-800'
                        onClick={() => setIsLogoutPopupOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className='w-36 p-3 rounded-full text-white bg-amber-600'
                        onClick={handleLogout}
                    >
                        {loadingLogout
                            ? <>Logging out...</>
                            : <>Logout</>
                        }
                    </button>
                </div>
            </div>

            {/* Blurred layer */}
            <div
                className={`absolute h-screen w-screen bg-black opacity-50 z-30
                            ${isLogoutPopupOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsLogoutPopupOpen(false)}
            >
            </div>
        </>
    )
}

export default NavBarComponent