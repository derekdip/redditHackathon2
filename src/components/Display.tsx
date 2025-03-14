'use client'

import { createContext, Dispatch, JSX, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { HorizontalScroll } from "./Carousel"

export type IOHandler={
    text: Map<number, Dispatch<SetStateAction<string>>>,
    slider?: RefObject<HTMLDivElement | null>
}
export const IOContext =  createContext<IOHandler>({text:new Map<number,Dispatch<SetStateAction<string>>>()}) 


export function Display(){
    const text = new Map<number,Dispatch<SetStateAction<string>>>()
    const slider =  useRef<HTMLDivElement | null>(null);
    const IO:IOHandler = {text,slider}
    const sample = "   Lorem ipsum l lll ll dolor sit amet consectetur adipisicing elit. Ipsum excepturi impedit aspernatur aliquam. Harum, aliquid! Quos unde in quaerat? Enim expedita nobis veniam eligendi, vitae quas neque officiis corporis est!Lorem ipsum l lll ll dolor sit amet consectetur adipisicing elit. Ipsum excepturi impedit aspernatur aliquam. Harum, aliquid! Quos unde in quaerat? Enim expedita nobis veniam eligendi, vitae quas neque officiis corporis est!"
   return(
        <IOContext.Provider value={IO}>
            <GenerateText text={sample}/>
            <TextInput text ={sample}></TextInput>
        </IOContext.Provider>
    )
}
function Character({id,value}:{id:number,value:string}){
    const io = useContext(IOContext);
    const [backgroundColor,setBackground]=useState("grey")
    useEffect(()=>{
        console.log("setting context vals")
        io.text.set(id,setBackground)
    },[])
    return(
        <div style={{backgroundColor, 
            display: 'inline-block', // Ensures the text stays inline horizontally
            whiteSpace:'break-spaces',
            width:'30px',height:'30px',
            fontSize: '24px'
        }}>
                {value}
        </div>
    )
}
function GenerateText({text}:{text:string}){
    let characters= text.split('')
    let [elements,setElements]=useState<Array<JSX.Element>>([])
    let [loading,setLoading]=useState(true)
    async function rendering(){ //kinda went overkill with this setup but it makes it efficient for large texts
        let elem = []
        for(let i=0; i<characters.length;i++){
            elem.push(<Character id={i} value={characters[i]} ></Character>)
        }
        setElements(elem)
        setLoading(false)
    }
    useEffect(()=>{
        if(loading){
            rendering()
        }
    },[loading])

    if(loading){
        return <></>
    }
    
    return <HorizontalScroll>
        {elements}
    </HorizontalScroll>
}
function TextInput({text}:{text:string}){
    const io = useContext(IOContext);
    let count = 3
    function logic(){
        {
            console.log("clicking")
            let colorSetter = io.text.get(count)//key is the index of text, value is the stateUpdater for that character
            if(colorSetter){
                colorSetter("green")
            }
            if (io.slider && io.slider.current) {
                io.slider.current.scrollLeft
                const scrollPosition =30; //this is the set width of the text divs
                io.slider.current.scrollLeft += scrollPosition;
            }
            count++
        }
    }
    return(
        <button style={{width:100,height:100, fontSize: '1rem'}} onClick={logic}>
                change next letter color
            </button>
    )
}

