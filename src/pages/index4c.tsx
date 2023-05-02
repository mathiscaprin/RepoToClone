import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Singleton from "./designpattern/singleton"
import { Product } from "./api/products";
const instance = Singleton.getInstance()


async function productAPI(){
  const res = await fetch(`http://localhost:3000/api/products`)
  const coffees = await res.json()
  return coffees
}


type Action = {
  type: "LINK";
  title: string;
  url: string;
};

type Card = {
  title?: string;
  text?: string;
  actions: Action[];
  image?: {
      url: string;
      description: string;
  }
};

type Carousel = {
  title?:string;
  cards: Card[]
}

function Profile({back, insertText, insertCard, coffee} : {back : Dispatch<SetStateAction<string>>, insertText : (str : string)=>void, insertCard : (coffee : Product)=>void, coffee : Product | undefined}){
  if (typeof coffee == "undefined"){
    return(
      <div>
        <p>Error</p>
        <button onClick={() => back("")}>Return</button>
      </div>
    )
  }else{

    let euro = Intl.NumberFormat('en-DE', {
      style: 'currency',
      currency: 'EUR',
    });

    const price = coffee.promo ? 
    <>
      <p>Price <span style={{textDecoration : "line-through"}}>{euro.format(coffee.price)}€</span> {euro.format(coffee.price * coffee.valeurPromo)}</p>
      <p>Price per ten <span style={{textDecoration : "line-through"}}>{euro.format(coffee.pricePerTen)}€</span> {euro.format(coffee.pricePerTen * coffee.valeurPromo)}€</p>
    </> : 
    <>
      <p>Price {euro.format(coffee.price)}€</p>
      <p>Price per ten {euro.format(coffee.pricePerTen)}€</p>
    </>

    return(
      <div className="profile">
        <div className="profileHeader">
          <h1>Products profile</h1>
          <button onClick={() => back("")}>X</button>
        </div>
        <h1>{coffee.name}</h1>
        <div className="profileTop">
          <img src={coffee.picture}/>
          <div className="top-right">
            <h2>{coffee.description}</h2>
            <button className="mainButton" onClick={()=>insertText(coffee.link)}>Send link</button>
            <button className="mainButton" onClick={()=>insertCard(coffee)}>Send card</button>
          </div>
        </div>
        <div className="profileMiddle">
          {price}
        </div>
      </div>
    )
  }
}


export default function Home4c() {


  const [coffees, setCoffees] = useState<Product[]>([])
  const [profile, setProfile] = useState("")




  useEffect(()=>{
    instance.setVariable((window as any).idzCpa.init())
    if (coffees.length == 0){
      productAPI().then((res : any)=> {
        setCoffees(res)
    })
    }
  })

  function insertText(text : string){
    console.log(instance.getVariable())
    instance.getVariable().then((client : any)=>{
      client.insertTextInComposeBox(text)
    })
  }

  function insertCard(coffee : Product){
    const card : Card = {
      title : coffee.name,
      text : coffee.description,
      
      actions : [
        {
          type : "LINK",
          title : coffee.name,
          url : coffee.link
        }
      ],
      image : {
        url : coffee.picture,
        description : coffee.name 
      }

    }
    instance.getVariable().then((client : any)=>{
      client.pushCardInConversationThread(card)
    })
  }

  function insertBundle(listProduct : Product[] = coffees){
    const carousel : Carousel = {
      title: "Coffee",
      cards : []
    }

    listProduct.forEach((coffee)=>{
      let card : Card = {
        title : coffee.name,
        text : coffee.description,
        
        actions : [
          {
            type : "LINK",
            title : coffee.name,
            url : coffee.link
          }
        ],
        image : {
          url : coffee.picture,
          description : coffee.name 
        }
      }
      carousel.cards.push(card)
    })
    instance.getVariable().then((client : any)=>{
      client.pushCardBundleInConversationThread(carousel)
    })
  }




  const listCoffee = coffees.map(coffee=>{
    let promo = coffee.promo ? "red" : "black"
    return(
      <div onClick={()=>setProfile(coffee.name)}  className="card">
        <img src={coffee.picture}/>
        <div className="card-right">
          <p style={{color : promo}}>{coffee.name}</p>
        </div>
        <img className="greaterThan" src="https://t4.ftcdn.net/jpg/03/76/69/25/360_F_376692508_XUzZzz0x3W34II8NlIOfqZQ2Lc26kh58.jpg"/>
      </div>
    )
  })


  return (
    <div className="list">
      {profile=="" ? listCoffee : <Profile back={setProfile} insertText={insertText} coffee={coffees.findLast((coffee)=>coffee.name == profile)} insertCard={insertCard}></Profile> }
      <button className="mainButton" onClick={() => insertBundle()}>Send all</button>
      <button className="mainButton" onClick={()=> insertBundle(coffees.filter((coffee) => coffee.promo))}>Send Promo</button>
    </div>
      
  )
}