
/***
 * Fonction de récupération des stations
 * @returns Station
 */
var getStations = async () => {
    var response = await fetch(APP.API_STATION)
    if (!response.ok) {
        throw new Error("Erreur de récupération des données")
    }

    var stations = await response.json()

    return stations.slice(0, 1000)
}

var initMarker = async () => {
    var stations = await getStations()

    stations = stations.filter((station) => {
        if (station.fields) {
            if (station.fields.latlng) {
                return true
            }
        }
        return false
    })
    localStorage.setItem('stations', JSON.stringify(stations))
    // var marker = L.marker([51.5, -0.09]).addTo(map);
    stations.forEach(({ fields }) => {
        //marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
        let popupMessage = APP.messagePopup(fields)

       var marker = L.marker(fields.latlng)
        .on('click', ()=>  APP.MYMAP.setView(fields.latlng, 11))
        .addTo(APP.MYMAP)
        .bindPopup(popupMessage)

        APP.MARKER.push({
            _id: fields._id,
            marker: marker
        })

    });
    console.log(stations[15].fields.latlng);

    // Centrer suivant les coordonnées en prémier paramètre
    APP.MYMAP.setView(stations[15].fields.latlng, 9)
    // return stations
}

initMaps = () => {
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: APP.API_MAP
    }).addTo(APP.MYMAP);
    initMarker()
    .then(
        () => {
            console.log("Initialisation des marqueurs");
        }
    )
    .catch(
         () =>{
             console.log("Problème d'Initialisation des marqueurs");
        }
    )
}