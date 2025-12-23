import { useMemo } from 'react';
import type { CostBreakdown, SimulationState } from '../types';
import { BIKE_PHYSICS } from '../types';

interface UseCostCalculatorProps {
  state: SimulationState;
  totalDistance: number;
  unlockFee: number;
  perMinuteRate: number;
}

export function useCostCalculator({
  state,
  totalDistance,
  unlockFee,
  perMinuteRate,
}: UseCostCalculatorProps): CostBreakdown {
  return useMemo(() => {
    const { elapsedTime, totalWaitTime, currentWaitTime, isWaitingAtLight } = state;

    // Current wait time should be included in total for display
    const effectiveWaitTime = totalWaitTime + (isWaitingAtLight ? currentWaitTime : 0);

    // Total elapsed time in minutes
    const totalMinutes = elapsedTime / 60;

    // Riding time (not waiting)
    const ridingTime = elapsedTime - effectiveWaitTime;
    const ridingMinutes = ridingTime / 60;

    // Waiting time in minutes
    const waitingMinutes = effectiveWaitTime / 60;

    // Calculate costs
    const ridingCost = ridingMinutes * perMinuteRate;
    const waitingCost = waitingMinutes * perMinuteRate;
    const totalCost = unlockFee + (totalMinutes * perMinuteRate);

    // Calculate ideal cost (no traffic light waits)
    // Ideal time = time to travel distance at max speed + acceleration/braking once
    const idealTime = calculateIdealTime(totalDistance);
    const idealMinutes = idealTime / 60;
    const idealCost = unlockFee + (idealMinutes * perMinuteRate);

    // Wasted money is the difference
    const wastedMoney = Math.max(0, totalCost - idealCost);

    return {
      unlockFee,
      ridingCost,
      waitingCost,
      totalCost,
      idealCost,
      wastedMoney,
    };
  }, [state, totalDistance, unlockFee, perMinuteRate]);
}

// Calculate ideal travel time (no stops)
function calculateIdealTime(distance: number): number {
  const { MAX_SPEED_MS, ACCELERATION_TIME, BRAKING_TIME, ACCELERATION_RATE, DECELERATION_RATE } = BIKE_PHYSICS;

  // Distance covered during acceleration
  const accelerationDistance = 0.5 * ACCELERATION_RATE * ACCELERATION_TIME * ACCELERATION_TIME;

  // Distance covered during braking
  const brakingDistance = 0.5 * DECELERATION_RATE * BRAKING_TIME * BRAKING_TIME;

  const totalAccelDecelDistance = accelerationDistance + brakingDistance;

  if (distance <= totalAccelDecelDistance) {
    // Short distance - never reach max speed
    // Simplified: assume symmetric accel/decel
    const avgAccel = (ACCELERATION_RATE + DECELERATION_RATE) / 2;
    return 2 * Math.sqrt(distance / avgAccel);
  }

  // Time = acceleration time + cruising time + braking time
  const cruisingDistance = distance - totalAccelDecelDistance;
  const cruisingTime = cruisingDistance / MAX_SPEED_MS;

  return ACCELERATION_TIME + cruisingTime + BRAKING_TIME;
}

// Calculate projected final cost based on current progress
export function calculateProjectedCost(
  currentElapsedTime: number,
  remainingDistance: number,
  remainingTrafficLights: number,
  averageWaitTime: number,
  unlockFee: number,
  perMinuteRate: number
): number {
  // Estimate remaining time
  const remainingTravelTime = remainingDistance / BIKE_PHYSICS.MAX_SPEED_MS;
  const remainingWaitTime = remainingTrafficLights * averageWaitTime;
  const totalProjectedTime = currentElapsedTime + remainingTravelTime + remainingWaitTime;

  return unlockFee + (totalProjectedTime / 60) * perMinuteRate;
}
