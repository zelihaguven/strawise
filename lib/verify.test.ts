import { describe, expect, it } from "vitest";
import { crossCheck, findStandards, parseVerifyResult } from "@/lib/verify";

describe("findStandards", () => {
  it("detects compostability schemes regardless of spacing and case", () => {
    const text = "Tested to EN13432 and astm d 6400. Certified OK compost HOME by TÜV AUSTRIA.";
    expect(findStandards(text)).toEqual(expect.arrayContaining(["EN 13432", "ASTM D6400", "OK compost HOME"]));
  });

  it("does not report OK compost INDUSTRIAL when only HOME is present", () => {
    expect(findStandards("OK compost HOME S1234")).not.toContain("OK compost INDUSTRIAL");
  });
});

describe("crossCheck", () => {
  it("flags standards the model reported that are absent from the document", () => {
    const checks = crossCheck(["EN 13432", "OK biodegradable MARINE"], "Conforms to EN 13432:2000.");
    expect(checks).toEqual([
      { standart: "EN 13432", metindeBulundu: true },
      { standart: "OK biodegradable MARINE", metindeBulundu: false },
    ]);
  });
});

describe("parseVerifyResult", () => {
  const valid = {
    iddia: "x",
    belgedeki_standartlar: [],
    sertifika_no_veya_kurum: "Belgede yok",
    uyum: "kısmen",
    gerekce: "y",
    eksik_bilgiler: ["z"],
  };

  it("accepts a well-formed result", () => {
    expect(parseVerifyResult(valid).uyum).toBe("kısmen");
  });

  it("rejects an unknown verdict", () => {
    expect(() => parseVerifyResult({ ...valid, uyum: "evet" })).toThrow();
  });
});
