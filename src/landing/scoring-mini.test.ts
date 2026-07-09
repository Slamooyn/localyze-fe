import { describe, expect, it } from "vitest";

import {
  competitionScore,
  composite,
  decay,
  scoreLocation,
  SAMPLE_LOCATIONS,
  verdictFromScore,
} from "./scoring-mini";

describe("scoring-mini", () => {
  it("decay: closer competitor weighs more", () => {
    expect(decay(200, 600)).toBeGreaterThan(decay(2000, 600));
  });

  it("competition score drops as tau grows (more competitors count)", () => {
    const d = [300, 600, 900];
    expect(competitionScore(d, 300)).toBeGreaterThan(competitionScore(d, 1500));
  });

  it("composite blends weighted pillars minus penalty and clamps", () => {
    expect(composite(80, 40, 0.5)).toBeCloseTo(60, 5);
    expect(composite(80, 40, 0.5, 100)).toBe(0);
    expect(composite(100, 100, 0.5)).toBe(100);
  });

  it("verdict bands at boundaries", () => {
    expect(verdictFromScore(80)).toBe("prime");
    expect(verdictFromScore(79.9)).toBe("strong");
    expect(verdictFromScore(50)).toBe("conditional");
    expect(verdictFromScore(49.9)).toBe("avoid");
  });

  it("raising competition weight lowers score in a saturated location", () => {
    const tebet = SAMPLE_LOCATIONS.find((l) => l.id === "tebet")!;
    const demandHeavy = scoreLocation(tebet, { demandWeight: 0.8 });
    const competitionHeavy = scoreLocation(tebet, { demandWeight: 0.2 });
    // Tebet has high demand but is saturated → weighting competition more hurts it
    expect(competitionHeavy.composite).toBeLessThan(demandHeavy.composite);
  });
});
