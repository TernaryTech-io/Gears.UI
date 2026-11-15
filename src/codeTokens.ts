// Light highlighting for TCodeBlock: JSON and YAML split into tokens, each with a kind the
// stylesheet colors (.t-code-key, .t-code-string, …). Text in, text out: nothing is parsed or
// evaluated, and the tokens' text joined together is exactly the code given.

export type CodeLanguage = 'json' | 'yaml' | 'text'

export type CodeTokenKind = 'key' | 'string' | 'number' | 'literal' | 'punctuation' | 'comment' | 'plain'

export interface CodeToken { kind: CodeTokenKind; text: string }

// Above this many characters the code is shown plain: highlighting would make too many elements.
export const maxHighlighted = 200_000

const jsonPattern = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],:])|(\s+)|([^"\s{}[\],:]+)/g

function json(code: string): CodeToken[] {
  const tokens: CodeToken[] = []
  for (const m of code.matchAll(jsonPattern)) {
    if (m[1] !== undefined) {
      tokens.push({ kind: m[2] !== undefined ? 'key' : 'string', text: m[1] })
      if (m[2] !== undefined) tokens.push({ kind: 'punctuation', text: m[2] })
    } else if (m[3] !== undefined) tokens.push({ kind: 'number', text: m[3] })
    else if (m[4] !== undefined) tokens.push({ kind: 'literal', text: m[4] })
    else if (m[5] !== undefined) tokens.push({ kind: 'punctuation', text: m[5] })
    else tokens.push({ kind: 'plain', text: m[0] })
  }
  return tokens
}

// A YAML scalar: quoted, a number, a literal, or plain text (with a comment after it, if any).
function yamlValue(value: string, tokens: CodeToken[]) {
  const comment = /(^|\s)#.*$/.exec(value)
  const body = comment ? value.slice(0, comment.index + comment[1].length) : value
  const text = body.trimEnd()
  const gap = body.slice(text.length)
  if (text.length) {
    const kind: CodeTokenKind = /^(["']).*\1$/.test(text) ? 'string'
      : /^-?(\d+(\.\d+)?([eE][+-]?\d+)?|\.inf|\.nan)$/i.test(text) ? 'number'
      : /^(true|false|null|~)$/i.test(text) ? 'literal'
      : /^[|>][+-]?$/.test(text) || /^[[\]{}]+$/.test(text) ? 'punctuation'
      : 'string'
    tokens.push({ kind, text })
  }
  if (gap) tokens.push({ kind: 'plain', text: gap })
  if (comment) tokens.push({ kind: 'comment', text: value.slice(comment.index + comment[1].length) })
}

const yamlKey = /^(\s*(?:-\s+)*)((?:"(?:\\.|[^"\\])*"|'[^']*'|(?!-\s)[^\s#'"][^#]*?))(:)(?=\s|$)(.*)$/
const yamlItem = /^(\s*)(-)(\s+|$)(.*)$/

function yaml(code: string): CodeToken[] {
  const tokens: CodeToken[] = []
  const lines = code.split('\n')
  // Inside a block scalar (after `|` or `>`): the indent of the line that began it.
  let block: number | null = null
  lines.forEach((line, i) => {
    let m: RegExpExecArray | null
    const indent = /^\s*/.exec(line)![0].length
    if (block !== null && (indent > block || !line.trim())) {
      tokens.push({ kind: 'string', text: line })
      if (i < lines.length - 1) tokens.push({ kind: 'plain', text: '\n' })
      return
    }
    block = /:\s*[|>][+-]?\s*(#.*)?$/.test(line) || /^\s*-\s+[|>][+-]?\s*$/.test(line) ? indent : null
    if (/^\s*#/.test(line)) tokens.push({ kind: 'comment', text: line })
    else if ((m = yamlKey.exec(line))) {
      if (m[1]) tokens.push({ kind: 'punctuation', text: m[1] })
      tokens.push({ kind: 'key', text: m[2] }, { kind: 'punctuation', text: m[3] })
      const rest = m[4]
      const lead = /^\s*/.exec(rest)![0]
      if (lead) tokens.push({ kind: 'plain', text: lead })
      yamlValue(rest.slice(lead.length), tokens)
    } else if ((m = yamlItem.exec(line))) {
      if (m[1]) tokens.push({ kind: 'plain', text: m[1] })
      tokens.push({ kind: 'punctuation', text: m[2] })
      if (m[3]) tokens.push({ kind: 'plain', text: m[3] })
      yamlValue(m[4], tokens)
    } else {
      const lead = /^\s*/.exec(line)![0]
      if (lead) tokens.push({ kind: 'plain', text: lead })
      yamlValue(line.slice(lead.length), tokens)
    }
    if (i < lines.length - 1) tokens.push({ kind: 'plain', text: '\n' })
  })
  return tokens
}

// Joins neighbours of the same kind, so there are fewer elements to draw.
function merge(tokens: CodeToken[]): CodeToken[] {
  const merged: CodeToken[] = []
  for (const token of tokens) {
    if (!token.text) continue
    const last = merged.at(-1)
    if (last && last.kind === token.kind) last.text += token.text
    else merged.push({ ...token })
  }
  return merged
}

// The code's tokens; one plain token for text, or code too long to highlight.
export function codeTokens(code: string, language: CodeLanguage = 'json'): CodeToken[] {
  if (language === 'text' || code.length > maxHighlighted) return code ? [{ kind: 'plain', text: code }] : []
  return merge(language === 'json' ? json(code) : yaml(code))
}
