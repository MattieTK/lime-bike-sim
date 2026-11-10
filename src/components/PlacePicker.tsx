import { useEffect, useId, useRef, useState } from 'react';
import type { Location } from '../types';
import { EXAMPLE_ROUTES, searchPlaces, type Place } from '../services/places';
import styles from '../styles/LimeBikeSimulator.module.css';

interface FieldProps {
  letter: 'A' | 'B';
  kind: 'start' | 'end';
  placeholder: string;
  value: Location | null;
  active: boolean;
  onFocus: () => void;
  onChoose: (place: Location | null) => void;
}

function PlaceField({ letter, kind, placeholder, value, active, onFocus, onChoose }: FieldProps) {
  const [text, setText] = useState(value?.label ?? '');
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [searching, setSearching] = useState(false);
  const listId = useId();
  const typed = useRef(false);

  // Show the chosen place's name, including pins dropped on the map.
  useEffect(() => {
    typed.current = false;
    setText(value ? value.label ?? 'Dropped pin' : '');
    setOpen(false);
  }, [value]);

  useEffect(() => {
    const query = text.trim();
    if (!typed.current || query.length < 3) {
      setResults([]);
      setSearching(false);
      return;
    }
    const controller = new AbortController();
    setSearching(true);
    const timer = setTimeout(() => {
      searchPlaces(query, controller.signal).then(
        (found) => {
          setResults(found);
          setCursor(0);
          setOpen(true);
          setSearching(false);
        },
        () => {
          if (!controller.signal.aborted) setSearching(false);
        }
      );
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text]);

  const choose = (place: Place) => {
    setOpen(false);
    onChoose({ lat: place.lat, lng: place.lng, label: place.label });
  };

  return (
    <div className={styles.field} data-active={active}>
      <span className={styles.fieldPin} data-kind={kind} aria-hidden="true">
        {letter}
      </span>
      <input
        className={styles.fieldInput}
        value={text}
        placeholder={placeholder}
        aria-label={kind === 'start' ? 'Start' : 'Destination'}
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        onFocus={(e) => {
          onFocus();
          e.currentTarget.select();
          if (results.length) setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => {
          typed.current = true;
          setText(e.target.value);
          if (e.target.value === '' && value) onChoose(null);
        }}
        onKeyDown={(e) => {
          if (!open || !results.length) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setCursor((c) => (c + 1) % results.length);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setCursor((c) => (c - 1 + results.length) % results.length);
          } else if (e.key === 'Enter') {
            e.preventDefault();
            choose(results[cursor]);
          } else if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
      />
      {searching && <span className={styles.fieldSpinner} aria-hidden="true" />}
      {open && results.length > 0 && (
        <ul className={styles.suggestions} id={listId} role="listbox">
          {results.map((place, i) => (
            <li
              key={`${place.lat},${place.lng}`}
              role="option"
              aria-selected={i === cursor}
              className={styles.suggestion}
              data-current={i === cursor}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(place);
              }}
              onMouseEnter={() => setCursor(i)}
            >
              <span>{place.label}</span>
              {place.context && <small>{place.context}</small>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface Props {
  start: Location | null;
  end: Location | null;
  picking: 'start' | 'end' | null;
  onPicking: (which: 'start' | 'end') => void;
  onStart: (place: Location | null) => void;
  onEnd: (place: Location | null) => void;
  onRoute: (start: Location, end: Location) => void;
}

export function PlacePicker({ start, end, picking, onPicking, onStart, onEnd, onRoute }: Props) {
  return (
    <div className={styles.picker} data-component="place-picker">
      <div className={styles.fields}>
        <PlaceField
          letter="A"
          kind="start"
          placeholder="Where from?"
          value={start}
          active={picking === 'start'}
          onFocus={() => onPicking('start')}
          onChoose={onStart}
        />
        <PlaceField
          letter="B"
          kind="end"
          placeholder="Where to?"
          value={end}
          active={picking === 'end'}
          onFocus={() => onPicking('end')}
          onChoose={onEnd}
        />
        <button
          type="button"
          className={styles.swap}
          title="Swap start and destination"
          aria-label="Swap start and destination"
          disabled={!start && !end}
          onClick={() => {
            if (start && end) onRoute(end, start);
            else {
              onStart(end);
              onEnd(start);
            }
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" />
          </svg>
        </button>
      </div>
      {!(start && end) && (
        <>
          <p className={styles.hint}>
            Search for a place, or click the map to drop pin {picking === 'end' ? 'B' : 'A'}.
          </p>
          <div className={styles.examples}>
            <span className={styles.examplesLabel}>Or try</span>
            {EXAMPLE_ROUTES.map((route) => (
              <button
                key={route.name}
                type="button"
                className={styles.chip}
                data-action="example-route"
                onClick={() => onRoute(route.start, route.end)}
              >
                {route.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
