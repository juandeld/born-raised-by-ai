import { hashSeed, rng } from "./rand";
import { Art } from "./kit";

/** Local stand-in for the image model: friendly avatars and simple scenes. Free, deterministic, offline. */
export interface Look {
  kind: "person" | "dog" | "cat" | "pet";
  hair: "short" | "long" | "puffs" | "bun" | "none";
  dress: boolean;
  glasses: boolean;
  /** 0.6 baby ... 1 adult */
  size: number;
}

export function lookOf(role: string, seed: number): Look {
  const r = role.toLowerCase();
  const h = hashSeed(`${role}|${seed}`);
  const isDog = /perr|dog|puppy|cachorr/.test(r);
  const isCat = /gat|cat|kitten/.test(r);
  const isPet = /mascota|pet|conej|rabbit|hamster|pajar|bird|loro/.test(r);
  const female = /ni[ñn]a|girl|mam[aá]|mom|mother|abuela|grandma|grandmother|hermana|sister|t[ií]a|aunt/.test(r);
  const old = /abuel|grand/.test(r);
  const baby = /beb[eé]|baby/.test(r);
  const styles: Look["hair"][] = female ? ["long", "puffs", "bun", "long"] : ["short", "short", "none", "short"];
  return {
    kind: isDog ? "dog" : isCat ? "cat" : isPet ? "pet" : "person",
    hair: old && female ? "bun" : styles[h % styles.length]!,
    dress: female,
    glasses: old || h % 7 === 0,
    size: baby ? 0.6 : /\b[3-5]\b/.test(r) ? 0.78 : /\b[6-9]\b/.test(r) ? 0.88 : 1,
  };
}

/** Draws a character with its feet at (0,0), ~560 px tall at size 1. */
export function drawPerson(a: Art, look: Look): void {
  a.push();
  a.scale(look.size);
  // legs and shoes
  a.rect(-46, -150, 38, 150, 16);
  a.rect(8, -150, 38, 150, 16);
  a.ellipse(-30, -6, 40, 20);
  a.ellipse(30, -6, 40, 20);
  // body
  if (look.dress) a.poly([[-70, -300], [70, -300], [105, -130], [-105, -130]], true);
  else a.rect(-72, -310, 144, 170, 26);
  // arms
  a.push(); a.translate(-72, -285); a.rotate(18); a.rect(-34, 0, 34, 130, 16); a.pop();
  a.push(); a.translate(72, -285); a.rotate(-18); a.rect(0, 0, 34, 130, 16); a.pop();
  // head
  if (look.hair === "long" || look.hair === "bun") a.rect(-90, -440, 180, 190, 70);
  if (look.hair === "puffs") { a.circle(-85, -420, 42); a.circle(85, -420, 42); }
  if (look.hair === "bun") a.circle(0, -470, 38);
  a.circle(0, -380, 82);
  if (look.hair === "short") a.curve([[-82, -390], [-70, -440], [0, -468], [70, -440], [82, -390], [40, -420], [-40, -420]], true);
  if (look.hair === "long" || look.hair === "puffs" || look.hair === "bun") a.curve([[-82, -380], [-60, -450], [0, -465], [60, -450], [82, -380], [30, -425], [-30, -425]], true);
  // face
  a.circle(-30, -378, 8, "black", 4);
  a.circle(30, -378, 8, "black", 4);
  a.arc(-28, -338, 0, -312, 28, -338, 8);
  if (look.glasses) { a.circle(-30, -378, 24, "none", 6); a.circle(30, -378, 24, "none", 6); a.line(-6, -378, 6, -378, 6); }
}

export function drawAnimal(a: Art, look: Look): void {
  const cat = look.kind === "cat";
  a.push();
  a.scale(look.size * 1.1);
  // tail
  a.curve([[110, -150], [170, -190], [185, -260], [150, -300]], false, "none", 22);
  a.curve([[110, -150], [170, -190], [185, -260], [150, -300]], false, "none", 10);
  // legs
  a.rect(-100, -90, 32, 90, 14); a.rect(-50, -90, 32, 90, 14); a.rect(40, -90, 32, 90, 14); a.rect(90, -90, 32, 90, 14);
  // body
  a.ellipse(10, -150, 130, 80);
  // head
  if (cat) { a.poly([[-150, -300], [-130, -230], [-90, -255]], true); a.poly([[-30, -300], [-50, -230], [-90, -255]], true); }
  else { a.ellipse(-150, -270, 24, 60); a.ellipse(-30, -270, 24, 60); }
  a.circle(-90, -230, 64);
  a.ellipse(-90, -205, 34, 24);
  a.ellipse(-90, -214, 10, 7, "black", 4);
  a.circle(-112, -245, 7, "black", 4);
  a.circle(-68, -245, 7, "black", 4);
  a.arc(-104, -192, -90, -178, -76, -192, 6);
  a.pop();
}

export function drawCharacter(a: Art, look: Look): void {
  if (look.kind === "person") drawPerson(a, look);
  else drawAnimal(a, look);
}

type Backdrop = (a: Art, r: () => number) => void;

const hills: Backdrop = (a) => {
  a.circle(820, 240, 90); // sun
  for (let i = 0; i < 8; i++) { const ang = (i / 8) * Math.PI * 2; a.line(820 + Math.cos(ang) * 112, 240 + Math.sin(ang) * 112, 820 + Math.cos(ang) * 160, 240 + Math.sin(ang) * 160); }
  a.cloud(240, 260, 230);
  a.curve([[0, 1030], [250, 960], [520, 1020], [800, 950], [1024, 1010]], false, "none");
  a.rect(60, 700, 40, 280, 10); a.circle(80, 640, 110); // tree
};
const lake: Backdrop = (a) => {
  a.cloud(760, 230, 250); a.cloud(200, 340, 190);
  for (let i = 0; i < 3; i++) a.arc(100 + i * 330, 1040 + i * 12, 190 + i * 330, 1000, 280 + i * 330, 1040 + i * 12);
  a.poly([[640, 940], [900, 940], [860, 1020], [680, 1020]], true); a.line(770, 940, 770, 700); a.poly([[775, 710], [775, 920], [900, 920]], true);
};
const balloon: Backdrop = (a) => {
  a.ellipse(760, 380, 150, 190); a.line(660, 530, 720, 640); a.line(860, 530, 800, 640); a.rect(715, 640, 90, 70, 14);
  a.cloud(200, 260, 240); a.cloud(300, 900, 260); a.cloud(820, 1000, 220);
};
const night: Backdrop = (a, r) => {
  a.curve([[760, 160], [820, 190], [830, 260], [790, 320], [730, 340], [790, 280], [790, 210]], true);
  for (let i = 0; i < 7; i++) a.star(120 + r() * 800, 120 + r() * 520, 34, 15);
  a.curve([[0, 1030], [260, 980], [560, 1030], [820, 970], [1024, 1020]], false, "none");
};
const house: Backdrop = (a) => {
  a.rect(560, 640, 340, 280, 12); a.poly([[530, 650], [730, 480], [930, 650]], true);
  a.rect(690, 760, 80, 160, 10); a.rect(590, 700, 70, 70, 8); a.rect(800, 700, 70, 70, 8);
  a.cloud(200, 280, 240); a.circle(850, 250, 80);
};
const chest: Backdrop = (a) => {
  a.rect(640, 800, 300, 170, 20); a.curve([[640, 800], [700, 700], [880, 700], [940, 800]], false); a.rect(760, 840, 60, 70, 10);
  a.star(260, 300, 60, 26); a.star(560, 200, 40, 18); a.star(820, 330, 48, 20);
};
const BACKDROPS: Backdrop[] = [hills, lake, balloon, night, house, chest];

export function drawScene(a: Art, looks: Look[], seed: number, setting: string): void {
  const r = rng(seed);
  const pick = /night|dream|moon|firefl|dusk|sleep/i.test(setting) ? 3 : /boat|lake|sail/i.test(setting) ? 1 : /balloon/i.test(setting) ? 2 : /house|home|door/i.test(setting) ? 4 : /treasure|chest|cave/i.test(setting) ? 5 : seed % BACKDROPS.length;
  BACKDROPS[pick]!(a, r);
  const n = Math.max(1, Math.min(looks.length, 4));
  const base = 1240;
  const gap = 850 / n;
  looks.slice(0, n).forEach((look, i) => {
    a.push();
    a.translate(120 + gap * (i + 0.5) - (n > 2 ? 0 : -60), base - (i % 2) * 40);
    a.scale(n > 2 ? 0.95 : 1.1);
    drawCharacter(a, look);
    a.pop();
  });
}
