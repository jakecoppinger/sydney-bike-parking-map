import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import Card from "./Card";
import * as http from "https";
import {
  OverpassResponse,
  RawOverpassNode,
  RawOverpassWay,
} from "./interfaces";

// southern-most latitude, western-most longitude, northern-most latitude, eastern-most longitude.
export async function getOSMData(bounds: number[]): Promise<OverpassResponse> {
  const options = {
    hostname: "overpass-api.de",
    port: 443,
    path: "/api/interpreter",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log("Started POST request...");
  const boundsStr = bounds.join(",");
  const request_str = `
    [out:json][timeout:25];
    (
      // query part for: “bicycle_parking=*”
      node["bicycle_parking"](${boundsStr});
      way["bicycle_parking"](${boundsStr});
      relation["bicycle_parking"](${boundsStr});
      // query part for: “amenity=bicycle_parking”
      node["amenity"="bicycle_parking"](${boundsStr});
      way["amenity"="bicycle_parking"](${boundsStr});
      relation["amenity"="bicycle_parking"](${boundsStr});
    );
    out body;
    >;
    out skel qt;
    `;
  console.log("request:", request_str);

  return new Promise((resolve, reject) => {
    var req = http.request(options, function (res) {
      var body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", function () {
        if (res.statusCode !== 200) {
          console.log("error code", res.statusCode);
          reject(res.statusCode);
        }

        const jsonResponse = JSON.parse(body);
        const bars = jsonResponse.elements;
        resolve(bars);
      });
    });
    req.on("error", function (e) {
      reject(e.message);
    });
    req.write(request_str);
    req.end();
  });
}

export function drawMarkerAndCard(
  item: RawOverpassNode,
  map: mapboxgl.Map
): mapboxgl.Marker {
  const { lat, lon } = item;

  const placeholder = document.createElement("div");
  ReactDOM.render(<Card item={item} />, placeholder);

  var popup = new mapboxgl.Popup({
    // offset: 25,
    // closeOnMove: true,
    anchor: "bottom", // make the popup appear above the pin
  }).setDOMContent(placeholder);

  let markerOptions: mapboxgl.MarkerOptions = {};
  markerOptions.color = "gray";

  const defaultScale = 0.5;
  markerOptions.scale = defaultScale;

  if (item.tags && item.tags.capacity !== undefined) {
    const capacity = parseInt(item.tags.capacity);
    console.log({capacity});
    let possibleScale = defaultScale + capacity / 30;
    if (possibleScale > 2) {
      possibleScale = 2;
    }
    markerOptions.scale = possibleScale;

    if (item.tags && item.tags.covered === "yes") {
      markerOptions.color = "green";
    }
    if (item.tags && item.tags.lit === "yes") {
      markerOptions.color = "yellow";
    }
    if (item.tags && item.tags.bicycle_parking === "shed") {
      markerOptions.color = "#00ec18";
    }
  }

  const marker = new mapboxgl.Marker(markerOptions)
    .setLngLat([lon, lat])
    .setPopup(popup) // sets a popup on this marker
    .addTo(map);

  if (window.orientation !== undefined) {
    marker.getElement().addEventListener("click", (e) => {
      map.flyTo({
        center: [lon, lat],
      });
    });
  }
  return marker;
}

export function drawmap(map: mapboxgl.Map): void {
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl());
  // Add geolocate control to the map.
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );

  map.on("moveend", function (originalEvent) {
    const { lat, lng } = map.getCenter();
    console.log("A moveend event occurred.");
    console.log({ lat, lng });

    // eg https://localhost:3000
    const location = window.location.origin;
    console.log({ location });
  });
}
export function removeMarkers(markers: mapboxgl.Marker[]): void {
  markers.map((marker) => marker.remove());
}

export function drawMarkersAndCards(
  map: mapboxgl.Map,
  items: RawOverpassNode[]
): mapboxgl.Marker[] {
  const markers = items
    .filter((item) => item.type === "node")
    .map((node: RawOverpassNode) => {
      return drawMarkerAndCard(node, map);
    });

  return markers;
}
