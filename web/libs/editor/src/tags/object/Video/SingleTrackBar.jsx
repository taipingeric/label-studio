import { observer } from "mobx-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "../../../utils/bem";
import { singleTrackStats } from "./singleTrack";
import "./SingleTrackBar.scss";

const frameFromEvent = (e, el, length) => {
  const rect = el.getBoundingClientRect();
  const frame = Math.round(((e.clientX - rect.left) / rect.width) * length);

  return Math.min(length, Math.max(1, frame));
};

/**
 * Whole-video overview of timeline spans for <TimelineLabels singleTrack="true">:
 * one colored segment per span, hatched gaps, the current frame, click to seek,
 * and coverage / gap / overlap counts.
 */
export const SingleTrackBar = observer(({ item, length, position, onSeek }) => {
  const barRef = useRef();
  const [hover, setHover] = useState(null);
  const { segments, covered, gaps, overlaps } = singleTrackStats(item, length);
  const block = cn("single-track");

  const handleClick = useCallback(
    (e) => {
      if (!length) return;
      onSeek(frameFromEvent(e, barRef.current, length));
    },
    [length, onSeek],
  );

  const handleMove = useCallback(
    (e) => {
      if (!length) return;
      const frame = frameFromEvent(e, barRef.current, length);
      const hits = segments.filter((s) => frame >= s.start && frame <= s.end);
      const rect = barRef.current.getBoundingClientRect();

      setHover({
        x: e.clientX - rect.left,
        text: `frame ${frame}  ${hits.length ? hits.map((s) => `${s.label} [${s.start}-${s.end}]`).join(" | ") : "(unlabeled)"}`,
      });
    },
    [length, segments],
  );

  if (!length) return null;

  return (
    <div className={block.toClassName()}>
      <div className={block.elem("info").toClassName()}>
        <b>Single track</b>
        <span>covered {(covered * 100).toFixed(1)}%</span>
        <span className={block.elem("stat").mod({ bad: gaps > 0 }).toClassName()}>gaps: {gaps}</span>
        <span className={block.elem("stat").mod({ bad: overlaps > 0 }).toClassName()}>overlaps: {overlaps}</span>
      </div>
      <div
        ref={barRef}
        className={block.elem("bar").toClassName()}
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        {segments.map((s) => (
          <div
            key={s.id}
            className={block.elem("segment").toClassName()}
            style={{
              left: `${((s.start - 1) / length) * 100}%`,
              width: `max(1px, ${((s.end - s.start + 1) / length) * 100}%)`,
              background: s.color,
            }}
          />
        ))}
        <div
          className={block.elem("position").toClassName()}
          style={{ left: `${((Math.max(1, position) - 1) / length) * 100}%` }}
        />
        {hover && (
          <div className={block.elem("tooltip").toClassName()} style={{ left: hover.x }}>
            {hover.text}
          </div>
        )}
      </div>
    </div>
  );
});
