var legend = document.getElementById('legend');
mapboxgl.accessToken = 'pk.eyJ1Ijoid2Fsa21hcCIsImEiOiJjaXI0d285eXIwMDR1aHRtOWQ3YWE3d2JtIn0.pqyo1f-gocUK9i819vmQBQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/walkmap/cj0hn4l6t00bu2rn479399xfv',
  zoom: 9,
  center: [30.118430, 59.944354],
  minZoom: 8,
  maxZoom: 18,
});
map.addControl(new mapboxgl.NavigationControl());
map.on('load', function () {
  toggleLayer('1', ['alldata'], 'Все музеи');
  toggleLayer('2', ['children', 'childrenbg'], 'Музеи с детскими программами');
  toggleLayer('3', ['7', '7bg'], 'Программы для дошкольников');
  toggleLayer('4', ['7-18', '7-18bg'], 'Программы для школьников');
  toggleLayer('5', ['family', 'familybg'], 'Семейные программы');
  toggleLayer('6', ['education', 'educationbg'], 'Образовательные программы');
  toggleLayer('7', ['dischildren', 'dischildrenbg'], 'Программы для детей с ограниченными возможностями');
  toggleLayer('8', ['catering', 'cateringbg'], 'Кэйтеринг');
  toggleLayer('9', ['0', '1-5', '5-10', '10-20', '20-30', 'okruga_bound'], 'Музеи по городским округам');

  function toggleLayer(id, ids, name) {
    var link = document.createElement('a');
    link.href = '#';
    // link.className = 'active';
    link.textContent = name;
    link.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log(e.target, e);
      if (id == '9') {
        if (legend.style.display == 'block') {
          legend.style.display = 'none';
        } else {
          legend.style.display = 'block';
        }
      }
      for (layers in ids) {
        var visibility = map.getLayoutProperty(ids[layers], 'visibility');
        if (visibility === 'visible') {
          map.setLayoutProperty(ids[layers], 'visibility', 'none');
          this.className = '';
        } else {
          this.className = 'active';
          map.setLayoutProperty(ids[layers], 'visibility', 'visible');
        }
      }
    };
    var layers = document.getElementById('menu');
    layers.appendChild(link);
  }

  var layers = ['0', '1-5', '5-10', '10-20', '20-30'];
  layers.forEach(function (layer) {
    var color = map.getPaintProperty(layer, 'fill-color');
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;
    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  });
});

var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

map.on('mousemove', function (e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['0', '1-5', '5-10', '10-20', '20-30'] });
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

  if (!features.length) {
    popup.remove();
    return;
  }

  popup
    .setLngLat(map.unproject(e.point))
    .setHTML(features.map(function(feature) {return feature.properties.name}))
      .addTo(map);
});