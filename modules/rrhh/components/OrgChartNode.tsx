'use client'

import { ChevronDown, ChevronRight, User, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { labels } from '@/lib/labels'
import type { OrgChartEmployee } from '../types'

interface OrgChartNodeProps {
  positionName: string
  areaName: string
  employees: OrgChartEmployee[]
  vacancies: number
  hasChildren: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  onClick: () => void
}

export function OrgChartNode({
  positionName,
  areaName,
  employees,
  vacancies,
  hasChildren,
  isExpanded,
  onToggleExpand,
  onClick,
}: OrgChartNodeProps) {
  const primaryEmployee = employees[0] ?? null
  const additionalCount = employees.length > 1 ? employees.length - 1 : 0

  return (
    <div className="flex items-start gap-1.5">
      {/* Expand/Collapse toggle — independent from node click */}
      <div className="flex w-5 shrink-0 items-center pt-3">
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand()
            }}
            className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={isExpanded ? labels.rrhh.orgChart.collapse : labels.rrhh.orgChart.expand}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Node card — click opens detail drawer */}
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-[200px] max-w-[280px] cursor-pointer flex-col gap-2 rounded-xl bg-background p-3 ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/20"
      >
        {/* Position + Area */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{positionName}</span>
          <Badge variant="secondary" className="shrink-0 text-[10px]">
            {areaName}
          </Badge>
        </div>

        {/* Employee info */}
        <div className="flex items-center gap-2">
          {primaryEmployee ? (
            <>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-foreground">{primaryEmployee.name}</span>
                <Badge
                  variant={primaryEmployee.status === 'active' ? 'default' : 'destructive'}
                  className="mt-0.5 h-4 text-[9px] px-1.5"
                >
                  {primaryEmployee.status === 'active'
                    ? labels.rrhh.employees.statuses.active
                    : labels.rrhh.employees.statuses.blocked}
                </Badge>
              </div>
              {additionalCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {labels.rrhh.orgChart.moreEmployees(additionalCount)}
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">{labels.rrhh.orgChart.noEmployees}</span>
            </div>
          )}
        </div>

        {/* Vacancies */}
        {vacancies > 0 && (
          <div className="flex items-center">
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-[10px]">
              {labels.rrhh.orgChart.vacancies(vacancies)}
            </Badge>
          </div>
        )}
      </button>
    </div>
  )
}
