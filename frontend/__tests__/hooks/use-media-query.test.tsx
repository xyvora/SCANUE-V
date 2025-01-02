import { renderHook } from '@testing-library/react'
import { useMediaQuery } from '../../hooks/use-media-query'

describe('useMediaQuery', () => {
  let matchMedia: jest.SpyInstance

  beforeAll(() => {
    matchMedia = jest.spyOn(window, 'matchMedia')
  })

  afterEach(() => {
    matchMedia.mockReset()
  })

  afterAll(() => {
    matchMedia.mockRestore()
  })

  it('returns true when media query matches', () => {
    matchMedia.mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(true)
  })

  it('returns false when media query does not match', () => {
    matchMedia.mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { result } = renderHook(() => useMediaQuery('(min-width: 600px)'))
    expect(result.current).toBe(false)
  })

  it('handles different media queries', () => {
    matchMedia.mockImplementation(query => ({
      matches: query === '(min-width: 800px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { result: result1 } = renderHook(() => useMediaQuery('(min-width: 800px)'))
    expect(result1.current).toBe(true)

    const { result: result2 } = renderHook(() => useMediaQuery('(min-width: 1200px)'))
    expect(result2.current).toBe(false)
  })
}) 