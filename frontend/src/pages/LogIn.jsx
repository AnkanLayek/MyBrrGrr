import { useContext, useState } from "react"

import NavBarComponent from "../components/NavBarComponent"
import LoginBurgerImg from '../assets/LoginBurger.webp'
import { Link, useNavigate } from "react-router-dom"
import { userContext } from "../context/ContextProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function LogIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErr, setFormErr] = useState('');
    const [logging, setLogging] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()
    const {loginVisitor} = useContext(userContext)

    const handleEmailChange = async (e) => {
        setEmail(e.target.value)
        if(formErr) {
            setFormErr('')
        }
    }

    const handlePasswordChange = async (e) => {
        setPassword(e.target.value)
        if(formErr) {
            setFormErr('')
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        setLogging(true)

        if(email == ''){
            setFormErr("Email is required")
        }
        else if(password == ''){
            setFormErr("Password is required")
        }
        else{
            const responce = await fetch(`${backendUrl}/log/in`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({email, password}),
                credentials: "include"
            })
            
            const data = await responce.json();
            if(responce.ok){
                loginVisitor(data.visitor)

                if(data.visitor.role == 'admin'){
                    navigate("/adminHome")
                }
                else if(data.visitor.role == 'user'){
                    navigate("/")
                }
            }
            else{
                setFormErr(data.message)
            }
        }

        setLogging(false)
    }

    return(
        <>
            <div className="fullPage w-screen">
                <main>
                    <div className="w-screen h-screen bg-gradient-to-tr from-amber-600 to-amber-400 flex justify-around items-center
                                    flex-col
                                    md:flex-row">
                        <div className="text-white">
                            <p className="font-thin mb-3
                                             text-4xl
                                          sm:text-5xl"
                            >
                                Welcome To
                            </p>
                            <p className="font-[Lucida_Handwriting]
                                             text-5xl
                                          sm:text-6xl"
                            >
                                MyBrrGrr
                            </p>
                        </div>

                        <div className="p-6 backdrop-blur-2xl bg-[rgba(255,255,255,0.6)] flex flex-col items-center gap-3 relative
                                           w-[90%]
                                        sm:w-96"
                        >
                            <div className="w-24 top-0 -translate-y-1/2 absolute">
                                <img src={LoginBurgerImg} alt="" className="aspect-[1.2]"/>
                            </div>
                            
                            <p className="my-5 text-3xl">Log In</p>
                            <form className="w-full flex flex-col gap-6 items-center"
                                onSubmit={handleLogin}
                            >
                                <div className="w-full flex flex-col">
                                    <label htmlFor="email">Email</label>
                                    <input className="outline-none border-b-[1px] p-2"
                                        type="email" name="email" id="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                </div>

                                <div className="w-full flex flex-col relative">
                                    <label htmlFor="password">Password</label>
                                    <input className="outline-none border-b-[1px] p-2"
                                        type={showPassword ? "text" : "password"} name="password" id="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        className="absolute text-xl text-amber-600 right-2 bottom-3 cursor-pointer"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    />
                                </div>

                                <div className="text-red-500">
                                    {formErr !== ''
                                        ? <p>{formErr}</p>
                                        : <></>
                                    }
                                </div>

                                <button className="px-3 py-2 rounded-full text-white bg-gradient-to-b from-amber-600 to-amber-500 cursor-pointer">
                                    {logging
                                        ? <>Logging in...</>
                                        : <>Login</>
                                    }
                                </button>

                                <p>Don't have an account ? <Link to={"/register"}  className="text-purple-800 underline" >Register</Link></p>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default LogIn