"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RangeSliderProps {
  label: string
  min: number
  max: number
  step?: number
  minValue: number
  maxValue: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  prefix?: string
  suffix?: string
  className?: string
}

export function RangeSlider({
  label,
  min,
  max,
  step = 1,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  prefix = "",
  suffix = "",
  className,
}: RangeSliderProps) {
  const handleSliderChange = (values: number[]) => {
    onMinChange(values[0])
    onMaxChange(values[1])
  }

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || min
    if (value <= maxValue && value >= min) {
      onMinChange(value)
    }
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || max
    if (value >= minValue && value <= max) {
      onMaxChange(value)
    }
  }

  return (
    <div className={className}>
      <Label className="text-sm font-medium mb-3 block">{label}</Label>

      {/* Slider */}
      <Slider
        value={[minValue, maxValue]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        className="w-full mb-4"
        aria-label={`${label} range`}
      />

      {/* Value Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Min</label>
          <div className="flex items-center gap-1">
            {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
            <Input
              type="number"
              value={minValue}
              onChange={handleMinInputChange}
              min={min}
              max={maxValue}
              step={step}
              className="h-8 text-sm"
            />
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Max</label>
          <div className="flex items-center gap-1">
            {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
            <Input
              type="number"
              value={maxValue}
              onChange={handleMaxInputChange}
              min={minValue}
              max={max}
              step={step}
              className="h-8 text-sm"
            />
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
