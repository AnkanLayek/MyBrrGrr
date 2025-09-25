import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

const BG_CLASSES = {
    amber: 'bg-amber-300',
    green: 'bg-green-300',
    red: 'bg-red-300'
}

const BORDER_CLASSES = {
    amber: 'border-amber-500',
    green: 'border-green-500',
    red: 'border-red-500'
}

const CROSS_CLASSES = {
    amber: 'text-amber-700',
    green: 'text-green-700',
    red: 'text-red-700'
}

const PROGRESS_CLASSES = {
    amber: 'bg-amber-100',
    green: 'bg-green-100',
    red: 'bg-red-100'
}

function PopUpComponent ({message='', color='amber', allowed=false}) {
    const bgClass = BG_CLASSES[color]
    const borderClass = BORDER_CLASSES[color]
    const crossClass = CROSS_CLASSES[color]
    const progressClass = PROGRESS_CLASSES[color]

    const [allowPopup, setAllowPopup] = useState(allowed)
    const [progressWidth, setProgressWidth] = useState(0)
    let counter = 0;

    const closePopup = () => {
        setAllowPopup(false)
    }

    const increaseProgressWidth = () => {
        counter++;
        setProgressWidth(counter);
        if(counter >= 100){
            clearInterval(progressInterval)
        }
    }

    let progressInterval
    useEffect(() => {
        setAllowPopup(allowed)
        if(allowed){
            progressInterval = setInterval(increaseProgressWidth, 40);
            return () => clearInterval(progressInterval)
        }
    }, [allowed])

    return (
        <div className={`max-w-[90vw] p-3 ${bgClass} border-[1px] ${borderClass} rounded-b-md overflow-hidden left-1/2 -translate-x-1/2 flex gap-5 absolute transition-all duration-150 z-10
                         ${allowPopup ? 'top-0' : '-top-40'}`}
        >
            <div>{message}</div>
            <div className="cursor-pointer"
                onClick={closePopup}
            >
                <FontAwesomeIcon icon={faXmark} className={`${crossClass}`}/>
            </div>
            <div className={`h-1 ${progressClass} absolute bottom-0 left-0`}
                style={{width: `${progressWidth}%`}}
            >

            </div>
        </div>
    )
}

export default PopUpComponent