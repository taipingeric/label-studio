import { resolveTimelineOverlaps, singleTrackStats } from "../singleTrack";

jest.mock("mobx-state-tree", () => ({
  ...jest.requireActual("mobx-state-tree"),
  // regions in these tests are plain objects; removed ones are dropped from annotation.regions
  isAlive: (node) => !node.deleted,
}));

/** minimal stand-in for a Video tag with an annotation holding timeline regions */
function setup(spans) {
  const video = { timelineControl: { valueType: "timelinelabels" } };
  let nextId = 1;
  const makeRegion = (start, end, label) => {
    const region = {
      id: `r${nextId++}`,
      type: "timelineregion",
      object: video,
      labelName: label,
      ranges: [{ start, end }],
      setRange([s, e]) {
        region.ranges = [{ start: s, end: e }];
      },
      deleteRegion() {
        region.deleted = true;
        annotation.regions = annotation.regions.filter((r) => r !== region);
      },
    };
    return region;
  };
  const annotation = {
    regions: [],
    createResult(value, labeling) {
      const { start, end } = value.ranges[0];
      const region = makeRegion(start, end, labeling.timelinelabels[0]);

      annotation.regions.push(region);
      return region;
    },
  };

  video.annotation = annotation;
  annotation.regions = spans.map(([s, e, l]) => makeRegion(s, e, l));

  const dump = () =>
    annotation.regions
      .map((r) => [r.ranges[0].start, r.ranges[0].end, r.labelName])
      .sort((a, b) => a[0] - b[0]);

  return { video, annotation, dump, regions: annotation.regions };
}

describe("single-track overlap resolution", () => {
  it("trims a partially overlapped span", () => {
    const { video, regions, dump } = setup([
      [1, 50, "A"],
      [40, 60, "B"],
    ]);

    expect(resolveTimelineOverlaps(video, regions[1])).toBe(true);
    expect(dump()).toEqual([
      [1, 39, "A"],
      [40, 60, "B"],
    ]);
  });

  it("trims the start of a span that begins inside the winner", () => {
    const { video, regions, dump } = setup([
      [30, 80, "A"],
      [10, 40, "B"],
    ]);

    resolveTimelineOverlaps(video, regions[1]);
    expect(dump()).toEqual([
      [10, 40, "B"],
      [41, 80, "A"],
    ]);
  });

  it("deletes a fully covered span", () => {
    const { video, regions, dump } = setup([
      [20, 30, "A"],
      [10, 40, "B"],
    ]);

    resolveTimelineOverlaps(video, regions[1]);
    expect(dump()).toEqual([[10, 40, "B"]]);
  });

  it("splits a span when the winner is drawn inside it", () => {
    const { video, regions, dump } = setup([
      [1, 95, "Capsulorhexis"],
      [15, 30, "Phaco"],
    ]);

    resolveTimelineOverlaps(video, regions[1]);
    expect(dump()).toEqual([
      [1, 14, "Capsulorhexis"],
      [15, 30, "Phaco"],
      [31, 95, "Capsulorhexis"],
    ]);
  });

  it("merges touching and overlapping spans of the same label", () => {
    const { video, regions, dump } = setup([
      [1, 10, "A"],
      [11, 20, "A"],
      [18, 30, "A"],
    ]);

    resolveTimelineOverlaps(video, regions[1]);
    expect(dump()).toEqual([[1, 30, "A"]]);
  });

  it("leaves locked spans alone and reports nothing changed when spans don't overlap", () => {
    const { video, regions, dump } = setup([
      [1, 10, "A"],
      [5, 20, "B"],
      [30, 40, "C"],
    ]);

    regions[0].locked = true;
    expect(resolveTimelineOverlaps(video, regions[1])).toBe(false);
    expect(dump()).toEqual([
      [1, 10, "A"],
      [5, 20, "B"],
      [30, 40, "C"],
    ]);
  });
});

describe("single-track stats", () => {
  it("counts coverage, gaps and overlaps", () => {
    const { video } = setup([
      [1, 10, "A"],
      [5, 20, "B"],
      [31, 40, "C"],
    ]);
    const stats = singleTrackStats(video, 50);

    expect(stats.overlaps).toBe(1);
    // frames 21-30 and 41-50 are unlabeled
    expect(stats.gaps).toBe(2);
    expect(stats.covered).toBeCloseTo(30 / 50);
    expect(stats.segments.map((s) => s.label)).toEqual(["A", "B", "C"]);
  });

  it("reports full coverage without gaps", () => {
    const { video } = setup([
      [1, 25, "A"],
      [26, 50, "B"],
    ]);
    const stats = singleTrackStats(video, 50);

    expect(stats).toMatchObject({ covered: 1, gaps: 0, overlaps: 0 });
  });
});
