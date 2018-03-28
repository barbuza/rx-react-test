// tslint:disable-next-line:no-var-requires
const deepDiff: deepDiff.IDeepDiff = require("deep-diff").default;

interface IDiffEdit {
  kind: "E";
  path: Array<string | number>;
  lhs: any;
  rhs: any;
}

interface IDiffArray {
  kind: "A";
  path: Array<string | number>;
  index: number;
  item: IDiffArray | IDiffEdit | IDiffDeleted | IDiffNew;
}

interface IDiffDeleted {
  kind: "D";
  path: Array<string | number>;
}

interface IDiffNew {
  kind: "N";
  path: Array<string | number>;
  rhs: any;
}

export function logDiffItem(item: IDiffEdit | IDiffNew | IDiffDeleted | IDiffArray): void {
  if (item.kind === "D") {
    // tslint:disable-next-line:no-console
    console.log(`➖ %c${item.path.join(".")}`, "font-weight: bold");
  } else if (item.kind === "N") {
    // tslint:disable-next-line:no-console
    console.log(`➕ %c${item.path.join(".")}`, "font-weight: bold", JSON.stringify(item.rhs));
  } else if (item.kind === "E") {
    // tslint:disable-next-line:no-console
    console.log(`✏️ %c${item.path.join(".")}`, "font-weight: bold",
                `${JSON.stringify(item.lhs)} -> ${JSON.stringify(item.rhs)}`);
  } else if (item.kind === "A") {
    const nestedPath = item.path.concat([item.index]).concat(item.item.path || []);
    logDiffItem({ ...item.item, path: nestedPath });
  } else {
    // tslint:disable-next-line:no-console
    console.warn("unknown item", item);
  }
}

export function logDiff(lhs: any, rhs: any): void {
  const items = deepDiff.diff(lhs, rhs) || [];
  for (const item of items) {
    logDiffItem(item as any);
  }
}
