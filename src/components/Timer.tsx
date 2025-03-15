import { useContext, useEffect, useRef, useState } from "react"
import { IOContext } from "./Display"

interface TimerInterface{
    secondsCountDown: number
    setSeconds?:Function
    onTimerEnd?: Function
    visible: boolean
    isStopped: boolean
  }
  const formatSeconds=(seconds:number)=>{
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    // Pad the minutes and seconds with leading zeros if necessary
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(remainingSeconds).padStart(2, '0');
    return(`${minutesStr}:${secondsStr}`)
  }
  
  export function Timer({secondsCountDown,setSeconds, onTimerEnd,visible,isStopped}:TimerInterface) {
    const secondsRef = useRef(secondsCountDown);
    const intervalIdRef = useRef< NodeJS.Timeout|null>(null);
    const [formattedTime, setFormattedTime]=useState(formatSeconds(secondsCountDown))
  
    const startTimer = () => {
      if (intervalIdRef.current != null) {
        return;
      }
      let temp = setInterval(() => {
        secondsRef.current -= 1;
        setFormattedTime(formatSeconds(secondsRef.current))
        if(setSeconds){
          setSeconds(formatSeconds(secondsRef.current))
        }
        if (secondsRef.current<=0){ //stops timer when it hits zero
          clearInterval(temp);
          console.log('ended')
          console.log(onTimerEnd)
          if (onTimerEnd){
            onTimerEnd((seconds:number)=>{
              secondsRef.current=seconds
            })
          }
        }
      }, 1000);
      intervalIdRef.current=temp;
      
    };
  
    const stopTimer = () => {
      console.log("-----------resetting timer--------------")
      if(intervalIdRef.current==null){
        return
      }
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null
    };
    if (isStopped){
      stopTimer()
    }
    if (!isStopped){
      startTimer()
    }
    
    useEffect(()=>{
      startTimer()
      return()=>{
        stopTimer()
      }
    },[])
    return(<></>)
  }
export function TimerView(){
    const [seconds,setSeconds]= useState<number>(2)//initial timer to start the game 
    const [formattedTime,setFormattedTime] = useState<string>("");
    const [rerenderTimer,setRerenderTimer]=useState<boolean>(true)
    const [color,setColor]=useState("green")
    const io = useContext(IOContext);
    const resetTimer=(start:number,end:number)=>{
        let randomTime =Math.floor( Math.random()*(end-start)+start)
        setSeconds(randomTime)
    }
    useEffect(()=>{
        if(rerenderTimer==false){
            setRerenderTimer(true)
            if(color=='green'){
                if(io.timerColor){
                    io.timerColor.current="red"
                }
                resetTimer(2,5)
                setColor("red")
            }else{
                resetTimer(4,15)
                if(io.timerColor){
                    io.timerColor.current="green"
                }
                //io.timerColor?io.timerColor.current="green":null
                setColor("green")
            }
        }
    },[rerenderTimer])
    return(
        <div>
            {rerenderTimer&&<Timer secondsCountDown={seconds} setSeconds={setFormattedTime} visible={true} onTimerEnd={()=>{setRerenderTimer(false)}} isStopped={false}/>}
            <p style={{backgroundColor:color}}>time: {formattedTime}</p>
        </div>
    )
}