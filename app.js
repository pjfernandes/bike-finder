const btn = document.getElementById("button");
mapboxgl.accessToken = 'pk.eyJ1IjoicGpmZXJuYW5kZXMiLCJhIjoiY2t1c291Z3lzNWg2bzJvbW5kNWNhbnZhaCJ9.eYxvagOUGuS5qDo-zOfRCA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-streets-v11',
  center: [-43.375805, -22.91446],
  zoom: 9
});

const mapDiv = document.getElementById("map");
mapDiv.insertAdjacentHTML('beforeend', map);

const fitMapToMarkers = (map, markers) => {
  const bounds = new mapboxgl.LngLatBounds();
  markers.forEach(marker => bounds.extend([marker.lng, marker.lat]));
  map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
};

btn.addEventListener("click",(event) => {
  event.preventDefault();
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = '';
  const address = document.getElementById("address-input").value;
  fetch(`https://nominatim.openstreetmap.org/search?street=${address}&city=Rio%20de%20Janeiro&format=json&polygon=1&addressdetails=1`)
    .then(response => response.json())
    .then((data) => {
      if (data.length < 1) {
        resultDiv.insertAdjacentHTML("beforeend", `<h5><i class="fas fa-frown text-primary"></i> Endereço não encontrado</h5>`);
      } else {
          const coords = [Number.parseFloat(data[0].lon), Number.parseFloat(data[0].lat)];
          let dists = [];
          fetch("https://dadosabertos.rio.rj.gov.br/apiTransporte/apresentacao/rest/index.cfm/estacoesBikeRio")
            .then(response => response.json())
            .then((data) => {
              const results = data.DATA;
              results.forEach(element => {
                euclidDist = coords[0];
                dists.push([element[3], element[4], element[0], element[6], element[5], Math.sqrt((coords[0] - Number.parseFloat(element[6])) ** 2 + (coords[1] - Number.parseFloat(element[5])) ** 2)]);
              });
              const distsSorted = dists.sort((a, b) => a[5] - b[5]);

              resultDiv.insertAdjacentHTML("beforeend",
              `
              <h5 class="result-title text-dark">Bcicletários próximos de:</h5>
              <h5><i class="fas fa-map-marker-alt text-danger"></i>&nbsp<span class="text-success">${address}</span></h5>`)

              map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/satellite-streets-v11',
                center: [-43.375805, -22.91446],
                zoom: 9
              });

              distsSorted.slice(0,5).forEach(element => {
                resultDiv.insertAdjacentHTML("beforeend",`<p class="text-secondary"><i class="fas fa-map-marker-alt text-info"></i>&nbsp${element[0]} ${element[1]}, ${element[2]}</p>`)
                var marker = new mapboxgl.Marker();
                var popup = new mapboxgl.Popup({ offset: 25 }).setText(`${element[0]} ${element[1]}, ${element[2]}`);
                var el = document.createElement('div');
                el.id = 'marker';
                marker
                  .remove()
                  .setLngLat([element[3], element[4]]).setPopup(popup)
                  .addTo(map);

                const bounds = new mapboxgl.LngLatBounds();
                bounds.extend([element[3], element[4]]);
                map.fitBounds(bounds, { padding: 70, maxZoom: 9, duration: 10 });
              })
              var popup = new mapboxgl.Popup({ offset: 25 }).setText(`Sua localização: ${address}`);
              var el = document.createElement('div');
              el.id = 'marker';
              new mapboxgl.Marker({ "color": "#FF0000" }).setLngLat(coords).setPopup(popup).addTo(map);
              //map.flyTo({ center: coords, essential: true, zoom: 9 });
            });
      };
    });
});
