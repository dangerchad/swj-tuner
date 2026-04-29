import type { ChordShape } from '../../data/chordTemplates';

interface Props {
  chord: ChordShape;
  active?: boolean;
}

const STRING_COUNT = 6;
const FRET_ROWS = 4;
const W = 60;
const H = 72;
const PAD_L = 10;
const PAD_R = 6;
const PAD_T = 18;
const PAD_B = 6;
const STR_W = (W - PAD_L - PAD_R) / (STRING_COUNT - 1);
const FRET_H = (H - PAD_T - PAD_B) / FRET_ROWS;
const DOT_R = 4.5;

function sx(i: number) { return PAD_L + i * STR_W; }
function fy(fret: number, start: number) { return PAD_T + (fret - start) * FRET_H + FRET_H / 2; }

export default function ChordDiagram({ chord, active = false }: Props) {
  const pressed = chord.frets.filter((f) => f > 0);
  const minFret = pressed.length ? Math.min(...pressed) : 1;
  const startFret = minFret <= 1 ? 1 : minFret;
  const endFret = startFret + FRET_ROWS - 1;
  const atNut = startFret === 1;

  // Group adjacent same-fret strings for barre drawing
  const barreFret = chord.barre;

  const textColor = active ? 'var(--color-accent)' : 'var(--color-text-2)';
  const nutColor = active ? 'var(--color-accent)' : 'var(--color-text-1)';
  const dotFill = active ? 'var(--color-accent)' : 'var(--color-text-1)';
  const lineColor = active ? 'rgba(74,222,128,0.25)' : 'var(--color-border-strong)';
  const stringColor = active ? 'rgba(74,222,128,0.4)' : 'var(--color-text-3)';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={W}
        height={H}
        style={{ display: 'block', overflow: 'visible' }}
        viewBox={`0 0 ${W} ${H}`}
      >
        {/* Nut */}
        {atNut && (
          <rect
            x={PAD_L}
            y={PAD_T - 3}
            width={W - PAD_L - PAD_R}
            height={3}
            rx={1}
            fill={nutColor}
          />
        )}

        {/* Strings (vertical) */}
        {Array.from({ length: STRING_COUNT }, (_, i) => (
          <line
            key={`s${i}`}
            x1={sx(i)} y1={PAD_T}
            x2={sx(i)} y2={H - PAD_B}
            stroke={stringColor}
            strokeWidth={i === 0 ? 1.5 : 1}
          />
        ))}

        {/* Fret lines (horizontal) */}
        {Array.from({ length: FRET_ROWS + 1 }, (_, i) => (
          <line
            key={`f${i}`}
            x1={PAD_L} y1={PAD_T + i * FRET_H}
            x2={W - PAD_R} y2={PAD_T + i * FRET_H}
            stroke={lineColor}
            strokeWidth={0.75}
          />
        ))}

        {/* Barre bar */}
        {barreFret !== undefined && barreFret >= startFret && barreFret <= endFret && (
          <rect
            x={PAD_L}
            y={fy(barreFret, startFret) - DOT_R}
            width={W - PAD_L - PAD_R}
            height={DOT_R * 2}
            rx={DOT_R}
            fill={dotFill}
            opacity={0.9}
          />
        )}

        {/* Individual dots */}
        {chord.frets.map((fret, i) => {
          if (fret <= 0) return null;
          if (fret < startFret || fret > endFret) return null;
          // Skip dots on barre fret (already drawn as bar)
          if (barreFret !== undefined && fret === barreFret) return null;
          return (
            <circle
              key={`d${i}`}
              cx={sx(i)}
              cy={fy(fret, startFret)}
              r={DOT_R}
              fill={dotFill}
            />
          );
        })}

        {/* Open / mute indicators above nut */}
        {chord.frets.map((fret, i) => {
          if (fret === 0) {
            return (
              <text
                key={`o${i}`}
                x={sx(i)}
                y={PAD_T - 6}
                textAnchor="middle"
                fontSize={8}
                fill={active ? 'var(--color-accent)' : 'var(--color-text-2)'}
                fontFamily="JetBrains Mono, monospace"
              >
                ○
              </text>
            );
          }
          if (fret === -1) {
            return (
              <text
                key={`x${i}`}
                x={sx(i)}
                y={PAD_T - 6}
                textAnchor="middle"
                fontSize={8}
                fill="var(--color-text-3)"
                fontFamily="JetBrains Mono, monospace"
              >
                ×
              </text>
            );
          }
          return null;
        })}

        {/* Position number when not at nut */}
        {!atNut && (
          <text
            x={PAD_L - 3}
            y={fy(startFret, startFret) + 2}
            textAnchor="end"
            fontSize={6}
            fill="var(--color-text-3)"
            fontFamily="JetBrains Mono, monospace"
          >
            {startFret}
          </text>
        )}
      </svg>

      {/* Chord name */}
      <span
        className="font-mono text-xs font-medium"
        style={{ color: textColor, fontSize: '11px' }}
      >
        {chord.name}
      </span>
    </div>
  );
}
