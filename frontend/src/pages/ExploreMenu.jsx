import { useEffect, useState } from "react";
import DetailedItemComponent from "../components/DetailedItemComponent"
import NavBarComponent from "../components/NavBarComponent"
import { HashLoader } from "react-spinners";
import { useSearchParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function ExploreMenu (){
    const [allItems, setAllItems] = useState([]);
    const [menuLoading, setMenuLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const itemId = searchParams.get('itemId');

    const fetchSingleItem = async () => {
        setMenuLoading(true)
        try {
            const responce = await fetch(`${backendUrl}/item/getItems/${itemId}?populateIngredient=true`, {
                method: 'GET',
            })

            const data = await responce.json();

            if(responce.ok){
                setAllItems([data.item])
            }
        } catch (error) {
            console.log(error)
        }
        setMenuLoading(false)
    }

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
        if(itemId){
            fetchSingleItem();
        }
        else{
            fetchAllItems();
        }
    }, [])
    
    return(
        <>
            <div className="fullPage w-screen relative overflow-x-hidden">
                {/* <header>
                    <NavBarComponent/>
                </header> */}

                <main>
                    <div className="p-7
                                    sm:p-10"
                    >
                        <h2 className="text-3xl font-bold
                                           mb-5
                                        sm:mb-10"
                        >
                            All Items
                        </h2>
                        {menuLoading
                            ? <div className="w-full h-[calc(100vh-17.25rem)] m-12 flex flex-col justify-center items-center">
                                <HashLoader
                                    color="#e17100"
                                />
                                <p className="text-3xl text-amber-600 mt-5 font-serif">Loading Menu...</p>
                            </div>
                            : <div className="flex flex-col gap-10">
                                {allItems.length>0
                                    ? <>
                                        {[...allItems].reverse().map((eachItem, idx) => (
                                            <DetailedItemComponent key={idx} role="user" item={eachItem} />
                                        ))}
                                    </>
                                    : <div
                                        className="rounded-xl flex justify-center items-center text-amber-500
                                                      h-[75vh]
                                                   sm:h-[65vh]"
                                        style={{boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(0, 0, 0, 0.1)'}}
                                    >
                                        No item to show
                                    </div>
                                }
                            </div>
                        }
                        
                    </div>
                </main>
            </div>
        </>
    )
}

export default ExploreMenu