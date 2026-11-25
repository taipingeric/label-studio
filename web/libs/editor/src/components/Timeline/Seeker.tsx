import { clamp } from "@humansignal/core/lib/utils/lodash-replacements";
import { type FC, type MouseEvent as ReactMouseEvent, type ReactElement, useCallback, useRef, useState } from "react";
import { cn } from "../../utils/bem";
import type { TimelineMinimapProps } from "./Types";

import "./Seeker.scss";

export interface SeekerProps {
  position: number;
  length: number;
  seekOffset: number;
  seekVisible: number;
  step: number;
  leftOffset?: number;
  /** frames per second; when set, hovering the seeker shows the frame number and time under the cursor */
  framerate?: number;
  minimap?: ReactElement<TimelineMinimapProps> | null;
  onIndicatorMove: (position: number) => void;
  onSeek: (position: number) => void;
}

export const Seeker: FC<SeekerProps> = ({
  position,
  length,
  seekOffset,
  seekVisible,
  onIndicatorMove,
  onSeek,
  minimap,
  step,
  framerate,
  ...props
}) => {
  const [hover, setHover] = useState<{ x: number; text: string } | null>(null);
  const leftOffset = (props.leftOffset ?? 150) / step;
  const rootRef = useRef<HTMLDivElement>();
  const seekerRef = useRef<HTMLDivElement>();
  const viewRef = useRef<HTMLDivElement>();

  const showIndicator = seekVisible > 0;

  // The indicator width is set wider by 1.5, to account for the pixel sizing of the position indicator width and placement
  // to align better with the viewable timeline scroll.
  const width = `${((Math.ceil(seekVisible) - Math.floor(leftOffset) + 1.5) / length) * 100}%`;
  const offsetLimit = length - (seekVisible - leftOffset);
  const windowOffset = `${(Math.min(seekOffset, offsetLimit) / length) * 100}%`;
  const seekerOffset = (position / length) * 100;

  const onIndicatorDrag = useCallback(
    (e) => {
      const indicator = viewRef.current!;
      const dimensions = rootRef.current!.getBoundingClientRect();
      const indicatorWidth = indicator.clientWidth;

      const startDrag = e.pageX;
      const startOffset = startDrag - dimensions.left - indicatorWidth / 2;
      const parentWidth = dimensions.width;
      const limit = parentWidth - indicatorWidth;

      const jump = clamp(Math.ceil(length * (startOffset / parentWidth)), 0, limit);

      onIndicatorMove?.(jump);

      const onMouseMove = (e: globalThis.MouseEvent) => {
        const newOffset = clamp(startOffset + (e.pageX - startDrag), 0, limit);
        const percent = newOffset / parentWidth;

        onIndicatorMove?.(Math.ceil(length * percent));
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [length],
  );

  const onSeekerDrag = useCallback(
    (e: globalThis.MouseEvent) => {
      const indicator = seekerRef.current!;
      const dimensions = rootRef.current!.getBoundingClientRect();
      const indicatorWidth = indicator.clientWidth;

      const startDrag = e.pageX;
      const startOffset = startDrag - dimensions.left - indicatorWidth / 2;
      const parentWidth = dimensions.width;

      const jump = (e: globalThis.MouseEvent) => {
        const limit = parentWidth - indicator.clientWidth;
        const newOffset = clamp(startOffset + (e.pageX - startDrag), 0, limit);
        const percent = newOffset / parentWidth;
        const newPosition = Math.ceil(length * percent);

        onSeek?.(newPosition);
      };

      jump(e);

      const onMouseMove = (e: globalThis.MouseEvent) => {
        jump(e);
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [length],
  );

  const onHover = useCallback(
    (e: ReactMouseEvent) => {
      if (!framerate || !rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const frame = clamp(Math.round(((e.clientX - rect.left) / rect.width) * length), 1, length);
      const seconds = Math.max(0, (frame - 1) / framerate);
      const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
      const ss = String(Math.floor(seconds % 60)).padStart(2, "0");

      setHover({ x: e.clientX - rect.left, text: `frame ${frame}  ${mm}:${ss}` });
    },
    [framerate, length],
  );

  const onDrag = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.target === viewRef.current) {
        onIndicatorDrag(e);
      } else {
        onSeekerDrag(e);
      }
    },
    [onIndicatorDrag, onSeekerDrag],
  );

  return (
    <div
      className={cn("seeker").toClassName()}
      ref={rootRef as any}
      onMouseDown={onDrag}
      onMouseMove={onHover}
      onMouseLeave={() => setHover(null)}
    >
      <div className={cn("seeker").elem("track").toClassName()} />
      {showIndicator && (
        <div
          className={cn("seeker").elem("indicator").toClassName()}
          ref={viewRef as any}
          style={{ left: windowOffset, width }}
        />
      )}
      <div
        className={cn("seeker").elem("position").toClassName()}
        ref={seekerRef as any}
        style={{ left: `${seekerOffset}%` }}
      />
      <div className={cn("seeker").elem("minimap").toClassName()}>{minimap}</div>
      {hover && (
        <div className={cn("seeker").elem("hover").toClassName()} style={{ left: hover.x }}>
          {hover.text}
        </div>
      )}
    </div>
  );
};
