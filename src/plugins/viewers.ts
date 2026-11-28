// What TFileViewer shows a file with, and the libraries it loads the first time a kind is shown:
// docx-preview (Apache-2.0) for Word, ExcelJS (MIT) for Excel, markdown-it (MIT) for Markdown; PDFs
// through TPdfViewer (PDF.js); images, audio and video by the browser; text, code and CSV by Gears UI.
import type { CodeLanguage } from '../codeTokens'
import { once } from './once'

/** A file to view: its name, where its content is, and what's known of it. */
export interface ViewerFile {
  /** Its own key, when names repeat; the name otherwise. */
  id?: string
  name: string
  /** The content's address: shown by the browser (images, media, PDFs) or read (everything else). */
  src: string
  /** Its media type, when known; the name's extension decides otherwise. */
  type?: string | null
  size?: number | null
  /** Where Download gets it (the content's address by default); false for no Download. */
  download?: string | false
  /** Reads the content, for a source the browser can't just fetch (a header to send, another origin). */
  load?: () => Promise<Blob>
}

export type ViewerKind = 'image' | 'video' | 'audio' | 'pdf' | 'markdown' | 'csv' | 'docx' | 'xlsx' | 'text' | 'none'

const extensions: Record<string, ViewerKind> = {
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', svg: 'image', bmp: 'image', avif: 'image', ico: 'image',
  mp4: 'video', webm: 'video', ogv: 'video', m4v: 'video', mov: 'video',
  mp3: 'audio', wav: 'audio', ogg: 'audio', oga: 'audio', m4a: 'audio', aac: 'audio', flac: 'audio', opus: 'audio',
  pdf: 'pdf',
  md: 'markdown', markdown: 'markdown',
  csv: 'csv', tsv: 'csv',
  docx: 'docx',
  xlsx: 'xlsx', xlsm: 'xlsx',
  txt: 'text', log: 'text', json: 'text', jsonl: 'text', ndjson: 'text', yaml: 'text', yml: 'text', xml: 'text', html: 'text', htm: 'text',
  css: 'text', scss: 'text', js: 'text', mjs: 'text', ts: 'text', vue: 'text', cs: 'text', csproj: 'text', sql: 'text', ini: 'text',
  conf: 'text', config: 'text', env: 'text', properties: 'text', toml: 'text', sh: 'text', ps1: 'text', py: 'text', java: 'text',
  go: 'text', rs: 'text', rb: 'text', php: 'text', c: 'text', h: 'text', cpp: 'text', gears: 'text'
}

export function extensionOf(name: string) {
  const dot = name.lastIndexOf('.')
  return dot < 0 ? '' : name.slice(dot + 1).toLowerCase()
}

/** How a file is shown: by its extension, then by its media type. */
export function viewerKind(file: Pick<ViewerFile, 'name' | 'type'>): ViewerKind {
  const byName = extensions[extensionOf(file.name)]
  if (byName) return byName
  const type = (file.type ?? '').toLowerCase()
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  if (type === 'application/pdf') return 'pdf'
  if (type === 'text/markdown') return 'markdown'
  if (type === 'text/csv' || type === 'text/tab-separated-values') return 'csv'
  if (type.includes('wordprocessingml')) return 'docx'
  if (type.includes('spreadsheetml')) return 'xlsx'
  if (type.startsWith('text/') || type === 'application/json' || type === 'application/xml' || type.endsWith('+json') || type.endsWith('+xml')) return 'text'
  return 'none'
}

/** The largest file each kind reads into the page; a larger one offers its download instead. */
export const viewerLimits: Partial<Record<ViewerKind, number>> = {
  text: 2 * 1024 * 1024,
  markdown: 2 * 1024 * 1024,
  csv: 5 * 1024 * 1024,
  docx: 25 * 1024 * 1024,
  xlsx: 15 * 1024 * 1024
}

/** The most rows (and columns) a CSV or a sheet shows. */
export const viewerRows = 1000
export const viewerColumns = 100

export function codeLanguageOf(name: string): CodeLanguage {
  const ext = extensionOf(name)
  if (ext === 'json' || ext === 'gears') return 'json'
  if (ext === 'yaml' || ext === 'yml') return 'yaml'
  return 'text'
}

export function viewerIcon(kind: ViewerKind) {
  return {
    image: 'photo', video: 'movie', audio: 'music', pdf: 'file-type-pdf', markdown: 'markdown', csv: 'file-spreadsheet',
    docx: 'file-type-docx', xlsx: 'file-spreadsheet', text: 'file-text', none: 'file'
  }[kind]
}

export function sizeText(bytes?: number | null) {
  if (bytes == null) return ''
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++ }
  return `${value.toFixed(value < 10 && unit > 0 ? 1 : 0)} ${units[unit]}`
}

/** Reads a file's content: its own `load`, or a fetch of `src` (with the page's cookies). */
export async function readFile(file: ViewerFile): Promise<Blob> {
  if (file.load) return file.load()
  const response = await fetch(file.src, { credentials: 'include' })
  if (!response.ok) throw new Error(response.status === 404 ? 'The file wasn\'t found.' : response.status === 401 || response.status === 403 ? 'You don\'t have access to this file.' : `The file couldn't be read (${response.status}).`)
  return response.blob()
}

/**
 * CSV (or tab-separated) text as rows of cells: quoted cells may hold the separator, quotes ("")
 * and line breaks. The separator is a tab for .tsv, otherwise whichever of `,` and `;` the first
 * line has more of. Stops after `max` rows; `more` says whether there were more.
 */
export function parseCsv(text: string, name = '', max = viewerRows): { rows: string[][]; more: boolean } {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  const firstLine = text.slice(0, text.indexOf('\n') < 0 ? text.length : text.indexOf('\n'))
  const separator = extensionOf(name) === 'tsv' ? '\t' : (firstLine.split(';').length > firstLine.split(',').length ? ';' : ',')
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"' && cell === '') quoted = true
    else if (c === separator) { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cell); cell = ''
      rows.push(row); row = []
      if (rows.length > max) return { rows: rows.slice(0, max), more: true }
    } else cell += c
  }
  if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row) }
  return { rows: rows.slice(0, max), more: rows.length > max }
}

// ---- The libraries ----

export const loadDocxPreview = once(() => import('docx-preview'))

export const loadExcelJs = once(async () => {
  const mod = await import('exceljs')
  return ((mod as unknown as { default?: typeof mod }).default ?? mod)
})

export const loadMarkdown = once(async () => {
  const { default: MarkdownIt } = await import('markdown-it')
  // No HTML from the file: it's text to read, not a page to run. Links open in a new tab.
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true })
  const render = md.renderer.rules.link_open ?? ((tokens, i, options, _env, self) => self.renderToken(tokens, i, options))
  md.renderer.rules.link_open = (tokens, i, options, env, self) => {
    tokens[i]!.attrSet('target', '_blank')
    tokens[i]!.attrSet('rel', 'noopener noreferrer')
    return render(tokens, i, options, env, self)
  }
  return md
})

/** A sheet's cells as text (numbers to the right), up to the row and column limits. */
export interface ViewerCell { text: string; number?: boolean }
export interface ViewerSheet { name: string; rows: ViewerCell[][]; more: boolean }

/**
 * A cell's value as a spreadsheet shows it, for the common number formats: decimals ("0.00"),
 * thousands ("#,##0"), percents, dates and times (kept in UTC, as the file stores them),
 * TRUE/FALSE, a formula's last result, rich text, links and errors. Other formats show the value.
 */
export function sheetCellText(value: unknown, format?: string): ViewerCell {
  if (value == null) return { text: '' }
  if (value instanceof Date) {
    const f = (format ?? '').toLowerCase()
    const time = /h|:s|am\/pm/.test(f)
    const day = /d|y/.test(f) || !time
    const iso = value.toISOString()
    return { text: [day ? iso.slice(0, 10) : '', time ? iso.slice(11, /:s/.test(f) ? 19 : 16) : ''].filter(Boolean).join(' '), number: true }
  }
  if (typeof value === 'number') return { text: formatNumber(value, format), number: true }
  if (typeof value === 'boolean') return { text: value ? 'TRUE' : 'FALSE' }
  if (typeof value === 'string') return { text: value }
  if (typeof value === 'object') {
    const v = value as { result?: unknown; formula?: string; sharedFormula?: string; richText?: { text: string }[]; text?: unknown; error?: string }
    if ('result' in v || v.formula || v.sharedFormula) return sheetCellText(v.result ?? '', format)
    if (v.richText) return { text: v.richText.map(r => r.text).join('') }
    if (v.error) return { text: v.error }
    if (v.text != null) return sheetCellText(v.text, format)
  }
  return { text: String(value) }
}

function formatNumber(value: number, format?: string) {
  const f = (format ?? '').split(';')[0]!.replace(/"[^"]*"|\[[^\]]*\]|\\./g, '')
  if (!f || f.toLowerCase() === 'general') return String(Math.round(value * 1e10) / 1e10)
  const percent = f.includes('%')
  const decimals = (/\.(0+)/.exec(f)?.[1] ?? '').length
  const grouped = /#,#|0,0/.test(f)
  const text = (percent ? value * 100 : value).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped })
  return percent ? `${text}%` : text
}
