'use client'

import { createContext, Dispatch, JSX, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { HorizontalScroll } from "./Carousel"
import { TimerView } from "./Timer"

export type IOHandler={
    text?: RefObject<Map<number, Dispatch<SetStateAction<string>>>|null>,
    slider?: RefObject<HTMLDivElement | null>
    timerColor?: RefObject<string | null>
}
export const IOContext =  createContext<IOHandler>({}) 


export function Display(){
    const text = new Map<number,Dispatch<SetStateAction<string>>>()
    const textRef = useRef(text)
    const slider =  useRef<HTMLDivElement | null>(null);
    const timerColor = useRef("red") //only use refs at this level bc useStates will cause re-renders
    const IO:IOHandler = {text:textRef,slider,timerColor}
    const sample = "   Lorem ipsum l lll ll dolor sit amet consectetur adipisicing elit. Ipsum excepturi impedit aspernatur aliquam. Harum, aliquid! Quos unde in quaerat? Enim expedita nobis veniam eligendi, vitae quas neque officiis corporis est!Lorem ipsum l lll ll dolor sit amet consectetur adipisicing elit. Ipsum excepturi impedit aspernatur aliquam. Harum, aliquid! Quos unde in quaerat? Enim expedita nobis veniam eligendi, vitae quas neque officiis corporis est!"
   return(
        <IOContext.Provider value={IO}>
            <TimerView></TimerView>
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
        if(io.text?.current){
            io.text.current.set(id,setBackground)
        }
    },[])
    return(
        <div style={{backgroundColor, 
            display: 'inline-block', // Ensures the text stays inline horizontally
            whiteSpace:'break-spaces',
            width:'30px',height:'30px',
            fontSize: '24px',
            
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
    const logic = (event:React.ChangeEvent<HTMLInputElement>) => {
        //console.log(event.target.value)
        if(!io.text?.current){
            return
        }
          let colorSetter = io.text.current.get(count);
          console.log(count)
          console.log(colorSetter)
          if (colorSetter) {
            if (io.timerColor && io.timerColor.current === "red") {
                console.log("changing color to red")
              colorSetter("red");
            } else if (io.timerColor && io.timerColor.current === "green") {
                console.log("changing color to green")
              colorSetter("green");
            }
          }
      
          if (io.slider && io.slider.current) {
            const scrollPosition = 30*count;
            io.slider.current.scrollLeft = scrollPosition;
            count++;
          }
      
      };
    return(
        <>
        <input type="text" placeholder="Enter text here" style={{width:100,height:100, fontSize: '1rem', backgroundColor:"white"}} onChange={(e)=>logic(e)}>
         </input>
        </>
    )
}

