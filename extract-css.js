require("./dist/App");
const { readFileSync, writeFileSync } = require("fs");
const { getStyles } = require("typestyle");
const posthtml = require("posthtml");

const css = getStyles();
const html = readFileSync("dist/index.html", "utf-8");
const result = posthtml()
  .use(tree => {
    tree.match({ tag: "head" }, node => {
      return {
        ...node,
        content: [
          ...node.content,
          {
            tag: "style",
            attrs: {
              id: "typestyle",
            },
            content: css,
          },
        ],
      };
    });
    return tree;
  })
  .process(html, { sync: true }).html;

writeFileSync("dist/index.html", result, "utf-8");
console.log("css extracted");
