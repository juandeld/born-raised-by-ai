import type { ReactNode } from "react";

/**
 * One line icon per adventure theme (id from COLOREAR_THEMES). Original, drawn on a 24 px grid with a single
 * uniform stroke so they read like pencil outlines. Decorative: the label next to them carries the meaning.
 */
const ICONS: Record<string, ReactNode> = {
  // stegosaurus: arched back with plates
  dinosaurs: (<><path d="M3 17c0-3.5 3-6 7.5-6 3.5 0 6.2 1.4 7.5 3.6l2.5-.6c.6 0 1 .5 1 1.1 0 .8-.6 1.4-1.4 1.6l-1.1.3V19" /><path d="M6 19v-2M10 19v-2M3 17h2" /><path d="M7 11l1.2-3 1.4 3M11 10.5l1.4-3 1.4 3.2M15 12l1.2-2.6 1.2 2.9" /></>),
  // rocket
  space: (<><path d="M12 3c3 2 4.5 5 4.5 9v4h-9v-4c0-4 1.5-7 4.5-9z" /><circle cx="12" cy="10" r="1.6" /><path d="M7.5 13.5L5 16.5v2.5l2.5-1.5M16.5 13.5l2.5 3v2.5l-2.5-1.5M10 19.5c0 1 .8 1.8 2 1.8s2-.8 2-1.8" /></>),
  // lion face
  jungle: (<><circle cx="12" cy="12" r="4" /><path d="M12 3l1.3 2.6 2.7-1.2.2 2.9 2.9.2-1.2 2.7L21 12l-2.1 1.8 1.2 2.7-2.9.2-.2 2.9-2.7-1.2L12 21l-1.3-2.6-2.7 1.2-.2-2.9-2.9-.2 1.2-2.7L3 12l2.1-1.8-1.2-2.7 2.9-.2.2-2.9 2.7 1.2z" /><path d="M10.5 11.3v.1M13.5 11.3v.1M11 13.6h2" /></>),
  // barn
  farm: (<><path d="M4 20V10l8-6 8 6v10z" /><path d="M9 20v-6h6v6M9 14l6 6M15 14l-6 6M8 9.5h8" /></>),
  // paw print
  pets: (<><ellipse cx="12" cy="15.5" rx="4" ry="3.2" /><ellipse cx="6.2" cy="11" rx="1.6" ry="2.1" /><ellipse cx="9.6" cy="6.8" rx="1.6" ry="2.1" /><ellipse cx="14.4" cy="6.8" rx="1.6" ry="2.1" /><ellipse cx="17.8" cy="11" rx="1.6" ry="2.1" /></>),
  // whale with spout
  ocean: (<><path d="M2.5 14c0-3.5 3.5-6 8-6 4 0 7 1.8 8.3 4.8 1-.2 2-.9 2.7-2-.2 2.5-1.2 4.2-3 5.2-1.7 1.8-4.5 3-8 3-4.5 0-8-2-8-5z" /><circle cx="7.5" cy="12.5" r=".4" /><path d="M10.5 8c0-1.6-1.2-2.4-1.2-3.8M10.5 8c0-1.6 1.2-2.4 1.2-3.8" /></>),
  // shell + wave (mermaid tail)
  mermaids: (<><path d="M3.500 17a8.500 8.500 0 0117 0z" /><path d="M12 8.500V17M7.500 10.500L9.500 17M16.500 10.500L14.500 17M10.500 17l-1 3.500h5l-1-3.500" /></>),
  // unicorn horn on a head
  unicorns: (<><path d="M12 2.5l-2 6h4z" /><path d="M10 8.5C7 9 5 11.5 5 15v1.5c0 2.5 1.5 4 4 4h3c3.5 0 6-2.5 6-6 0-2.5-1-4.5-3-5.5" /><path d="M14 8.5L17.5 6l.5 3.2M10.5 14.3v.1" /></>),
  // dragon: winged body with spikes
  dragons: (<><path d="M12 4c-1.5 3-3 4-3 7 0 2.5 1.5 4 3 4s3-1.5 3-4c0-3-1.5-4-3-7z" /><path d="M12 15c0 2.5-2 4-5 4.5 1-1 1.5-2 1.5-3.2M12 15c0 2.5 2 4 5 4.5-1-1-1.5-2-1.5-3.2" /><path d="M12 10c-1 1.500-2 2.200-2 3.600a2 2 0 004 0c0-1.400-1-2.100-2-3.600z" /><path d="M3 21c1.500-1 3-1 4.500 0s3 1 4.500 0 3-1 4.500 0 3 1 4.500 0" /></>),
  // castle
  castles: (<><path d="M4 20V9h3v2h2V9h2V6l1-1 1 1v3h2v2h2V9h3v11z" /><path d="M10 20v-4a2 2 0 014 0v4M12 3v3" /></>),
  // fairy wings with wand star
  fairies: (<><path d="M4.500 19.500L14 10" /><path d="M16.500 3l1.100 2.400 2.400 1.100-2.400 1.100-1.100 2.400-1.100-2.400L13 6.500l2.400-1.100z" /><path d="M6 6.500v3M4.500 8h3M19 15v3M17.500 16.500h3" /></>),
  // pirate ship
  pirates: (<><path d="M3 15h18c-1 3.5-3.500 5-6.500 5h-5C6.500 20 4 18.500 3 15z" /><path d="M12 3v12M12 4l6 4.500h-6M12 7.500L7 11h5" /><path d="M10.500 6.500v.1" /></>),
  // robot head
  robots: (<><rect x="5" y="8" width="14" height="11" rx="2.500" /><path d="M12 8V5M10.500 5h3" /><circle cx="9.500" cy="13" r="1.300" /><circle cx="14.500" cy="13" r="1.300" /><path d="M9.500 16.500h5M3 12.500v3M21 12.500v3" /></>),
  // car, side view
  cars: (<><path d="M3 16v-3.500c0-1 .6-1.700 1.500-2L7 9l2-3h6l3 3.500 2 .7c.7.2 1 .8 1 1.500V16z" /><path d="M9.500 6.500L8.500 9.500h9M12.500 9.500V6.500" /><circle cx="7.500" cy="16.500" r="2" /><circle cx="16.500" cy="16.500" r="2" /></>),
  // digger / tractor
  trucks: (<><path d="M3 17V9h7l2 4h4v4" /><path d="M5 9V6.500M16 13l3-5.500 3 1.500-2 3" /><circle cx="7" cy="17.500" r="2.200" /><circle cx="16" cy="17.500" r="2.200" /><path d="M9.200 17.500h4.600M3 17h1.800" /></>),
  // steam train front
  trains: (<><rect x="6" y="4" width="12" height="13" rx="3" /><path d="M6 11h12M9 17l-2 3.500M15 17l2 3.500M6.500 20.500h11" /><circle cx="9.500" cy="14" r=".6" /><circle cx="14.500" cy="14" r=".6" /><path d="M9 7.500h6" /></>),
  // hot-air balloon
  planes: (<><path d="M12 2.500c3.500 0 6 2.500 6 5.800 0 3-2.500 5.500-6 6.700-3.500-1.200-6-3.700-6-6.700 0-3.300 2.500-5.800 6-5.800z" /><path d="M9.500 14.200L10 17.500h4l.5-3.300M10 17.500v3.500h4v-3.500M12 2.500c-2 2-2.500 4-2.500 6s1.200 4 2.500 6c1.300-2 2.500-4 2.500-6s-.5-4-2.500-6z" /></>),
  // cape + shield
  heroes: (<><path d="M12 3l7 2.500v5.500c0 4.500-3 7.700-7 9.500-4-1.800-7-5-7-9.500V5.500z" /><path d="M12 7.500l1.200 2.600 2.800.3-2.100 1.900.6 2.800-2.500-1.400-2.500 1.400.6-2.800-2.100-1.900 2.800-.3z" /></>),
  // butterfly
  bugs: (<><path d="M12 7v12M12 7c-1-1.500-2-2.500-3-3M12 7c1-1.500 2-2.500 3-3" /><path d="M12 9C9 4.500 4 4.500 3.500 8c-.4 3 2.500 5 8.500 4M12 9c3-4.500 8-4.500 8.500-1 .4 3-2.500 5-8.500 4" /><path d="M12 12.500c-4 0-7 1.500-6 4.500s4.500 2 6-1M12 12.500c4 0 7 1.500 6 4.500s-4.500 2-6-1" /></>),
  // flower
  garden: (<><circle cx="12" cy="9" r="2" /><path d="M12 7c-1.500-1-1.500-4 0-4.500 1.500.5 1.500 3.500 0 4.500zM14 9c1-1.500 4-1.500 4.500 0-.5 1.500-3.500 1.500-4.500 0zM12 11c1.500 1 1.500 4 0 4.500-1.500-.5-1.500-3.500 0-4.500zM10 9c-1 1.500-4 1.500-4.500 0 .5-1.500 3.500-1.500 4.500 0z" /><path d="M12 15.500V21M12 19c-2.500 0-4-1-4.500-3 2.500 0 4 1 4.500 3z" /></>),
  // ice cream cone
  sweets: (<><path d="M7.500 11L12 21l4.500-10" /><path d="M7 11a5 5 0 0110 0c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1z" /><path d="M12 6V4c0-.8.6-1.300 1.300-1.300M9.800 14.500l3.700 2.700" /></>),
  // soccer ball
  soccer: (<><circle cx="12" cy="12" r="8.500" /><path d="M12 8.500l3 2.200-1.100 3.600h-3.800L9 10.700z" /><path d="M12 8.500V3.700M15 10.700l4.300-1.500M13.900 14.300l2.800 3.600M10.100 14.300l-2.800 3.600M9 10.700L4.700 9.200" /></>),
  // guitar
  music: (<><path d="M14.500 9.500l4-4M17 3.500l3.500 3.500-2 2-3.500-3.500z" /><path d="M13.500 10.500c1.500 1.500.8 3.300-.5 4 .5 2-1 4.500-4 5.500-3 .6-5-1.500-4.500-4.500 1-3 3.500-4.500 5.500-4 .7-1.300 2.500-2 3.500-1z" /><circle cx="9" cy="15" r="1" /></>),
  // tree
  christmas: (<><path d="M12 3l-4 5.500h2.500L7 13h3l-4 5.500h12L14 13h3l-3.500-4.500H16z" /><path d="M12 18.500V21" /></>),
};

export function ThemeIcon({ id, className }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="40"
      height="40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {ICONS[id] ?? <circle cx="12" cy="12" r="7" />}
    </svg>
  );
}

/** Pencil-stroke star used for the free-text "write your own" option. */
export function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className}>
      <path d="M4 20l1-4L16.500 4.500a1.800 1.800 0 012.500 0l.5.5a1.800 1.800 0 010 2.500L8 19z" /><path d="M14.500 6.500l3 3" />
    </svg>
  );
}
