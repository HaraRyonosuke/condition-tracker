#!/usr/bin/env node
/**
 * Cursor beforeShellExecution hook for `git commit`.
 *
 * 1. Auto-fix with Prettier + ESLint
 * 2. If checks still fail → deny; agent keeps fixing per docs/conventions.md
 * 3. If auto-fix changed anything → re-stage previously staged paths, report
 *    the changes, and permission: "ask" (commit only after user approves)
 * 4. If already clean with no auto-fix changes → allow
 */

import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import process from 'node:process'

const MAX_OUTPUT_CHARS = 4000

function readStdin() {
  try {
    return readFileSync(0, 'utf8')
  } catch {
    return ''
  }
}

function parseInput(raw) {
  if (!raw.trim()) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function isGitCommitCommand(command) {
  if (!command || typeof command !== 'string') return false
  return /\bgit\s+commit\b/i.test(command)
}

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    shell: true,
    cwd: process.cwd(),
    env: process.env,
  })
  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout: (result.stdout ?? '').trim(),
    stderr: (result.stderr ?? '').trim(),
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim(),
  }
}

function runNpmScript(script) {
  return { script, ...run('npm', ['run', script]) }
}

function lines(text) {
  return text ? text.split(/\r?\n/).filter(Boolean) : []
}

function truncate(text) {
  if (text.length <= MAX_OUTPUT_CHARS) return text
  return `${text.slice(0, MAX_OUTPUT_CHARS)}\n…(truncated)`
}

function respond(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`)
}

function deny(agentMessage, userMessage) {
  respond({
    permission: 'deny',
    user_message:
      userMessage ?? 'コミット前チェックで未解決の問題があるため、コミットを止めました。',
    agent_message: agentMessage,
  })
  process.exit(0)
}

const input = parseInput(readStdin())
const command = input.command ?? ''

if (!isGitCommitCommand(command)) {
  respond({ permission: 'allow' })
  process.exit(0)
}

const stagedBefore = new Set(lines(run('git', ['diff', '--cached', '--name-only']).stdout))

// 1) Auto-fix
runNpmScript('format')
runNpmScript('lint:fix')

// 2) Verify — keep fixing until clean
const formatCheck = runNpmScript('format:check')
const lintCheck = runNpmScript('lint')

if (!formatCheck.ok || !lintCheck.ok) {
  const sections = []
  if (!formatCheck.ok) {
    sections.push(
      `## Prettier (format:check) failed\n${truncate(formatCheck.output || '(no output)')}`,
    )
  }
  if (!lintCheck.ok) {
    sections.push(`## ESLint (lint) failed\n${truncate(lintCheck.output || '(no output)')}`)
  }

  deny(
    [
      'git commit はブロックしました。Prettier / ESLint が通るまでコミットしないでください。',
      '',
      'エラーが消えるまで繰り返してください:',
      '1. `docs/conventions.md` に沿ってリファクタする',
      '   （Vue ディレクティブは longform、テンプレートは PascalCase、未使用変数を消す、など）',
      '2. `npm run format` と `npm run lint:fix` を実行する',
      '3. `npm run format:check` と `npm run lint` が両方成功するまで直す',
      '4. 直したファイルを `git add` し、改めて `git commit` を試す',
      '5. 自動修正があった場合は報告し、あなたの許可を待ってからコミットする',
      '',
      ...sections,
    ].join('\n'),
  )
}

// 3) What did auto-fix change (working tree vs index)?
const fixedPaths = lines(run('git', ['diff', '--name-only']).stdout)
const fixedSet = new Set(fixedPaths)

if (fixedPaths.length > 0) {
  // Re-stage only paths that were already staged, so the pending commit includes fixes
  const toRestage = fixedPaths.filter((path) => stagedBefore.has(path))
  if (toRestage.length > 0) {
    run('git', ['add', '--', ...toRestage])
  }

  const diffStat = run('git', ['diff', '--cached', '--stat', '--', ...fixedPaths])
  const unstagedStill = lines(run('git', ['diff', '--name-only']).stdout)

  const reportLines = [
    'コミット前に Prettier / ESLint で次を自動修正しました。内容を確認し、許可する場合のみコミットを承認してください。',
    '',
    '修正したファイル:',
    ...fixedPaths.map((path) => {
      const restaged = toRestage.includes(path) ? '（ステージし直した）' : '（未ステージのまま）'
      return `- ${path} ${restaged}`
    }),
  ]

  if (diffStat.stdout) {
    reportLines.push('', 'ステージ済みの差分概要:', diffStat.stdout)
  }

  if (unstagedStill.length > 0) {
    reportLines.push(
      '',
      'まだ未ステージの修正があります（このコミットには入りません）:',
      ...unstagedStill.map((path) => `- ${path}`),
    )
  }

  respond({
    permission: 'ask',
    user_message: reportLines.join('\n'),
    agent_message: [
      '自動修正がありました。上記をあなたへ報告済みです。',
      'フックの確認ダイアログで許可が出た場合のみ、このコミット続行を前提にしてください。',
      '拒否された場合はコミットせず、指示を待ってください。',
      '未ステージの修正が残っている場合は、許可後のコミットに含めない旨も伝えてください。',
      `修正ファイル: ${[...fixedSet].join(', ')}`,
    ].join('\n'),
  })
  process.exit(0)
}

// 4) Already clean — no auto-fix churn
respond({
  permission: 'allow',
  agent_message:
    'Prettier / ESLint は既にクリーンで、コミット前の自動修正はありませんでした。コミットを続行します。',
})
process.exit(0)
