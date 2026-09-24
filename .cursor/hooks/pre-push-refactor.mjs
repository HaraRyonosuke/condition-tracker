#!/usr/bin/env node
/**
 * Cursor beforeShellExecution hook for `git push`.
 *
 * Asks you to confirm that the impact-scope refactor is the last commit.
 * The agent must refactor first (see .cursor/rules/pre-push-refactor.mdc).
 */

import { readFileSync } from 'node:fs'
import process from 'node:process'

function readStdin() {
  try {
    return readFileSync(0, 'utf8')
  } catch {
    return ''
  }
}

function parseInput(raw) {
  const text = raw.replace(/^\uFEFF/, '').trim()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

function isGitPushCommand(command) {
  if (!command || typeof command !== 'string') return false
  if (!/\bgit\s+push\b/i.test(command)) return false
  if (/\s--dry-run\b/.test(command)) return false
  return true
}

function respond(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`, () => {
    process.exit(0)
  })
}

process.on('uncaughtException', (error) => {
  respond({
    permission: 'deny',
    user_message: 'push フックが失敗したため、push を止めました。',
    agent_message: String(error?.stack ?? error),
  })
})

const input = parseInput(readStdin())
const command = input.command ?? ''

if (!isGitPushCommand(command)) {
  respond({ permission: 'allow' })
} else {
  respond({
    permission: 'ask',
    user_message: [
      'push の前に、今回の影響範囲（origin/main...HEAD）を docs/specs/README.md の表の順で直しましたか。',
      'リファクタで差分がある場合は、自動でコミットせず、内容を報告して許可を待ってからコミットしましたか。',
      'lint / format だけでは足りません。範囲の外のリファクタは不要です。',
      '済んでいれば許可、未了なら拒否してください。',
    ].join('\n'),
    agent_message: [
      'git push は確認待ちです。許可が出るまで完了扱いにしないでください。',
      'リファクタの差分を、許可の前にコミットしていたら、拒否されたものとして push せず、確認からやり直してください。',
      '代諾は無効です。',
    ].join('\n'),
  })
}
