'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var ts = require('typescript');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

function getCodeFrame() {
    try {
        const { codeFrameColumns } = require("@babel/code-frame");
        return codeFrameColumns;
    }
    catch (_a) { }
    // istanbul ignore next
    return undefined;
}
function getLocation(node) {
    const sourceFile = node.getSourceFile();
    const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
    return {
        start: { line: start.line + 1, column: start.character + 1 },
        end: { line: end.line + 1, column: end.character + 1 },
    };
}
function frameNodes(nodes, messages = []) {
    const codeFrame = getCodeFrame();
    const sourceFile = nodes[0].getSourceFile();
    const code = sourceFile.getFullText();
    let output = "";
    let lastLine;
    // oh jesus, why does @babel/code-frame not support this out of the box?
    for (const [i, node] of nodes.entries()) {
        const message = messages[i];
        // istanbul ignore else
        const location = getLocation(node);
        if (codeFrame) {
            const nextLocation = nodes[i + 1] && getLocation(nodes[i + 1]);
            const linesAbove = typeof lastLine === "number" ? location.start.line - lastLine - 1 : 2;
            const linesBelow = nextLocation ? nextLocation.start.line - location.end.line - 1 : 3;
            output +=
                "\n" +
                    codeFrame(code, location, {
                        highlightCode: true,
                        message,
                        linesAbove,
                        linesBelow,
                    });
            lastLine = location.end.line + linesBelow;
        }
        else {
            output += `\n${location.start.line}:${location.start.column}: \`${node.getFullText().trim()}\` <- ${message}`;
        }
    }
    return output;
}
class UnsupportedSyntaxError extends Error {
    constructor(node, message = "Syntax not yet supported") {
        super(`${message}\n${frameNodes([node])}`);
    }
}

class NamespaceFixer {
    constructor(sourceFile) {
        this.sourceFile = sourceFile;
    }
    findNamespaces() {
        const namespaces = [];
        const items = {};
        for (const node of this.sourceFile.statements) {
            const location = {
                start: node.getStart(),
                end: node.getEnd(),
            };
            // Well, this is a big hack:
            // For some global `namespace` and `module` declarations, we generate
            // some fake IIFE code, so rollup can correctly scan its scope.
            // However, rollup will then insert bogus semicolons,
            // these `EmptyStatement`s, which are a syntax error and we want to
            // remove them. Well, we do that here…
            if (ts.isEmptyStatement(node)) {
                namespaces.unshift({
                    name: "",
                    exports: [],
                    location,
                });
                continue;
            }
            // When generating multiple chunks, rollup links those via import
            // statements, obviously. But rollup uses full filenames with extension,
            // which typescript does not like. So make sure to remove those here.
            if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
                node.moduleSpecifier &&
                ts.isStringLiteral(node.moduleSpecifier)) {
                let { text } = node.moduleSpecifier;
                if (text.startsWith(".") && text.endsWith(".d.ts")) {
                    let end = node.moduleSpecifier.getEnd() - 1; // -1 to account for the quote
                    namespaces.unshift({
                        name: "",
                        exports: [],
                        location: {
                            start: end - 5,
                            end,
                        },
                    });
                }
            }
            if (ts.isClassDeclaration(node)) {
                items[node.name.getText()] = { type: "class", generics: node.typeParameters && node.typeParameters.length };
            }
            else if (ts.isFunctionDeclaration(node)) {
                // a function has generics, but these don’t need to be specified explicitly,
                // since functions are treated as values.
                items[node.name.getText()] = { type: "function" };
            }
            else if (ts.isInterfaceDeclaration(node)) {
                items[node.name.getText()] = {
                    type: "interface",
                    generics: node.typeParameters && node.typeParameters.length,
                };
            }
            else if (ts.isTypeAliasDeclaration(node)) {
                items[node.name.getText()] = { type: "type", generics: node.typeParameters && node.typeParameters.length };
            }
            else if (ts.isModuleDeclaration(node) && ts.isIdentifier(node.name)) {
                items[node.name.getText()] = { type: "namespace" };
            }
            else if (ts.isEnumDeclaration(node)) {
                items[node.name.getText()] = { type: "enum" };
            }
            if (!ts.isVariableStatement(node)) {
                continue;
            }
            const { declarations } = node.declarationList;
            if (declarations.length !== 1) {
                continue;
            }
            const decl = declarations[0];
            const name = decl.name.getText();
            if (!decl.initializer || !ts.isCallExpression(decl.initializer)) {
                items[name] = { type: "var" };
                continue;
            }
            const obj = decl.initializer.arguments[0];
            if (!decl.initializer.expression.getFullText().includes("/*#__PURE__*/Object.freeze") ||
                !ts.isObjectLiteralExpression(obj)) {
                continue;
            }
            const exports = [];
            for (const prop of obj.properties) {
                if (!ts.isPropertyAssignment(prop) ||
                    !ts.isIdentifier(prop.name) ||
                    (prop.name.text !== "__proto__" && !ts.isIdentifier(prop.initializer))) {
                    throw new UnsupportedSyntaxError(prop, "Expected a property assignment");
                }
                if (prop.name.text === "__proto__") {
                    continue;
                }
                exports.push({
                    exportedName: prop.name.getText(),
                    localName: prop.initializer.getText(),
                });
            }
            // sort in reverse order, since we will do string manipulation
            namespaces.unshift({
                name,
                exports,
                location,
            });
        }
        return { namespaces, itemTypes: items };
    }
    fix() {
        let code = this.sourceFile.getFullText();
        const { namespaces, itemTypes } = this.findNamespaces();
        for (const ns of namespaces) {
            const codeAfter = code.slice(ns.location.end);
            code = code.slice(0, ns.location.start);
            for (const { exportedName, localName } of ns.exports) {
                if (exportedName === localName) {
                    const { type, generics } = itemTypes[localName];
                    if (type === "interface" || type === "type") {
                        // an interface is just a type
                        const typeParams = renderTypeParams(generics);
                        code += `type ${ns.name}_${exportedName}${typeParams} = ${localName}${typeParams};\n`;
                    }
                    else if (type === "enum" || type === "class") {
                        // enums and classes are both types and values
                        const typeParams = renderTypeParams(generics);
                        code += `type ${ns.name}_${exportedName}${typeParams} = ${localName}${typeParams};\n`;
                        code += `declare const ${ns.name}_${exportedName}: typeof ${localName};\n`;
                    }
                    else {
                        // functions and vars are just values
                        code += `declare const ${ns.name}_${exportedName}: typeof ${localName};\n`;
                    }
                }
            }
            if (ns.name) {
                code += `declare namespace ${ns.name} {\n`;
                code += `  export {\n`;
                for (const { exportedName, localName } of ns.exports) {
                    if (exportedName === localName) {
                        code += `    ${ns.name}_${exportedName} as ${exportedName},\n`;
                    }
                    else {
                        code += `    ${localName} as ${exportedName},\n`;
                    }
                }
                code += `  };\n`;
                code += `}`;
            }
            code += codeAfter;
        }
        return code;
    }
}
function renderTypeParams(num) {
    if (!num) {
        return "";
    }
    return `<${Array.from({ length: num }, (_, i) => `_${i}`).join(", ")}>`;
}

const dts = ".d.ts";
const formatHost = {
    getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
    getNewLine: () => ts.sys.newLine,
    getCanonicalFileName: ts.sys.useCaseSensitiveFileNames ? (f) => f : (f) => f.toLowerCase(),
};
const OPTIONS_OVERRIDE = {
    // Ensure ".d.ts" modules are generated
    declaration: true,
    // Skip ".js" generation
    noEmit: false,
    emitDeclarationOnly: true,
    // Skip code generation when error occurs
    noEmitOnError: true,
    // Avoid extra work
    checkJs: false,
    declarationMap: false,
    skipLibCheck: true,
    // Ensure TS2742 errors are visible
    preserveSymlinks: true,
    // Ensure we can parse the latest code
    target: ts.ScriptTarget.ESNext,
};
function getCompilerOptions(input, overrideOptions) {
    const compilerOptions = Object.assign(Object.assign({}, overrideOptions), OPTIONS_OVERRIDE);
    let dirName = path.dirname(input);
    let dtsFiles = [];
    const configPath = ts.findConfigFile(path.dirname(input), ts.sys.fileExists);
    if (!configPath) {
        return { dtsFiles, dirName, compilerOptions };
    }
    dirName = path.dirname(configPath);
    const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile);
    if (error) {
        console.error(ts.formatDiagnostic(error, formatHost));
        return { dtsFiles, dirName, compilerOptions };
    }
    const { fileNames, options, errors } = ts.parseJsonConfigFileContent(config, ts.sys, dirName);
    dtsFiles = fileNames.filter((name) => name.endsWith(dts));
    if (errors.length) {
        console.error(ts.formatDiagnostics(errors, formatHost));
        return { dtsFiles, dirName, compilerOptions };
    }
    return {
        dtsFiles,
        dirName,
        compilerOptions: Object.assign(Object.assign({}, options), compilerOptions),
    };
}
function createProgram(fileName, overrideOptions) {
    const { dtsFiles, compilerOptions } = getCompilerOptions(fileName, overrideOptions);
    return ts.createProgram([fileName].concat(Array.from(dtsFiles)), compilerOptions, ts.createCompilerHost(compilerOptions, true));
}
function createPrograms(input, overrideOptions) {
    const programs = [];
    let inputs = [];
    let dtsFiles = new Set();
    let dirName = "";
    let compilerOptions = {};
    for (let main of input) {
        if (main.endsWith(dts)) {
            continue;
        }
        main = path.resolve(main);
        const options = getCompilerOptions(main, overrideOptions);
        options.dtsFiles.forEach(dtsFiles.add, dtsFiles);
        if (!inputs.length) {
            inputs.push(main);
            ({ dirName, compilerOptions } = options);
            continue;
        }
        if (options.dirName === dirName) {
            inputs.push(main);
        }
        else {
            const host = ts.createCompilerHost(compilerOptions, true);
            const program = ts.createProgram(inputs.concat(Array.from(dtsFiles)), compilerOptions, host);
            programs.push(program);
            inputs = [main];
            ({ dirName, compilerOptions } = options);
        }
    }
    if (inputs.length) {
        const host = ts.createCompilerHost(compilerOptions, true);
        const program = ts.createProgram(inputs.concat(Array.from(dtsFiles)), compilerOptions, host);
        programs.push(program);
    }
    return programs;
}

/**
 * Reorder Statements and group them by name.
 *
 * In JS, there is a 1:1 relationship between *names* and declarations.
 *
 * In TS however, one *name* can consist of multiple declarations.
 *
 * Examples are function overrides, and the fact that there is a difference
 * between *types* and *values*, which can have the same *name*, but obviously
 * different declarations.
 */
function reorderStatements(sourceFile) {
    var _a, _b;
    // Some statements, such as import/export, etc do not have `names`, but we
    // want to render them. So we just assign random names to them, and since
    // JS Map iteration works in insertion order, things will work out just fine.
    // Additionally, we use the special `"0"` name for things that we want to
    // just remove from the code and not render at all.
    let nameless = 0;
    const names = new Map();
    let needsReorder = false;
    for (const stmt of sourceFile.statements) {
        const name = (_a = getName(stmt)) !== null && _a !== void 0 ? _a : String(++nameless);
        if (names.has(name)) {
            (_b = names.get(name)) === null || _b === void 0 ? void 0 : _b.push(stmt);
            needsReorder = true;
        }
        else {
            names.set(name, [stmt]);
        }
    }
    // avoid re-parsing if there is nothing to re-order
    if (!names.has("0") && !needsReorder) {
        return sourceFile;
    }
    names.delete("0");
    let input = sourceFile.getFullText();
    let code = "";
    for (const group of names.values()) {
        for (const stmt of group) {
            code += input.slice(stmt.pos, stmt.end);
        }
    }
    return ts.createSourceFile(sourceFile.fileName, code, ts.ScriptTarget.Latest, true);
}
function getName(node) {
    var _a;
    if (ts.isEnumDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isTypeAliasDeclaration(node)) {
        return (_a = node.name) === null || _a === void 0 ? void 0 : _a.getText();
    }
    if (ts.isVariableStatement(node)) {
        const { declarations } = node.declarationList;
        if (declarations.length !== 0 && ts.isIdentifier(declarations[0].name)) {
            return declarations[0].name.getText();
        }
    }
    return undefined;
}

let IDs = 1;
/**
 * Create a new `Program` for the given `node`:
 */
function createProgram$1(node) {
    return withStartEnd({
        type: "Program",
        sourceType: "module",
        body: [],
    }, node);
}
/**
 * Create a default export for `id`:
 * `export default id`
 */
function createDefaultExport(node, range) {
    return withStartEnd({
        type: "ExportDefaultDeclaration",
        declaration: createIdentifier(node),
    }, range);
}
/**
 * Create an export for `id`:
 * `export { id }`
 */
function createExport(node, range) {
    const id = createIdentifier(node);
    return withStartEnd({
        type: "ExportNamedDeclaration",
        declaration: null,
        specifiers: [
            {
                type: "ExportSpecifier",
                exported: id,
                local: id,
            },
        ],
    }, range);
}
/**
 * Creates a reference to `id`:
 * `_ = ${id}`
 */
function createReference(id) {
    return {
        type: "AssignmentPattern",
        left: {
            type: "Identifier",
            name: String(IDs++),
        },
        right: id,
    };
}
function createIdentifier(node) {
    return withStartEnd({
        type: "Identifier",
        name: node.getText(),
    }, {
        start: node.getStart(),
        end: node.getEnd(),
    });
}
/**
 * Create a new Scope which is always included
 * `(function (_ = MARKER) {})()`
 */
function createIIFE(range) {
    const fn = withStartEnd({
        type: "FunctionExpression",
        id: null,
        params: [],
        body: { type: "BlockStatement", body: [] },
    }, range);
    const iife = withStartEnd({
        type: "ExpressionStatement",
        expression: {
            type: "CallExpression",
            callee: { type: "Identifier", name: String(IDs++) },
            arguments: [fn],
            optional: false,
        },
    }, range);
    return { fn, iife };
}
/**
 * Create a new Declaration and Scope for `id`:
 * `function ${id}(_ = MARKER) {}`
 */
function createDeclaration(id, range) {
    return withStartEnd({
        type: "FunctionDeclaration",
        id: withStartEnd({
            type: "Identifier",
            name: ts.idText(id),
        }, { start: id.getStart(), end: id.getEnd() }),
        params: [],
        body: { type: "BlockStatement", body: [] },
    }, range);
}
function convertExpression(node) {
    if (ts.isLiteralExpression(node)) {
        return { type: "Literal", value: node.text };
    }
    if (ts.isPropertyAccessExpression(node)) {
        if (ts.isPrivateIdentifier(node.name)) {
            throw new UnsupportedSyntaxError(node.name);
        }
        return withStartEnd({
            type: "MemberExpression",
            computed: false,
            optional: false,
            object: convertExpression(node.expression),
            property: convertExpression(node.name),
        }, {
            start: node.expression.getStart(),
            end: node.name.getEnd(),
        });
    }
    // istanbul ignore else
    if (ts.isIdentifier(node)) {
        return createIdentifier(node);
    }
    else {
        throw new UnsupportedSyntaxError(node);
    }
}
function getStart({ start, pos }) {
    return typeof start === "number" ? start : pos || 0;
}
function withStartEnd(node, range) {
    return Object.assign(node, {
        start: getStart(range),
        end: range.end,
    });
}
function matchesModifier(node, flags) {
    const nodeFlags = ts.getCombinedModifierFlags(node);
    return (nodeFlags & flags) === flags;
}

const IGNORE_TYPENODES = new Set([
    ts.SyntaxKind.LiteralType,
    ts.SyntaxKind.VoidKeyword,
    ts.SyntaxKind.UnknownKeyword,
    ts.SyntaxKind.AnyKeyword,
    ts.SyntaxKind.BooleanKeyword,
    ts.SyntaxKind.NumberKeyword,
    ts.SyntaxKind.StringKeyword,
    ts.SyntaxKind.ObjectKeyword,
    ts.SyntaxKind.NullKeyword,
    ts.SyntaxKind.UndefinedKeyword,
    ts.SyntaxKind.SymbolKeyword,
    ts.SyntaxKind.NeverKeyword,
    ts.SyntaxKind.ThisKeyword,
    ts.SyntaxKind.ThisType,
    ts.SyntaxKind.BigIntKeyword,
]);
class DeclarationScope {
    constructor({ id, range, transformer }) {
        /**
         * As we walk the AST, we need to keep track of type variable bindings that
         * shadow the outer identifiers. To achieve this, we keep a stack of scopes,
         * represented as Sets of variable names.
         */
        this.scopes = [];
        this.transformer = transformer;
        if (id) {
            this.declaration = createDeclaration(id, range);
        }
        else {
            const { iife, fn } = createIIFE(range);
            this.iife = iife;
            this.declaration = fn;
        }
    }
    pushScope() {
        this.scopes.push(new Set());
    }
    popScope(n = 1) {
        for (let i = 0; i < n; i++) {
            this.scopes.pop();
        }
    }
    pushTypeVariable(id) {
        const name = id.getText();
        this.scopes[this.scopes.length - 1].add(name);
    }
    pushRaw(expr) {
        this.declaration.params.push(expr);
    }
    pushReference(id) {
        let name;
        // We convert references from TS AST to ESTree
        // to hand them off to rollup.
        // This means we have to check the left-most identifier inside our scope
        // tree and avoid to create the reference in that case
        if (id.type === "Identifier") {
            name = id.name;
        }
        else if (id.type === "MemberExpression") {
            if (id.object.type === "Identifier") {
                name = id.object.name;
            }
        }
        if (name) {
            for (const scope of this.scopes) {
                if (scope.has(name)) {
                    return;
                }
            }
        }
        this.pushRaw(createReference(id));
    }
    pushIdentifierReference(id) {
        this.pushReference(createIdentifier(id));
    }
    /**
     * This will fix up the modifiers of a declaration.
     * We want to remove `export (default)?` modifiers, and in that case add a
     * missing `declare`. All the others should be untouched.
     */
    fixModifiers(node) {
        if (!node.modifiers) {
            return;
        }
        const modifiers = [];
        let hasDeclare = false;
        let start = Infinity;
        let end = 0;
        for (const mod of node.modifiers) {
            if (mod.kind !== ts.SyntaxKind.ExportKeyword && mod.kind !== ts.SyntaxKind.DefaultKeyword) {
                modifiers.push(mod.getText());
            }
            if (mod.kind === ts.SyntaxKind.DeclareKeyword) {
                hasDeclare = true;
            }
            start = Math.min(start, mod.getStart());
            end = Math.max(end, mod.getEnd());
        }
        // function, class and variables *must* have a `declare` modifier
        if (!hasDeclare &&
            (ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isVariableStatement(node))) {
            modifiers.unshift("declare");
        }
        const newModifiers = modifiers.join(" ");
        if (!newModifiers && end) {
            end += 1;
        }
        this.transformer.fixups.push({
            range: { start, end },
            replaceWith: newModifiers,
        });
    }
    convertEntityName(node) {
        if (ts.isIdentifier(node)) {
            return createIdentifier(node);
        }
        return withStartEnd({
            type: "MemberExpression",
            computed: false,
            optional: false,
            object: this.convertEntityName(node.left),
            property: createIdentifier(node.right),
        }, 
        // TODO: clean up all the `start` handling!
        { start: node.getStart(), end: node.end });
    }
    convertPropertyAccess(node) {
        // hm, we only care about property access expressions here…
        if (!ts.isIdentifier(node.expression) && !ts.isPropertyAccessExpression(node.expression)) {
            throw new UnsupportedSyntaxError(node.expression);
        }
        if (ts.isPrivateIdentifier(node.name)) {
            throw new UnsupportedSyntaxError(node.name);
        }
        let object = ts.isIdentifier(node.expression)
            ? createIdentifier(node.expression)
            : this.convertPropertyAccess(node.expression);
        return withStartEnd({
            type: "MemberExpression",
            computed: false,
            optional: false,
            object,
            property: createIdentifier(node.name),
        }, 
        // TODO: clean up all the `start` handling!
        { start: node.getStart(), end: node.end });
    }
    convertComputedPropertyName(node) {
        if (!node.name || !ts.isComputedPropertyName(node.name)) {
            return;
        }
        const { expression } = node.name;
        if (ts.isLiteralExpression(expression)) {
            return;
        }
        if (ts.isIdentifier(expression)) {
            return this.pushReference(createIdentifier(expression));
        }
        if (ts.isPropertyAccessExpression(expression)) {
            return this.pushReference(this.convertPropertyAccess(expression));
        }
        throw new UnsupportedSyntaxError(expression);
    }
    convertParametersAndType(node) {
        this.convertComputedPropertyName(node);
        const typeVariables = this.convertTypeParameters(node.typeParameters);
        for (const param of node.parameters) {
            this.convertTypeNode(param.type);
        }
        this.convertTypeNode(node.type);
        this.popScope(typeVariables);
    }
    convertHeritageClauses(node) {
        for (const heritage of node.heritageClauses || []) {
            for (const type of heritage.types) {
                this.pushReference(convertExpression(type.expression));
                this.convertTypeArguments(type);
            }
        }
    }
    convertTypeArguments(node) {
        if (!node.typeArguments) {
            return;
        }
        for (const arg of node.typeArguments) {
            this.convertTypeNode(arg);
        }
    }
    convertMembers(members) {
        for (const node of members) {
            if (ts.isPropertyDeclaration(node) || ts.isPropertySignature(node) || ts.isIndexSignatureDeclaration(node)) {
                this.convertComputedPropertyName(node);
                this.convertTypeNode(node.type);
                continue;
            }
            // istanbul ignore else
            if (ts.isMethodDeclaration(node) ||
                ts.isMethodSignature(node) ||
                ts.isConstructorDeclaration(node) ||
                ts.isConstructSignatureDeclaration(node) ||
                ts.isCallSignatureDeclaration(node) ||
                ts.isGetAccessorDeclaration(node) ||
                ts.isSetAccessorDeclaration(node)) {
                this.convertParametersAndType(node);
            }
            else {
                throw new UnsupportedSyntaxError(node);
            }
        }
    }
    convertTypeParameters(params) {
        if (!params) {
            return 0;
        }
        for (const node of params) {
            this.convertTypeNode(node.constraint);
            this.convertTypeNode(node.default);
            this.pushScope();
            this.pushTypeVariable(node.name);
        }
        return params.length;
    }
    convertTypeNode(node) {
        if (!node) {
            return;
        }
        if (IGNORE_TYPENODES.has(node.kind)) {
            return;
        }
        if (ts.isTypeReferenceNode(node)) {
            this.pushReference(this.convertEntityName(node.typeName));
            this.convertTypeArguments(node);
            return;
        }
        if (ts.isTypeLiteralNode(node)) {
            return this.convertMembers(node.members);
        }
        if (ts.isArrayTypeNode(node)) {
            return this.convertTypeNode(node.elementType);
        }
        if (ts.isTupleTypeNode(node)) {
            // ts@v4 renamed `elementTypes` to `elements`
            for (const type of (node.elements || node.elementTypes)) {
                this.convertTypeNode(type);
            }
            return;
        }
        if (ts.isNamedTupleMember(node) || ts.isParenthesizedTypeNode(node) || ts.isTypeOperatorNode(node) || ts.isTypePredicateNode(node)) {
            return this.convertTypeNode(node.type);
        }
        if (ts.isUnionTypeNode(node) || ts.isIntersectionTypeNode(node)) {
            for (const type of node.types) {
                this.convertTypeNode(type);
            }
            return;
        }
        if (ts.isMappedTypeNode(node)) {
            const { typeParameter, type } = node;
            this.convertTypeNode(typeParameter.constraint);
            this.pushScope();
            this.pushTypeVariable(node.typeParameter.name);
            this.convertTypeNode(type);
            this.popScope();
            return;
        }
        if (ts.isConditionalTypeNode(node)) {
            this.convertTypeNode(node.checkType);
            this.pushScope();
            this.convertTypeNode(node.extendsType);
            this.convertTypeNode(node.trueType);
            this.convertTypeNode(node.falseType);
            this.popScope();
            return;
        }
        if (ts.isIndexedAccessTypeNode(node)) {
            this.convertTypeNode(node.objectType);
            this.convertTypeNode(node.indexType);
            return;
        }
        if (ts.isFunctionOrConstructorTypeNode(node)) {
            this.convertParametersAndType(node);
            return;
        }
        if (ts.isImportTypeNode(node)) {
            this.convertImportTypeNode(node);
            return;
        }
        if (ts.isTypeQueryNode(node)) {
            this.pushReference(this.convertEntityName(node.exprName));
            return;
        }
        if (ts.isTypeNode(node) && node.kind === ts.SyntaxKind.RestType) {
            this.convertTypeNode(node.type);
            return;
        }
        if (ts.isTypeNode(node) && node.kind === ts.SyntaxKind.OptionalType) {
            this.convertTypeNode(node.type);
            return;
        }
        // istanbul ignore else
        if (ts.isInferTypeNode(node)) {
            this.pushTypeVariable(node.typeParameter.name);
            return;
        }
        else {
            throw new UnsupportedSyntaxError(node);
        }
    }
    // For import type nodes of the form
    // `import("./foo").Bar`
    // we create the following ESTree equivalent:
    // 1. `import * as _ from "./foo";` on the toplevel
    // 2. `_.Bar` in our declaration scope
    convertImportTypeNode(node) {
        // istanbul ignore if
        if (!ts.isLiteralTypeNode(node.argument) || !ts.isStringLiteral(node.argument.literal)) {
            throw new UnsupportedSyntaxError(node, "inline imports should have a literal argument");
        }
        const fileId = node.argument.literal.text;
        const start = node.getStart() + (node.isTypeOf ? "typeof ".length : 0);
        const range = {
            start,
            end: (node.qualifier ? node.qualifier : node).getEnd(),
        };
        const importId = this.transformer.addFixupLocation(range);
        const importIdRef = withStartEnd({
            type: "Identifier",
            name: importId,
        }, range);
        this.transformer.unshiftStatement({
            type: "ImportDeclaration",
            specifiers: [
                {
                    type: "ImportNamespaceSpecifier",
                    local: { type: "Identifier", name: importId },
                },
            ],
            source: { type: "Literal", value: fileId },
        });
        if (node.qualifier && ts.isIdentifier(node.qualifier)) {
            this.pushReference(withStartEnd({
                type: "MemberExpression",
                computed: false,
                optional: false,
                object: importIdRef,
                property: createIdentifier(node.qualifier),
            }, range));
        }
        else {
            // we definitely need to do some string manipulation on the source code,
            // since rollup will not touch the `import("...")` bit at all.
            // also, for *internal* namespace references, we have the same problem
            // as with re-exporting references… -_-
            this.pushReference(importIdRef);
        }
        this.convertTypeArguments(node);
    }
    convertNamespace(node) {
        this.pushScope();
        // istanbul ignore if
        if (!node.body || !ts.isModuleBlock(node.body)) {
            throw new UnsupportedSyntaxError(node, `namespace must have a "ModuleBlock" body.`);
        }
        const { statements } = node.body;
        // first, hoist all the declarations for correct shadowing
        for (const stmt of statements) {
            if (ts.isEnumDeclaration(stmt) ||
                ts.isFunctionDeclaration(stmt) ||
                ts.isClassDeclaration(stmt) ||
                ts.isInterfaceDeclaration(stmt) ||
                ts.isTypeAliasDeclaration(stmt) ||
                ts.isModuleDeclaration(stmt)) {
                // istanbul ignore else
                if (stmt.name && ts.isIdentifier(stmt.name)) {
                    this.pushTypeVariable(stmt.name);
                }
                else {
                    throw new UnsupportedSyntaxError(stmt, `non-Identifier name not supported`);
                }
                continue;
            }
            if (ts.isVariableStatement(stmt)) {
                for (const decl of stmt.declarationList.declarations) {
                    // istanbul ignore else
                    if (ts.isIdentifier(decl.name)) {
                        this.pushTypeVariable(decl.name);
                    }
                    else {
                        throw new UnsupportedSyntaxError(decl, `non-Identifier name not supported`);
                    }
                }
                continue;
            }
            // istanbul ignore else
            if (ts.isExportDeclaration(stmt)) ;
            else {
                throw new UnsupportedSyntaxError(stmt, `namespace child (hoisting) not supported yet`);
            }
        }
        // and then walk all the children like normal…
        for (const stmt of statements) {
            if (ts.isVariableStatement(stmt)) {
                for (const decl of stmt.declarationList.declarations) {
                    if (decl.type) {
                        this.convertTypeNode(decl.type);
                    }
                }
                continue;
            }
            if (ts.isFunctionDeclaration(stmt)) {
                this.convertParametersAndType(stmt);
                continue;
            }
            if (ts.isInterfaceDeclaration(stmt) || ts.isClassDeclaration(stmt)) {
                const typeVariables = this.convertTypeParameters(stmt.typeParameters);
                this.convertHeritageClauses(stmt);
                this.convertMembers(stmt.members);
                this.popScope(typeVariables);
                continue;
            }
            if (ts.isTypeAliasDeclaration(stmt)) {
                const typeVariables = this.convertTypeParameters(stmt.typeParameters);
                this.convertTypeNode(stmt.type);
                this.popScope(typeVariables);
                continue;
            }
            if (ts.isModuleDeclaration(stmt)) {
                this.convertNamespace(stmt);
                continue;
            }
            if (ts.isEnumDeclaration(stmt)) {
                // noop
                continue;
            }
            // istanbul ignore else
            if (ts.isExportDeclaration(stmt)) {
                if (stmt.exportClause) {
                    if (ts.isNamespaceExport(stmt.exportClause)) {
                        throw new UnsupportedSyntaxError(stmt.exportClause);
                    }
                    for (const decl of stmt.exportClause.elements) {
                        const id = decl.propertyName || decl.name;
                        this.pushIdentifierReference(id);
                    }
                }
            }
            else {
                throw new UnsupportedSyntaxError(stmt, `namespace child (walking) not supported yet`);
            }
        }
        this.popScope();
    }
}

class Transformer {
    constructor(sourceFile) {
        this.sourceFile = sourceFile;
        this.fixups = [];
        this.typeReferences = new Set();
        this.declarations = new Map();
        this.exports = new Set();
        // collect all the type references and create fixups to remove them from the code,
        // we will add all of these later on to the whole chunk…
        const lineStarts = sourceFile.getLineStarts();
        for (const ref of sourceFile.typeReferenceDirectives) {
            this.typeReferences.add(ref.fileName);
            const { line } = sourceFile.getLineAndCharacterOfPosition(ref.pos);
            const start = lineStarts[line];
            const end = sourceFile.getLineEndOfPosition(ref.pos);
            this.fixups.push({
                range: { start, end },
                replaceWith: "",
            });
        }
        this.ast = createProgram$1(sourceFile);
        for (const stmt of sourceFile.statements) {
            this.convertStatement(stmt);
        }
    }
    transform() {
        return {
            ast: this.ast,
            fixups: this.fixups,
            typeReferences: this.typeReferences,
        };
    }
    addFixupLocation(range) {
        const original = this.sourceFile.text.slice(range.start, range.end);
        let identifier = `_mp_rt${this.fixups.length}`;
        identifier += original.slice(identifier.length).replace(/[^a-zA-Z0-9_$]/g, () => "_");
        this.fixups.push({
            range,
            replaceWith: identifier,
        });
        return identifier;
    }
    unshiftStatement(node) {
        this.ast.body.unshift(withStartEnd(node, { start: 0, end: 0 }));
    }
    pushStatement(node) {
        this.ast.body.push(node);
    }
    maybeMarkAsExported(node, id) {
        if (!matchesModifier(node, ts.ModifierFlags.Export) || !node.modifiers) {
            return false;
        }
        const isExportDefault = matchesModifier(node, ts.ModifierFlags.ExportDefault);
        const name = isExportDefault ? "default" : id.getText();
        if (this.exports.has(name)) {
            return true;
        }
        const loc = { start: node.pos, end: node.pos };
        this.pushStatement((isExportDefault ? createDefaultExport : createExport)(id, loc));
        this.exports.add(name);
        return true;
    }
    createDeclaration(range, id) {
        if (!id) {
            const scope = new DeclarationScope({ range, transformer: this });
            this.pushStatement(scope.iife);
            return scope;
        }
        const name = id.getText();
        // We have re-ordered and grouped declarations in `reorderStatements`,
        // so we can assume same-name statements are next to each other, so we just
        // bump the `end` range.
        const scope = new DeclarationScope({ id, range, transformer: this });
        const existingScope = this.declarations.get(name);
        if (existingScope) {
            existingScope.pushIdentifierReference(id);
            existingScope.declaration.end = range.end;
            // we possibly have other declarations, such as an ExportDeclaration in
            // between, which should also be updated to the correct start/end.
            let selfIdx = this.ast.body.findIndex((node) => node == existingScope.declaration);
            for (let i = selfIdx + 1; i < this.ast.body.length; i++) {
                const decl = this.ast.body[i];
                decl.start = decl.end = range.end;
            }
        }
        else {
            this.pushStatement(scope.declaration);
            this.declarations.set(name, scope);
        }
        return existingScope || scope;
    }
    convertStatement(node) {
        if (ts.isEnumDeclaration(node)) {
            return this.convertEnumDeclaration(node);
        }
        if (ts.isFunctionDeclaration(node)) {
            return this.convertFunctionDeclaration(node);
        }
        if (ts.isInterfaceDeclaration(node) || ts.isClassDeclaration(node)) {
            return this.convertClassOrInterfaceDeclaration(node);
        }
        if (ts.isTypeAliasDeclaration(node)) {
            return this.convertTypeAliasDeclaration(node);
        }
        if (ts.isVariableStatement(node)) {
            return this.convertVariableStatement(node);
        }
        if (ts.isExportDeclaration(node) || ts.isExportAssignment(node)) {
            return this.convertExportDeclaration(node);
        }
        if (ts.isModuleDeclaration(node)) {
            return this.convertNamespaceDeclaration(node);
        }
        if (node.kind == ts.SyntaxKind.NamespaceExportDeclaration) {
            // just ignore `export as namespace FOO` statements…
            return this.removeStatement(node);
        }
        if (ts.isEmptyStatement(node)) {
            return this.removeStatement(node);
        }
        // istanbul ignore else
        if (ts.isImportDeclaration(node) || ts.isImportEqualsDeclaration(node)) {
            return this.convertImportDeclaration(node);
        }
        else {
            throw new UnsupportedSyntaxError(node);
        }
    }
    removeStatement(node) {
        this.pushStatement(withStartEnd({
            type: "ExpressionStatement",
            expression: { type: "Literal", value: "pls remove me" },
        }, node));
    }
    convertNamespaceDeclaration(node) {
        // we want to keep `declare global` augmentations, and we want to
        // pull in all the things referenced inside.
        // so for this case, we need to figure out some way so that rollup does
        // the right thing and not rename these…
        const isGlobalAugmentation = node.flags & ts.NodeFlags.GlobalAugmentation;
        if (isGlobalAugmentation || !ts.isIdentifier(node.name)) {
            const scope = this.createDeclaration(node);
            scope.convertNamespace(node);
            return;
        }
        this.maybeMarkAsExported(node, node.name);
        const scope = this.createDeclaration(node, node.name);
        scope.fixModifiers(node);
        scope.pushIdentifierReference(node.name);
        scope.convertNamespace(node);
    }
    convertEnumDeclaration(node) {
        this.maybeMarkAsExported(node, node.name);
        const scope = this.createDeclaration(node, node.name);
        scope.fixModifiers(node);
        scope.pushIdentifierReference(node.name);
    }
    convertFunctionDeclaration(node) {
        // istanbul ignore if
        if (!node.name) {
            throw new UnsupportedSyntaxError(node, `FunctionDeclaration should have a name`);
        }
        this.maybeMarkAsExported(node, node.name);
        const scope = this.createDeclaration(node, node.name);
        scope.fixModifiers(node);
        scope.pushIdentifierReference(node.name);
        scope.convertParametersAndType(node);
    }
    convertClassOrInterfaceDeclaration(node) {
        // istanbul ignore if
        if (!node.name) {
            throw new UnsupportedSyntaxError(node, `ClassDeclaration / InterfaceDeclaration should have a name`);
        }
        this.maybeMarkAsExported(node, node.name);
        const scope = this.createDeclaration(node, node.name);
        scope.fixModifiers(node);
        const typeVariables = scope.convertTypeParameters(node.typeParameters);
        scope.convertHeritageClauses(node);
        scope.convertMembers(node.members);
        scope.popScope(typeVariables);
    }
    convertTypeAliasDeclaration(node) {
        this.maybeMarkAsExported(node, node.name);
        const scope = this.createDeclaration(node, node.name);
        scope.fixModifiers(node);
        const typeVariables = scope.convertTypeParameters(node.typeParameters);
        scope.convertTypeNode(node.type);
        scope.popScope(typeVariables);
    }
    convertVariableStatement(node) {
        const { declarations } = node.declarationList;
        // istanbul ignore if
        if (declarations.length !== 1) {
            throw new UnsupportedSyntaxError(node, `VariableStatement with more than one declaration not yet supported`);
        }
        for (const decl of declarations) {
            // istanbul ignore if
            if (!ts.isIdentifier(decl.name)) {
                throw new UnsupportedSyntaxError(node, `VariableDeclaration must have a name`);
            }
            this.maybeMarkAsExported(node, decl.name);
            const scope = this.createDeclaration(node, decl.name);
            scope.fixModifiers(node);
            scope.convertTypeNode(decl.type);
        }
    }
    convertExportDeclaration(node) {
        if (ts.isExportAssignment(node)) {
            this.pushStatement(withStartEnd({
                type: "ExportDefaultDeclaration",
                declaration: convertExpression(node.expression),
            }, node));
            return;
        }
        const source = node.moduleSpecifier ? convertExpression(node.moduleSpecifier) : undefined;
        if (!node.exportClause) {
            // export * from './other'
            this.pushStatement(withStartEnd({
                type: "ExportAllDeclaration",
                source,
                exported: null,
            }, node));
        }
        else if (ts.isNamespaceExport(node.exportClause)) {
            // export * as name from './other'
            this.pushStatement(withStartEnd({
                type: "ExportAllDeclaration",
                source,
                exported: createIdentifier(node.exportClause.name),
            }, node));
        }
        else {
            // export { name } from './other'
            const specifiers = [];
            for (const elem of node.exportClause.elements) {
                specifiers.push(this.convertExportSpecifier(elem));
            }
            this.pushStatement(withStartEnd({
                type: "ExportNamedDeclaration",
                declaration: null,
                specifiers,
                source,
            }, node));
        }
    }
    convertImportDeclaration(node) {
        if (ts.isImportEqualsDeclaration(node)) {
            // assume its like `import default`
            if (!ts.isExternalModuleReference(node.moduleReference)) {
                throw new UnsupportedSyntaxError(node, "ImportEquals should have a literal source.");
            }
            this.pushStatement(withStartEnd({
                type: "ImportDeclaration",
                specifiers: [
                    {
                        type: "ImportDefaultSpecifier",
                        local: createIdentifier(node.name),
                    },
                ],
                source: convertExpression(node.moduleReference.expression),
            }, node));
            return;
        }
        const source = convertExpression(node.moduleSpecifier);
        const specifiers = node.importClause && node.importClause.namedBindings
            ? this.convertNamedImportBindings(node.importClause.namedBindings)
            : [];
        if (node.importClause && node.importClause.name) {
            specifiers.push({
                type: "ImportDefaultSpecifier",
                local: createIdentifier(node.importClause.name),
            });
        }
        this.pushStatement(withStartEnd({
            type: "ImportDeclaration",
            specifiers,
            source,
        }, node));
    }
    convertNamedImportBindings(node) {
        if (ts.isNamedImports(node)) {
            return node.elements.map((el) => {
                const local = createIdentifier(el.name);
                const imported = el.propertyName ? createIdentifier(el.propertyName) : local;
                return {
                    type: "ImportSpecifier",
                    local,
                    imported,
                };
            });
        }
        return [
            {
                type: "ImportNamespaceSpecifier",
                local: createIdentifier(node.name),
            },
        ];
    }
    convertExportSpecifier(node) {
        const exported = createIdentifier(node.name);
        return {
            type: "ExportSpecifier",
            exported: exported,
            local: node.propertyName ? createIdentifier(node.propertyName) : exported,
        };
    }
}

const tsx = /\.(t|j)sx?$/;
const plugin = (options = {}) => {
    const { respectExternal = false, compilerOptions = {} } = options;
    // There exists one Program object per entry point,
    // except when all entry points are ".d.ts" modules.
    let programs = [];
    function getModule(fileName) {
        let source;
        let program;
        // Create any `ts.SourceFile` objects on-demand for ".d.ts" modules,
        // but only when there are zero ".ts" entry points.
        if (!programs.length && fileName.endsWith(dts)) {
            const code = ts.sys.readFile(fileName, "utf8");
            if (code)
                source = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true);
        }
        else {
            // Rollup doesn't tell you the entry point of each module in the bundle,
            // so we need to ask every TypeScript program for the given filename.
            program = programs.find((p) => (source = p.getSourceFile(fileName)));
            if (!program && ts.sys.fileExists(fileName)) {
                programs.push((program = createProgram(fileName, compilerOptions)));
                source = program.getSourceFile(fileName);
            }
        }
        return { source, program };
    }
    // Parse a TypeScript module into an ESTree program.
    const typeReferences = new Set();
    // All the fixups we have applied, which we need to fix in the final render step
    const fixups = [];
    function transformFile(input) {
        input = reorderStatements(input);
        let code = input.getFullText();
        const transformer = new Transformer(input);
        const output = transformer.transform();
        for (const ref of output.typeReferences) {
            typeReferences.add(ref);
        }
        // apply fixups, which means replacing certain text ranges before we hand off the code to rollup
        for (const fixup of output.fixups) {
            let placeholder = `✂${fixups.length}`;
            const len = fixup.range.end - fixup.range.start;
            if (placeholder.length + 1 > len) {
                throw new Error("Unable to apply fixup.");
            }
            placeholder = placeholder.padEnd(len - 1) + "✂";
            code = code.slice(0, fixup.range.start) + placeholder + code.slice(fixup.range.end);
            fixups.push(fixup.replaceWith);
        }
        if (process.env.DTS_DUMP_AST) {
            console.log(input.fileName);
            console.log(code);
            console.log(JSON.stringify(output.ast.body, undefined, 2));
        }
        return { code, ast: output.ast };
    }
    return {
        name: "dts",
        options(options) {
            let { input = [] } = options;
            if (!Array.isArray(input)) {
                input = typeof input === "string" ? [input] : Object.values(input);
            }
            else if (input.length > 1) {
                // when dealing with multiple unnamed inputs, transform the inputs into
                // an explicit object, which strips the file extension
                options.input = {};
                for (const filename of input) {
                    const name = path__default['default'].basename(filename).replace(/((\.d)?\.(t|j)sx?)$/, "");
                    options.input[name] = filename;
                }
            }
            programs = createPrograms(Object.values(input), compilerOptions);
            return Object.assign(Object.assign({}, options), { treeshake: {
                    moduleSideEffects: "no-external",
                    propertyReadSideEffects: true,
                    unknownGlobalSideEffects: false,
                } });
        },
        outputOptions(options) {
            return Object.assign(Object.assign({}, options), { chunkFileNames: options.chunkFileNames || "[name]-[hash]" + dts, entryFileNames: options.entryFileNames || "[name]" + dts, format: "es", exports: "named", compact: false, freeze: true, interop: false, namespaceToStringTag: false, strict: false });
        },
        load(id) {
            if (!tsx.test(id)) {
                return null;
            }
            if (id.endsWith(dts)) {
                const { source } = getModule(id);
                return source ? transformFile(source) : null;
            }
            // Always try ".d.ts" before ".tsx?"
            const declarationId = id.replace(tsx, dts);
            let module = getModule(declarationId);
            if (module.source) {
                return transformFile(module.source);
            }
            // Generate in-memory ".d.ts" modules from ".tsx?" modules!
            module = getModule(id);
            if (!module.source || !module.program) {
                return null;
            }
            let generated;
            const { emitSkipped, diagnostics } = module.program.emit(module.source, (_, declarationText) => {
                const source = ts.createSourceFile(declarationId, declarationText, ts.ScriptTarget.Latest, true);
                generated = transformFile(source);
            }, undefined, // cancellationToken
            true);
            if (emitSkipped) {
                const errors = diagnostics.filter((diag) => diag.category === ts.DiagnosticCategory.Error);
                if (errors.length) {
                    console.error(ts.formatDiagnostics(errors, formatHost));
                    this.error("Failed to compile. Check the logs above.");
                }
            }
            return generated;
        },
        resolveId(source, importer) {
            if (!importer) {
                return;
            }
            // normalize directory separators to forward slashes, as apparently typescript expects that?
            importer = importer.split("\\").join("/");
            // resolve this via typescript
            const { resolvedModule } = ts.nodeModuleNameResolver(source, importer, compilerOptions, ts.sys);
            if (!resolvedModule) {
                return;
            }
            if (!respectExternal && resolvedModule.isExternalLibraryImport) {
                // here, we define everything that comes from `node_modules` as `external`.
                return { id: source, external: true };
            }
            else {
                // using `path.resolve` here converts paths back to the system specific separators
                return { id: path__default['default'].resolve(resolvedModule.resolvedFileName) };
            }
        },
        renderChunk(code, chunk) {
            code = code.replace(/✂(\d+)\s*✂/g, (_, num) => fixups[num]);
            const source = ts.createSourceFile(chunk.fileName, code, ts.ScriptTarget.Latest, true);
            const fixer = new NamespaceFixer(source);
            code = writeBlock(Array.from(typeReferences, (ref) => `/// <reference types="${ref}" />`));
            code += fixer.fix();
            return { code, map: { mappings: "" } };
        },
    };
};
function writeBlock(codes) {
    if (codes.length) {
        return codes.join("\n") + "\n";
    }
    return "";
}

exports.default = plugin;
