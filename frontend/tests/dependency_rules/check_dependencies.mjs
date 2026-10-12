import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const sourceRoot = path.resolve('src');
const allowed = {
  data_models: ['data_models'], actions: ['data_models', 'actions'],
  server_connection: ['data_models', 'actions', 'server_connection'],
  user_interface: ['data_models', 'actions', 'user_interface'],
  startup: ['data_models', 'actions', 'server_connection', 'user_interface', 'startup'],
};

function listSourceFiles(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(folder, entry.name);
    return entry.isDirectory() ? listSourceFiles(filename) : /\.tsx?$/.test(filename) ? [filename] : [];
  });
}

function checkImport(filename, layer, node) {
  const target = node.moduleSpecifier?.text;
  if (typeof target !== 'string') return;
  if (target.startsWith('.')) {
    const destination = path.resolve(path.dirname(filename), target);
    if (!destination.startsWith(`${sourceRoot}${path.sep}`)) throw new Error(`${filename}: imports outside frontend`);
    const importedLayer = path.relative(sourceRoot, destination).split(path.sep)[0];
    if (!allowed[layer]?.includes(importedLayer)) throw new Error(`${filename}: ${layer} cannot import ${importedLayer}`);
  } else if (['data_models', 'actions'].includes(layer)) {
    throw new Error(`${filename}: core module imports ${target}`);
  } else if (layer === 'server_connection' && /react/.test(target)) {
    throw new Error(`${filename}: server connection imports React`);
  }
}

function checkFunction(filename, source, node) {
  if (!ts.isFunctionLike(node) || !node.body) return;
  const start = source.getLineAndCharacterOfPosition(node.getStart(source)).line;
  const end = source.getLineAndCharacterOfPosition(node.getEnd()).line;
  if (end - start + 1 > 30) throw new Error(`${filename}:${start + 1}: function exceeds 30 lines`);
  if (node.parameters.length > 4) throw new Error(`${filename}:${start + 1}: function exceeds four parameters`);
}

function checkFile(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const layer = path.relative(sourceRoot, filename).split(path.sep)[0];
  const source = ts.createSourceFile(filename, content, ts.ScriptTarget.Latest, true,
    filename.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = node => {
    if (ts.isImportDeclaration(node)) checkImport(filename, layer, node);
    checkFunction(filename, source, node);
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'fetch' &&
      path.relative(sourceRoot, filename) !== path.join('server_connection', 'request_once.ts')) {
      throw new Error(`${filename}: fetch is only allowed in request_once.ts`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

const files = listSourceFiles(sourceRoot);
files.forEach(checkFile);
console.log(`Architecture and clean-code checks passed for ${files.length} frontend modules.`);
