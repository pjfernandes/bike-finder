const btn = document.getElementById("button");

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

              resultDiv.insertAdjacentHTML("beforeend", `<h5><i class="logo fas fa-bicycle text-primary"></i> Os 5 bicicletários mais próximos</h5>`)
              distsSorted.slice(0,5).forEach(element => {
                resultDiv.insertAdjacentHTML("beforeend",`<p class="text-secondary">${element[0]} ${element[1]}, ${element[2]}</p>`)
              })
              //PAREI AQUI

            });
      }
    });
});
