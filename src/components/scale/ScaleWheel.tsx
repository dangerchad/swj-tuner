import { NOTE_DISPLAY, getScalePCs, getKeyRoot } from '../../lib/musicTheory';

interface Props {
  keyName: string;     // e.g. "C major"
  chroma: number[];    // 12-bin chroma vector
}

const CX = 150;
const CY = 150;
const OUTER_R = 118;
const INNER_R = 58;
const LABEL_R = (OUTER_R + INNER_R) / 2;
const GAP_DEG = 2.5;
const TOTAL = 300;

function toRad(deg: number) { return (deg * Math.PI) / 180; }

function polarXY(angleDeg: number, r: number) {
  const rad = toRad(angleDeg);
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// Arc path for a donut segment: pitch class i (C=0 at top, clockwise)
function segPath(i: number, gap = GAP_DEG): string {
  const startDeg = -90 + i * 30 + gap;
  const endDeg   = -90 + (i + 1) * 30 - gap;
  const o1 = polarXY(startDeg, OUTER_R);
  const o2 = polarXY(endDeg,   OUTER_R);
  const i1 = polarXY(startDeg, INNER_R);
  const i2 = polarXY(endDeg,   INNER_R);
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${OUTER_R} ${OUTER_R} 0 0 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    `A ${INNER_R} ${INNER_R} 0 0 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

export default function ScaleWheel({ keyName, chroma }: Props) {
  const scalePCs = getScalePCs(keyName);
  const keyRoot  = getKeyRoot(keyName);
  const isMinor  = keyName.includes('minor');

  // Normalise chroma for display
  const chromaMax = Math.max(...chroma, 0.01);
  const normChroma = chroma.map((v) => v / chromaMax);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={TOTAL}
        height={TOTAL}
        viewBox={`0 0 ${TOTAL} ${TOTAL}`}
        className="w-full max-w-xs"
        style={{ maxWidth: '280px' }}
      >
        {/* Centre label */}
        <text
          x={CX} y={CY - 8}
          textAnchor="middle"
          fontSize={13}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="700"
          fill="var(--color-text-1)"
        >
          {keyName ? keyName.split(' ')[0] : '—'}
        </text>
        <text
          x={CX} y={CY + 10}
          textAnchor="middle"
          fontSize={10}
          fontFamily="'DM Sans', sans-serif"
          fill="var(--color-text-3)"
        >
          {keyName ? (isMinor ? 'minor' : 'major') : 'key'}
        </text>

        {NOTE_DISPLAY.map((_, pc) => {
          const inScale  = scalePCs.includes(pc);
          const isRoot   = pc === keyRoot;
          const activity = normChroma[pc];        // 0-1
          const isActive = activity > 0.28;

          // Segment fill
          let fill: string;
          if (isActive && isRoot)    fill = 'var(--color-accent)';
          else if (isActive)         fill = 'var(--color-purple)';
          else if (isRoot)           fill = 'rgba(74,222,128,0.45)';
          else if (inScale)          fill = 'var(--color-surface-3)';
          else                       fill = 'var(--color-surface-2)';

          // Stroke
          const stroke = isRoot
            ? 'var(--color-accent)'
            : inScale
            ? 'var(--color-border-strong)'
            : 'var(--color-border)';

          const midDeg = -90 + pc * 30 + 15;
          const lp = polarXY(midDeg, LABEL_R);

          // Outer glow ring for active notes
          const glowR = OUTER_R + 6;
          const g1 = polarXY(-90 + pc * 30 + GAP_DEG, glowR);
          const g2 = polarXY(-90 + (pc + 1) * 30 - GAP_DEG, glowR);
          const glowPath = [
            `M ${g1.x.toFixed(2)} ${g1.y.toFixed(2)}`,
            `A ${glowR} ${glowR} 0 0 1 ${g2.x.toFixed(2)} ${g2.y.toFixed(2)}`,
          ].join(' ');

          return (
            <g key={pc}>
              {/* Active outer arc glow */}
              {isActive && (
                <path
                  d={glowPath}
                  fill="none"
                  stroke={isRoot ? 'var(--color-accent-glow)' : 'rgba(167,139,250,0.5)'}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              )}

              {/* Main segment */}
              <path
                d={segPath(pc)}
                fill={fill}
                stroke={stroke}
                strokeWidth={0.75}
                style={
                  isActive
                    ? { filter: isRoot ? 'drop-shadow(0 0 6px rgba(74,222,128,0.6))' : 'none' }
                    : undefined
                }
              />

              {/* Scale-degree tick on inner circle */}
              {inScale && !isActive && (
                <circle
                  cx={polarXY(midDeg, INNER_R + 6).x}
                  cy={polarXY(midDeg, INNER_R + 6).y}
                  r={2}
                  fill="var(--color-text-3)"
                />
              )}

              {/* Note label */}
              <text
                x={lp.x.toFixed(2)}
                y={(lp.y + 4).toFixed(2)}
                textAnchor="middle"
                fontSize={inScale || isActive ? 11 : 9}
                fontWeight={isRoot || isActive ? '700' : '400'}
                fontFamily="'JetBrains Mono', monospace"
                fill={
                  isActive && isRoot ? '#0A0A0C'
                  : isActive          ? 'var(--color-text-1)'
                  : isRoot            ? 'var(--color-accent)'
                  : inScale           ? 'var(--color-text-2)'
                  :                     'var(--color-text-3)'
                }
              >
                {NOTE_DISPLAY[pc]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
