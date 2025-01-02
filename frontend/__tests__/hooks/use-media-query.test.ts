import { renderHook } from '@testing-library/react'
import { useMediaQuery } from '@/hooks/use-media-query'
import type { MediaQueryList, MediaQueryListEvent } from '@/types/media-query'

describe('useMediaQuery', () => {
  let matchMediaMock: jest.SpyInstance

  beforeAll(() => {
    matchMediaMock = jest.spyOn(window, 'matchMedia')
  })

  afterEach(() => {
    matchMediaMock.mockReset()
  })

  afterAll(() => {
    matchMediaMock.mockRestore()
  })

  it('should return initial matches value', () => {
    const mockMediaQueryList = {
      matches: true,
      media: '(min-width: 768px)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    } as MediaQueryList

    matchMediaMock.mockImplementation(() => mockMediaQueryList)

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(true)
  })

  it('should handle media query changes', () => {
    let changeListener: EventListener = jest.fn()
    const mockMediaQueryList = {
      matches: false,
      media: '(min-width: 768px)',
      addEventListener: (_: string, cb: EventListener) => { changeListener = cb },
      removeEventListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    } as MediaQueryList

    matchMediaMock.mockImplementation(() => mockMediaQueryList)

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)

    const event = new Event('change') as MediaQueryListEvent
    Object.defineProperty(event, 'matches', { value: true })
    Object.defineProperty(event, 'media', { value: '(min-width: 768px)' })
    
    changeListener(event)
    expect(result.current).toBe(true)
  })

  it('should handle SSR', () => {
    const windowSpy = jest.spyOn(global, 'window', 'get')
    windowSpy.mockImplementation(() => undefined as unknown as Window & typeof globalThis)

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)

    windowSpy.mockRestore()
  })
}) 