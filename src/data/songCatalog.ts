import { SWJ_PRESETS } from './presets';
import type { TuningPreset } from './presets';

export interface SongEntry {
  title: string;
  preset: TuningPreset;
}

export const SONG_CATALOG: SongEntry[] = SWJ_PRESETS
  .flatMap((preset) => preset.songs.map((title) => ({ title, preset })))
  .sort((a, b) => a.title.localeCompare(b.title));
