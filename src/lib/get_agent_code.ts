import ts from 'typescript'

export function get_agent_code(file_path: string) {
  const program = ts.createProgram([file_path], {
    strict: true,
    target: ts.ScriptTarget.Latest,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    noEmit: true,
    allowImportingTsExtensions: true,
  })

  const checker = program.getTypeChecker()
  const source_file = program.getSourceFile(file_path)
  if (!source_file) throw new Error(`Could not parse file: ${file_path}`)

  const module_symbol = checker.getSymbolAtLocation(source_file)
  if (!module_symbol) throw new Error(`No module symbol for: ${file_path}`)

  const exports = checker.getExportsOfModule(module_symbol)
  const main_export = exports.find((e) => e.getName() === 'main')
  if (!main_export) throw new Error(`main function not found in ${file_path}`)

  const tool_exports = exports.filter((e) => {
    const name = e.getName()
    return name !== 'default' && name !== 'main'
  })

  const declarations = tool_exports.map((s) => build_fn_declaration(s, checker)).filter(Boolean)
  const main_source = build_main_source(source_file, main_export)

  return [...declarations, '', main_source].join('\n')
}

function resolve_symbol(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Symbol {
  if (symbol.flags & ts.SymbolFlags.Alias) {
    return checker.getAliasedSymbol(symbol)
  }
  return symbol
}

function get_call_signature(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Signature | undefined {
  const resolved = resolve_symbol(symbol, checker)
  const decl = resolved.valueDeclaration ?? resolved.declarations?.[0]
  if (!decl) return undefined

  if (ts.isFunctionDeclaration(decl) || ts.isMethodDeclaration(decl)) {
    return checker.getSignatureFromDeclaration(decl)
  }

  if (ts.isVariableDeclaration(decl) && decl.initializer && ts.isArrowFunction(decl.initializer)) {
    return checker.getSignatureFromDeclaration(decl.initializer)
  }

  const type = checker.getTypeOfSymbolAtLocation(resolved, decl)
  return type.getCallSignatures()[0]
}

function is_arrow_export(symbol: ts.Symbol, checker: ts.TypeChecker): boolean {
  const resolved = resolve_symbol(symbol, checker)
  const decl = resolved.valueDeclaration ?? resolved.declarations?.[0]
  if (!decl) return false
  return ts.isVariableDeclaration(decl) && !!decl.initializer && ts.isArrowFunction(decl.initializer)
}

function is_async_export(symbol: ts.Symbol, checker: ts.TypeChecker): boolean {
  const resolved = resolve_symbol(symbol, checker)
  const decl = resolved.valueDeclaration ?? resolved.declarations?.[0]
  if (!decl) return false

  if ('modifiers' in decl) {
    const mods = decl.modifiers as ts.NodeArray<ts.ModifierLike> | undefined
    return !!mods?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword)
  }
  if (ts.isVariableDeclaration(decl) && decl.initializer && 'modifiers' in decl.initializer) {
    const mods = (decl.initializer as any).modifiers as ts.NodeArray<ts.ModifierLike> | undefined
    return !!mods?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword)
  }
  return false
}

function type_to_string(t: ts.Type, checker: ts.TypeChecker): string {
  return checker.typeToString(t, undefined, ts.TypeFormatFlags.NoTruncation)
}

function build_fn_declaration(symbol: ts.Symbol, checker: ts.TypeChecker): string {
  const name = symbol.getName()
  const sig = get_call_signature(symbol, checker)
  if (!sig) return ''

  const arrow = is_arrow_export(symbol, checker)
  const async_str = is_async_export(symbol, checker) ? 'async ' : ''

  const tparams = sig.getTypeParameters?.() ?? []
  const tparams_str = tparams.length > 0 ? `<${tparams.map((tp) => type_to_string(tp, checker)).join(', ')}>` : ''

  const params = sig
    .getParameters()
    .map((p) => {
      const p_decl = p.valueDeclaration as ts.ParameterDeclaration | undefined
      const p_name = p.getName()
      const p_type = p_decl ? type_to_string(checker.getTypeOfSymbolAtLocation(p, p_decl), checker) : 'any'
      const opt = p_decl?.questionToken ? '?' : ''
      const rest = p_decl?.dotDotDotToken ? '...' : ''
      return `${rest}${p_name}${opt}: ${p_type}`
    })
    .join(', ')

  const ret_type = type_to_string(sig.getReturnType(), checker)

  if (arrow) {
    return `declare const ${name}: ${async_str}(${params}) => ${ret_type};`
  }
  return `declare ${async_str}function ${name}${tparams_str}(${params}): ${ret_type};`
}

function build_main_source(source_file: ts.SourceFile, main_symbol: ts.Symbol): string {
  const decl = main_symbol.valueDeclaration ?? main_symbol.declarations?.[0]
  if (!decl || !ts.isFunctionDeclaration(decl)) {
    return 'function main() { /* could not read main */ }'
  }
  return decl.getText(source_file)
}
