import React from 'react';
import Listing from './Listing';
import Map from './Map';
import Bar from './Bar';

export default class MainView extends React.Component {
    constructor() {
        super();
        this.state = {
            listings: [],
            distance: 500,
            lat: 44.2312,
            lng: -76.4860,
            beds: '',
            baths: ''
        };
        this.API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
    }
    refreshListings = (lat, lng, beds, baths) => {
        this.setState({lat: lat, lng: lng});
        fetch(this.API_URL + `/property?lat=${lat}&lng=${lng}&beds=${beds ? beds : this.state.beds}&baths=${baths ? baths : this.state.baths}`).then(resp => resp.json()).then(data => {
            this.setState({
                listings: data
            });
        });
    }

    updateLngLat = (lngLat) => {
        this.setState({lat: lngLat['lat'], lng: lngLat['lng']});
    }
    render() {
        if (this.state.listings) {
            return (
                <div>
                    <Bar 
                    
                    onDistanceChange={
                        (e, v) => {
                            this.setState({distance: v});
                        }
                    }
                    
                    onBedroomsChange={
                        (e) => {
                            let value = !isNaN(e.target.value) && parseInt(e.target.value) > 0 ? e.target.value : ''; 
                            this.setState({beds: value});
                            this.refreshListings(this.state.lat, this.state.lng, value, this.state.baths)
                        }
                    }

                    onBathroomsChange={
                        (e) => {
                            let value = !isNaN(e.target.value) && parseInt(e.target.value) > 0 ? e.target.value : ''; 
                            this.setState({baths: value});
                            this.refreshListings(this.state.lat, this.state.lng, this.state.beds, value);
                        }
                    }
                    />
                    <div style={{ width: "50%", float: 'left', marginTop: 54 }}>
                        {
                            this.state.listings                            
                            .map((p, i) => {
                                return <Listing
                                    address={p.address}
                                    link={p.link}
                                    bedrooms={p.bed}
                                    bathrooms={p.bath}
                                    price={p.price}
                                    // walkingDistance={p.walkingTime}
                                    unit={p.unit}
                                    key={i}
                                >
                                </Listing>
                            })
                        }
                    </div>
                    <Map
                        listings={this.state.listings}
                        refreshListings={this.refreshListings}
                        distance={this.state.distance}
                        updateLngLat={this.updateLngLat}
                    />
                </div>
            );
        } else {
            return <h1>Loading...</h1>
        }
    }
}