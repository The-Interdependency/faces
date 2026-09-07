import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as BookOpen, i as ChartNoAxesColumn, n as ScanFace, r as RotateCcw } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cn6YNFYj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REGIONS = [
	{
		id: "eyes",
		label: "Eyes",
		note: "aperture, tilt, and lid"
	},
	{
		id: "brows",
		label: "Brows",
		note: "arch, weight, set"
	},
	{
		id: "nose",
		label: "Nose",
		note: "bridge, tip, and profile"
	},
	{
		id: "mouth",
		label: "Mouth",
		note: "width, fullness, corners"
	},
	{
		id: "jaw",
		label: "Jaw",
		note: "width and mandibular angle"
	},
	{
		id: "chin",
		label: "Chin",
		note: "projection and notch"
	},
	{
		id: "cheeks",
		label: "Cheeks",
		note: "malar bone and fullness"
	},
	{
		id: "ears",
		label: "Ears",
		note: "size and flare from the skull"
	},
	{
		id: "hairline",
		label: "Hairline",
		note: "peak, recession, height"
	},
	{
		id: "forehead",
		label: "Forehead",
		note: "vertical rise above the brow"
	}
];
var FEATURES = [
	{
		id: "eyes_almond",
		region: "eyes",
		name: "Almond eyes",
		term: "almond",
		gloss: "Tapered inner and outer corners with a long, even aperture.",
		knobs: {
			eyeWidth: 1.18,
			eyeHeight: .82,
			eyeTilt: .12,
			eyeRound: .2,
			lidHood: .15
		}
	},
	{
		id: "eyes_hooded",
		region: "eyes",
		name: "Hooded lids",
		term: "hooded",
		gloss: "A fold of skin drops over the crease and shortens the visible lid.",
		knobs: {
			lidHood: 1,
			eyeHeight: .7,
			eyeWidth: 1.02,
			eyeRound: .35
		}
	},
	{
		id: "eyes_round",
		region: "eyes",
		name: "Round eyes",
		term: "round",
		gloss: "Tall aperture with little taper; the iris is fully framed.",
		knobs: {
			eyeWidth: .92,
			eyeHeight: 1.22,
			eyeRound: 1,
			lidHood: .05,
			eyeTilt: 0
		}
	},
	{
		id: "eyes_deep_set",
		region: "eyes",
		name: "Deep-set eyes",
		term: "deep-set",
		gloss: "The globe sits back; the brow shelf casts a short shadow.",
		knobs: {
			lidHood: .55,
			browSet: -.4,
			eyeHeight: .78,
			eyeGap: .9
		}
	},
	{
		id: "eyes_upturned",
		region: "eyes",
		name: "Upturned eyes",
		term: "upturned",
		gloss: "Outer canthus sits higher than the inner; a positive palpebral tilt.",
		knobs: {
			eyeTilt: .55,
			eyeWidth: 1.08,
			eyeHeight: .88
		}
	},
	{
		id: "eyes_downturned",
		region: "eyes",
		name: "Downturned eyes",
		term: "downturned",
		gloss: "Outer canthus drops below the inner corner.",
		knobs: {
			eyeTilt: -.55,
			eyeWidth: 1.1,
			eyeHeight: .86
		}
	},
	{
		id: "brows_arched",
		region: "brows",
		name: "Arched brows",
		term: "arched",
		gloss: "A high peak sits past the iris, then falls toward the temple.",
		knobs: {
			browArch: 1,
			browThick: .55,
			browSet: .15
		}
	},
	{
		id: "brows_straight",
		region: "brows",
		name: "Straight brows",
		term: "straight",
		gloss: "Almost no peak; the line runs level across the ridge.",
		knobs: {
			browArch: .05,
			browThick: .6,
			browSet: 0
		}
	},
	{
		id: "brows_bushy",
		region: "brows",
		name: "Bushy brows",
		term: "bushy",
		gloss: "Heavy, wide strokes that nearly meet the lid.",
		knobs: {
			browThick: 1.2,
			browArch: .35,
			browGap: .7
		}
	},
	{
		id: "brows_high_set",
		region: "brows",
		name: "High-set brows",
		term: "high-set",
		gloss: "A wide shelf of forehead sits between brow and lid.",
		knobs: {
			browSet: .85,
			browArch: .4,
			browThick: .5
		}
	},
	{
		id: "nose_aquiline",
		region: "nose",
		name: "Aquiline nose",
		term: "aquiline",
		gloss: "A convex hook in profile, like an eagle’s beak.",
		knobs: {
			noseHook: 1,
			noseLength: 1.15,
			noseBridge: .7,
			noseTip: .35
		}
	},
	{
		id: "nose_button",
		region: "nose",
		name: "Button nose",
		term: "button",
		gloss: "Short, low bridge with a small rounded tip.",
		knobs: {
			noseLength: .7,
			noseWidth: .85,
			noseHook: 0,
			noseTip: .85,
			noseBridge: .35
		}
	},
	{
		id: "nose_roman",
		region: "nose",
		name: "Roman nose",
		term: "roman",
		gloss: "A high, nearly straight bridge that projects strongly.",
		knobs: {
			noseBridge: 1,
			noseLength: 1.12,
			noseHook: .15,
			noseWidth: .82
		}
	},
	{
		id: "nose_snub",
		region: "nose",
		name: "Snub nose",
		term: "snub",
		gloss: "Short and slightly upturned at the tip.",
		knobs: {
			noseLength: .68,
			noseTip: 1,
			noseHook: -.35,
			noseWidth: .95
		}
	},
	{
		id: "nose_broad",
		region: "nose",
		name: "Broad nose",
		term: "broad",
		gloss: "Wide alae and a generous tip, read most clearly in three-quarter view.",
		knobs: {
			noseWidth: 1.28,
			noseTip: .7,
			noseBridge: .45,
			noseLength: .95
		}
	},
	{
		id: "mouth_full",
		region: "mouth",
		name: "Full lips",
		term: "full",
		gloss: "Both vermilion borders are thick, with a soft outer contour.",
		knobs: {
			lipFull: 1.15,
			lipWidth: .98,
			cupidBow: .45
		}
	},
	{
		id: "mouth_thin",
		region: "mouth",
		name: "Thin lips",
		term: "thin",
		gloss: "A narrow vermilion with little vertical volume.",
		knobs: {
			lipFull: .28,
			lipWidth: .95,
			cupidBow: .2
		}
	},
	{
		id: "mouth_wide",
		region: "mouth",
		name: "Wide mouth",
		term: "wide",
		gloss: "Commissures sit well outside the iris line.",
		knobs: {
			lipWidth: 1.28,
			lipFull: .7,
			mouthCorner: .1
		}
	},
	{
		id: "mouth_cupid",
		region: "mouth",
		name: "Cupid’s bow",
		term: "cupid’s bow",
		gloss: "A sharp double peak on the upper lip.",
		knobs: {
			cupidBow: 1,
			lipFull: .85,
			lipWidth: .92
		}
	},
	{
		id: "mouth_downturned",
		region: "mouth",
		name: "Downturned mouth",
		term: "downturned",
		gloss: "Commissures fall below the midline of the lips.",
		knobs: {
			mouthCorner: -.9,
			lipWidth: 1.02,
			lipFull: .6
		}
	},
	{
		id: "jaw_square",
		region: "jaw",
		name: "Square jaw",
		term: "square",
		gloss: "A wide bigonial width and an abrupt mandibular angle.",
		knobs: {
			jawWidth: 1.22,
			jawAngle: .2
		}
	},
	{
		id: "jaw_tapered",
		region: "jaw",
		name: "Tapered jaw",
		term: "tapered",
		gloss: "The mandible narrows cleanly toward the chin.",
		knobs: {
			jawWidth: .72,
			jawAngle: .85
		}
	},
	{
		id: "jaw_rounded",
		region: "jaw",
		name: "Rounded jaw",
		term: "rounded",
		gloss: "A soft curve with little angular break at the gonion.",
		knobs: {
			jawWidth: .95,
			jawAngle: .55
		}
	},
	{
		id: "jaw_lantern",
		region: "jaw",
		name: "Lantern jaw",
		term: "lantern",
		gloss: "A long, projecting lower third that reads in profile first.",
		knobs: {
			jawWidth: 1.05,
			jawAngle: .35,
			chinLength: 1.2
		}
	},
	{
		id: "chin_cleft",
		region: "chin",
		name: "Cleft chin",
		term: "cleft",
		gloss: "A vertical notch in the mentalis, visible from both sides.",
		knobs: {
			chinCleft: 1,
			chinPoint: .4,
			chinLength: 1.05
		}
	},
	{
		id: "chin_pointed",
		region: "chin",
		name: "Pointed chin",
		term: "pointed",
		gloss: "A sharp mental point rather than a padded pad.",
		knobs: {
			chinPoint: 1,
			chinLength: 1.1,
			chinCleft: 0
		}
	},
	{
		id: "chin_receding",
		region: "chin",
		name: "Receding chin",
		term: "receding",
		gloss: "The chin sits behind the lower lip in profile.",
		knobs: {
			chinLength: .55,
			chinPoint: .15,
			chinCleft: 0
		}
	},
	{
		id: "chin_strong",
		region: "chin",
		name: "Strong chin",
		term: "strong",
		gloss: "Broad, forward mental eminence without a sharp point.",
		knobs: {
			chinLength: 1.18,
			chinPoint: .25,
			chinCleft: .1
		}
	},
	{
		id: "cheeks_high",
		region: "cheeks",
		name: "High cheekbones",
		term: "high cheekbones",
		gloss: "Malar bones sit high and catch a hard side light.",
		knobs: {
			cheekBone: 1,
			cheekFull: .35
		}
	},
	{
		id: "cheeks_hollow",
		region: "cheeks",
		name: "Hollow cheeks",
		term: "hollow",
		gloss: "A concavity under the malar, often read as a long midface.",
		knobs: {
			cheekBone: .7,
			cheekFull: .05
		}
	},
	{
		id: "cheeks_full",
		region: "cheeks",
		name: "Full cheeks",
		term: "full",
		gloss: "Soft volume from the nasolabial fold out to the zygoma.",
		knobs: {
			cheekFull: 1,
			cheekBone: .35
		}
	},
	{
		id: "ears_prominent",
		region: "ears",
		name: "Prominent ears",
		term: "prominent",
		gloss: "The helix stands away from the skull — clearest in profile.",
		knobs: {
			earSize: 1.15,
			earFlare: 1
		}
	},
	{
		id: "ears_close",
		region: "ears",
		name: "Close-set ears",
		term: "close-set",
		gloss: "The pinna lies flat against the head.",
		knobs: {
			earSize: .9,
			earFlare: .1
		}
	},
	{
		id: "ears_large",
		region: "ears",
		name: "Large ears",
		term: "large",
		gloss: "A long pinna relative to the face, even when pinned back.",
		knobs: {
			earSize: 1.35,
			earFlare: .45
		}
	},
	{
		id: "hairline_widow",
		region: "hairline",
		name: "Widow’s peak",
		term: "widow’s peak",
		gloss: "A V-shaped descent at the midline of the hairline.",
		knobs: {
			widowPeak: 1,
			hairlineHeight: .55,
			recede: .15
		}
	},
	{
		id: "hairline_receding",
		region: "hairline",
		name: "Receding hairline",
		term: "receding",
		gloss: "Temples pull back, leaving a high, often M-shaped front.",
		knobs: {
			recede: 1,
			hairlineHeight: .85,
			widowPeak: .1
		}
	},
	{
		id: "hairline_low",
		region: "hairline",
		name: "Low hairline",
		term: "low",
		gloss: "Hair meets the brow shelf with little forehead showing.",
		knobs: {
			hairlineHeight: .2,
			recede: 0,
			widowPeak: .05
		}
	},
	{
		id: "forehead_high",
		region: "forehead",
		name: "High forehead",
		term: "high",
		gloss: "A tall frontal rise from brow to hairline.",
		knobs: {
			foreheadHeight: 1,
			hairlineHeight: .9
		}
	},
	{
		id: "forehead_low",
		region: "forehead",
		name: "Low forehead",
		term: "low",
		gloss: "A short vertical span between brow and hair.",
		knobs: {
			foreheadHeight: .2,
			hairlineHeight: .25
		}
	},
	{
		id: "forehead_broad",
		region: "forehead",
		name: "Broad forehead",
		term: "broad",
		gloss: "Wide frontal bone; the temples do not pinch.",
		knobs: {
			foreheadHeight: .7,
			jawWidth: 1.08,
			recede: .2
		}
	}
];
function featureById(id) {
	return FEATURES.find((f) => f.id === id);
}
function featuresInRegion(region) {
	return FEATURES.filter((f) => f.region === region);
}
var BOX_INTERVAL_MS = [
	0,
	0,
	45e3,
	18e4,
	72e4,
	27e5
];
function emptyDeck(now = Date.now()) {
	const cards = {};
	for (const feature of FEATURES) cards[feature.id] = {
		featureId: feature.id,
		box: 1,
		reviews: 0,
		correct: 0,
		streak: 0,
		lastResult: null,
		lastSeenAt: 0,
		dueAt: now
	};
	return cards;
}
function intervalForBox(box) {
	return BOX_INTERVAL_MS[box] ?? 0;
}
function gradeCard(card, passed, now = Date.now()) {
	if (!passed) return {
		...card,
		box: 1,
		reviews: card.reviews + 1,
		streak: 0,
		lastResult: "fail",
		lastSeenAt: now,
		dueAt: now
	};
	const box = Math.min(5, card.box + 1);
	return {
		...card,
		box,
		reviews: card.reviews + 1,
		correct: card.correct + 1,
		streak: card.streak + 1,
		lastResult: "pass",
		lastSeenAt: now,
		dueAt: now + intervalForBox(box)
	};
}
function nextDue(cards, now = Date.now(), avoidId) {
	const list = Object.values(cards).sort((a, b) => {
		const ad = a.dueAt - now;
		const bd = b.dueAt - now;
		if (ad !== bd) return ad - bd;
		if (a.box !== b.box) return a.box - b.box;
		return a.lastSeenAt - b.lastSeenAt;
	});
	const preferred = list.find((c) => c.featureId !== avoidId) ?? list[0];
	if (!preferred) throw new Error("empty deck");
	return preferred;
}
function encodeBucket(ms) {
	if (ms <= 0) return "self";
	if (ms <= 4e3) return "3s";
	if (ms <= 8e3) return "6s";
	return "12s";
}
function ratioByEncode(trials) {
	const buckets = {
		"3s": {
			n: 0,
			hits: 0,
			ms: 0
		},
		"6s": {
			n: 0,
			hits: 0,
			ms: 0
		},
		"12s": {
			n: 0,
			hits: 0,
			ms: 0
		},
		self: {
			n: 0,
			hits: 0,
			ms: 0
		}
	};
	for (const trial of trials) {
		const key = encodeBucket(trial.encodeMs);
		buckets[key].n += 1;
		buckets[key].ms += Math.max(trial.encodeMs, 1);
		if (trial.correct) buckets[key].hits += 1;
	}
	return Object.keys(buckets).map((key) => {
		const b = buckets[key];
		return {
			key,
			n: b.n,
			recall: b.n ? b.hits / b.n : 0,
			seconds: b.n ? b.ms / b.n / 1e3 : 0,
			ratio: b.ms > 0 ? b.hits / (b.ms / 1e3) : 0
		};
	});
}
var ENCODE_OPTIONS = [
	{
		value: 3e3,
		label: "3 s",
		hint: "brief glance"
	},
	{
		value: 6e3,
		label: "6 s",
		hint: "one clean look"
	},
	{
		value: 12e3,
		label: "12 s",
		hint: "study the line"
	},
	{
		value: 0,
		label: "Self",
		hint: "you decide"
	}
];
var useTrainer = create()(persist((set, get) => ({
	cards: emptyDeck(),
	trials: [],
	encodeMs: 6e3,
	sessionStartedAt: Date.now(),
	setEncodeMs: (encodeMs) => set({ encodeMs }),
	recordTrial: (featureId, correct, encodeMs, latencyMs) => {
		const now = Date.now();
		const cards = { ...get().cards };
		cards[featureId] = gradeCard(cards[featureId] ?? emptyDeck()[featureId], correct, now);
		const trial = {
			at: now,
			featureId,
			encodeMs,
			correct,
			latencyMs
		};
		set({
			cards,
			trials: [...get().trials, trial].slice(-400)
		});
	},
	resetProgress: () => set({
		cards: emptyDeck(),
		trials: [],
		sessionStartedAt: Date.now()
	}),
	peekDue: (avoidId) => nextDue(get().cards, Date.now(), avoidId)
}), {
	name: "lineament-trainer",
	skipHydration: true
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var styles = {
	primary: "bg-primary text-primary-fg hover:bg-accent disabled:opacity-40",
	ghost: "border border-border bg-surface text-fg hover:bg-raised disabled:opacity-40",
	quiet: "bg-transparent text-muted hover:text-fg hover:bg-raised disabled:opacity-40",
	danger: "bg-bad/20 text-bad hover:bg-bad/30 disabled:opacity-40"
};
var Button = (0, import_react.forwardRef)(function Button({ className, variant = "primary", type = "button", ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-4 text-sm font-medium tracking-wide transition-colors duration-150", styles[variant], className),
		...props
	});
});
var REGION_MASK = {
	forehead: "linear-gradient(to bottom, #000 0%, #000 38%, transparent 48%)",
	hairline: "linear-gradient(to bottom, #000 0%, #000 36%, transparent 46%)",
	brows: "linear-gradient(to bottom, transparent 22%, #000 30%, #000 48%, transparent 56%)",
	eyes: "linear-gradient(to bottom, transparent 28%, #000 34%, #000 54%, transparent 62%)",
	ears: "linear-gradient(to right, #000 0%, #000 22%, transparent 32%, transparent 68%, #000 78%, #000 100%)",
	cheeks: "linear-gradient(to bottom, transparent 38%, #000 46%, #000 70%, transparent 80%)",
	nose: "linear-gradient(to bottom, transparent 34%, #000 42%, #000 68%, transparent 76%)",
	mouth: "linear-gradient(to bottom, transparent 54%, #000 60%, #000 78%, transparent 86%)",
	jaw: "linear-gradient(to bottom, transparent 62%, #000 70%, #000 96%, transparent 100%)",
	chin: "linear-gradient(to bottom, transparent 66%, #000 74%, #000 96%, transparent 100%)"
};
function FaceLine({ feature, blurOthers, label, showLabel }) {
	const src = `/faces/${feature.id}.jpg`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "relative overflow-hidden rounded-md border border-border bg-raised",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					width: 1792,
					height: 1008,
					className: `block h-auto w-full ${blurOthers ? "scale-[1.01] blur-[2.4px]" : ""}`
				}),
				blurOthers ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					width: 1792,
					height: 1008,
					className: "pointer-events-none absolute inset-0 h-full w-full object-cover",
					style: {
						WebkitMaskImage: REGION_MASK[feature.region],
						maskImage: REGION_MASK[feature.region]
					}
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-3 pb-2 font-mono text-[10px] tracking-wide text-fg/80 uppercase sm:text-[11px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "looks left" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "looks right" })]
				})
			]
		}), showLabel && label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-center font-display text-[1.65rem] leading-tight tracking-tight text-accent italic sm:text-[2rem]",
			children: label
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-center font-display text-[1.65rem] leading-tight tracking-tight text-subtle italic sm:text-[2rem]",
			children: "name the shared feature"
		})]
	});
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return function next() {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function pick(rng, list) {
	return list[Math.floor(rng() * list.length)];
}
function distractors(feature, seed, n = 3) {
	const rng = mulberry32(seed + 901);
	const pool = FEATURES.filter((f) => f.id !== feature.id);
	const same = pool.filter((f) => f.region === feature.region);
	const other = pool.filter((f) => f.region !== feature.region);
	const picks = [];
	const take = (list) => {
		const remain = list.filter((f) => !picks.some((p) => p.id === f.id));
		if (remain.length) picks.push(pick(rng, remain));
	};
	take(same);
	take(same);
	while (picks.length < n) take(other.length ? other : pool);
	return picks.slice(0, n);
}
function DrillStage({ feature, encodeMs, onDone }) {
	const seed = (0, import_react.useMemo)(() => hashSeed(feature.id), [feature.id]);
	const choices = (0, import_react.useMemo)(() => {
		return [feature, ...distractors(feature, seed, 3)].map((item, i) => ({
			item,
			o: (seed + i * 17) % 97
		})).sort((a, b) => a.o - b.o).map((row) => row.item);
	}, [feature, seed]);
	const [phase, setPhase] = (0, import_react.useState)("encode");
	const [picked, setPicked] = (0, import_react.useState)(null);
	const started = (0, import_react.useRef)(Date.now());
	const encodedFor = (0, import_react.useRef)(0);
	const probeAt = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		started.current = Date.now();
		if (encodeMs <= 0) return;
		const t = window.setTimeout(() => {
			encodedFor.current = encodeMs;
			probeAt.current = Date.now();
			setPhase("probe");
		}, encodeMs);
		return () => window.clearTimeout(t);
	}, [encodeMs, feature.id]);
	const reveal = () => {
		encodedFor.current = Date.now() - started.current;
		probeAt.current = Date.now();
		setPhase("probe");
	};
	const answer = (id) => {
		if (phase !== "probe") return;
		setPicked(id);
		setPhase("feedback");
	};
	const correct = picked === feature.id;
	const remain = encodeMs > 0 && phase === "encode" ? Math.max(0, encodeMs - (typeof window === "undefined" ? 0 : 0)) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceLine, {
				feature,
				blurOthers: true,
				label: feature.name,
				showLabel: phase !== "probe"
			}),
			phase === "encode" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col items-center gap-3",
				children: [
					encodeMs === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: reveal,
						children: "Hide the name"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncodeBar, { ms: encodeMs }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: "Look at the sharp region only. The printed name appears once."
					}),
					remain ? null : null
				]
			}) : null,
			phase !== "encode" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-5 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2",
				children: choices.map((choice) => {
					const state = phase === "feedback" ? choice.id === feature.id ? "ok" : choice.id === picked ? "bad" : "idle" : "idle";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: phase !== "probe",
						onClick: () => answer(choice.id),
						className: `min-h-12 rounded-md border px-3 text-left text-sm ${state === "ok" ? "border-ok bg-ok/15 text-fg" : state === "bad" ? "border-bad bg-bad/15 text-fg" : "border-border bg-raised text-fg hover:border-primary"}`,
						children: choice.name
					}, choice.id);
				})
			}) : null,
			phase === "feedback" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						correct ? "Held." : `It was ${feature.name.toLowerCase()}.`,
						" ",
						feature.gloss
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => onDone(correct, encodedFor.current, Date.now() - probeAt.current),
					children: "Next line"
				})]
			}) : null
		]
	});
}
function hashSeed(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return h >>> 0;
}
function EncodeBar({ ms }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-1 w-48 overflow-hidden rounded-full bg-raised",
		role: "progressbar",
		"aria-label": "Encoding time",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-primary",
			style: {
				width: "100%",
				transformOrigin: "left",
				animation: `lineament-drain ${ms}ms linear forwards`
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes lineament-drain { from { transform: scaleX(1) } to { transform: scaleX(0) } }` })]
	});
}
function TrainerApp() {
	const [tab, setTab] = (0, import_react.useState)("drill");
	(0, import_react.useEffect)(() => {
		useTrainer.persist.rehydrate();
	}, []);
	const trials = useTrainer((s) => s.trials);
	const cards = useTrainer((s) => s.cards);
	const dueCount = Object.values(cards).filter((c) => c.dueAt <= Date.now()).length;
	const hits = trials.filter((t) => t.correct).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tracking-[0.22em] text-subtle uppercase",
						children: "feature isolation · left / right · retrieval"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl tracking-tight text-fg italic sm:text-5xl",
						children: "Lineament"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
						children: "One shared trait across a line of faces. Everything else goes soft. Name it, then retrieve it after the label drops."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-3 gap-3 font-mono text-[11px] tracking-wide text-subtle uppercase",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "due",
							v: String(dueCount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "trials",
							v: String(trials.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "recall",
							v: trials.length ? `${Math.round(hits / trials.length * 100)}%` : "—"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-5 flex flex-wrap gap-2",
				"aria-label": "Sections",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						id: "drill",
						tab,
						setTab,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "size-4" }),
						children: "Drill"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						id: "atlas",
						tab,
						setTab,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }),
						children: "Atlas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						id: "ratio",
						tab,
						setTab,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "size-4" }),
						children: "Time / recall"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mt-6 flex-1",
				children: [
					tab === "drill" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrillPanel, {}) : null,
					tab === "atlas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtlasPanel, {}) : null,
					tab === "ratio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatioPanel, {}) : null
				]
			})
		]
	});
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-16 rounded-md border border-border bg-surface px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-sans text-lg font-medium tracking-normal text-fg normal-case",
			children: v
		})]
	});
}
function TabBtn({ id, tab, setTab, icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setTab(id),
		className: `inline-flex min-h-11 items-center gap-2 rounded-sm border px-3 text-sm ${tab === id ? "border-primary bg-raised text-fg" : "border-border bg-surface text-muted"}`,
		children: [icon, children]
	});
}
function DrillPanel() {
	const encodeMs = useTrainer((s) => s.encodeMs);
	const setEncodeMs = useTrainer((s) => s.setEncodeMs);
	const peekDue = useTrainer((s) => s.peekDue);
	const recordTrial = useTrainer((s) => s.recordTrial);
	const resetProgress = useTrainer((s) => s.resetProgress);
	const [regionLock, setRegionLock] = (0, import_react.useState)("all");
	const [round, setRound] = (0, import_react.useState)(0);
	const [lastId, setLastId] = (0, import_react.useState)();
	const [live, setLive] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setLive(true), []);
	const feature = (0, import_react.useMemo)(() => {
		if (!live) return FEATURES[0];
		if (regionLock === "all") return featureById(peekDue(lastId).featureId) ?? FEATURES[0];
		const pool = featuresInRegion(regionLock);
		return pool[round % pool.length];
	}, [
		round,
		regionLock,
		lastId
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-border bg-surface p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "sr-only",
						htmlFor: "region",
						children: "Region"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "region",
						value: regionLock,
						onChange: (e) => {
							setRegionLock(e.target.value);
							setRound((n) => n + 1);
						},
						className: "min-h-11 rounded-sm border border-border bg-raised px-3 text-sm text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Due mix (Leitner)"
						}), REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: r.id,
							children: [r.label, " only"]
						}, r.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					role: "group",
					"aria-label": "Encode time",
					children: ENCODE_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setEncodeMs(opt.value),
						className: `min-h-11 rounded-sm px-3 text-sm ${encodeMs === opt.value ? "bg-primary text-primary-fg" : "bg-raised text-muted"}`,
						children: opt.label
					}, opt.value))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Surrounding features stay slightly blurred so the shared trait is the only sharp signal. Profiles look left, then right."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrillStage, {
				feature,
				encodeMs,
				onDone: (correct, spent, latency) => {
					recordTrial(feature.id, correct, spent, latency);
					setLastId(feature.id);
					setRound((n) => n + 1);
				}
			}, `${feature.id}-${round}`),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "quiet",
					onClick: () => resetProgress(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Reset deck"]
				})
			})
		]
	});
}
function AtlasPanel() {
	const [open, setOpen] = (0, import_react.useState)(FEATURES[0]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 lg:grid-cols-[240px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-lg border border-border bg-surface p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-2 pb-2 font-mono text-[11px] tracking-wide text-subtle uppercase",
				children: [FEATURES.length, " terms"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[70vh] space-y-4 overflow-y-auto pr-1",
				children: REGIONS.map((region) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 text-xs font-medium text-muted",
					children: region.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1",
					children: featuresInRegion(region.id).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setOpen(f),
						className: `flex min-h-10 w-full items-center rounded-sm px-2 text-left text-sm ${open.id === f.id ? "bg-raised text-fg" : "text-muted hover:text-fg"}`,
						children: f.name
					}) }, f.id))
				})] }, region.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-border bg-surface p-4 sm:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceLine, {
				feature: open,
				blurOthers: true,
				label: open.name,
				showLabel: true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-muted",
				children: open.gloss
			})]
		})]
	});
}
function RatioPanel() {
	const trials = useTrainer((s) => s.trials);
	const cards = useTrainer((s) => s.cards);
	const rows = ratioByEncode(trials);
	const weakest = Object.values(cards).filter((c) => c.reviews > 0).sort((a, b) => a.correct / Math.max(1, a.reviews) - b.correct / Math.max(1, b.reviews)).slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl italic",
						children: "Seeing time vs. recall"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
						children: "Massed staring feels fluent and fades. Brief encoding plus retrieval usually buys more names per minute. Change the encode preset on Drill and watch this table fill — the ratio is hits per second of looking."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[28rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "font-mono text-[11px] tracking-wide text-subtle uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "Encode"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "Trials"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "Recall"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "Avg look"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "Hits / sec"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 font-medium",
										children: row.key
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 tabular-nums",
										children: row.n
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 tabular-nums",
										children: row.n ? `${Math.round(row.recall * 100)}%` : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 tabular-nums",
										children: row.n ? `${row.seconds.toFixed(1)}s` : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 tabular-nums",
										children: row.n ? row.ratio.toFixed(2) : "—"
									})
								]
							}, row.key)) })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl italic",
						children: "Weak boxes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Failed names drop to box 1 and return immediately. That is the Leitner spend: time goes to what you cannot yet retrieve."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 grid gap-2 sm:grid-cols-2",
						children: weakest.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-subtle",
							children: "No graded cards yet."
						}) : weakest.map((c) => {
							const f = featureById(c.featureId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between rounded-md border border-border bg-raised px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f?.name ?? c.featureId }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[11px] text-subtle",
									children: [
										"box ",
										c.box,
										" · ",
										c.correct,
										"/",
										c.reviews
									]
								})]
							}, c.featureId);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MethodNotes, {})
		]
	});
}
function MethodNotes() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "rounded-lg border border-border bg-surface p-5 text-sm leading-relaxed text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl text-fg italic",
			children: "How the line is built"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-3 space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: "Isolation."
				}), " One trait is held constant; other knobs vary and are slightly blurred so the name attaches to the right contour."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: "Viewpoint."
				}), " Left and right three-quarter profiles stop the name from locking to a single silhouette."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: "Retrieval."
				}), " The label is printed once, then removed. A four-choice probe is harder than rereading, and that difficulty is the point."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: "Spacing."
				}), " Correct answers move out in time; misses return now. Cramming the same card is cheaper in the minute and worse tomorrow."] })
			]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainerApp, {});
}
//#endregion
export { Home as component };
