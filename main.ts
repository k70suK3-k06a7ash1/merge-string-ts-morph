import { Project, SyntaxKind } from "npm:ts-morph";

import type { VariableDeclaration, ObjectLiteralExpression, SourceFile, ArrayLiteralExpression } from "ts-morph";

// プロジェクトとソースファイルを初期化
const project = new Project();
const sourceFiles = project.addSourceFilesAtPaths(
  ["./datasources/sample.ts"]
);

// 初期化式が配列リテラルである変数宣言を取得
const getArrayLiteralDeclarations = (sourceFile: SourceFile[]): VariableDeclaration[] =>
  sourceFile.flatMap((e) => e.getVariableDeclarations()
    .filter((declaration) =>
      declaration.getInitializer()?.getKind() === SyntaxKind.ArrayLiteralExpression
    )
  )

// 配列リテラルの要素を収集
const collectObjectLiterals = (declarations: VariableDeclaration[]): ObjectLiteralExpression[] =>
  declarations.flatMap((declaration) => {
    const initializer = declaration.getInitializer();
    const arrayLiteral = initializer?.asKind(SyntaxKind.ArrayLiteralExpression) as ArrayLiteralExpression;
    return arrayLiteral
      ? arrayLiteral.getElements().filter((element) =>
        element.getKind() === SyntaxKind.ObjectLiteralExpression
      ) as ObjectLiteralExpression[]
      : [];
  });

const mergeStringProperties = (objectLiterals: ObjectLiteralExpression[], properties: string[],targetProps : string) =>
  objectLiterals.forEach((objectLiteral, idx) => {
    console.log({ rest: `${idx}/${objectLiterals.length}` })
    properties.forEach((propName) => {
      const isPropertyAssignment = objectLiteral.getKind() === SyntaxKind.
      const property = objectLiteral.getProperty(propName);
      console.log({ property: property?.getinitia })

      if (property) {
        // console.log({ property })

      }
    });
  });

// メイン処理
const main = async () => {
  console.log("step1")
  const declarations = getArrayLiteralDeclarations(sourceFiles);
  console.log("step2")
  const objectLiterals = collectObjectLiterals(declarations);
  console.log("step3")
  console.log({ count: objectLiterals.length })
  mergeStringProperties(objectLiterals, ["name", "faculty", "department"],"name");
  console.log("step4")

  // try {
  //   await sourceFiles.forEach(e => e.save());
  //   console.log("Updated file saved!");
  // } catch (error) {
  //   console.error("Error saving file:", error);
  // }
};

// 実行
main();

