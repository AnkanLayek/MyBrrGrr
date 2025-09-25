import React, { useContext, useEffect, useState } from "react";
import { ClockLoader, GridLoader, HashLoader, MoonLoader, RotateLoader } from "react-spinners";
import BGImg from "../assets/MyBrrGrrBG.png";
import GreenTick from "../assets/GreenTick.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCross, faPen, faRightFromBracket, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import PopUpComponent from "../components/PopUpComponent";
import ConfirmationPopupComponent from "../components/ConfirmationPopupComponent";
import { useOrders } from "../context/AllOrdersContext";
import { userContext } from "../context/ContextProvider";

function PlacedOrders() {
    // const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusEditable, setStatusEditable] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [popupColor, setPopupColor] = useState('amber');
    const [allowPopup, setAllowPopup] = useState(false);
    const [allowConfirmationPopup, setAllowConfirmationPopup] = useState(false);
    const [confirmationPopupMsg, setConfirmationPopupMsg] = useState('');
    const [filterSearch, setFilterSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [allOrdersCount, setAllOrdersCount] = useState(0);
    const [unseenOrdersCount, setUnseenOrdersCount] = useState(0);
    const [activeOrdersCount, setActiveOrdersCount] = useState(0);
    const [deliveredOrdersCount, setDeliveredOrdersCount] = useState(0);
    const [cancelledOrdersCount, setCancelledOrdersCount] = useState(0);
    const [loadingStatusSave, setLoadingStatusSave] = useState(false);
    
    const {role} = useContext(userContext);
    let {allOrders, loadingOrders, changeOrderStatus} = useOrders();

    const closePopup = () => {
        if(role == 'admin' && selectedOrder.orderStatus == 'unseen') {
            setConfirmationPopupMsg("Change the order status to 'Active' ?");
            setAllowConfirmationPopup(true);
        }
        else {
            setSelectedOrder(null);
            setStatusEditable(false);
        }
    }

    const handleConfirmationBtnClick = async (btnReturn) => {
        if(btnReturn == 'yes') {
            await handleStatusSave('active');
        }
        setAllowConfirmationPopup(false);
        setSelectedOrder(null);
        setStatusEditable(false);
    }

    const handleStatusSave = async (newStatus) => {
        if(role != 'admin') {
            return;
        }

        const statusToSave = newStatus ?? selectedStatus;
        if(selectedOrder.orderStatus == statusToSave) {
            setStatusEditable(false);
            return;
        }
        try {
            setLoadingStatusSave(true);
            const response = await changeOrderStatus(selectedOrder, statusToSave);

            const data = await response.json();

            if(response.ok){
                setSelectedOrder((prev) => {
                    if(prev) {
                        return {...prev, orderStatus: statusToSave}
                    }
                    return null;
                })
                setPopupColor('green');
            }
            else{
                setPopupColor('red');
            }
            setPopupMessage(data.message);
            setAllowPopup(true);
        } catch (error) {
            console.log(error);
        }
        setSelectedStatus('');
        setLoadingStatusSave(false);
        setStatusEditable(false);
    }

    const handleStatusChangeCancel = () => {
        setSelectedStatus('');
        setStatusEditable(false);
    }

    const getOrderStatusColor = (status, forceColor, border=false) => {
        if(filterStatus != status && !forceColor){
            return 'bg-gray-100'
        }
        else if(status == 'all') {
            return 'bg-gray-200 text-gray-600'.concat(border ? ' border-[1px] border-gray-600' : '');
        }
        else if(status == 'unseen') {
            return 'bg-orange-100 text-orange-600'.concat(border ? ' border-[1px] border-orange-600' : '');
        }
        else if(status == 'active') {
            return 'bg-green-100 text-green-600'.concat(border ? ' border-[1px] border-green-600' : '');
        }
        else if(status == 'delivered') {
            return 'bg-purple-100 text-purple-700'.concat(border ? ' border-[1px] border-purple-600' : '');
        }
        else if(status == 'cancelled') {
            return 'bg-red-100 text-red-600'.concat(border ? ' border-[1px] border-red-600' : '');
        }
    }

    const getOrderStatusNumber = (status) => {
        if(status == 'all') {
            return allOrdersCount;
        }
        else if(status == 'unseen') {
            return unseenOrdersCount;
        }
        else if(status == 'active') {
            return activeOrdersCount;
        }
        else if(status == 'delivered') {
            return deliveredOrdersCount;
        }
        else if(status == 'cancelled') {
            return cancelledOrdersCount;
        }
    }

    useEffect(() => {
        if(allOrders.length == 0) {
            return;
        }

        if(filterSearch == '' && filterStatus == 'all') {
            setFilteredOrders(allOrders);
            return;
        }

        if(filterSearch == '') {    // Filter for status only
            setFilteredOrders(() => (
                allOrders.filter((eachOrder) => eachOrder.orderStatus == filterStatus)
            ));
            return;
        }

        if(filterStatus == 'all') {    // Filter for search only
            setFilteredOrders(() => (
                allOrders.filter((eachOrder) => (
                    eachOrder.orderName.replaceAll(" ", '').toLowerCase().includes(filterSearch.replaceAll(" ", '').toLowerCase()) ||
                    eachOrder.orderedBy.fullName.replaceAll(" ", '').toLowerCase().includes(filterSearch.replaceAll(" ", '').toLowerCase())
                ))
            ));
            return;
        }

        setFilteredOrders(() => (
            allOrders.filter((eachOrder) => eachOrder.orderStatus == filterStatus)
        ));
        setFilteredOrders((prev) => (
            prev.filter((eachOrder) => (
                eachOrder.orderName.replaceAll(" ", '').toLowerCase().includes(filterSearch.replaceAll(" ", '').toLowerCase()) ||
                eachOrder.orderedBy.fullName.replaceAll(" ", '').toLowerCase().includes(filterSearch.replaceAll(" ", '').toLowerCase())
            ))
        ));
    }, [allOrders, filterSearch, filterStatus])

    useEffect(() => {
        setAllOrdersCount(allOrders.length);
        setUnseenOrdersCount(0);
        setActiveOrdersCount(0);
        setDeliveredOrdersCount(0);
        setCancelledOrdersCount(0);

        allOrders.forEach(eachOrder => {
            if(eachOrder.orderStatus == 'unseen') {
                setUnseenOrdersCount(prev => prev+1);
            }
            else if(eachOrder.orderStatus == 'active') {
                setActiveOrdersCount(prev => prev+1);
            }
            else if(eachOrder.orderStatus == 'delivered') {
                setDeliveredOrdersCount(prev => prev+1);
            }
            else if(eachOrder.orderStatus == 'cancelled') {
                setCancelledOrdersCount(prev => prev+1);
            }
        });
    }, [allOrders])

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
        if(selectedOrder) {
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [selectedOrder])

    // useEffect(() => {
    //     fetchAllOrders();
    // }, [])

    return (
        <>
            <div className="fullPage w-screen relative">
                <main>
                    <div className="min-h-[calc(100vh-4rem)]">
                        <div className={`w-screen h-[calc(100vh-4rem)] top-0 absolute`}
                                        // ${allowConfirmationPopup ? 'block' : 'hidden'}`}
                        >
                            <ConfirmationPopupComponent
                                message={confirmationPopupMsg}
                                allowed={allowConfirmationPopup}
                                onBtnClick={handleConfirmationBtnClick}
                            />
                        </div>
                        <div className={`relative min-h-[calc(100vh-4rem)]
                                        p-7
                                        sm:p-10
                                        ${loadingOrders ? 'overflow-hidden' : ''}`}
                        >
                            <PopUpComponent message={popupMessage} color={popupColor} allowed={allowPopup} />

                            <h2 className="text-3xl font-bold
                                            mb-5
                                            sm:mb-10"
                            >
                                All Orders
                            </h2>
                            <div className="mb-6 flex gap-5 justify-between items-center
                                               flex-col
                                            md:flex-row">

                                {/* Filters */}
                                <div className="flex gap-5 h-fit w-full overflow-scroll">
                                    {
                                        ['all', 'unseen', 'active', 'delivered', 'cancelled'].map((eachStatus) => (
                                            <div
                                                className={`px-3 py-2 text-center text-nowrap rounded-full cursor-pointer
                                                            ${getOrderStatusColor(eachStatus, false, true)}`}
                                                key={eachStatus}
                                                onClick={() => setFilterStatus(eachStatus)}
                                            >
                                                {eachStatus.charAt(0).toUpperCase() + eachStatus.slice(1) + " (" + getOrderStatusNumber(eachStatus) + ")" }
                                            </div>
                                        ))
                                    }
                                </div>

                                {/* Search */}
                                <div
                                    className="group p-2 rounded-full flex items-center
                                                  w-full
                                               md:w-auto"
                                    style={{boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)'}}
                                >
                                    <input
                                        type="search"
                                        placeholder="Search item or user"
                                        className={`right-0 rounded-full outline-none ease-out transition-all duration-400
                                                                w-full           opacity-100             px-2
                                                    group-hover:md:w-80 group-hover:md:opacity-100 group-hover:md:px-2
                                                          focus:md:w-80       focus:md:opacity-100       focus:md:px-2
                                                    ${filterSearch ? 'md:w-80 md:opacity-100 md:px-2' : 'md:w-0 md:opacity-0 md:px-0'}`}
                                        value={filterSearch}
                                        onChange={(e) => setFilterSearch(e.target.value)}
                                        spellCheck={false}
                                    />
                                    <FontAwesomeIcon icon={faSearch} className="p-2 text-xl text-white bg-purple-700 rounded-full cursor-pointer" />
                                </div>

                            </div>
                            {loadingOrders
                            ? <div
                                    className="w-full min-h-80 text-gray-400 flex justify-center items-center rounded-xl"
                                    style={{ boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)' }}
                                >
                                <HashLoader
                                    color="#e17100"
                                />
                            </div>
                            : <>
                                {/* <div
                                    className="w-full min-h-80 flex rounded-xl"
                                    // style={{ boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)' }}
                                > */}
                                    {filteredOrders.length > 0
                                        ? <table className="placedOrdersTable w-full">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="w-[30%] text-amber-600" align="start">Name</th>
                                                    {role == 'admin' && <th className="text-purple-800" align="start">Ordered by</th>}
                                                    <th className="text-amber-600">Status</th>
                                                    <th className={`${role == 'admin' && 'orderPriceCol'} text-purple-800`}>Price</th>
                                                    <th className="text-amber-600 hidden sm:table-cell">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...filteredOrders].reverse().map((eachOrder) => (
                                                    <tr
                                                        key={eachOrder._id}
                                                        className="group transition-all duration-200 cursor-pointer
                                                                hover:scale-[101.5%] hover:bg-purple-100"
                                                        onClick={() => setSelectedOrder(eachOrder)}
                                                    >
                                                        <td className="w-[30%] text-amber-600">
                                                            {eachOrder.orderName} {eachOrder.noOfItems>1 ? `x ${eachOrder.noOfItems}` : ''}
                                                        </td>
                                                        {role == 'admin' && <td className="text-purple-800">{eachOrder.orderedBy.fullName}</td>}
                                                        <td align="center">
                                                            <div className={`inline-block p-2 text-center rounded-sm
                                                                            min-w-[80%]
                                                                            md:min-w-[60%]
                                                                            ${getOrderStatusColor(eachOrder.orderStatus, true)}
                                                                            
                                                                            `}>
                                                                {eachOrder.orderStatus.charAt(0).toUpperCase() + eachOrder.orderStatus.slice(1)}
                                                            </div>
                                                        </td>
                                                        <td className={`${role == 'admin' && 'orderPriceCol'} text-purple-800`} align="center">&#8377; {eachOrder.orderPrice}</td>
                                                        <td className="text-amber-600 hidden sm:table-cell" align="center">{new Date(eachOrder.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        : <div
                                            className="w-full min-h-80 text-gray-400 flex justify-center items-center rounded-xl"
                                            style={{ boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)' }}
                                        >
                                            No orders to display
                                        </div>
                                    }
                                    
                                {/* </div> */}
                            </>
                            }

                            {/* Order details popup */}
                            {selectedOrder && (
                                <div
                                    className="fixed bg-white rounded-xl top-[50vh] left-[50vw] -translate-1/2 flex flex-col gap-6 z-[2]
                                                p-5       w-[90%]
                                                md:p-7 md:w-auto"
                                    style={{ boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)' }}
                                >
                                    <div className="flex items-center gap-10">
                                        <div className="aspect-square rounded-2xl overflow-hidden
                                                        w-[25%]
                                                        sm:w-[15%]">
                                            <img src={BGImg} alt="" />
                                        </div>

                                        <div>
                                            <h2 className="mb-3 text-amber-600 font-bold
                                                            text-2xl
                                                        sm:text-3xl"
                                            >
                                                {selectedOrder.orderName} <span className="font-normal">{selectedOrder.noOfItems>1 ? `x ${selectedOrder.noOfItems}` : ''}</span>
                                            </h2>
                                            {role=='admin' && (
                                                <h3 className="text-purple-800 font-bold
                                                                text-xl
                                                            sm:text-2xl"
                                                >
                                                    Ordered By : <p className="font-semibold inline-block">{selectedOrder.orderedBy.fullName}</p>
                                                </h3>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <ul className="mt-2 flex flex-wrap gap-x-7 gap-y-2">
                                            {selectedOrder.orderIngredients.map((eachIngredient, idx) => (
                                                <li key={idx} className="flex gap-1 items-center">
                                                    <img src={GreenTick} alt="" className="h-5" />
                                                    <span>{eachIngredient.ingredientName}</span>
                                                    {selectedOrder.orderIngredientsQuantities && selectedOrder.orderIngredientsQuantities[eachIngredient._id]>1 && (
                                                        <span>({selectedOrder.orderIngredientsQuantities[eachIngredient._id]}x)</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-semibold">Order Message</h3>
                                        <div className="w-full p-3 mt-2 outline-none bg-gray-200 rounded resize-none">
                                            {selectedOrder.orderMessage
                                                ? selectedOrder.orderMessage
                                                : <div className="text-gray-400 text-center">No Message</div>}
                                        </div>
                                    </div>

                                    <div className="flex justify-between
                                                    flex-col items-start
                                                    sm:flex-row sm:items-center"
                                    >
                                        <h3 className="text-2xl font-semibold">Date & Time</h3>
                                        <div className="text-amber-600 font-medium flex gap-3">
                                            <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                            <p>{new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between
                                                    flex-col
                                                    sm:flex-row"
                                    >
                                        <h3 className="text-2xl font-semibold">Current Status</h3>
                                        {statusEditable && role == 'admin'
                                            ? <div className="flex items-center justify-between
                                                                gap-3
                                                            lg:gap-10"
                                            >
                                                <select
                                                    className="px-3 py-2 mt-1 bg-gray-200 rounded-md outline-none"
                                                    defaultValue={selectedOrder.orderStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                >
                                                    <option value="unseen">Unseen</option>
                                                    <option value="active">Active</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <div className="flex gap-3">
                                                    <div onClick={handleStatusChangeCancel}>
                                                        <FontAwesomeIcon icon={faXmark} className="text-xl text-red-600 cursor-pointer" />
                                                    </div>
                                                    {loadingStatusSave
                                                        ? <GridLoader
                                                            size={3}
                                                            color="green"
                                                        />
                                                        : <div onClick={() => handleStatusSave()}>
                                                            {/* <FontAwesomeIcon icon={faCheck} className="text-xl text-green-600" /> */}
                                                            <img src={GreenTick} alt="" className="h-5 w-5 cursor-pointer" />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            : <div className="flex gap-10 items-center">
                                                <div className={`inline-block p-2 text-center rounded-sm min-w-20
                                                                 ${getOrderStatusColor(selectedOrder.orderStatus, true)}`}
                                                >
                                                    {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
                                                </div>
                                                {role == 'admin' &&
                                                    <div onClick={() => setStatusEditable(true)}>
                                                        <FontAwesomeIcon
                                                            icon={faPen}
                                                            className={`cursor-pointer
                                                                        ${(selectedOrder.orderStatus == 'unseen'
                                                                            ? 'text-amber-600'

                                                                            : (selectedOrder.orderStatus == 'active'
                                                                                ? 'text-green-600'

                                                                                : (selectedOrder.orderStatus == 'delivered'
                                                                                    ? 'text-purple-700'

                                                                                    : (selectedOrder.orderStatus == 'cancelled'
                                                                                        ? 'text-red-600'
                                                                                        : ''
                                                                        ))))}`} />
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>

                                    <div className="flex justify-between
                                                    flex-col items-start
                                                    sm:flex-row sm:items-center"
                                    >
                                        <h3 className="text-2xl font-semibold">Payment Details</h3>
                                        <div className="text-purple-800 font-bold flex gap-2">
                                            <p>&#8377; {selectedOrder.orderPrice}</p>
                                            <p>({selectedOrder.paymentType == 'onTable' ? 'On Table' : 'Online'})</p>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* Blured Layer */}
                            {selectedOrder && (
                                <div
                                    className="z-[1] h-[calc(100%)] w-screen top-0 left-0 bg-black/50 absolute"
                                    onClick={closePopup}
                                >
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default PlacedOrders;