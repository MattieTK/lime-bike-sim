#!/usr/bin/env node
/**
 * Generate precomputed route data for a given start/end location.
 *
 * Usage:
 *   node scripts/generate-route.cjs <startLat> <startLng> <endLat> <endLng> [output.json]
 *
 * Example:
 *   node scripts/generate-route.cjs 51.5007 -0.1246 51.5155 -0.1419 > bigben-to-oxford.json
 */

const https = require('https');
const http = require('http');

const args = process.argv.slice(2);

if (args.length < 4) {
  console.error('Usage: node scripts/generate-route.cjs <startLat> <startLng> <endLat> <endLng>');
  console.error('Example: node scripts/generate-route.cjs 51.5007 -0.1246 51.5155 -0.1419');
  process.exit(1);
}

const [startLat, startLng, endLat, endLng] = args.map(Number);

// Fetch helper
function fetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        } else {
          resolve(JSON.parse(data));
        }
      });
    }).on('error', reject);
  });
}

// POST helper for Overpass
function post(url, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const client = url.startsWith('https') ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        } else {
          resolve(JSON.parse(data));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Haversine distance
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function main() {
  console.error(`Fetching route from (${startLat}, ${startLng}) to (${endLat}, ${endLng})...`);

  // 1. Fetch route from OSRM
  const osrmUrl = `https://router.project-osrm.org/route/v1/bike/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
  const routeData = await fetch(osrmUrl);

  if (routeData.code !== 'Ok' || !routeData.routes.length) {
    console.error('Failed to fetch route:', routeData);
    process.exit(1);
  }

  const route = routeData.routes[0];
  const coordinates = route.geometry.coordinates;
  const distance = route.distance;

  console.error(`Route: ${(distance / 1000).toFixed(2)} km, ${coordinates.length} points`);

  // 2. Sample coordinates for traffic light query
  const sampledCoords = [];
  let accDist = 0;
  sampledCoords.push(coordinates[0]);

  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1];
    const [lng2, lat2] = coordinates[i];
    accDist += haversineDistance(lat1, lng1, lat2, lng2);

    if (accDist >= 100) { // Sample every 100m
      sampledCoords.push(coordinates[i]);
      accDist = 0;
    }
  }
  sampledCoords.push(coordinates[coordinates.length - 1]);

  // 3. Fetch traffic lights from Overpass
  console.error(`Querying traffic lights along ${sampledCoords.length} sampled points...`);

  const coordsStr = sampledCoords.map(([lng, lat]) => `${lat},${lng}`).join(',');
  const overpassQuery = `
    [out:json][timeout:30];
    (
      node["highway"="traffic_signals"](around:30,${coordsStr});
    );
    out body;
  `;

  let overpassData;
  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  ];

  for (const endpoint of endpoints) {
    try {
      console.error(`Trying ${endpoint}...`);
      overpassData = await post(endpoint, `data=${encodeURIComponent(overpassQuery)}`);
      break;
    } catch (err) {
      console.error(`  Failed: ${err.message}`);
    }
  }

  if (!overpassData) {
    console.error('All Overpass endpoints failed');
    process.exit(1);
  }

  // 4. Process traffic lights
  const trafficLights = [];
  const MIN_DISTANCE_BETWEEN_LIGHTS = 50;

  for (const node of overpassData.elements) {
    if (node.type !== 'node') continue;

    // Find closest point on route and distance from start
    let closestDist = Infinity;
    let distanceFromStart = 0;
    let accumulatedDistance = 0;

    for (let i = 0; i < coordinates.length; i++) {
      const [lng, lat] = coordinates[i];
      const dist = haversineDistance(node.lat, node.lon, lat, lng);

      if (dist < closestDist) {
        closestDist = dist;
        distanceFromStart = accumulatedDistance;
      }

      if (i > 0) {
        const [prevLng, prevLat] = coordinates[i - 1];
        accumulatedDistance += haversineDistance(prevLat, prevLng, lat, lng);
      }
    }

    // Only include if within 30m of route
    if (closestDist <= 30) {
      trafficLights.push({
        id: node.id,
        lat: node.lat,
        lng: node.lon,
        distanceFromStart,
      });
    }
  }

  // Sort by distance and deduplicate
  trafficLights.sort((a, b) => a.distanceFromStart - b.distanceFromStart);

  const dedupedLights = [];
  for (const light of trafficLights) {
    const lastLight = dedupedLights[dedupedLights.length - 1];
    if (!lastLight || light.distanceFromStart - lastLight.distanceFromStart >= MIN_DISTANCE_BETWEEN_LIGHTS) {
      dedupedLights.push(light);
    }
  }

  console.error(`Found ${dedupedLights.length} traffic lights`);

  // 5. Output the precomputed route
  const precomputedRoute = {
    coordinates,
    distance,
    trafficLights: dedupedLights,
  };

  console.log(JSON.stringify(precomputedRoute, null, 2));
  console.error('\nDone! Paste the JSON output into your component as precomputedRoute prop.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
