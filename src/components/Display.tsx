'use client'

import { createContext, Dispatch, JSX, SetStateAction, useContext, useEffect, useRef, useState } from "react"

const TextContext =  createContext(new Map<number,Dispatch<SetStateAction<string>>>()) //Map renderer
export function Display(){
    const manager = new Map<number,Dispatch<SetStateAction<string>>>()
    const sample = "hello world"
    return(
        <TextContext.Provider value={manager}>
            <GenerateText text={sample}/>
            <TextInput text ={sample}></TextInput>
        </TextContext.Provider>
    )
}
function Character({id,value}:{id:number,value:string}){
    const textContext = useContext(TextContext);
    const [backgroundColor,setBackground]=useState("grey")
    useEffect(()=>{
        console.log("setting context vals")
        textContext.set(id,setBackground)
    },[])
    return(
        <span style={{backgroundColor, fontSize: '2rem'}}>
                {value}
        </span>
    )
}
function GenerateText({text}:{text:string}){
    let characters= text.split('')
    let [elements,setElements]=useState<Array<JSX.Element>>([])
    let [loading,setLoading]=useState(true)
    async function rendering(){ //kinda went overkill with this setup but it makes it more efficient
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
    
    return <div>
        {elements}
    </div>
}
function TextInput({text}:{text:string}){
    const textContext = useContext(TextContext);
    let count = 0
    return(
        <button style={{width:100,height:100, fontSize: '1rem'}} onClick={()=>{
            console.log("clicking")
            let colorSetter = textContext.get(count)//key is the index of text, value is the stateUpdater for that character
            if(colorSetter){
                colorSetter("green")
            }
            count++
        }
            }>
                change next letter color
            </button>
    )
}

