import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location, RoutePlan } from '../types';
import { boundsOf, pointAt, segmentAt } from '../engine/geo';
import { sampleAt, type Ride } from '../engine/ride';
import { phaseAt, type Phase, type SignalPlan } from '../engine/signalModel';
import styles from '../styles/LimeBikeSimulator.module.css';

export interface MapHandle {
  /** Move the rider and the lights to a moment of the ride. */
  showTime: (time: number) => void;
  /** Start following the rider again after the visitor has moved the map. */
  follow: () => void;
  /** Frame the whole route. */
  fit: () => void;
}

interface Props {
  plan: RoutePlan | null;
  ride: Ride | null;
  signalPlans: SignalPlan[];
  start?: Location;
  end?: Location;
  playing: boolean;
  /** Which end the next map click sets, or null when clicks do nothing. */
  picking: 'start' | 'end' | null;
  canMoveEnds: boolean;
  onPick?: (which: 'start' | 'end', lat: number, lng: number) => void;
  onFollowChange?: (following: boolean) => void;
  tileUrl?: string;
  tileAttribution?: string;
}

const LONDON: L.LatLngExpression = [51.5074, -0.1278];
// OpenStreetMap's own tiles. The dark scheme recolours them with a CSS filter
// rather than depending on a second tile provider.
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const BIKE_SVG =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5 9 8h6l3.5 8.5M9 8l3.5 8.5h6M14 5h2.5"/></svg>';

function endIcon(letter: string, kind: 'start' | 'end') {
  return L.divIcon({
    className: '',
    html: `<div class="${styles.endPin}" data-kind="${kind}">${letter}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export const MapCanvas = forwardRef<MapHandle, Props>(function MapCanvas(
  {
    plan,
    ride,
    signalPlans,
    start,
    end,
    playing,
    picking,
    canMoveEnds,
    onPick,
    onFollowChange,
    tileUrl,
    tileAttribution,
  },
  ref
) {
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layers = useRef<{
    tiles?: L.TileLayer;
    route?: L.LayerGroup;
    done?: L.Polyline;
    rider?: L.Marker;
    lights: { el: HTMLElement | null; phase: Phase | 'passed' | null }[];
    ends?: L.LayerGroup;
  }>({ lights: [] });

  // Latest props for use inside Leaflet callbacks and the per-frame update.
  const live = useRef({ plan, ride, signalPlans, picking, onPick, onFollowChange, playing });
  live.current = { plan, ride, signalPlans, picking, onPick, onFollowChange, playing };
  const following = useRef(true);
  const lastTime = useRef(0);
  // While the opening zoom-in is animating, hold off the follow pan so it is not cut short.
  const flyingUntil = useRef(0);

  const setFollowing = (value: boolean) => {
    if (following.current === value) return;
    following.current = value;
    live.current.onFollowChange?.(value);
  };

  const fit = () => {
    const m = map.current;
    const bounds = live.current.plan && boundsOf(live.current.plan.coordinates);
    if (m && bounds) m.fitBounds(bounds, { padding: [36, 36], animate: true });
  };

  const showTime = (time: number) => {
    lastTime.current = time;
    const m = map.current;
    const { plan: p, ride: r, signalPlans: plans, playing: isPlaying } = live.current;
    const { rider, done, lights } = layers.current;
    if (!m || !p || !r || !rider) return;

    const { distance, speed } = sampleAt(r, time);
    const pos = pointAt(p.coordinates, p.cum, distance);
    rider.setLatLng([pos.lat, pos.lng]);

    // Is the rider standing at a light right now?
    const el = rider.getElement()?.firstElementChild as HTMLElement | null;
    if (el) {
      const waiting = speed < 0.05 && time > 0 && time < r.duration;
      if (el.dataset.waiting !== String(waiting)) el.dataset.waiting = String(waiting);
    }

    if (done) {
      const seg = segmentAt(p.cum, distance);
      const path: L.LatLngExpression[] = [];
      for (let i = 0; i <= seg; i++) path.push([p.coordinates[i][1], p.coordinates[i][0]]);
      path.push([pos.lat, pos.lng]);
      done.setLatLngs(path);
    }

    for (let i = 0; i < lights.length; i++) {
      const light = lights[i];
      if (!light.el) continue;
      const state: Phase | 'passed' =
        distance > p.signals[i].distance + 2 ? 'passed' : phaseAt(plans[i], time, r.offsets[i]);
      if (state !== light.phase) {
        light.phase = state;
        light.el.dataset.phase = state;
      }
    }

    // Keep the rider in the middle part of the view without panning every frame.
    if (isPlaying && following.current && performance.now() > flyingUntil.current) {
      const size = m.getSize();
      const pt = m.latLngToContainerPoint([pos.lat, pos.lng]);
      const mx = size.x * 0.28;
      const my = size.y * 0.28;
      if (pt.x < mx || pt.x > size.x - mx || pt.y < my || pt.y > size.y - my) {
        m.panTo([pos.lat, pos.lng], { animate: true, duration: 0.5 });
      }
    }
  };

  useImperativeHandle(ref, () => ({
    showTime,
    fit,
    follow: () => {
      setFollowing(true);
      const { plan: p, ride: r } = live.current;
      if (map.current && p && r) {
        const pos = pointAt(p.coordinates, p.cum, sampleAt(r, lastTime.current).distance);
        map.current.setView([pos.lat, pos.lng], Math.max(map.current.getZoom(), 16), { animate: true });
      }
    },
  }));

  // Create the map once.
  useEffect(() => {
    if (!holder.current) return;
    const m = L.map(holder.current, {
      center: LONDON,
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: true,
    });
    L.control.zoom({ position: 'topleft' }).addTo(m);
    m.attributionControl.setPrefix(false);
    map.current = m;

    m.on('click', (e: L.LeafletMouseEvent) => {
      const which = live.current.picking;
      if (which) live.current.onPick?.(which, e.latlng.lat, e.latlng.lng);
    });
    // Dragging the map by hand means "let me look around".
    m.on('dragstart', () => setFollowing(false));

    const observer = new ResizeObserver(() => m.invalidateSize());
    observer.observe(holder.current);
    return () => {
      observer.disconnect();
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Basemap follows the colour scheme.
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    layers.current.tiles?.remove();
    layers.current.tiles = L.tileLayer(tileUrl ?? TILE_URL, {
      attribution: tileAttribution ?? ATTRIBUTION,
      maxZoom: 19,
      className: tileUrl ? undefined : styles.tiles,
    }).addTo(m);
  }, [tileUrl, tileAttribution]);

  // Start and end pins.
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    layers.current.ends?.remove();
    const group = L.layerGroup().addTo(m);
    layers.current.ends = group;
    const add = (loc: Location | undefined, which: 'start' | 'end') => {
      if (!loc) return;
      const marker = L.marker([loc.lat, loc.lng], {
        icon: endIcon(which === 'start' ? 'A' : 'B', which),
        draggable: canMoveEnds,
        keyboard: false,
        zIndexOffset: 500,
      }).addTo(group);
      if (loc.label) marker.bindTooltip(loc.label, { direction: 'top', offset: [0, -12] });
      marker.on('dragend', () => {
        const at = marker.getLatLng();
        live.current.onPick?.(which, at.lat, at.lng);
      });
    };
    add(start, 'start');
    add(end, 'end');
    if (!live.current.plan && start && !end) m.panTo([start.lat, start.lng]);
  }, [start, end, canMoveEnds]);

  // Route line, lights and rider.
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    layers.current.route?.remove();
    layers.current.lights = [];
    layers.current.rider = undefined;
    layers.current.done = undefined;
    if (!plan) return;

    const group = L.layerGroup().addTo(m);
    layers.current.route = group;
    const latlngs = plan.coordinates.map(([lng, lat]) => [lat, lng] as L.LatLngTuple);
    L.polyline(latlngs, { className: styles.routeCasing, weight: 9, interactive: false }).addTo(group);
    L.polyline(latlngs, { className: styles.routeLine, weight: 5, interactive: false }).addTo(group);
    layers.current.done = L.polyline([], {
      className: styles.routeDone,
      weight: 5,
      interactive: false,
    }).addTo(group);

    layers.current.lights = plan.signals.map((sig) => {
      const at = pointAt(plan.coordinates, plan.cum, sig.distance);
      const marker = L.marker([at.lat, at.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div class="${styles.light}" data-kind="${sig.kind}" data-phase="red"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
        keyboard: false,
        zIndexOffset: 200,
      }).addTo(group);
      marker.bindTooltip(
        `${sig.kind === 'junction' ? 'Traffic lights' : 'Signalled crossing'}${sig.name ? ` · ${sig.name}` : ''}`,
        { direction: 'top', offset: [0, -8] }
      );
      return { el: marker.getElement()?.firstElementChild as HTMLElement | null, phase: null };
    });

    layers.current.rider = L.marker(latlngs[0], {
      icon: L.divIcon({
        className: '',
        html: `<div class="${styles.rider}" data-waiting="false">${BIKE_SVG}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      }),
      interactive: false,
      zIndexOffset: 1000,
    }).addTo(group);

    setFollowing(true);
    const bounds = boundsOf(plan.coordinates);
    if (bounds) m.fitBounds(bounds, { padding: [36, 36] });
    showTime(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  // A different ride on the same route: repaint the lights from its start.
  useEffect(() => {
    for (const light of layers.current.lights) light.phase = null;
    showTime(lastTime.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride, signalPlans]);

  // Zoom in on the rider when the ride starts.
  useEffect(() => {
    const m = map.current;
    const { plan: p, ride: r } = live.current;
    if (!playing || !m || !p || !r || !following.current) return;
    const pos = pointAt(p.coordinates, p.cum, sampleAt(r, lastTime.current).distance);
    flyingUntil.current = performance.now() + 900;
    m.flyTo([pos.lat, pos.lng], Math.max(m.getZoom(), 16), { duration: 0.8 });
  }, [playing]);

  return (
    <div
      ref={holder}
      className={styles.map}
      data-picking={picking ? 'true' : 'false'}
      role="application"
      aria-label="Map of the route"
    />
  );
});
