import { useState } from 'react';
import { usePracticeStore, fmtDuration, fmtTime, logsByDate, totalSecsOnDate } from '../../state/practiceStore';
import type { PracticeLog } from '../../state/practiceStore';
import { SONG_CATALOG } from '../../data/songCatalog';

interface Props {
  date: string;
  logs: PracticeLog[];
}

const SONG_TITLES = SONG_CATALOG.map((s) => s.title);

function SessionCard({ log }: { log: PracticeLog }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(log.notes);
  const [link, setLink] = useState(log.links[0] ?? '');
  const [songInput, setSongInput] = useState('');
  const [songs, setSongs] = useState<string[]>(log.songs);
  const { updateLog, deleteLog } = usePracticeStore();

  const suggestions = songInput.length > 0
    ? SONG_TITLES.filter((t) => t.toLowerCase().includes(songInput.toLowerCase())).slice(0, 4)
    : [];

  function save() {
    updateLog(log.id, {
      notes,
      songs,
      links: link.trim() ? [link.trim()] : [],
    });
    setExpanded(false);
  }

  function addSong(title: string) {
    if (!songs.includes(title)) setSongs([...songs, title]);
    setSongInput('');
  }

  function removeSong(title: string) {
    setSongs(songs.filter((s) => s !== title));
  }

  return (
    <div
      className="rounded-xl border p-3 flex flex-col gap-2"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-1)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-accent)' }}>
            {fmtDuration(log.duration)}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>
            {fmtTime(log.startedAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs px-2 py-0.5 rounded border"
            style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-text-3)' }}
          >
            {expanded ? 'Done' : (log.notes || log.songs.length ? 'Edit' : '+ Notes')}
          </button>
          <button
            onClick={() => deleteLog(log.id)}
            className="text-xs"
            style={{ color: 'var(--color-text-3)' }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Preview when collapsed */}
      {!expanded && (log.notes || log.songs.length > 0 || log.links[0]) && (
        <div className="flex flex-col gap-1">
          {log.notes && (
            <p className="text-xs" style={{ color: 'var(--color-text-2)' }}>{log.notes}</p>
          )}
          {log.songs.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {log.songs.map((s) => (
                <span key={s} className="text-xs px-1.5 py-0.5 rounded"
                  style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-3)' }}>
                  {s}
                </span>
              ))}
            </div>
          )}
          {log.links[0] && (
            <a href={log.links[0]} target="_blank" rel="noopener noreferrer"
              className="text-xs truncate" style={{ color: 'var(--color-loosen)' }}>
              {log.links[0]}
            </a>
          )}
        </div>
      )}

      {/* Expanded editor */}
      {expanded && (
        <div className="flex flex-col gap-3 pt-1">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you work on?"
            rows={3}
            className="w-full text-sm rounded-lg p-2.5 resize-none outline-none border"
            style={{
              background: 'var(--color-surface-2)',
              borderColor: 'var(--color-border-strong)',
              color: 'var(--color-text-1)',
            }}
          />

          {/* Song picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: 'var(--color-text-3)' }}>Songs</label>
            {songs.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {songs.map((s) => (
                  <span key={s}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded border"
                    style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-text-2)' }}>
                    {s}
                    <button onClick={() => removeSong(s)} style={{ color: 'var(--color-text-3)' }}>×</button>
                  </span>
                ))}
              </div>
            )}
            <div className="relative">
              <input
                value={songInput}
                onChange={(e) => setSongInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && songInput.trim()) { addSong(songInput.trim()); } }}
                placeholder="Add a song..."
                className="w-full text-sm rounded-lg px-2.5 py-1.5 outline-none border"
                style={{
                  background: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border-strong)',
                  color: 'var(--color-text-1)',
                }}
              />
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 rounded-lg border z-10"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border-strong)' }}>
                  {suggestions.map((t) => (
                    <button key={t} onClick={() => addSong(t)}
                      className="w-full text-left text-xs px-3 py-2"
                      style={{ color: 'var(--color-text-2)' }}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Link */}
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--color-text-3)' }}>Link</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full text-sm rounded-lg px-2.5 py-1.5 outline-none border"
              style={{
                background: 'var(--color-surface-2)',
                borderColor: 'var(--color-border-strong)',
                color: 'var(--color-text-1)',
              }}
            />
          </div>

          <button
            onClick={save}
            className="self-start text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--color-accent)', color: '#0A0A0C' }}
          >
            Save notes
          </button>
        </div>
      )}
    </div>
  );
}

export default function SessionLog({ date, logs }: Props) {
  const dayLogs = logsByDate(logs, date);
  const totalSecs = totalSecsOnDate(logs, date);

  if (dayLogs.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium" style={{ color: 'var(--color-text-2)' }}>
          Today's sessions
        </p>
        <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>
          {fmtDuration(totalSecs)} total
        </span>
      </div>
      {dayLogs.map((log) => (
        <SessionCard key={log.id} log={log} />
      ))}
    </div>
  );
}
