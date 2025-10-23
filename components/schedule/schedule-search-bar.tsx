'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Filter,
  Building2,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  useScheduleFilters,
  useEmployees,
  useShifts,
  useEmployeeActions,
} from '@/stores/employee-store';
import { mockDepartments } from '@/lib/mock-data/employees';
import type { ShiftType } from '@/types/employee';
import { fadeIn, slideDown, spring } from '@/lib/utils/motion';
import { cn } from '@/lib/utils';

const shiftTypes: { value: ShiftType; label: string; color: string }[] = [
  { value: 'morning', label: 'Morning', color: 'bg-blue-500' },
  { value: 'afternoon', label: 'Afternoon', color: 'bg-orange-500' },
  { value: 'night', label: 'Night', color: 'bg-purple-500' },
  { value: 'full-day', label: 'Full Day', color: 'bg-green-500' },
];

export function ScheduleSearchBar() {
  const filters = useScheduleFilters();
  const employees = useEmployees();
  const shifts = useShifts();
  const { setScheduleFilters, clearScheduleFilters } = useEmployeeActions();

  const [searchFocused, setSearchFocused] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);

  // Get unique locations from shifts
  const uniqueLocations = useMemo(() => {
    const locations = new Set(shifts.map((s) => s.location).filter(Boolean));
    return Array.from(locations).sort();
  }, [shifts]);

  // Handle search input
  const handleSearchChange = useCallback(
    (value: string) => {
      setScheduleFilters({ search: value });
    },
    [setScheduleFilters]
  );

  // Handle department filter toggle
  const handleDepartmentToggle = useCallback(
    (deptName: string) => {
      const current = filters.departments;
      const updated = current.includes(deptName)
        ? current.filter((d) => d !== deptName)
        : [...current, deptName];
      setScheduleFilters({ departments: updated });
    },
    [filters.departments, setScheduleFilters]
  );

  // Handle shift type filter toggle
  const handleShiftTypeToggle = useCallback(
    (type: ShiftType) => {
      const current = filters.shiftTypes;
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      setScheduleFilters({ shiftTypes: updated });
    },
    [filters.shiftTypes, setScheduleFilters]
  );

  // Handle location filter toggle
  const handleLocationToggle = useCallback(
    (location: string) => {
      const current = filters.locations;
      const updated = current.includes(location)
        ? current.filter((l) => l !== location)
        : [...current, location];
      setScheduleFilters({ locations: updated });
    },
    [filters.locations, setScheduleFilters]
  );

  // Remove individual filter
  const removeFilter = useCallback(
    (type: 'department' | 'shiftType' | 'location', value: string) => {
      if (type === 'department') {
        setScheduleFilters({
          departments: filters.departments.filter((d) => d !== value),
        });
      } else if (type === 'shiftType') {
        setScheduleFilters({
          shiftTypes: filters.shiftTypes.filter((t) => t !== value),
        });
      } else if (type === 'location') {
        setScheduleFilters({
          locations: filters.locations.filter((l) => l !== value),
        });
      }
    },
    [filters, setScheduleFilters]
  );

  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.departments.length > 0 ||
    filters.shiftTypes.length > 0 ||
    filters.locations.length > 0;

  const activeFilterCount =
    filters.departments.length +
    filters.shiftTypes.length +
    filters.locations.length;

  return (
    <div className="space-y-3">
      {/* Search and Filter Controls */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              'pl-10 pr-10 transition-all',
              searchFocused && 'ring-2 ring-ring ring-offset-2'
            )}
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => handleSearchChange('')}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Filter Popover */}
        <Popover open={showFilterPopover} onOpenChange={setShowFilterPopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="default"
              className="gap-2 relative"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <motion.div
                  {...fadeIn}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold"
                >
                  {activeFilterCount}
                </motion.div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80"
            align="end"
            side="bottom"
            sideOffset={8}
            asChild
          >
            <motion.div {...slideDown}>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {/* Department Filters */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>Departments</span>
                    </div>
                    <div className="space-y-2 pl-6">
                      {mockDepartments.map((dept) => (
                        <div
                          key={dept.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`dept-${dept.id}`}
                            checked={filters.departments.includes(dept.name)}
                            onCheckedChange={() =>
                              handleDepartmentToggle(dept.name)
                            }
                          />
                          <Label
                            htmlFor={`dept-${dept.id}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            {dept.name}
                            <span className="text-muted-foreground text-xs ml-2">
                              ({dept.employeeCount})
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Shift Type Filters */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Shift Types</span>
                    </div>
                    <div className="space-y-2 pl-6">
                      {shiftTypes.map((type) => (
                        <div
                          key={type.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`shift-${type.value}`}
                            checked={filters.shiftTypes.includes(type.value)}
                            onCheckedChange={() =>
                              handleShiftTypeToggle(type.value)
                            }
                          />
                          <Label
                            htmlFor={`shift-${type.value}`}
                            className="text-sm font-normal cursor-pointer flex-1 flex items-center gap-2"
                          >
                            <div className={cn('w-3 h-3 rounded', type.color)} />
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Location Filters */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Locations</span>
                    </div>
                    <div className="space-y-2 pl-6">
                      {uniqueLocations.length > 0 ? (
                        uniqueLocations.map((location) => (
                          <div
                            key={location}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`location-${location}`}
                              checked={filters.locations.includes(location)}
                              onCheckedChange={() =>
                                handleLocationToggle(location)
                              }
                            />
                            <Label
                              htmlFor={`location-${location}`}
                              className="text-sm font-normal cursor-pointer flex-1"
                            >
                              {location}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No locations available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Filter Actions */}
              {hasActiveFilters && (
                <motion.div {...fadeIn} className="pt-4 border-t mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearScheduleFilters();
                      setShowFilterPopover(false);
                    }}
                    className="w-full"
                  >
                    Clear all filters
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </PopoverContent>
        </Popover>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <motion.div {...fadeIn}>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearScheduleFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          </motion.div>
        )}
      </div>

      {/* Active Filter Pills */}
      <AnimatePresence mode="popLayout">
        {hasActiveFilters && (
          <motion.div
            {...fadeIn}
            exit={fadeIn.exit}
            className="flex flex-wrap items-center gap-2"
          >
            {/* Department Pills */}
            {filters.departments.map((dept) => (
              <motion.div key={`dept-${dept}`} layout transition={spring.gentle}>
                <Badge
                  variant="secondary"
                  className="gap-1.5 pr-1 pl-3 py-1"
                >
                  <Building2 className="h-3 w-3" />
                  <span>{dept}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeFilter('department', dept)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </motion.div>
            ))}

            {/* Shift Type Pills */}
            {filters.shiftTypes.map((type) => {
              const shiftInfo = shiftTypes.find((s) => s.value === type);
              return (
                <motion.div key={`type-${type}`} layout transition={spring.gentle}>
                  <Badge
                    variant="secondary"
                    className="gap-1.5 pr-1 pl-3 py-1"
                  >
                    <div
                      className={cn('w-2 h-2 rounded', shiftInfo?.color)}
                    />
                    <span>{shiftInfo?.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeFilter('shiftType', type)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </motion.div>
              );
            })}

            {/* Location Pills */}
            {filters.locations.map((location) => (
              <motion.div key={`loc-${location}`} layout transition={spring.gentle}>
                <Badge
                  variant="secondary"
                  className="gap-1.5 pr-1 pl-3 py-1"
                >
                  <MapPin className="h-3 w-3" />
                  <span>{location}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeFilter('location', location)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
