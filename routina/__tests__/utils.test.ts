import { describe, it, expect } from 'vitest'
import { cn, formatTime, getCurrentTime, formatDate, parseTimeToMinutes, minutesToTime } from '@/lib/utils'

describe('Utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      const result = cn('px-4', 'py-2', 'bg-blue-500')
      expect(result).toContain('px-4')
      expect(result).toContain('py-2')
    })

    it('handles conditional classes', () => {
      const result = cn('base-class', false && 'hidden-class', true && 'visible-class')
      expect(result).toContain('base-class')
      expect(result).toContain('visible-class')
      expect(result).not.toContain('hidden-class')
    })
  })

  describe('formatTime', () => {
    it('formats 24-hour time to 12-hour with AM', () => {
      expect(formatTime('09:30')).toBe('9:30 AM')
      expect(formatTime('08:00')).toBe('8:00 AM')
    })

    it('formats 24-hour time to 12-hour with PM', () => {
      expect(formatTime('14:30')).toBe('2:30 PM')
      expect(formatTime('18:00')).toBe('6:00 PM')
    })

    it('handles noon correctly', () => {
      expect(formatTime('12:00')).toBe('12:00 PM')
    })

    it('handles midnight correctly', () => {
      expect(formatTime('00:00')).toBe('12:00 AM')
    })
  })

  describe('parseTimeToMinutes', () => {
    it('converts time string to minutes', () => {
      expect(parseTimeToMinutes('00:00')).toBe(0)
      expect(parseTimeToMinutes('01:00')).toBe(60)
      expect(parseTimeToMinutes('12:30')).toBe(750)
      expect(parseTimeToMinutes('23:59')).toBe(1439)
    })
  })

  describe('minutesToTime', () => {
    it('converts minutes to time string', () => {
      expect(minutesToTime(0)).toBe('00:00')
      expect(minutesToTime(60)).toBe('01:00')
      expect(minutesToTime(750)).toBe('12:30')
      expect(minutesToTime(1439)).toBe('23:59')
    })
  })

  describe('formatDate', () => {
    it('formats date to YYYY-MM-DD', () => {
      const date = new Date('2025-01-15T10:00:00')
      expect(formatDate(date)).toBe('2025-01-15')
    })
  })

  describe('getCurrentTime', () => {
    it('returns time in HH:MM format', () => {
      const time = getCurrentTime()
      expect(time).toMatch(/^\d{2}:\d{2}$/)
    })
  })
})
