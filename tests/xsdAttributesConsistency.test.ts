import { describe, it } from "vitest";
import fs from "fs";
import path from "path";
import ts from "typescript";

function camelCase(name: string): string {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function gatherSpecAttributes(): Set<string> {
  const schemaDir = path.join(__dirname, "../reference/musicxml-4.0/schema");
  const specAttrs = new Set<string>();
  const files = fs.readdirSync(schemaDir).filter((f) => f.endsWith(".xsd"));
  for (const file of files) {
    const contents = fs.readFileSync(path.join(schemaDir, file), "utf8");
    const regex = /<xs:attribute[^>]*name="([^"]+)"/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(contents))) {
      specAttrs.add(camelCase(match[1]));
    }
  }
  return specAttrs;
}

function gatherSchemaAttributes(): Set<string> {
  const srcDir = path.join(__dirname, "../src/schemas");
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".ts"));
  const attributes = new Set<string>();

  for (const file of files) {
    const full = path.join(srcDir, file);
    const source = fs.readFileSync(full, "utf8");
    const sf = ts.createSourceFile(full, source, ts.ScriptTarget.Latest, true);

    function visit(node: ts.Node) {
      if (
        ts.isVariableStatement(node) &&
        node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      ) {
        for (const decl of node.declarationList.declarations) {
          if (
            decl.name &&
            ts.isIdentifier(decl.name) &&
            decl.initializer &&
            ts.isCallExpression(decl.initializer) &&
            ts.isPropertyAccessExpression(decl.initializer.expression) &&
            decl.initializer.expression.expression.getText() === "z" &&
            decl.initializer.expression.name.text === "object"
          ) {
            const arg = decl.initializer.arguments[0];
            if (ts.isObjectLiteralExpression(arg)) {
              for (const p of arg.properties) {
                if (
                  ts.isPropertyAssignment(p) ||
                  ts.isShorthandPropertyAssignment(p)
                ) {
                  const name = p.name.getText(sf).replace(/\??$/, "");
                  attributes.add(name);
                }
              }
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    }

    ts.forEachChild(sf, visit);
  }

  return attributes;
}

describe("Schema attribute names vs XSD", () => {
  it("reports differences", () => {
    const specAttrs = gatherSpecAttributes();
    const schemaAttrs = gatherSchemaAttributes();

    const missingInSpec = Array.from(schemaAttrs).filter(
      (a) => !specAttrs.has(a),
    );
    const missingInSchema = Array.from(specAttrs).filter(
      (a) => !schemaAttrs.has(a),
    );

    console.log("Attributes in schemas but not in spec:", missingInSpec);
    console.log("Attributes in spec but not in schemas:", missingInSchema);
  });
});
