import { Units, ValueWithUnits } from "../types/types.products";

export enum UnitType {
  VOLUME = "volume",
  WEIGHT = "weight",
}

export const UnitsOfType = {
  [UnitType.VOLUME]: [Units.L, Units.ml, Units.gal],
  [UnitType.WEIGHT]: [Units.g, Units.kg, Units.oz],
};

export const DefaultUnitOfType = {
  [UnitType.VOLUME]: Units.L,
  [UnitType.WEIGHT]: Units.kg,
};

export const getUnitType = (unit: Units): UnitType => {
  const unitType = Object.entries(UnitsOfType).find(([, units]) =>
    units.includes(unit)
  )?.[0] as UnitType;

  if (!unitType) {
    throw new Error(`Unit ${unit} not found`);
  }

  return unitType;
};

export const unitsTypeOf = (unit: Units) => {
  const unitType = getUnitType(unit);
  return UnitsOfType[unitType];
};

// Conversion factors to base units
const CONVERSION_FACTORS: Record<Units, number> = {
  // Volume units (base: ml)
  [Units.ml]: 1,
  [Units.L]: 1000,
  [Units.gal]: 3785.41, // US gallon
  // Weight units (base: g)
  [Units.g]: 1,
  [Units.kg]: 1000,
  [Units.oz]: 28.3495, // US ounce
};

// Base units for each unit type
const BASE_UNITS = {
  [UnitType.VOLUME]: Units.ml,
  [UnitType.WEIGHT]: Units.g,
};

export const convertUnits = (
  input: ValueWithUnits,
  outputUnit?: Units
): ValueWithUnits => {
  // Validate that input unit is valid
  const inputUnitType = getUnitType(input.units);

  // Use base unit if outputUnit is not provided
  const targetOutputUnit = outputUnit ?? BASE_UNITS[inputUnitType];

  // Validate that output unit is valid and of the same type
  const outputUnitType = getUnitType(targetOutputUnit);

  if (inputUnitType !== outputUnitType) {
    throw new Error(
      `Cannot convert between different unit types: ${inputUnitType} to ${outputUnitType}`
    );
  }

  // Convert input to base unit, then to output unit
  const valueInBaseUnit = input.value * CONVERSION_FACTORS[input.units];
  const convertedValue = valueInBaseUnit / CONVERSION_FACTORS[targetOutputUnit];

  return {
    value: convertedValue,
    units: targetOutputUnit,
  };
};

/**
 * Automatically converts a ValueWithUnits to use more appropriate units with fewer significant digits.
 * Only allows conversions within the same measurement system:
 * - g ↔ kg (metric weight)
 * - mL ↔ L (metric volume)
 * Examples:
 * - 0.1 kg -> 100 g
 * - 5000 g -> 5 kg
 * - 0.05 L -> 50 ml
 * - 2500 ml -> 2.5 L
 */
export const autoConvert = (input: ValueWithUnits): ValueWithUnits => {
  // Define allowed conversion pairs (only within same measurement system)
  const allowedConversions: Record<Units, Units[]> = {
    [Units.g]: [Units.kg], // g can convert to kg
    [Units.kg]: [Units.g], // kg can convert to g
    [Units.ml]: [Units.L], // ml can convert to L
    [Units.L]: [Units.ml], // L can convert to ml
    [Units.oz]: [], // oz cannot auto-convert to other units
    [Units.gal]: [], // gal cannot auto-convert to other units
  };

  const allowedTargetUnits = allowedConversions[input.units] || [];

  // If no conversions are allowed for this unit, return as-is
  if (allowedTargetUnits.length === 0) {
    return input;
  }

  // Try each allowed unit to find the one that gives the most readable value
  let bestConversion = input;
  let bestScore = getReadabilityScore(input.value);

  for (const targetUnit of allowedTargetUnits) {
    try {
      const converted = convertUnits(input, targetUnit);
      const score = getReadabilityScore(converted.value);

      // Prefer conversions that result in values between 0.1 and 999
      // and have fewer decimal places
      if (score > bestScore) {
        bestConversion = converted;
        bestScore = score;
      }
    } catch {
      // Skip invalid conversions
      continue;
    }
  }

  return bestConversion;
};

/**
 * Calculate a readability score for a numeric value.
 * Higher scores indicate more readable values.
 */
const getReadabilityScore = (value: number): number => {
  const absValue = Math.abs(value);

  // Heavily penalize very small or very large numbers
  if (absValue < 0.01 || absValue >= 10000) return -1000;

  // Prefer values between 0.1 and 999
  let score = 0;
  if (absValue >= 0.1 && absValue < 1000) {
    score += 100;
  }

  // Prefer values between 1 and 99 (most readable range)
  if (absValue >= 1 && absValue < 100) {
    score += 50;
  }

  // Penalize decimal places (prefer whole numbers)
  const decimalPlaces = (value.toString().split(".")[1] || "").length;
  score -= decimalPlaces * 10;

  // Bonus for round numbers
  if (value % 1 === 0) {
    score += 20;
  }

  // Bonus for multiples of 5 or 10
  if (value % 10 === 0) {
    score += 15;
  } else if (value % 5 === 0) {
    score += 10;
  }

  return score;
};
