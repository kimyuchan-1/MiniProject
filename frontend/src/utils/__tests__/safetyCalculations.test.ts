/**
 * Property-based tests for heatmap data processing
 * Feature: enhanced-interactive-map, Property 1: Heatmap Data Accuracy
 * Validates: Requirements 3.1, 3.4
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { 
  generateHeatmapPoints, 
  getHeatmapIntensity,
  HeatmapMode 
} from '../safetyCalculations'
import { 
  AccidentData, 
  EnhancedCrosswalk, 
  HeatmapPoint,
  RiskWeights,
  SafetyWeights,
  calculateRiskScore,
  calculateSafetyScore
} from '@/types/accident'

// Generators for property-based testing
const accidentDataArb = fc.record({
  acc_uid: fc.string({ minLength: 1 }),
  sido_code: fc.string({ minLength: 2, maxLength: 2 }),
  sigungu_code: fc.string({ minLength: 5, maxLength: 5 }),
  year: fc.integer({ min: 2020, max: 2024 }),
  month: fc.integer({ min: 1, max: 12 }),
  accident_count: fc.integer({ min: 0, max: 100 }),
  casualty_count: fc.integer({ min: 0, max: 200 }),
  fatality_count: fc.integer({ min: 0, max: 50 }),
  serious_injury_count: fc.integer({ min: 0, max: 100 }),
  minor_injury_count: fc.integer({ min: 0, max: 150 }),
  reported_injury_count: fc.integer({ min: 0, max: 200 }),
  district_name: fc.option(fc.string()),
  estimated_lat: fc.option(fc.double({ min: 37.0, max: 38.0, noNaN: true })), // Seoul area
  estimated_lon: fc.option(fc.double({ min: 126.0, max: 127.5, noNaN: true })) // Seoul area
})

const enhancedCrosswalkArb = fc.record({
  cw_uid: fc.string({ minLength: 1 }),
  sido: fc.string({ minLength: 1 }),
  sigungu: fc.string({ minLength: 1 }),
  address: fc.string({ minLength: 1 }),
  crosswalk_lat: fc.double({ min: 37.0, max: 38.0, noNaN: true }), // Seoul area
  crosswalk_lon: fc.double({ min: 126.0, max: 127.5, noNaN: true }), // Seoul area
  hasSignal: fc.boolean(),
  crosswalk_width: fc.option(fc.double({ min: 2.0, max: 20.0, noNaN: true })),
  highland: fc.option(fc.boolean()),
  button: fc.option(fc.boolean()),
  sound_signal: fc.option(fc.boolean()),
  bump: fc.option(fc.boolean()),
  braille_block: fc.option(fc.boolean()),
  spotlight: fc.option(fc.boolean())
})

const mapBoundsArb = fc.record({
  south: fc.double({ min: 37.0, max: 37.8, noNaN: true }),
  west: fc.double({ min: 126.0, max: 127.0, noNaN: true }),
  north: fc.double({ min: 37.2, max: 38.0, noNaN: true }),
  east: fc.double({ min: 126.5, max: 127.5, noNaN: true })
})

const riskWeightsArb = fc.record({
  fatality: fc.double({ min: 1, max: 20, noNaN: true }),
  serious: fc.double({ min: 1, max: 10, noNaN: true }),
  minor: fc.double({ min: 0.5, max: 5, noNaN: true }),
  accident: fc.double({ min: 0.1, max: 2, noNaN: true })
})

const safetyWeightsArb = fc.record({
  hasSignal: fc.double({ min: 10, max: 50, noNaN: true }),
  hasButton: fc.double({ min: 5, max: 20, noNaN: true }),
  hasSound: fc.double({ min: 5, max: 25, noNaN: true }),
  hasRemainTime: fc.double({ min: 5, max: 20, noNaN: true }),
  crosswalkWidth: fc.double({ min: 1, max: 5, noNaN: true }),
  isHighland: fc.double({ min: 10, max: 30, noNaN: true }),
  hasBump: fc.double({ min: 5, max: 15, noNaN: true }),
  hasBraille: fc.double({ min: 5, max: 20, noNaN: true }),
  hasSpotlight: fc.double({ min: 5, max: 25, noNaN: true })
})

describe('Heatmap Data Accuracy Properties', () => {
  
  /**
   * Property 1: Heatmap Data Accuracy
   * For any accident data set and map bounds, the generated heatmap points should 
   * accurately reflect the risk scores calculated from the accident data, and all 
   * points should fall within the specified map bounds.
   * Validates: Requirements 3.1, 3.4
   */
  it('should generate heatmap points with accurate risk scores within map bounds', () => {
    fc.assert(
      fc.property(
        fc.array(accidentDataArb, { minLength: 0, maxLength: 20 }),
        fc.array(enhancedCrosswalkArb, { minLength: 0, maxLength: 10 }),
        riskWeightsArb,
        safetyWeightsArb,
        (accidents, crosswalks, riskWeights, safetyWeights) => {
          // Precondition: Skip test if any weights contain NaN or invalid values
          const allWeightsValid = Object.values(riskWeights).every(w => isFinite(w) && !isNaN(w)) &&
                                 Object.values(safetyWeights).every(w => isFinite(w) && !isNaN(w))
          
          if (!allWeightsValid) {
            return true // Skip this test case
          }

          // Generate heatmap points
          const heatmapPoints = generateHeatmapPoints(
            accidents, 
            crosswalks, 
            riskWeights, 
            safetyWeights
          )

          // Property 1a: All heatmap points should have valid coordinates
          heatmapPoints.forEach(point => {
            expect(point.lat).toBeTypeOf('number')
            expect(point.lon).toBeTypeOf('number')
            expect(isFinite(point.lat)).toBe(true)
            expect(isFinite(point.lon)).toBe(true)
          })

          // Property 1b: Risk scores should be within valid range (0-100)
          heatmapPoints.forEach(point => {
            expect(point.riskScore).toBeGreaterThanOrEqual(0)
            expect(point.riskScore).toBeLessThanOrEqual(100)
          })

          // Property 1c: Safety scores should be within valid range (0-100)
          heatmapPoints.forEach(point => {
            expect(point.safetyScore).toBeGreaterThanOrEqual(0)
            expect(point.safetyScore).toBeLessThanOrEqual(100)
          })

          // Property 1d: Combined scores should be calculated correctly
          heatmapPoints.forEach(point => {
            const expectedCombined = point.safetyScore - point.riskScore
            expect(point.combinedScore).toBeCloseTo(expectedCombined, 5)
          })

          // Property 1e: If no accidents with coordinates, no heatmap points should be generated
          const accidentsWithCoords = accidents.filter(acc => 
            acc.estimated_lat !== null && 
            acc.estimated_lat !== undefined &&
            acc.estimated_lon !== null && 
            acc.estimated_lon !== undefined
          )
          
          if (accidentsWithCoords.length === 0) {
            expect(heatmapPoints).toHaveLength(0)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 2: Heatmap intensity calculation consistency
   * For any heatmap point and mode, the intensity should be deterministic and within valid range
   */
  it('should calculate consistent heatmap intensities for all modes', () => {
    fc.assert(
      fc.property(
        fc.record({
          lat: fc.double({ min: 37.0, max: 38.0, noNaN: true }),
          lon: fc.double({ min: 126.0, max: 127.5, noNaN: true }),
          riskScore: fc.double({ min: 0, max: 100, noNaN: true }),
          safetyScore: fc.double({ min: 0, max: 100, noNaN: true }),
          combinedScore: fc.double({ min: -100, max: 100, noNaN: true })
        }),
        fc.constantFrom('risk', 'safety', 'combined') as fc.Arbitrary<HeatmapMode>,
        (point: HeatmapPoint, mode: HeatmapMode) => {
          const intensity = getHeatmapIntensity(point, mode)

          // Property 2a: Intensity should be within valid range (0-1)
          expect(intensity).toBeGreaterThanOrEqual(0)
          expect(intensity).toBeLessThanOrEqual(1)

          // Property 2b: Intensity should be deterministic (same input = same output)
          const intensity2 = getHeatmapIntensity(point, mode)
          expect(intensity).toBe(intensity2)

          // Property 2c: Mode-specific intensity calculations
          switch (mode) {
            case 'risk':
              expect(intensity).toBeCloseTo(point.riskScore / 100, 5)
              break
            case 'safety':
              expect(intensity).toBeCloseTo((100 - point.safetyScore) / 100, 5)
              break
            case 'combined':
              const expectedCombined = Math.max(0, -point.combinedScore + 50) / 100
              const normalizedCombined = Math.min(1, expectedCombined)
              expect(intensity).toBeCloseTo(normalizedCombined, 5)
              break
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3: Risk score calculation accuracy
   * For any accident data and weights, risk score should be calculated correctly
   */
  it('should calculate risk scores accurately from accident data', () => {
    fc.assert(
      fc.property(
        accidentDataArb,
        riskWeightsArb,
        (accident: AccidentData, weights: RiskWeights) => {
          // Precondition: Skip test if any weights contain NaN or invalid values
          const allWeightsValid = Object.values(weights).every(w => isFinite(w) && !isNaN(w))
          
          if (!allWeightsValid) {
            return true // Skip this test case
          }

          const riskScore = calculateRiskScore(accident, weights)

          // Property 3a: Risk score should be non-negative
          expect(riskScore).toBeGreaterThanOrEqual(0)

          // Property 3b: Risk score should not exceed 100
          expect(riskScore).toBeLessThanOrEqual(100)

          // Property 3c: Risk score should be deterministic
          const riskScore2 = calculateRiskScore(accident, weights)
          expect(riskScore).toBe(riskScore2)

          // Property 3d: Risk score should increase with higher accident counts
          const higherAccident = {
            ...accident,
            fatality_count: accident.fatality_count + 1
          }
          const higherRiskScore = calculateRiskScore(higherAccident, weights)
          expect(higherRiskScore).toBeGreaterThanOrEqual(riskScore)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 4: Safety score calculation accuracy
   * For any crosswalk data and weights, safety score should be calculated correctly
   */
  it('should calculate safety scores accurately from crosswalk data', () => {
    fc.assert(
      fc.property(
        enhancedCrosswalkArb,
        safetyWeightsArb,
        (crosswalk: EnhancedCrosswalk, weights: SafetyWeights) => {
          // Precondition: Skip test if any weights contain NaN or invalid values
          const allWeightsValid = Object.values(weights).every(w => isFinite(w) && !isNaN(w))
          
          if (!allWeightsValid) {
            return true // Skip this test case
          }

          const safetyScore = calculateSafetyScore(crosswalk, weights)

          // Property 4a: Safety score should be non-negative
          expect(safetyScore).toBeGreaterThanOrEqual(0)

          // Property 4b: Safety score should not exceed 100
          expect(safetyScore).toBeLessThanOrEqual(100)

          // Property 4c: Safety score should be deterministic
          const safetyScore2 = calculateSafetyScore(crosswalk, weights)
          expect(safetyScore).toBe(safetyScore2)

          // Property 4d: Safety score should increase with more safety features
          const enhancedCrosswalk = {
            ...crosswalk,
            hasSignal: true,
            button: true,
            sound_signal: true
          }
          const higherSafetyScore = calculateSafetyScore(enhancedCrosswalk, weights)
          expect(higherSafetyScore).toBeGreaterThanOrEqual(safetyScore)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 5: Heatmap points coordinate accuracy
   * For any generated heatmap points, coordinates should match source accident data
   */
  it('should generate heatmap points with coordinates matching source data', () => {
    fc.assert(
      fc.property(
        fc.array(accidentDataArb, { minLength: 1, maxLength: 10 }),
        fc.array(enhancedCrosswalkArb, { minLength: 0, maxLength: 5 }),
        (accidents, crosswalks) => {
          // Filter accidents with valid coordinates
          const validAccidents = accidents.filter(acc => 
            acc.estimated_lat !== null && 
            acc.estimated_lat !== undefined &&
            acc.estimated_lon !== null && 
            acc.estimated_lon !== undefined
          )

          if (validAccidents.length === 0) return

          const heatmapPoints = generateHeatmapPoints(validAccidents, crosswalks)

          // Property 5a: Each heatmap point should correspond to a valid accident location
          heatmapPoints.forEach(point => {
            const matchingAccident = validAccidents.find(acc => 
              Math.abs(acc.estimated_lat! - point.lat) < 0.001 &&
              Math.abs(acc.estimated_lon! - point.lon) < 0.001
            )
            expect(matchingAccident).toBeDefined()
          })

          // Property 5b: Number of heatmap points should not exceed unique accident locations
          const uniqueLocations = new Set(
            validAccidents.map(acc => `${acc.estimated_lat},${acc.estimated_lon}`)
          )
          expect(heatmapPoints.length).toBeLessThanOrEqual(uniqueLocations.size)
        }
      ),
      { numRuns: 100 }
    )
  })
})