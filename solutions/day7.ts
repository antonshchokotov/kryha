import { day7 as input } from "../test-data.js";

const { diskSize, updateSize, string: inputString } = input;

const LINE_REGEX =
  /^((\$ (?<command>cd|ls))|(?<folderName>dir)|(?<fileSize>\d+)) *(?<value>.*)$/;

type TFolder = {
  path: string;
  size: number;
  folders: { [key: string]: TFolder };
};

type TFolderSizeMap = {
  [key: string]: number;
};

let tree: TFolder = { path: "/", size: 0, folders: {} };
let path: TFolder[] = [tree];

function updateTree(string: string): void {
  const outputLines = string.match(/.+$/gm);
  if (!outputLines) throw new Error(`cannot parse input string ${string}`);

  for (const rawLine of outputLines) {
    const line = rawLine.match(LINE_REGEX);
    if (!line) throw new Error(`cannot process line ${rawLine}`);

    const { fileSize, folderName, command, value } = line.groups!;

    if (fileSize) {
      increaseAllParentFoldersSizes(fileSize);
    } else if (folderName) {
      addCurrentFolderChild(value);
    } else if (command === "cd") {
      processCommandCd(value);
    } else if (command === "ls") {
      processCommandLs();
    }
  }
}

function increaseAllParentFoldersSizes(sizeStr: string): void {
  const size = Number(sizeStr);
  path.forEach((folder) => (folder.size = folder.size + size));
}

function addCurrentFolderChild(name: string): void {
  path.at(-1)!.folders[name] = {
    path: `${path.at(-1)!.path}${name}/`,
    size: 0,
    folders: {},
  };
}

function processCommandCd(value: string): void {
  if (value === "/") {
    path = [tree];
  } else if (value === "..") {
    path.pop();
  } else {
    const currentDir = path.at(-1)!;
    if (!currentDir.folders[value]) {
      throw new Error("try ls command first, to read the directory content");
    }
    path.push(currentDir.folders[value]);
  }
}

function processCommandLs(): void {
  // nothing to do
  // can be used in the next version for repeated ls command issue
}

function createFolderSizeMap(rootFolder: TFolder): TFolderSizeMap {
  const map: TFolderSizeMap = {};
  let foldersToProcess: TFolder[] = [rootFolder];

  while (foldersToProcess.length) {
    const currentFolder = foldersToProcess.pop()!;
    map[currentFolder.path] = currentFolder.size;

    const subFolders = Object.values(currentFolder.folders);
    if (subFolders.length) foldersToProcess.push(...subFolders);
  }

  return map;
}

function getTotalSizeOfFoldersUnder100k(folderSizeMap: TFolderSizeMap): number {
  return Object.values(folderSizeMap).reduce((acc, size) => {
    return size <= 100000 ? (acc += size) : acc;
  }, 0);
}

function findSizeOfFolderToDelete(folderSizeMap: TFolderSizeMap): number {
  const treeSize = tree.size;
  const minSizeToFree = treeSize - (diskSize - updateSize);

  if (minSizeToFree <= 0) return 0;

  let deleteCandidateSize = treeSize;

  for (const size of Object.values(folderSizeMap)) {
    if (size < deleteCandidateSize && size >= minSizeToFree) {
      deleteCandidateSize = size;
    }
  }

  return deleteCandidateSize;
}

updateTree(inputString);
const folderSizeMap = createFolderSizeMap(tree);

const answerPart1 = getTotalSizeOfFoldersUnder100k(folderSizeMap);
const answerPart2 = findSizeOfFolderToDelete(folderSizeMap);

console.log(`day7 results: ${answerPart1} ${answerPart2}`);
