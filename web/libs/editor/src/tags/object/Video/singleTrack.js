import { isAlive } from "mobx-state-tree";

/**
 * Single-track mode for <TimelineLabels singleTrack="true">.
 *
 * Every frame may carry at most one timeline label (like a surgical phase bar).
 * After the user draws or edits a timeline region (the "winner"), every other
 * timeline region of the same video that overlaps it is fixed up:
 *   - same label and overlapping/adjacent -> merged into the winner
 *   - fully covered                       -> deleted
 *   - winner sits strictly inside it      -> split into a head and a tail
 *   - partially overlapping               -> trimmed at the winner's edge
 * Locked regions are left untouched (any remaining overlap shows up in the
 * single-track bar statistics).
 */

/** @returns {[number, number]} normalized [start, end] of the region's first range */
export function getRange(region) {
  const range = region.ranges[0];
  let start = range.start;
  let end = range.end;

  if (start === null || start === undefined) start = end;
  if (end === null || end === undefined) end = start;
  return start <= end ? [start, end] : [end, start];
}

export function getLabel(region) {
  try {
    return region.labelName ?? "";
  } catch {
    return "";
  }
}

export function getColor(region) {
  try {
    const label = region.labeling?.selectedLabels?.[0];

    if (label?.background) return label.background;
  } catch {
    // fall through
  }
  return region.style?.fillcolor ?? "#888";
}

/** All live timeline regions that belong to the given video tag */
export function timelineRegions(video) {
  const annotation = video?.annotation;

  if (!annotation) return [];
  return annotation.regions.filter(
    (r) => isAlive(r) && r.type === "timelineregion" && r.object === video && r.ranges?.length > 0,
  );
}

function createTail(video, source, start, end) {
  const control = video.timelineControl;

  if (!control) return;
  const label = getLabel(source);
  const labeling = { [control.valueType ?? "timelinelabels"]: label ? [label] : [] };

  video.annotation.createResult({ ranges: [{ start, end }] }, labeling, control, video, false);
}

/**
 * Remove overlaps between `winner` and the other timeline regions of `video`.
 * Must be called from inside an MST action.
 * @returns {boolean} whether anything was changed
 */
export function resolveTimelineOverlaps(video, winner) {
  if (!video || !winner || !isAlive(winner) || !winner.ranges?.length) return false;

  const opts = { skipSingleTrack: true };
  let changed = false;

  for (const other of timelineRegions(video)) {
    if (other === winner || !isAlive(winner) || other.locked) continue;

    const [ws, we] = getRange(winner);
    const [os, oe] = getRange(other);

    if (getLabel(other) === getLabel(winner) && oe >= ws - 1 && os <= we + 1) {
      // same class touching or overlapping: merge into one segment
      if (!winner.locked) {
        winner.setRange([Math.min(os, ws), Math.max(oe, we)], opts);
        other.deleteRegion();
        changed = true;
      }
      continue;
    }

    if (oe < ws || os > we) continue;

    if (os >= ws && oe <= we) {
      other.deleteRegion();
    } else if (os < ws && oe > we) {
      other.setRange([os, ws - 1], opts);
      createTail(video, other, we + 1, oe);
    } else if (os < ws) {
      other.setRange([os, ws - 1], opts);
    } else {
      other.setRange([we + 1, oe], opts);
    }
    changed = true;
  }

  return changed;
}

/**
 * Coverage statistics for the single-track bar.
 * @returns {{segments: {start:number,end:number,label:string,color:string,id:string}[], covered:number, gaps:number, overlaps:number}}
 */
export function singleTrackStats(video, length) {
  const segments = timelineRegions(video)
    .map((r) => {
      const [start, end] = getRange(r);

      return { id: r.id, start, end, label: getLabel(r), color: getColor(r) };
    })
    .sort((a, b) => a.start - b.start || a.end - b.end);

  let covered = 0;
  let gaps = 0;
  let overlaps = 0;
  let reached = 0;

  for (const seg of segments) {
    if (seg.start > reached + 1) gaps++;
    if (seg.start <= reached) overlaps++;
    covered += Math.max(0, seg.end - Math.max(seg.start, reached + 1) + 1);
    reached = Math.max(reached, seg.end);
  }
  if (length > 0 && reached < length) gaps++;

  return { segments, covered: length > 0 ? Math.min(1, covered / length) : 0, gaps, overlaps };
}
