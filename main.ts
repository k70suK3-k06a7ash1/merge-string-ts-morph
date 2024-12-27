import { Project, SyntaxKind } from "ts-morph";

import type { VariableDeclaration, ObjectLiteralExpression, SourceFile } from "ts-morph";

// プロジェクトとソースファイルを初期化
const project = new Project();
const sourceFiles = project.addSourceFilesAtPaths(
[  "./datasources/sample.ts" ]
);

const getArrayLiteralDeclarations = (sourceFile: SourceFile[]): VariableDeclaration[] =>
  sourceFile.flatMap((e) => e.getVariableDeclarations()
    .filter((declaration) =>
      declaration.getInitializer()?.getKind() === SyntaxKind.ArrayLiteralExpression
    )
)

const combineAndDefineNameOptional = (
  objectLiterals: ObjectLiteralExpression[],
  properties: string[],
  targetProperty: string
) => {
  objectLiterals.forEach((objectLiteral, idx) => {
    console.log({ status: `${idx + 1}/${objectLiterals.length}` });

    // Collect values of the specified properties
    const values: string[] = [];
    properties.forEach((propName) => {
      const property = objectLiteral.getProperty(propName);
      if (property && property.getKindName() === "PropertyAssignment") {
        const initializer = property.getFirstChild();
        if (initializer) {
          values.push(initializer.getText());
        }
      }
    });

    // If no values are found, skip modification
    if (values.length === 0) return;

    // Define the combined value in the target property
    const combinedValue = values.join(" ");
    const existingTargetProperty = objectLiteral.getProperty(targetProperty);

    if (existingTargetProperty) {
      existingTargetProperty.replaceWithText(`${targetProperty}: \"${combinedValue}\"`);
    } else {
      objectLiteral.addPropertyAssignment({
        name: targetProperty,
        initializer: `\"${combinedValue}\"`,
      });
    }

    // Remove the original properties
    removeProperties(objectLiteral, properties);
  });
};

 
const collectObjectLiterals = (declarations: VariableDeclaration[]): ObjectLiteralExpression[] =>
    declarations.flatMap((declaration) => {
    const initializer = declaration.getInitializer();
    const arrayLiteral = initializer?.asKind(SyntaxKind.ArrayLiteralExpression);
    return arrayLiteral
      ? arrayLiteral.getElements().filter((element) =>
          element.getKind() === SyntaxKind.ObjectLiteralExpression
        ) as ObjectLiteralExpression[]
      : [];
  });

const removeProperties = (objectLiterals: ObjectLiteralExpression[], properties: string[]) =>
    objectLiterals.forEach((objectLiteral, idx) => {
      console.log({rest : `${idx}/${objectLiterals.length}`})
    properties.forEach((propName) => {
      const property = objectLiteral.getProperty(propName);
      if (property) {
        property.remove();
      }
    });
  });

const combineAndDefineName = (
  objectLiterals: ObjectLiteralExpression[],
  properties: string[],
  targetProperty: string
) => {
  objectLiterals.forEach((objectLiteral, idx) => {
    console.log({ status: `${idx + 1}/${objectLiterals.length}` });

    // Collect values of the specified properties
    const values: string[] = [];
    properties.forEach((propName) => {
      const property = objectLiteral.getProperty(propName);
      if (property && property.getKindName() === "PropertyAssignment") {
        const initializer = property.getFirstChild();
        if (initializer) {
          values.push(initializer.getText());
        }
      }
    });

    // Define the combined value in the target property
    const combinedValue = values.join(" ");
    const existingTargetProperty = objectLiteral.getProperty(targetProperty);

    if (existingTargetProperty) {
      existingTargetProperty.replaceWithText(`${targetProperty}: \"${combinedValue}\"`);
    } else {
      objectLiteral.addPropertyAssignment({
        name: targetProperty,
        initializer: `\"${combinedValue}\"`,
      });
    }

    // Remove the original properties
    removeProperties(objectLiteral, properties);
  });
};


const main = async () => {
    console.log("step1")
    const declarations = getArrayLiteralDeclarations(sourceFiles);
    console.log("step2")
    const objectLiterals = collectObjectLiterals(declarations);
    console.log("step3")
    console.log({count : objectLiterals.length})
  removeProperties(objectLiterals, ["id", "degree", "searchKey"]);
    console.log("step4")

  try {
    await sourceFiles.forEach(e => e.save());
    console.log("Updated file saved!");
  } catch (error) {
    console.error("Error saving file:", error);
  }
};

// 実行
main();

