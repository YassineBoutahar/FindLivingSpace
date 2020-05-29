// import React, { Component } from 'react';
// // import GoogleMapReact from 'google-map-react';
// // import MapIcon from './MapIcon';
// // import './App.css';
// import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';

// const Mapbox = ReactMapboxGl({
//   accessToken: "pk.eyJ1IjoiaHVyYW5pIiwiYSI6ImNrOXAyb2xzZTA2dWkzZm9nYzk4cTc1b24ifQ.ku3RdymnlXjzFViYd4-Z2Q"
// });

// export default class Map extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       lat: 43.6426,
//       lng: -79.3871,
//       zoom: [10],
//       // showCenterMarker: true
//     }
//     navigator.geolocation.getCurrentPosition(pos => {
//       this.props.refreshListings(pos.coords.latitude, pos.coords.longitude);
//       this.setState({
//         lat: pos.coords.latitude,
//         lng: pos.coords.longitude
//       });
//     });
//   }

//   componentDidMount() {
//     // const map = new mapboxgl.Map({
//     //   container: this.mapContainer,
//     //   style: 'mapbox://styles/mapbox/streets-v9',
//     //   center: [this.state.lng, this.state.lat],
//     //   zoom: this.state.zoom
//     // });

//     // map.on('move', () => {
//     //   this.setState({
//     //   lng: map.getCenter().lng.toFixed(4),
//     //   lat: map.getCenter().lat.toFixed(4),
//     //   zoom: map.getZoom().toFixed(2)
//     //   });
//     // });
//   }
  
//   handleClick = (map, e) => {
//     map.setCenter(e.lngLat);
//     // this.props.refreshListings(e.lat, e.lng);
//   }

//   // hideMarker = (e) => {
//   //   this.setState({
//   //     showCenterMarker: false
//   //   });
//   //   this.props.refreshListings(e.lat, e.lng);
//   // }
//   render() {
//     return (
//       // <div style={{ height: '100vh', width: '50%', position: 'fixed', top: 64.2, right: 0 }}>
//       //   <GoogleMapReact
//       //     bootstrapURLKeys={{ key: this.GOOGLE_MAP_API_KEY }}
//       //     center={this.state.center}
//       //     defaultZoom={this.state.zoom}
//       //     id="map"
//       //     onClick={this.handleClick}
//       //   >
//       //     {this.props.listings.map((p, i) => {
//       //       return <MapIcon
//       //         lat={p.location.lat}
//       //         lng={p.location.lng}
//       //         text={`$${p.price} CAD`}
//       //         withinDistance={p.api_data.distance.value < this.props.distance}
//       //         key={i}
//       //       />
//       //     })}
//       //     {this.state.showCenterMarker ? <Marker lat={this.state.center.lat} lng={this.state.center.lng} onClick={this.hideMarker}></Marker> : null}
          
//       //   </GoogleMapReact>
//       // </div>
//       <Mapbox
//         style="mapbox://styles/mapbox/streets-v9"
//         containerStyle={{
//           height: '100vh',
//           width: '50vw',
//           float: "right",
//           marginBottom: 54
//         }}
//         zoom={this.state.zoom}
//         center={[this.state.lng, this.state.lat]}
//         onMove={(map) => {
//           let center = map.getCenter();
//           this.setState({lng: center['lng'], lat: center['lat']});
//           // this.props.refreshListings(center['lat'], center['lng']);
//         }}
//         onClick={this.handleClick}
//       >
//         <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker' }}>
//           <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
//         </Layer>
//       </Mapbox>
//     )
//   }
// }

import React from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiaHVyYW5pIiwiYSI6ImNrOXAyb2xzZTA2dWkzZm9nYzk4cTc1b24ifQ.ku3RdymnlXjzFViYd4-Z2Q';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat:  44.2312,
      lng: -76.4860
    };
    this.markers = [];
  }
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 12,
      center: [this.state.lng, this.state.lat]
    });

    this.props.refreshListings(this.map.getCenter()[1], this.map.getCenter()[0]);

    this.map.on('click', e => {
      if (this.marker) {
        this.marker.remove();
      }
      this.props.updateLngLat(e.lngLat);
      this.marker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(this.map);
      this.setState({lat: e.lngLat['lat'], lng: e.lngLat['lng']});
      this.map.setCenter(e.lngLat);
      this.props.refreshListings(e.lngLat['lat'], e.lngLat['lng']);
    });
  }

  distance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const style = {
      position: 'fixed',
      top: 0,
      right: 0,
      float: 'right',
      width: "50vw",
      height: "100%"
    };

    this.markers.forEach(marker => marker.remove());
    this.props.listings.forEach((p, i) => {
        let el = document.createElement('div');
        el.style.width = 'max-content';
        el.style.height = 'max-content';
        el.style.margin ='10px 0 0 -10px';
        el.style.background = 'white';
        el.style.MozBorderRadius = '10px';
        el.style.WebkitBorderRadius = '10px';
        el.style.borderRadius = '10px';
        el.style.padding = '3px';
        el.style.boxShadow = 'rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.18) 0px 1px 2px';
        el.style.backgroundColor = this.distance(p.lngLat[1], p.lngLat[0], this.state.lat, this.state.lng) < this.props.distance ? '#afeb78' : "#ffffff";
        el.textContent =`$${p.price} CAD`;
        el.onclick = (e) => {
          e.stopPropagation();
          window.open(p.link);
        }

        this.markers.push(new mapboxgl.Marker(el).setLngLat(p.lngLat).addTo(this.map));
    });

    return <div  style={style} ref={el => this.mapContainer = el} className="mapContainer" />;
  }
}