import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRecordStore } from '@/stores/record'

const writeText = vi.fn()

describe('useRecordStore clipboard', () => {
  beforeEach(() => {
    writeText.mockReset()
    writeText.mockResolvedValue(undefined)
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { clipboard: { writeText } },
    })
    setActivePinia(createPinia())
  })

  it('copyFormattedText writes the preview text', async () => {
    const store = useRecordStore()
    await store.copyFormattedText()
    expect(writeText).toHaveBeenCalledTimes(1)
    expect(writeText.mock.calls[0]?.[0]).toContain('【日々の気分チェック記録】')
    expect(store.copyState).toBe('copied')
    expect(store.clearState).toBe('idle')
  })

  it('clearClipboard writes an empty string', async () => {
    const store = useRecordStore()
    store.copyState = 'copied'
    await store.clearClipboard()
    expect(writeText).toHaveBeenCalledWith('')
    expect(store.copyState).toBe('idle')
    expect(store.clearState).toBe('cleared')
  })

  it('clearClipboard records an error when writeText rejects', async () => {
    writeText.mockRejectedValue(new Error('denied'))
    const store = useRecordStore()
    store.copyState = 'copied'
    await store.clearClipboard()
    expect(store.copyState).toBe('idle')
    expect(store.clearState).toBe('error')
  })

  it('copyFormattedText failure resets clearState', async () => {
    const store = useRecordStore()
    store.clearState = 'cleared'
    writeText.mockRejectedValue(new Error('denied'))
    await store.copyFormattedText()
    expect(store.copyState).toBe('error')
    expect(store.clearState).toBe('idle')
  })
})
