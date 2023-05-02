import { SetStateAction, useEffect, useState } from "react"
import Singleton from "./designpattern/singleton"
import { coffees, Product } from "./api/products";
const instance = Singleton.getInstance()
import Home3 from "./index3";
import Home4a from "./index4a";
import Home4b from "./index4b";
import Home4c from "./index4c";
import Home7 from "./index7"


function Buttons({func} : {func : (func : SetStateAction<JSX.Element>)=>void}){

    const versions = [<Home3/>,<Home4a/>,<Home4b />,<Home4c />,<Home7/>]
    const description : {[version : string] : string} = {
      "Home3" : "basic version",
      "Home4a" : "Add insert text",
      "Home4b" :  "Add insert card",
      "Home4c" : "Add card bundle",
      "Home7" : "Add Intent and Triggers"
    }
    const buttons = versions.map((version)=>{
      return(
        <a onClick={()=>func(version)}> Version {version.type.name} : {description[version.type.name]}</a>
      )
    })
    return(
      <div className="homeButtons">
        {buttons}
      </div>
      )
}

export default function Home() {

  function changeState(newState : SetStateAction<JSX.Element>){
    setState(newState)
    setBase(false)
  }

  const [state, setState] = useState(<Buttons func={changeState}/>)
  const [base, setBase] = useState(true)


  return(
    <div style={{padding:30}}>
      {base? 
      <div>
        <h1>Choose version : </h1>
      </div> : 
      <div className="head">
        <img src="https://t4.ftcdn.net/jpg/03/76/69/25/360_F_376692508_XUzZzz0x3W34II8NlIOfqZQ2Lc26kh58.jpg" onClick={() => {setState(<Buttons func={changeState}/>); setBase(true)}}/>
        <h1>Product List</h1>
      </div> }
      {state}
    </div>
  )

}
