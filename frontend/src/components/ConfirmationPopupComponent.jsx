function ConfirmationPopupComponent ({message='', allowed=false, onBtnClick}) {
    return(
        <>
            <div className={`w-full h-full relative z-10
                            ${allowed ? 'block' : 'hidden'}`}
            >
                <div className={`aspect-[2/1] p-5 bg-white rounded-xl flex flex-col items-center justify-around gap-8 top-1/2 left-1/2 -translate-1/2 transition-all duration-200 absolute
                                ${allowed ? 'scale-100' : 'scale-0'}
                                 sm:min-w-96 `}
                >
                    <div className="text-lg text-center">{message}</div>
                    <div className="w-full flex justify-around gap-3">
                        <button className="w-20 py-2 text-lg text-white bg-green-600 rounded-full cursor-pointer"
                            onClick={() => onBtnClick("yes")}
                        >
                            Yes
                        </button>
                        <button className="w-20 py-2 text-lg text-white bg-red-600 rounded-full cursor-pointer"
                            onClick={() => onBtnClick("no")}
                        >
                            No
                        </button>
                    </div>
                </div>

                <div className={`w-full h-full bg-[rgba(0,0,0,0.3)]`}
                                // ${allowed ? 'block' : 'hidden'}`}
                >

                </div>
            </div>
        </>
    )
}

export default ConfirmationPopupComponent