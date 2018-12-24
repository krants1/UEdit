import {Component, OnInit} from '@angular/core';

import * as ol from './ol.index';

import {HttpClient} from '@angular/common/http';


type Coordinate = number[];

interface RouteResponse {
  routes?: any;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  map: ol.Map;
  layers: ol.TileLayer[] = [];
  vectorSource: ol.VectorSource;
  mapEPSG = '';

  path: Coordinate[] = [];

  intrDraw: ol.Draw;
  intrSnap: ol.Snap;

  bingMaps = [
    {key: 'Road', name: 'Road (static)'},
    {key: 'RoadOnDemand', name: 'Road (dynamic)'},
    {key: 'Aerial', name: 'Aerial'},
    {key: 'AerialWithLabels', name: 'Aerial with labels'},
    {key: 'collinsBart', name: 'Collins Bart'},
    {key: 'ordnanceSurvey', name: 'Ordnance Survey'},
  ];

  mapboxMaps = [
    {key: 'streets', name: 'Streets'},
    {key: 'outdoors', name: 'Outdoors'},
    {key: 'streets-satellite', name: 'Streets Satellite'}
  ];

  mapsList: { key: string, name: string }[] = [];
  drawList = [
    // {key: 'none', name: 'None'},
    {key: 'Point', name: 'Point'},
    {key: 'LineString', name: 'LineString'},
    {key: 'Polygon', name: 'Polygon'},
    {key: 'Circle', name: 'Circle'}
  ];

  selectDrawKey = '';
  selectMapKey = 'osm';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {

    this.layers.push(new ol.TileLayer({
      tag: 'osm',
      visible: true,
      source: new ol.OSM()
    }));
    this.mapsList.push({key: 'osm', name: 'OSM'});

    const mabBoxAccessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
    this.mapboxMaps.forEach(m => {
      this.layers.push(new ol.TileLayer({
        tag: 'mapbox_' + m.key,
        visible: false,
        source: new ol.XYZ({
          attributions: 'Tiles © USGS, rendered with <a href="http://www.maptiler.com/">MapTiler</a>',
          url: 'https://api.mapbox.com/v4/mapbox.' + m.key + '/{z}/{x}/{y}@2x.png?access_token=' + mabBoxAccessToken
        })
      }));
      this.mapsList.push({key: 'mapbox_' + m.key, name: 'MapBox: ' + m.name});
    });

    this.bingMaps.forEach(m => {
        this.layers.push(
          new ol.TileLayer({
            tag: 'bind_' + m.key,
            visible: false,
            preload: Infinity,
            source: new ol.BingMaps({
              hidpi: true, imagerySet: m.key,
              key: 'AqCF8GCX4vEuPnF5OrU0D9uAQY-OspWzfphcidW7z4VifdubRVZZHPnCa-FzdVf-'
            })
          }));
        this.mapsList.push({key: 'bind_' + m.key, name: 'Bind: ' + m.name});
      }
    );

    this.vectorSource = new ol.VectorSource();
    this.layers.push(new ol.VectorLayer({
      source: this.vectorSource,
      style: new ol.Style({

        route: new ol.Style({
          stroke: new ol.Stroke({
            width: 6, color: [237, 212, 0, 0.8]
          })
        }),
        fill: new ol.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.Stroke({
          color: 'green',
          width: 2
        }),
        image: new ol.CircleStyle({
          radius: 7,
          fill: new ol.Fill({
            color: '#ffcc33'
          })
        })
      })
    }));

    this.map = new ol.Map({
      layers: this.layers,
      target: 'map',
      view: new ol.View({
        center: ol.fromLonLat([30.54, 50.45]),
        zoom: 12,
        minZoom: 2
      })
    });

    console.log('map projection: ', this.map.values_.view.projection_.code_);
    this.mapEPSG = this.map.values_.view.projection_.code_;

    this.map.addControl(new ol.ScaleLine({units: 'metric'}));
    this.map.addControl(new ol.MousePosition({
      coordinateFormat: ol.createStringXY(2),
      projection: 'EPSG:4326',
      undefinedHTML: '&nbsp;'
    }));
    this.map.addControl(new ol.FullScreen());
    this.map.addInteraction(new ol.Modify({source: this.vectorSource}));
    this.map.on('singleclick', (e) => this.onMapSingleClick(e));
  }

  onMapSingleClick(event) {
    if (this.selectDrawKey !== '') {
      return;
    }
    if (event.pointerEvent.ctrlKey) {
      console.log(event.pointerEvent.ctrlKey);
    }
    const lonlat: Coordinate = ol.transform(event.coordinate, this.mapEPSG, 'EPSG:4326');

    if (this.path.length === 2) {
      this.path = [];
    }
    this.path.push(lonlat);

    if (this.path.length === 2) {
      // let url = `http://${window.location.hostname}:5000/`;
      let url = 'https://router.project-osrm.org/';
      url += 'route/v1/driving/';
      url += ol.format(this.path[0], '{x},{y}', 6) + ';';
      url += ol.format(this.path[1], '{x},{y}', 6);
      url += '?geometries=geojson&overview=full';
      // console.log(url);
      for (let i = 0; i < 1; i++) {
        const start = new Date();
        this.http.get(url)
            .subscribe((data: RouteResponse) => {
              console.log((new Date().getTime() - start.getTime()) + ' mls,',
                'distance:', data.routes[0].distance,
                'duration:', data.routes[0].distance,
                'weight:', data.routes[0].weight);
              this.drawGeoJson(data.routes[0].geometry.coordinates);
            }, error => console.log('getPathError', error));
      }
    }
  }
  drawGeoJson(coordinates) {
    const coordinatesT = [];
    coordinates.forEach(c => coordinatesT.push(ol.transform(c, 'EPSG:4326', this.mapEPSG)));
    const geojsonObject = {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'MultiLineString',
          'coordinates': [coordinatesT]
        }
      }]
    };
    this.vectorSource.clear();
    this.vectorSource.addFeatures(
      (new ol.GeoJSON()).readFeatures(geojsonObject)
    );
  }
  drawPolyline(polyline) {
    console.log(polyline);
    const route = (new ol.Polyline({
      factor: 1e6
    }).readGeometry(polyline, {}));
    const routeFeature = new ol.Feature({
      type: 'route',
      geometry: route
    });
    //  this.vectorSource.clear();
    this.vectorSource.addFeatures(
      routeFeature
    );
  }

  addInteractions() {
    this.intrDraw = new ol.Draw({
      source: this.vectorSource,
      type: this.selectDrawKey
    });
    this.map.addInteraction(this.intrDraw);
    this.intrSnap = new ol.Snap({source: this.vectorSource, pixelTolerance: 8});
    this.map.addInteraction(this.intrSnap);
  }

  onDrawChange() {
    this.map.removeInteraction(this.intrDraw);
    this.map.removeInteraction(this.intrSnap);
    this.addInteractions();
  }

  onMapChange($event) {
    this.layers.forEach((layer) => {
      if (layer.get('tag') === $event.value) {
        layer.setVisible(true);
      } else {
        if (layer.type === 'TILE') {
          layer.setVisible(false);
        }
      }
    });
  }

  onDrawClear() {
    this.vectorSource.clear();
    this.selectDrawKey = '';
  }
}
