import {  JSX, useContext, useEffect } from "react";
import { IOContext } from "./Display";


export function HorizontalScroll({children}:{children: JSX.Element| JSX.Element[]}){
    const io = useContext(IOContext);
    useEffect(() => {
        if (io.slider && io.slider.current) {
            io.slider.current.style.overflowX = 'hidden';
        }
      }, []); // The empty array ensures this runs only after the first render
    return (
        <div className="scrollable-container" style={{ width: '400px', overflowX: 'auto', whiteSpace: 'nowrap',scrollBehavior:'smooth',scrollbarWidth:'none'}} ref={io.slider} >
            {children}
        </div>
    );
};