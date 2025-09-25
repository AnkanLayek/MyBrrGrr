import { createContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const userContext = createContext();

const ContextProvider = ( {children} ) => {
    // const role = 'admin'
    // const authenticated = true

    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState('');
    const [authenticated, setAuthenticated] = useState(null);

    const loginVisitor = (visitor) => {
        setCurrentUser(visitor)
        setRole(visitor.role)
        setAuthenticated(true)
    }
    const logoutVisitor = () => {
        setCurrentUser(null)
        setRole('visitor');
        setAuthenticated(false);
    }

    const fetchVisitorDetails = async () => {
        try {
            const response = await fetch(`${backendUrl}/visitorDetails/get`, {
                method: 'GET',
                credentials: "include"
            })

            const data = await response.json();
            if(response.ok){
                setCurrentUser(data.visitor)
                setRole(data.role)
                setAuthenticated(data.authenticated)
            }
            else{
                setRole("visitor");
                setAuthenticated(false);
            }
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    }

    useEffect(() => {
        fetchVisitorDetails()
    }, [])

    return (
        <>
            {((role!='') && (authenticated!=null))
                ? <userContext.Provider value={{currentUser, role, authenticated, loginVisitor, logoutVisitor}}>
                    {children}
                </userContext.Provider>
                : <></>
            }
        </>
    )
}

export default ContextProvider