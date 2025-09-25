import { useContext, useState } from "react"

import LoginBurgerImg from '../assets/LoginBurger.webp'
import { Link, useNavigate } from "react-router-dom"
import { userContext } from "../context/ContextProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import { faEye } from "@fortawesome/free-regular-svg-icons";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Register(){
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErr, setFormErr] = useState('');
    const [registering, setRegistering] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()
    const {loginVisitor} = useContext(userContext)

    const handleFullNameChange = async (e) => {
        setFullName(e.target.value)
        if(formErr) {
            setFormErr('')
        }
    }

    const handleUsernameChange = async (e) => {
        setUsername(e.target.value)
        if(formErr) {
            setFormErr('')
        }
    }

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

    const handleRegister = async (e) => {
        e.preventDefault()

        setRegistering(true)

        if(fullName == ''){
            setFormErr("Full name is required")
        }
        else if(username == ''){
            setFormErr("Username is required")
        }
        else if(email == ''){
            setFormErr("Email is required")
        }
        else if(password == ''){
            setFormErr("Password is required")
        }
        else{
            const responce = await fetch(`${backendUrl}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({fullName, username, email, password}),
                credentials: "include"
            })
            
            const data = await responce.json();
            if(responce.ok){
                loginVisitor(data.user.role)
                navigate("/")
            }
            else{
                setFormErr(data.message)
            }
        }

        setRegistering(false)
    }

    return(
        <>
            <div className="fullPage w-screen">
                <main>
                    <div className="w-screen h-screen bg-gradient-to-tr from-amber-600 to-amber-400 flex justify-around items-center
                                       flex-col
                                    md:flex-row"
                    >
                        <div className="text-white
                                        hidden
                                        md:block"
                        >
                            <p className="font-thin mb-3
                                             text-4xl
                                          lg:text-5xl"
                            >
                                Welcome To
                            </p>
                            <p className="font-[Lucida_Handwriting]
                                             text-5xl
                                          lg:text-6xl"
                            >
                                MyBrrGrr
                            </p>
                        </div>

                        <div className="p-6 backdrop-blur-2xl bg-[rgba(255,255,255,0.6)] flex flex-col items-center gap-3 relative
                                           w-[90%]
                                        sm:w-[28rem]"
                        >
                            <div className="w-24 top-0 -translate-y-1/2 absolute">
                                <img src={LoginBurgerImg} alt="" className="aspect-[1.2]"/>
                            </div>
                            
                            <p className="my-5 text-3xl">Register</p>
                            <form className="w-full flex flex-col gap-6 items-center"
                                onSubmit={handleRegister}
                            >
                                <div className="w-full flex flex-col">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input className="outline-none border-b-[1px] p-2"
                                        type="text" name="fullName" id="fullName"
                                        value={fullName}
                                        onChange={handleFullNameChange}
                                    />
                                </div>

                                <div className="w-full flex flex-col">
                                    <label htmlFor="username">Username</label>
                                    <input className="outline-none border-b-[1px] p-2"
                                        type="text" name="username" id="username"
                                        value={username}
                                        onChange={handleUsernameChange}
                                    />
                                </div>

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
                                    {registering
                                        ? <>Registering...</>
                                        : <>Register</>
                                    }
                                </button>

                                <p>Aleady having an account ? <Link to={"/login"}  className="text-purple-800 underline" >Login</Link></p>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default Register;