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
  if (!raw.trim()) return {}
  try {
    return JSON.parse(raw)
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
  process.stdout.write(`${JSON.stringify(payload)}\n`)
}

const input = parseInput(readStdin())
const command = input.command ?? ''

if (!isGitPushCommand(command)) {
  respond({ permission: 'allow' })
  process.exit(0)
}

respond({
  permission: 'ask',
  user_message: [
    'push の前に、今回の影響範囲（origin/main...HEAD）を conventions に沿ってリファクタし、必要ならそれを最終コミットにしましたか。',
    'lint / format だけでは足りません。範囲の外のリファクタは不要です。',
    '済んでいれば許可、未了なら拒否してください。',
  ].join('\n'),
  agent_message: [
    'git push は確認待ちです。許可が出るまで完了扱いにしないでください。',
    'まだ影響範囲のリファクタ（最終コミット）が無ければ、拒否されたものとして push せず、先に直してから再度 push してください。',
    '代諾は無効です。',
  ].join('\n'),
})
process.exit(0)
