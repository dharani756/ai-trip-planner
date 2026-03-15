import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Compass, Loader2, PlaneTakeoff, ArrowLeft } from "lucide-react";

const GEMINI_KEY = "AIzaSyDaE7xktUzRbPE-L70wdJBLvGgP2UXTUcU";
const GEOAPIFY_KEY = "24c580e634414b49a6f4c4a6b6ec67b0";
const App = () => {

const [page,setPage] = useState("create");

const [query,setQuery] = useState("");
const [places,setPlaces] = useState([]);
const [selectedPlace,setSelectedPlace] = useState(null);

const [days,setDays] = useState("");
const [budget,setBudget] = useState("");

const [itinerary,setItinerary] = useState("");
const [hotels,setHotels] = useState([]);
const [attractions,setAttractions] = useState([]);

const [isGenerating,setIsGenerating] = useState(false);

/* ----------- COST ESTIMATION FUNCTION ----------- */

const estimateCost = () => {

if(!days) return 0;

const day = parseInt(days);

let perDay = 0;

if(budget === "Budget") perDay = 40;
if(budget === "Moderate") perDay = 120;
if(budget === "Luxury") perDay = 350;

return day * perDay;

};

/* ------------------------------------------------ */

useEffect(()=>{

const searchPlace = async()=>{

if(query.length < 3){
setPlaces([]);
return;
}

try{

const res = await fetch(
`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`
);

const data = await res.json();

setPlaces(data.features || []);

}catch(err){
console.log(err);
}

};

const timer = setTimeout(searchPlace,300);

return ()=>clearTimeout(timer);

},[query]);

const handleSelect = (place)=>{

const name = place.properties.name;
const country = place.properties.country;

const lat = place.geometry.coordinates[1];
const lon = place.geometry.coordinates[0];

setSelectedPlace({name,country,lat,lon});

setQuery(`${name}, ${country}`);

setPlaces([]);

};

const handleGenerate = ()=>{

if(!selectedPlace || !days) return;

setPage("budget");

};

const generateAITrip = async (budgetType) => {

    try {

      const prompt = `
Create a ${days}-day travel itinerary for ${selectedPlace.name}, ${selectedPlace.country}.

Budget: ${budgetType}

Give a day-by-day travel plan including attractions and food.
`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      const data = await res.json();

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        setItinerary(text);
      } else {

        setItinerary(`
Day 1
Explore city center and local markets.

Day 2
Visit temples, parks, and popular attractions.

Day 3
Enjoy sightseeing and local food.
`);

      }

    } catch (err) {

      setItinerary(`
Day 1
Explore city center and markets.

Day 2
Visit famous attractions and temples.

Day 3
Enjoy sightseeing and local cuisine.
`);

    }

  };

const getHotels = async () => {

    try {

      const res = await fetch(
        `https://api.geoapify.com/v2/places?categories=accommodation.hotel&text=${selectedPlace.name}&limit=6&apiKey=${GEOAPIFY_KEY}`
      );

      const data = await res.json();

      if (data.features && data.features.length > 0) {

        setHotels(data.features);

      } else {

        setHotels([
          { properties: { name: `${selectedPlace.name} Grand Hotel` } },
          { properties: { name: `${selectedPlace.name} Residency` } },
          { properties: { name: `${selectedPlace.name} Comfort Stay` } }
        ]);

      }

    } catch {

      setHotels([
        { properties: { name: `${selectedPlace.name} Grand Hotel` } },
        { properties: { name: `${selectedPlace.name} Residency` } },
        { properties: { name: `${selectedPlace.name} Comfort Stay` } }
      ]);

    }

};

const getAttractions = async () => {

    try {

      const res = await fetch(
        `https://api.geoapify.com/v2/places?categories=tourism.sights&text=${selectedPlace.name}&limit=6&apiKey=${GEOAPIFY_KEY}`
      );

      const data = await res.json();

      if (data.features && data.features.length > 0) {

        setAttractions(data.features);

      } else {

        setAttractions([
          { properties: { name: `${selectedPlace.name} Central Park` } },
          { properties: { name: `${selectedPlace.name} Historic Temple` } },
          { properties: { name: `${selectedPlace.name} City Museum` } }
        ]);

      }

    } catch {

      setAttractions([
        { properties: { name: `${selectedPlace.name} Central Park` } },
        { properties: { name: `${selectedPlace.name} Historic Temple` } },
        { properties: { name: `${selectedPlace.name} City Museum` } }
      ]);

    }

};

const handleBudgetSelect = async(value)=>{

setBudget(value);

setIsGenerating(true);

await generateAITrip(value);
await getHotels();
await getAttractions();

setIsGenerating(false);

setPage("results");

};

return(
<>

<style>{`

body{
font-family:Arial;
background:#eef2ff;
margin:0;
}

.container{
display:flex;
justify-content:center;
align-items:center;
min-height:100vh;
padding:20px;
}

.card{
background:white;
padding:30px;
border-radius:12px;
width:520px;
box-shadow:0 10px 30px rgba(0,0,0,0.1);
}

.title{
font-size:24px;
font-weight:bold;
display:flex;
align-items:center;
gap:10px;
}

.input{
width:100%;
padding:12px;
border-radius:8px;
border:1px solid #ddd;
margin-top:5px;
}

.btn{
background:#4f46e5;
color:white;
border:none;
padding:12px;
border-radius:8px;
cursor:pointer;
width:100%;
margin-top:20px;
font-weight:bold;
}

.dropdown{
border:1px solid #ddd;
border-radius:8px;
margin-top:5px;
max-height:140px;
overflow:auto;
}

.dropdown li{
padding:8px;
cursor:pointer;
}

.dropdown li:hover{
background:#f1f5f9;
}

.grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:12px;
margin-top:10px;
}

.place-card{
background:#f8fafc;
padding:12px;
border-radius:10px;
border:1px solid #eee;
}

.section{
margin-top:20px;
}

.itinerary{
background:#f9fafb;
padding:15px;
border-radius:10px;
margin-top:10px;
line-height:1.6;
}

.cost{
background:#eef2ff;
padding:12px;
border-radius:10px;
margin-top:10px;
font-weight:bold;
color:#4f46e5;
text-align:center;
}

`}</style>

<div className="container">

{page==="create" &&(

<div className="card">

<div className="title">
<PlaneTakeoff/> Trip Designer
</div>

<p>Tell us where you want to go</p>

<label>Destination</label>

<input
className="input"
value={query}
placeholder="Search destination"
onChange={(e)=>setQuery(e.target.value)}
/>

{places.length>0 &&(

<ul className="dropdown">

{places.map((place,i)=>(
<li key={i} onClick={()=>handleSelect(place)}>
{place.properties.name}, {place.properties.country}
</li>
))}

</ul>

)}

<label style={{marginTop:"15px",display:"block"}}>
Number of Days
</label>

<input
type="number"
className="input"
value={days}
onChange={(e)=>setDays(e.target.value)}
/>

<button className="btn" onClick={handleGenerate}>
<Compass size={18}/> Continue
</button>

</div>

)}

{page==="budget" &&(

<div className="card">

<button onClick={()=>setPage("create")}>
<ArrowLeft size={16}/> Back
</button>

<h2>What's your budget?</h2>

<div className="grid">

<button className="btn" onClick={()=>handleBudgetSelect("Budget")}>
💰 Budget
</button>

<button className="btn" onClick={()=>handleBudgetSelect("Moderate")}>
🏨 Moderate
</button>

<button className="btn" onClick={()=>handleBudgetSelect("Luxury")}>
✨ Luxury
</button>

</div>

{isGenerating &&(
<p><Loader2/> Generating trip...</p>
)}

</div>

)}

{page==="results" &&(

<div className="card" style={{width:"720px"}}>

<button onClick={()=>setPage("budget")}>
<ArrowLeft size={16}/> Change Budget
</button>

<h2>{selectedPlace?.name} Trip Plan</h2>

<p>{days} Days • {budget}</p>

<div className="cost">
Estimated Trip Cost: ${estimateCost()}
</div>

<iframe
width="100%"
height="250"
src={`https://maps.google.com/maps?q=${selectedPlace?.name}&z=12&output=embed`}
/>

<div className="section">

<h3>🏨 Hotels</h3>

<div className="grid">
{hotels.map((h,i)=>(
<div key={i} className="place-card">
<b>{h.properties?.name}</b>
<p>{h.properties?.formatted}</p>
</div>
))}
</div>

</div>

<div className="section">

<h3>📍 Attractions</h3>

<div className="grid">
{attractions.map((a,i)=>(
<div key={i} className="place-card">
<b>{a.properties?.name}</b>
<p>{a.properties?.formatted}</p>
</div>
))}
</div>

</div>

<div className="section">

<h3>🧭 AI Itinerary</h3>

<div className="itinerary">
{itinerary.split("\n").map((line,i)=>(
<p key={i}>{line}</p>
))}
</div>

</div>

</div>

)}

</div>

</>
);

};

export default App;