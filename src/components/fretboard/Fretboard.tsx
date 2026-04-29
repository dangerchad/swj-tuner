import { noteNameToPC, getScalePCs, getKeyRoot, pcToName } from '../../lib/musicTheory';
import type { TuningPreset } from '../../data/presets';

interface Props {
  preset: TuningPreset;
  keyName: string;
  chroma: number[];
}

// Layout constants
const STRINGS      = 6;
const FRETS        = 12;
const LABEL_W      = 36;   // left margin for open-string labels
const OPEN_W       = 48;   // column width for open position
const FRET_W       = 52;   // column width per fret
const STRING_H     = 32;   // row height per string
const PAD_T        = 16;
const PAD_B        = 24;
const DOT_R        = 9;
const SMALL_DOT_R  = 7;

const MARKER_FRETS = new Set([3, 5, 7, 9, 12]);

const SVG_W = LABEL_W + OPEN_W + FRETS * FRET_W;
const SVG_H = PAD_T + (STRINGS - 1) * STRING_H + PAD_B;

// x centre of fret column (fret=0 → open position)
function fretX(fret: number) {
  if (fret === 0) return LABEL_W + OPEN_W / 2;
  return LABEL_W + OPEN_W + (fret - 1) * FRET_W + FRET_W / 2;
}

// x of fret BAR line (the vertical bar before fret `fret`)
function barX(fret: number) {
  if (fret === 0) return LABEL_W + OPEN_W; // nut
  return LABEL_W + OPEN_W + fret * FRET_W;
}

// y centre of string i (0 = lowest/thickest at top)
function stringY(i: number) {
  return PAD_T + i * STRING_H;
}

export default function Fretboard({ preset, keyName, chroma }: Props) {
  const scalePCs  = getScalePCs(keyName);
  const keyRoot   = getKeyRoot(keyName);
  const chromaMax = Math.max(...chroma, 0.01);

  // Per-string open pitch classes
  const openPCs = preset.notes.map(noteNameToPC);

  function noteAt(stringIdx: number, fret: number): number {
    return ((openPCs[stringIdx] + fret) % 12 + 12) % 12;
  }

  function dotColor(pc: number): string | null {
    const activity = chroma[pc] / chromaMax;
    if (activity > 0.28) return 'var(--color-purple)';
    if (pc === keyRoot)  return 'var(--color-accent)';
    if (scalePCs.includes(pc)) return 'var(--color-surface-3)';
    return null; // not in scale — no dot
  }

  function textColor(pc: number): string {
    const activity = chroma[pc] / chromaMax;
    if (activity > 0.28) return 'var(--color-text-1)';
    if (pc === keyRoot)  return '#0A0A0C';
    return 'var(--color-text-2)';
  }

  const markerY = PAD_T + 2.5 * STRING_H; // between strings 2 and 3

  return (
    <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
      <svg
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ display: 'block' }}
      >
        {/* ── Nut ── */}
        <rect
          x={LABEL_W + OPEN_W - 3}
          y={PAD_T - 4}
          width={4}
          height={(STRINGS - 1) * STRING_H + 8}
          rx={2}
          fill="var(--color-text-2)"
        />

        {/* ── Fret bars ── */}
        {Array.from({ length: FRETS }, (_, f) => (
          <line
            key={`fb${f}`}
            x1={barX(f + 1)} y1={PAD_T - 2}
            x2={barX(f + 1)} y2={PAD_T + (STRINGS - 1) * STRING_H + 2}
            stroke="var(--color-border-strong)"
            strokeWidth={1}
          />
        ))}

        {/* ── String lines ── */}
        {Array.from({ length: STRINGS }, (_, i) => (
          <line
            key={`sl${i}`}
            x1={LABEL_W + OPEN_W - 3} y1={stringY(i)}
            x2={SVG_W - 4}            y2={stringY(i)}
            stroke="var(--color-border-strong)"
            strokeWidth={i === 0 ? 2 : i === 1 ? 1.5 : 1}
          />
        ))}

        {/* ── Fret position markers ── */}
        {Array.from({ length: FRETS }, (_, f) => {
          const fret = f + 1;
          if (!MARKER_FRETS.has(fret)) return null;
          if (fret === 12) {
            return (
              <g key={`m${fret}`}>
                <circle cx={fretX(fret)} cy={markerY - 8} r={4} fill="var(--color-surface-3)" />
                <circle cx={fretX(fret)} cy={markerY + 8} r={4} fill="var(--color-surface-3)" />
              </g>
            );
          }
          return (
            <circle key={`m${fret}`} cx={fretX(fret)} cy={markerY} r={4} fill="var(--color-surface-3)" />
          );
        })}

        {/* ── Fret numbers ── */}
        {[3, 5, 7, 9, 12].map((fret) => (
          <text
            key={`fn${fret}`}
            x={fretX(fret)}
            y={SVG_H - 4}
            textAnchor="middle"
            fontSize={8}
            fontFamily="'JetBrains Mono', monospace"
            fill="var(--color-text-3)"
          >
            {fret}
          </text>
        ))}

        {/* ── Open string label column ── */}
        <text
          x={LABEL_W + OPEN_W / 2 - 2}
          y={PAD_T - 8}
          textAnchor="middle"
          fontSize={7}
          fontFamily="'DM Sans', sans-serif"
          fill="var(--color-text-3)"
        >
          open
        </text>

        {/* ── Notes ── */}
        {Array.from({ length: STRINGS }, (_, si) =>
          Array.from({ length: FRETS + 1 }, (_, fret) => {
            const pc    = noteAt(si, fret);
            const fill  = dotColor(pc);
            if (!fill && fret > 0) return null; // no dot for non-scale fretted notes

            const cx = fretX(fret);
            const cy = stringY(si);
            const r  = fret === 0 ? DOT_R : SMALL_DOT_R;

            if (!fill && fret === 0) {
              // Open string: always show a ring even if not in scale
              return (
                <g key={`n${si}-${fret}`}>
                  <circle cx={cx} cy={cy} r={r}
                    fill="var(--color-surface-1)"
                    stroke="var(--color-border-strong)"
                    strokeWidth={1}
                  />
                  <text
                    x={cx} y={cy + 4}
                    textAnchor="middle"
                    fontSize={8}
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="500"
                    fill="var(--color-text-3)"
                  >
                    {pcToName(pc)}
                  </text>
                </g>
              );
            }

            return (
              <g key={`n${si}-${fret}`}>
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={fill ?? 'transparent'}
                  style={
                    chroma[pc] / chromaMax > 0.28
                      ? { filter: pc === keyRoot ? 'drop-shadow(0 0 5px rgba(74,222,128,0.7))' : 'drop-shadow(0 0 4px rgba(167,139,250,0.6))' }
                      : undefined
                  }
                />
                <text
                  x={cx} y={cy + 3.5}
                  textAnchor="middle"
                  fontSize={fret === 0 ? 8 : 7}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight={pc === keyRoot ? '700' : '400'}
                  fill={textColor(pc)}
                >
                  {pcToName(pc)}
                </text>
              </g>
            );
          })
        )}

        {/* ── String name labels (far left) ── */}
        {preset.notes.map((note, i) => (
          <text
            key={`sn${i}`}
            x={LABEL_W - 4}
            y={stringY(i) + 4}
            textAnchor="end"
            fontSize={9}
            fontFamily="'JetBrains Mono', monospace"
            fill="var(--color-text-3)"
          >
            {note.replace(/\d/, '')}
          </text>
        ))}
      </svg>
    </div>
  );
}
