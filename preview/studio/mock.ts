// A stand-in for the Gears API, so the Studio's sections run in the preview: the Online Shop's
// models and rows, a SQL translation of builder queries, saved queries and generated code. The types
// match the Studio's api.ts.

export type EnvironmentKind = 'Development' | 'Testing' | 'Production'
export const environmentKinds: EnvironmentKind[] = ['Development', 'Testing', 'Production']

export type FieldType = 'Key' | 'Text' | 'Integer' | 'Decimal' | 'Double' | 'Boolean' | 'DateTime' | 'Date' | 'Time' | 'Guid'
export type FilterOperator = 'Equals' | 'NotEquals' | 'Contains' | 'NotContains' | 'StartsWith' | 'EndsWith' | 'GreaterThan'
  | 'GreaterThanOrEqual' | 'LessThan' | 'LessThanOrEqual' | 'Between' | 'In' | 'NotIn' | 'IsEmpty' | 'IsNotEmpty'
export interface FilterCondition { kind: 'condition'; field: string; operator: FilterOperator; value?: string | null; values?: string[] | null }
export interface FilterGroup { kind: 'group'; logic: 'And' | 'Or'; children: (FilterGroup | FilterCondition)[] }
export interface QueryModel {
  source: string
  columns: string[]
  filter: FilterGroup | null
  sort: { field: string; descending: boolean }[]
  skip: number
  take: number | null
}
export interface QueryField { name: string; type: FieldType; nullable: boolean; operators: FilterOperator[] }
export interface QuerySource { category: string; name: string; fields: QueryField[] }
export interface QuerySchema { dialect: string; language: string; canWrite: boolean; sources: QuerySource[] }
export interface Translation { dialect: string; text: string; language: string; warnings: string[] }
export interface QueryResult {
  columns: { name: string; type: FieldType | null }[]
  rows: unknown[][]
  total: number | null
  affected: number | null
  truncated: boolean
  milliseconds: number
}
export interface SavedQueryInput { name: string; shared: boolean; mode: 'Builder' | 'Editor'; environment: EnvironmentKind; definition: string }
export interface SavedQuery extends SavedQueryInput { id: string; ownerName: string; mine: boolean; canEdit: boolean; updated: string }

// ---- The models ----

const text: FilterOperator[] = ['Contains', 'Equals', 'NotEquals', 'NotContains', 'StartsWith', 'EndsWith', 'In', 'NotIn', 'IsEmpty', 'IsNotEmpty']
const number: FilterOperator[] = ['Equals', 'NotEquals', 'GreaterThan', 'GreaterThanOrEqual', 'LessThan', 'LessThanOrEqual', 'Between', 'In', 'NotIn']
const date: FilterOperator[] = ['Equals', 'GreaterThan', 'LessThan', 'Between', 'IsEmpty', 'IsNotEmpty']
const operatorsFor: Record<FieldType, FilterOperator[]> = {
  Key: ['Equals', 'NotEquals', 'In', 'NotIn'], Text: text, Integer: number, Decimal: number, Double: number,
  Boolean: ['Equals', 'NotEquals'], DateTime: date, Date: date, Time: date, Guid: ['Equals', 'NotEquals']
}
const field = (name: string, type: FieldType, nullable = false): QueryField => ({ name, type, nullable, operators: operatorsFor[type] })

const sources: QuerySource[] = [
  { category: 'Catalog', name: 'Product', fields: [field('Id', 'Key'), field('Name', 'Text'), field('Sku', 'Text'), field('Price', 'Decimal'), field('Stock', 'Integer'), field('Active', 'Boolean'), field('Added', 'Date')] },
  { category: 'Catalog', name: 'Brand', fields: [field('Id', 'Key'), field('Name', 'Text'), field('Country', 'Text', true)] },
  { category: 'Customers', name: 'Customer', fields: [field('Id', 'Key'), field('Name', 'Text'), field('Email', 'Text'), field('City', 'Text', true), field('Joined', 'Date')] },
  { category: 'Orders', name: 'Order', fields: [field('Id', 'Key'), field('Customer', 'Text'), field('Total', 'Decimal'), field('Placed', 'DateTime'), field('Paid', 'Boolean')] }
]

// Rows, made up the same way each time.
const pick = <T>(list: T[], i: number) => list[i % list.length]
const id = (i: number) => (0x65a1f0000000 + i * 7919).toString(16).padStart(24, '0')
const things = ['Desk lamp', 'Notebook', 'Fountain pen', 'Backpack', 'Water bottle', 'Headphones', 'Mouse pad', 'Desk organizer', 'Phone stand', 'Sticky notes']
const names = ['Jordan Diaz', 'Alex Brown', 'Casey Dunn', 'Morgan Lee', 'Riley Chen', 'Sam Patel', 'Taylor Kim', 'Jamie Ortiz']
const cities = ['Denver', 'Austin', 'Portland', null, 'Chicago', 'Boston']
const rows: Record<string, Record<string, unknown>[]> = {
  Product: Array.from({ length: 64 }, (_, i) => ({
    Id: id(i), Name: `${pick(things, i)}${i >= things.length ? ` ${Math.floor(i / things.length) + 1}` : ''}`, Sku: `SKU-${1000 + i}`,
    Price: Math.round((4 + (i * 37) % 120 + 0.99) * 100) / 100, Stock: (i * 13) % 50, Active: i % 7 !== 0,
    Added: `2026-${String(1 + i % 10).padStart(2, '0')}-${String(1 + (i * 3) % 28).padStart(2, '0')}`
  })),
  Brand: ['Northwind', 'Contoso', 'Fabrikam', 'Tailspin'].map((name, i) => ({ Id: id(100 + i), Name: name, Country: pick(['US', 'DE', null, 'JP'], i) })),
  Customer: names.map((name, i) => ({
    Id: id(200 + i), Name: name, Email: `${name.split(' ')[0].toLowerCase()}@example.com`, City: pick(cities, i), Joined: `2025-${String(1 + i).padStart(2, '0')}-15`
  })),
  Order: Array.from({ length: 40 }, (_, i) => ({
    Id: id(300 + i), Customer: pick(names, i * 3), Total: Math.round((20 + (i * 53) % 400 + 0.5) * 100) / 100,
    Placed: `2026-10-${String(1 + i % 28).padStart(2, '0')}T${String(8 + i % 10).padStart(2, '0')}:30:00`, Paid: i % 4 !== 1
  }))
}

const wait = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms))

// ---- Queries ----

const table = (source: string) => `"${sources.find(s => s.name === source)?.category}_${source}"`
const numeric = (type: FieldType | undefined) => type === 'Integer' || type === 'Decimal' || type === 'Double'
const fieldOf = (source: string, name: string) => sources.find(s => s.name === source)?.fields.find(f => f.name === name)

function literal(source: string, name: string, value: string | null | undefined) {
  const type = fieldOf(source, name)?.type
  if (type === 'Boolean') return value === 'true' ? '1' : '0'
  return numeric(type) && value !== '' && !isNaN(Number(value)) ? String(value) : `'${String(value ?? '').replace(/'/g, "''")}'`
}

function conditionSql(source: string, c: FilterCondition): string {
  const col = `"${c.field}"`
  const v = (x?: string | null) => literal(source, c.field, x)
  switch (c.operator) {
    case 'Equals': return `${col} = ${v(c.value)}`
    case 'NotEquals': return `${col} <> ${v(c.value)}`
    case 'Contains': return `${col} LIKE '%${c.value ?? ''}%'`
    case 'NotContains': return `${col} NOT LIKE '%${c.value ?? ''}%'`
    case 'StartsWith': return `${col} LIKE '${c.value ?? ''}%'`
    case 'EndsWith': return `${col} LIKE '%${c.value ?? ''}'`
    case 'GreaterThan': return `${col} > ${v(c.value)}`
    case 'GreaterThanOrEqual': return `${col} >= ${v(c.value)}`
    case 'LessThan': return `${col} < ${v(c.value)}`
    case 'LessThanOrEqual': return `${col} <= ${v(c.value)}`
    case 'Between': return `${col} BETWEEN ${v(c.values?.[0])} AND ${v(c.values?.[1])}`
    case 'In': return `${col} IN (${(c.values ?? []).map(x => v(x)).join(', ')})`
    case 'NotIn': return `${col} NOT IN (${(c.values ?? []).map(x => v(x)).join(', ')})`
    case 'IsEmpty': return `(${col} IS NULL OR ${col} = '')`
    case 'IsNotEmpty': return `(${col} IS NOT NULL AND ${col} <> '')`
  }
}

function groupSql(source: string, group: FilterGroup, nested = false): string {
  const parts = group.children.map(child => child.kind === 'group' ? groupSql(source, child, true) : conditionSql(source, child)).filter(Boolean)
  const joined = parts.join(group.logic === 'And' ? ' AND ' : ' OR ')
  return nested && parts.length > 1 ? `(${joined})` : joined
}

function translate(query: QueryModel): Translation {
  const columns = query.columns.length ? query.columns.map(c => `"${c}"`).join(', ') : '*'
  const where = query.filter ? groupSql(query.source, query.filter) : ''
  const order = query.sort.map(s => `"${s.field}"${s.descending ? ' DESC' : ''}`).join(', ')
  const lines = [`SELECT ${columns}`, `FROM ${table(query.source)}`]
  if (where) lines.push(`WHERE ${where}`)
  if (order) lines.push(`ORDER BY ${order}`)
  if (query.take) lines.push(`LIMIT ${query.take}${query.skip ? ` OFFSET ${query.skip}` : ''}`)
  const warnings = query.sort.some(s => fieldOf(query.source, s.field)?.type === 'Decimal')
    ? ['SQLite sorts decimals as text, so this sort runs in memory.'] : []
  return { dialect: 'Sqlite', text: lines.join('\n'), language: 'sql', warnings }
}

function matches(row: Record<string, unknown>, c: FilterCondition): boolean {
  const value = row[c.field]
  const s = value == null ? '' : String(value).toLowerCase()
  const target = (c.value ?? '').toLowerCase()
  const n = Number(value)
  switch (c.operator) {
    case 'Equals': return s === target
    case 'NotEquals': return s !== target
    case 'Contains': return s.includes(target)
    case 'NotContains': return !s.includes(target)
    case 'StartsWith': return s.startsWith(target)
    case 'EndsWith': return s.endsWith(target)
    case 'GreaterThan': return typeof value === 'number' ? n > Number(c.value) : s > target
    case 'GreaterThanOrEqual': return typeof value === 'number' ? n >= Number(c.value) : s >= target
    case 'LessThan': return typeof value === 'number' ? n < Number(c.value) : s < target
    case 'LessThanOrEqual': return typeof value === 'number' ? n <= Number(c.value) : s <= target
    case 'Between': {
      const [from, to] = (c.values ?? []).map(x => x.toLowerCase())
      return typeof value === 'number' ? n >= Number(from) && n <= Number(to) : s >= from && s <= to
    }
    case 'In': return (c.values ?? []).some(x => x.toLowerCase() === s)
    case 'NotIn': return !(c.values ?? []).some(x => x.toLowerCase() === s)
    case 'IsEmpty': return s === ''
    case 'IsNotEmpty': return s !== ''
  }
}

function test(row: Record<string, unknown>, group: FilterGroup): boolean {
  if (!group.children.length) return true
  const results = group.children.map(child => child.kind === 'group' ? test(row, child) : matches(row, child))
  return group.logic === 'And' ? results.every(Boolean) : results.some(Boolean)
}

function run(query: QueryModel): QueryResult {
  const started = performance.now()
  const source = sources.find(s => s.name === query.source)!
  let list = (rows[query.source] ?? []).filter(row => !query.filter || test(row, query.filter))
  for (const s of [...query.sort].reverse()) {
    list = [...list].sort((a, b) => {
      const x = a[s.field] as never, y = b[s.field] as never
      return (x < y ? -1 : x > y ? 1 : 0) * (s.descending ? -1 : 1)
    })
  }
  const total = list.length
  const page = list.slice(query.skip, query.take ? query.skip + query.take : undefined)
  const fields = query.columns.length ? source.fields.filter(f => query.columns.includes(f.name)) : source.fields
  return {
    columns: fields.map(f => ({ name: f.name, type: f.type })),
    rows: page.map(row => fields.map(f => row[f.name] ?? null)),
    total, affected: null, truncated: false, milliseconds: Math.max(1, Math.round(performance.now() - started + 3))
  }
}

// ---- Saved queries ----

let saved: SavedQuery[] = [
  {
    id: 'q1', name: 'Low stock', shared: false, mode: 'Builder', environment: 'Development', ownerName: 'Jordan Diaz', mine: true, canEdit: true, updated: '2026-10-30',
    definition: JSON.stringify({
      source: 'Product', columns: ['Name', 'Sku', 'Stock'], take: 25, sort: [{ field: 'Stock', descending: false }],
      filter: { kind: 'group', logic: 'And', children: [{ kind: 'condition', field: 'Stock', operator: 'LessThan', value: '10', values: [] }] }
    })
  },
  { id: 'q2', name: 'Unpaid orders', shared: true, mode: 'Editor', environment: 'Development', ownerName: 'Alex Brown', mine: false, canEdit: false, updated: '2026-10-28', definition: 'SELECT "Customer", "Total", "Placed"\nFROM "Orders_Order"\nWHERE "Paid" = 0\nORDER BY "Placed" DESC' },
  { id: 'q3', name: 'Customers by city', shared: true, mode: 'Editor', environment: 'Production', ownerName: 'Jordan Diaz', mine: true, canEdit: true, updated: '2026-10-25', definition: 'SELECT "City", COUNT(*)\nFROM "Customers_Customer"\nGROUP BY "City"' }
]
let nextId = 4

// ---- Generated code ----

function csharp(source: QuerySource) {
  const types: Record<FieldType, string> = {
    Key: 'Key', Text: 'string', Integer: 'int', Decimal: 'decimal', Double: 'double', Boolean: 'bool',
    DateTime: 'DateTime', Date: 'DateOnly', Time: 'TimeOnly', Guid: 'Guid'
  }
  const props = source.fields.filter(f => f.name !== 'Id').map(f =>
    `${f.type === 'Text' && !f.nullable ? '    [Required]\n' : ''}    public ${types[f.type]}${f.nullable ? '?' : ''} ${f.name} { get; set; }${f.type === 'Text' && !f.nullable ? ' = "";' : ''}`)
  return `// <auto-generated>
// Generated by Gears from the ${source.name} model. Changes here are replaced on the next save;
// edit the model in the Studio, or this project's clone.
// </auto-generated>
using System.ComponentModel.DataAnnotations;
using Ternary.Data;

namespace OnlineShop.Models.${source.category};

[DbModel("${source.category}")]
public partial class ${source.name} : DbModel
{
${props.join('\n\n')}
}
`
}

export const api = {
  async querySchema(environment: EnvironmentKind): Promise<QuerySchema> {
    await wait()
    // Testing and Production are at an older commit, without the Orders category.
    const list = environment === 'Development' ? sources : sources.filter(s => s.category !== 'Orders')
    return { dialect: 'Sqlite', language: 'sql', canWrite: environment === 'Development', sources: list }
  },
  async translateQuery(query: QueryModel): Promise<Translation> {
    await wait(60)
    return translate(query)
  },
  async runQuery(query: QueryModel): Promise<{ query: Translation; result: QueryResult }> {
    await wait(350)
    return { query: translate(query), result: run(query) }
  },
  // Runs editor text: here only "FROM <table>" is understood, enough to show results.
  async rawQuery(text: string, allowWrites: boolean): Promise<QueryResult> {
    await wait(350)
    if (/^\s*(insert|update|delete)\b/i.test(text)) {
      if (!allowWrites) throw new Error('This query changes data. Turn on "Allow changes" to run it.')
      return { columns: [], rows: [], total: null, affected: 1, truncated: false, milliseconds: 4 }
    }
    const name = text.match(/from\s+"?(\w+?)_(\w+)"?/i)?.[2]
    const source = sources.find(s => s.name === name)
    if (!source) throw new Error('No such table. Try one of the tables the builder shows, such as "Catalog_Product".')
    const result = run({ source: source.name, columns: [], filter: null, sort: [], skip: 0, take: 100 })
    return { ...result, total: null, truncated: (rows[source.name]?.length ?? 0) > 100 }
  },
  async savedQueries(): Promise<SavedQuery[]> {
    await wait(80)
    return [...saved]
  },
  async createQuery(input: SavedQueryInput): Promise<SavedQuery> {
    await wait()
    const query = { ...input, id: `q${nextId++}`, ownerName: 'Jordan Diaz', mine: true, canEdit: true, updated: '2026-10-31' }
    saved = [...saved, query]
    return query
  },
  async updateQuery(id: string, input: SavedQueryInput): Promise<SavedQuery> {
    await wait()
    const query = { ...saved.find(q => q.id === id)!, ...input, updated: '2026-10-31' }
    saved = saved.map(q => q.id === id ? query : q)
    return query
  },
  async deleteQuery(id: string) {
    await wait()
    saved = saved.filter(q => q.id !== id)
  },
  async code(): Promise<{ path: string; content: string }[]> {
    await wait(300)
    return sources.map(s => ({ path: `${s.category}/${s.name}.cs`, content: csharp(s) }))
  }
}

export function errorText(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}
