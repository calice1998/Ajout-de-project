var APP = {
    API_MAP: "pk.eyJ1Ijoic3RhdGlvbjIwMjEiLCJhIjoiY2tzN2Y3eG5jMWNoYTJ1cGhuazNmNDVtOCJ9.bQ01AQ0ugcNHlZlmT9XlrQ",
    API_STATION: "/api/stations.json",
    MYMAP: L.map('map').setView([47.49163, 4.33834], 9),
    MARKER:[],
    toggleNav: (ev) => {
        document.querySelector('nav').classList.toggle('none')
    },
    setDetails: (fields) => {
        // console.log('Set Details:', fields);
        const { hdebut, hfin } = fields
        let { carburants, services } = fields
        var horaire;
        hdebut === hfin ? horaire = '24h/24' : horaire = hdebut + " à " + hfin
        carburants = carburants ? "<li>" + carburants.split('|').join('</li><li>') + "</li>" : ""
        services = services ? "<li>" + services.split('|').join('</li><li>') + "</li>" : ""

        var template = `
       <div class="station-cover">
       <img src="${fields.imageURL}" width="100%">
   </div>
   <div class="station-title">
      <h2>${fields.name}</h2>
   </div>
   <div class="station-reviews flex gap-10 p-10">
       <div class="reviews-note">4.2</div>
       <div class="reviews-start">
           <i class="fas fa-star"></i>
           <i class="fas fa-star"></i>
           <i class="fas fa-star"></i>
           <i class="fas fa-star"></i>
           <i class="fas fa-star"></i>
       </div>
       <div class="reviews-resume">
           ${fields.countNotes} avis
       </div>
   </div>
   <div class="station-actions flex p-10">
       <div class="station-action-item flex flex-1 aic column">
           <i class="fas fa-road"></i>
           <span>Itinéraire</span>
       </div>
       <div class="station-action-item flex flex-1 aic column">
           <i class="fas fa-save"></i>
           <span>Enregistrer</span>
       </div>
       <div class="station-action-item flex flex-1 aic column">
           <i class="fas fa-street-view"></i>
           <span>Proximité</span>
       </div>
       <div class="station-action-item flex flex-1 aic  column">
           <i class="fas fa-mobile-alt"></i>
           <span>Phone</span>
       </div>
       <div class="station-action-item flex flex-1 aic column">
           <i class="fas fa-share-alt"></i>
           <span>Partager</span>
       </div>
   </div>
   <div class="station-description p-10">
       ${fields.description}
   </div>
   <div class="station-services p-10">
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/adresse.svg"  alt="">
           <strong>Adresse : </strong>
           <span class="flex-1">${fields.adresse} <strong>${fields.codepostal}</strong>${fields.commune}</span>
       </div>
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/phone.svg"  alt="">
           <strong>Téléphone : </strong>
           <span class="flex-1">+33 3 76 05 30 15</span>
       </div>
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/horaire.svg"  alt="">
           <strong>Horaire : </strong>
           <span class="flex-1"> ${horaire}</span>
       </div>
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/carburant.svg"  alt="">
           <strong>Carburant : </strong>
           <ul class="flex-1">
               ${carburants}
           </ul>
       </div>
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/route.svg"  alt="">
           <strong>Route : </strong>
           <span class="flex-1">A proximité d'autoroute</span>
       </div>
       <div class="station-service flex aic gap-5">
           <img src="/assets/icons/service.svg"  alt="">
           <strong>Services : </strong>
           <ul class="flex-1">
               ${services}
           </ul>
       </div>
   </div>
       `
        let nav = document.querySelector('nav')
        nav.classList.contains('none') ? nav.classList.toggle('none') : null
        nav.innerHTML = template
        nav.scrollTop = 0
        //console.log(template);
    },
    messagePopup: (fields) => {
        var div = document.createElement('div')
        var button = document.createElement('button')
        div.className = "station-popup"
        div.innerHTML = `
        <strong>Nom </strong>: ${fields.name} <br>
        <strong>Adresse </strong>: ${fields.adresse}<br>
        <strong>Code Postal </strong>: ${fields.codepostal}${fields.commune} <br>
        `
        button.innerHTML = 'En savoir plus'
        button.className = 'bt-about-station'

        button.onclick = () => {
            //
            APP.setDetails(fields)
        }
        div.appendChild(button)

        return div
    },
    filterStations: (ev) =>{
        let tag = ev.target.value.trim()
        let stations = JSON.parse(localStorage.getItem('stations'))
        if(!tag){
            APP.hiddeSuggestion()
            return
        }
        stations = stations.filter(({fields})=>{
            tag = tag.toLowerCase()
            key_one = fields.name.toLowerCase()
            key_two = fields.adresse.toLowerCase()
            if(key_one.search(tag) >0 || key_two.search(tag)> 0){
                return true
            }
            return false
        })
       APP.autocomplete(stations)
    },
    autocomplete: (stations)=>{
        // console.log(stations);
        let container = document.querySelector('.search-bar-suggestion')
        container.innerHTML =""
        // Affichage de la boite d'autocomplétion
        container.classList.contains('none')? container.classList.toggle('none') : null
        if(!stations.length){
            container.innerHTML = `<div class="suggestion-item">Aucun résultat ne correpond à votre recherche</div>`
            return;
        }
        stations = stations.slice(0, 15)

        stations.forEach(({fields}) => {
            let div = document.createElement('div')
            div.className = 'suggestion-item'
            div.innerHTML = `
                        ${fields.adresse}  <strong>${fields.codepostal}</strong>
                        <strong>${fields.commune}</strong>
            `
            div.onclick = ()=>{
                APP.setDetails(fields)
                APP.hiddeSuggestion()
                let marker = APP.MARKER.filter(e=> e._id === fields._id)[0].marker
                marker.openPopup()
                // console.log(marker);
            }
            container.appendChild(div)
          
            
        });

    },
    hiddeSuggestion:()=>{
        let container = document.querySelector('.search-bar-suggestion')
        if(!container.classList.contains('none')){
            container.classList.add('none')
            
        }
    }
}


var setupListeners = () => {
    document.getElementById('bars').onclick = APP.toggleNav
    document.querySelector('input').oninput = APP.filterStations 
    document.querySelector('input').onmouseover = APP.filterStations 
    document.querySelector('.search-bar-suggestion').onmouseleave = APP.hiddeSuggestion
}