import { day6 as input } from "../test-data.js";

type TInput = {
  string: string;
  substringLength?: number;
};

function findIdxAfterUniqueSubstring({
  string,
  substringLength = 4,
}: TInput): number | null {
  const charIdxMap: { [key: string]: number } = {};
  let startIdx = 0;
  let currentIdx = 0;

  while (currentIdx - startIdx < substringLength) {
    if (currentIdx === string.length) return null; // substring was not found

    const char = string[currentIdx];
    const existingCharIdx = charIdxMap[char];

    if (existingCharIdx >= startIdx) startIdx = existingCharIdx + 1;

    charIdxMap[char] = currentIdx;
    currentIdx++;
  }

  return currentIdx;
}

const answerPart1 = findIdxAfterUniqueSubstring({ string: input.string });
const answerPart2 = findIdxAfterUniqueSubstring({
  string: input.string,
  substringLength: 14,
});

console.log(`day6 results: ${answerPart1} ${answerPart2}`);
