import { StageDialogue } from "../dialogue";
import { stage1Dialogue } from "./stage1-immigration";
import { stage2Dialogue } from "./stage2-convenience";
import { stage3Dialogue } from "./stage3-izakaya";
import { stage4Dialogue } from "./stage4-directions";
import { stage5Dialogue } from "./stage5-hospital";

export const dialogueMap: Record<number, StageDialogue> = {
  1: stage1Dialogue,
  2: stage2Dialogue,
  3: stage3Dialogue,
  4: stage4Dialogue,
  5: stage5Dialogue,
};
