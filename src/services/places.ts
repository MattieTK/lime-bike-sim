import type { Location } from '../types';

/** Place search, using the Photon geocoder (OpenStreetMap data, hosted by Komoot). */
const PHOTON = 'https://photon.komoot.io';
// Bias results towards London without excluding the rest of the world.
const LONDON = { lat: 51.5074, lng: -0.1278 };

export interface Place extends Location {
  label: string;
  /** Area or postcode, to tell similar names apart. */
  context: string;
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    district?: string;
    locality?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
}

function toPlace(f: PhotonFeature): Place | null {
  const p = f.properties;
  const address = [p.housenumber, p.street].filter(Boolean).join(' ');
  const label = p.name || address;
  if (!label) return null;
  const context = [p.name && address ? address : '', p.district || p.locality || p.city, p.postcode]
    .filter(Boolean)
    .join(', ');
  return { label, context, lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] };
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const url = `${PHOTON}/api/?q=${encodeURIComponent(query)}&limit=6&lang=en&lat=${LONDON.lat}&lon=${LONDON.lng}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Place search answered ${res.status}`);
  const data = (await res.json()) as { features: PhotonFeature[] };
  const seen = new Set<string>();
  const places: Place[] = [];
  for (const f of data.features) {
    const place = toPlace(f);
    if (!place) continue;
    const key = `${place.label}|${place.context}`;
    if (seen.has(key)) continue;
    seen.add(key);
    places.push(place);
  }
  return places;
}

/** A name for a pin dropped on the map. Falls back to null if nothing is nearby. */
export async function nameOf(lat: number, lng: number, signal?: AbortSignal): Promise<string | null> {
  try {
    const res = await fetch(`${PHOTON}/reverse?lat=${lat}&lon=${lng}&limit=1&lang=en`, { signal });
    if (!res.ok) return null;
    const data = (await res.json()) as { features: PhotonFeature[] };
    const p = data.features[0]?.properties;
    if (!p) return null;
    return p.name || [p.housenumber, p.street].filter(Boolean).join(' ') || p.district || null;
  } catch {
    return null;
  }
}

export const EXAMPLE_ROUTES: { name: string; start: Location; end: Location }[] = [
  {
    name: 'Big Ben → Oxford Circus',
    start: { lat: 51.5007, lng: -0.1246, label: 'Big Ben' },
    end: { lat: 51.5155, lng: -0.1419, label: 'Oxford Circus' },
  },
  {
    name: "King's Cross → Bank",
    start: { lat: 51.5308, lng: -0.1238, label: "King's Cross" },
    end: { lat: 51.5134, lng: -0.089, label: 'Bank' },
  },
  {
    name: 'Brixton → Waterloo',
    start: { lat: 51.4627, lng: -0.1145, label: 'Brixton' },
    end: { lat: 51.5033, lng: -0.1145, label: 'Waterloo' },
  },
  {
    name: 'Hackney → Shoreditch',
    start: { lat: 51.547, lng: -0.056, label: 'Hackney Central' },
    end: { lat: 51.5246, lng: -0.078, label: 'Shoreditch' },
  },
];
