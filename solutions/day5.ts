import { day5 as input } from "../test-data.js";

type TInput = {
  stacks: string[][];
  steps: string[];
  isBulkLoad?: boolean;
  mutateOriginalStacks?: boolean;
};

function rearrangeStacks({
  stacks,
  steps,
  isBulkLoad = true,
  mutateOriginalStacks = true,
}: TInput): string[][] | null {
  try {
    const stacksCopy = stacks.map((stack) => [...stack]);

    for (const step of steps) {
      const moveCommand = step.match(/^move (\d+) from (\d+) to (\d+)$/);
      if (!moveCommand) throw new Error(`${step} command is not supported`);
      const [_, countStr, fromStr, toStr] = moveCommand;
      const [count, from, to] = [countStr, fromStr, toStr].map(Number);

      if (from > stacksCopy.length || to > stacksCopy.length) {
        throw new Error(
          `cannot move from ${from} to ${to}, stack doesn't exist`
        );
      }

      const crates = stacksCopy[from - 1].splice(-count);
      if (!isBulkLoad) crates.reverse();
      stacksCopy[to - 1].push(...crates);
    }

    if (mutateOriginalStacks) stacksCopy.forEach((el, i) => (stacks[i] = el));

    return stacksCopy;
  } catch (e: any) {
    console.log(e.message);

    return null;
  }
}

function getTopCranes(stacks: string[][]): string {
  const answer: string = stacks.map((stack) => stack.at(-1)).join("");

  return answer;
}

const stacksPart1 = rearrangeStacks({
  ...input,
  isBulkLoad: false,
  mutateOriginalStacks: false,
});
const answerPart1 = stacksPart1 && getTopCranes(stacksPart1);

const stacksPart2 = rearrangeStacks({
  ...input,
  isBulkLoad: true,
  mutateOriginalStacks: false,
});
const answerPart2 = stacksPart2 && getTopCranes(stacksPart2);

console.log(`day5 results: ${answerPart1} ${answerPart2}`);
