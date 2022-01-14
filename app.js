const findCoords = (address => {
  const url = `https://nominatim.openstreetmap.org/search?street=${address}&city=Rio%20de%20Janeiro&format=json&polygon=1&addressdetails=1`;
  let coords = [];
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      coords[0] = Number.parseFloat(data[0].lon)
      coords[1] = Number.parseFloat(data[0].lat);
    });
  return coords;
});


const distance = (coordsArray => {
  fetch("https://dadosabertos.rio.rj.gov.br/apiTransporte/apresentacao/rest/index.cfm/estacoesBikeRio")
    .then(response => response.json())
    .then((data) => {
      const results = data.DATA;
      const coordsBike = coordsArray;

      let dists = [];

      for (var i = 0; i < results.length; i++) {
        let euclidDist = Math.sqrt((coordsBike[0] - Number.parseFloat(results[i][6]))**2 + (coordsBike[1] - Number.parseFloat(results[i][5]))**2);
        console.log(euclidDist)
        dists[i] = [results[i][3], results[i][4], results[i][0], results[i][6], results[i][5], euclidDist];
      };

      const distsSorted = dists.sort((a, b) => parseFloat(b[5]) - parseFloat(a[5]));
      console.log(dists);
    });
});


const a = findCoords("Bangu");
distance(a)
