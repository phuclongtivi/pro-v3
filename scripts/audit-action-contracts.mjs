import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const surface = process.env.LONG_SURFACE || (process.env.npm_package_name || "pro").split("-")[0];
const roots = ["app", "components"].map(name => path.join(root, name)).filter(fs.existsSync);

function filesAt(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return filesAt(file);
    return /\.(tsx|jsx)$/.test(entry.name) ? [file] : [];
  });
}

const controls = [];
for (const file of roots.flatMap(filesAt)) {
  const sourceText = fs.readFileSync(file, "utf8");
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      if (node.tagName.getText(source) === "button") {
        const pos = source.getLineAndCharacterOfPosition(node.getStart(source));
        const actionAttribute = node.attributes.properties.find(item =>
          ts.isJsxAttribute(item) && ["data-action-id", "dataActionId"].includes(item.name.getText(source))
        );
        const runtimeIgnore = node.attributes.properties.some(item =>
          ts.isJsxAttribute(item) && item.name.getText(source) === "data-runtime-ignore"
        );
        const element = node.parent;
        const rawLabel = ts.isJsxElement(element)
          ? element.children.map(child => ts.isJsxText(child) ? child.getText(source) : "").join(" ")
          : "";
        const label = rawLabel.replace(/\s+/g, " ").trim();
        const hasHandler = node.attributes.properties.some(item =>
          ts.isJsxAttribute(item) && ["onClick", "onSubmit"].includes(item.name.getText(source))
        );
        controls.push({
          surface,
          file: path.relative(root, file).replaceAll(path.sep, "/"),
          line: pos.line + 1,
          column: pos.character + 1,
          explicitActionId: actionAttribute ? actionAttribute.getText(source) : null,
          runtimeIgnore,
          label: label || null,
          hasHandler,
          status: actionAttribute ? "mapped" : "unmapped",
        });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

const mapped = controls.filter(control => control.status === "mapped").length;
const report = {
  generatedAt: new Date().toISOString(),
  surface,
  policy: "Every UI button requires an explicit data-action-id mapped to an ActionContract.",
  totals: {controls: controls.length, mapped, unmapped: controls.length - mapped, coveragePercent: controls.length ? Number((mapped / controls.length * 100).toFixed(2)) : 100},
  controls,
};

const outputDir = path.join(root, "reports");
fs.mkdirSync(outputDir, {recursive: true});
fs.writeFileSync(path.join(outputDir, "action-coverage.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`ACTION CONTRACT COVERAGE ${mapped}/${controls.length} (${report.totals.coveragePercent}%)`);
if (report.totals.unmapped) {
  console.error(`BLOCKED: ${report.totals.unmapped} button controls do not declare data-action-id.`);
  process.exitCode = 1;
}
