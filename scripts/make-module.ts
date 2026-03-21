import fs from 'node:fs'
import path from 'node:path'

// --- Name utilities ---

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

function toPascalCase(str: string): string {
  return str
    .replace(/(^|[-_\s])(\w)/g, (_, _sep, char) => char.toUpperCase())
    .replace(/[-_\s]/g, '')
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function pluralize(word: string): string {
  const lower = word.toLowerCase()
  if (lower.endsWith('y') && !['ay', 'ey', 'iy', 'oy', 'uy'].some((v) => lower.endsWith(v))) {
    return word.slice(0, -1) + 'ies'
  }
  if (/(?:s|x|sh|ch)$/.test(lower)) {
    return word + 'es'
  }
  return word + 's'
}

// --- Argument parsing ---

function parseArgs(args: string[]): { name: string; entity: string } {
  let name = ''
  let entity = ''

  for (const arg of args) {
    if (arg.startsWith('--name=')) {
      name = arg.split('=')[1]
    } else if (arg.startsWith('--entity=')) {
      entity = arg.split('=')[1]
    }
  }

  if (!name || !entity) {
    console.error('Usage: npx tsx scripts/make-module.ts --name=<module> --entity=<Entity>')
    console.error('Example: npx tsx scripts/make-module.ts --name=catalog --entity=Product')
    process.exit(1)
  }

  return { name, entity }
}

// --- Placeholder replacement ---

function replacePlaceholders(
  content: string,
  vars: {
    moduleName: string
    ModuleName: string
    entityName: string
    EntityName: string
    entitiesName: string
  }
): string {
  return content
    .replace(/\{\{moduleName\}\}/g, vars.moduleName)
    .replace(/\{\{ModuleName\}\}/g, vars.ModuleName)
    .replace(/\{\{entityName\}\}/g, vars.entityName)
    .replace(/\{\{EntityName\}\}/g, vars.EntityName)
    .replace(/\{\{entitiesName\}\}/g, vars.entitiesName)
}

// --- File mapping: stub path → output path ---

function getFileMap(
  vars: {
    moduleName: string
    EntityName: string
    entitiesName: string
  }
): Array<{ stub: string; output: string }> {
  const mod = `modules/${vars.moduleName}`

  return [
    { stub: 'api.ts.stub', output: `${mod}/api.ts` },
    { stub: 'types.ts.stub', output: `${mod}/types.ts` },
    { stub: 'hooks.ts.stub', output: `${mod}/hooks.ts` },
    { stub: 'schemas.ts.stub', output: `${mod}/schemas.ts` },
    { stub: 'components/EntityList.tsx.stub', output: `${mod}/components/${vars.EntityName}List.tsx` },
    { stub: 'components/EntityForm.tsx.stub', output: `${mod}/components/${vars.EntityName}Form.tsx` },
    { stub: 'components/EntityList.stories.tsx.stub', output: `${mod}/components/${vars.EntityName}List.stories.tsx` },
    { stub: 'components/EntityForm.stories.tsx.stub', output: `${mod}/components/${vars.EntityName}Form.stories.tsx` },
    { stub: 'components/columns.tsx.stub', output: `${mod}/components/columns.tsx` },
    { stub: '__tests__/mod.test.ts.stub', output: `${mod}/__tests__/${vars.moduleName}.test.ts` },
    { stub: 'app-list/page.tsx.stub', output: `app/(dashboard)/${vars.entitiesName}/page.tsx` },
    { stub: 'app-new/page.tsx.stub', output: `app/(dashboard)/${vars.entitiesName}/new/page.tsx` },
  ]
}

// --- Main ---

function main() {
  const { name, entity } = parseArgs(process.argv.slice(2))

  const moduleName = toKebabCase(name)
  const ModuleName = toPascalCase(name)
  const entityName = toCamelCase(entity)
  const EntityName = toPascalCase(entity)
  const entitiesName = toKebabCase(pluralize(entity))

  const vars = { moduleName, ModuleName, entityName, EntityName, entitiesName }

  // Check if module already exists
  const moduleDir = path.resolve('modules', moduleName)
  if (fs.existsSync(moduleDir)) {
    console.error(`Error: Module "${moduleName}" already exists at ${moduleDir}`)
    process.exit(1)
  }

  const stubsDir = path.resolve('stubs', 'module')
  if (!fs.existsSync(stubsDir)) {
    console.error('Error: Stubs directory not found at stubs/module/')
    process.exit(1)
  }

  const fileMap = getFileMap(vars)
  const created: string[] = []

  for (const { stub, output } of fileMap) {
    const stubPath = path.join(stubsDir, stub)
    const outputPath = path.resolve(output)

    if (!fs.existsSync(stubPath)) {
      console.error(`Warning: Stub not found: ${stubPath}`)
      continue
    }

    const content = fs.readFileSync(stubPath, 'utf-8')
    const replaced = replacePlaceholders(content, vars)

    const dir = path.dirname(outputPath)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(outputPath, replaced, 'utf-8')

    created.push(output)
    console.log(`\u2713 Created ${output}`)
  }

  console.log(`\nModule "${moduleName}" created with ${created.length} files.`)
}

main()
