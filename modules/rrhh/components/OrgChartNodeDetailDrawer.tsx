'use client'

import { useMemo } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
  FormDrawerBody,
  FormDrawerFooter,
} from '@/components/ui/form-drawer'
import { DetailSection, DetailField } from '@/components/ui/detail-section'
import { labels } from '@/lib/labels'
import type { OrgChartNode } from '../types'

interface OrgChartNodeDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  node: OrgChartNode | null
  employeeStatus: 'all' | 'active' | 'blocked'
  onViewEmployee: (employeeId: string) => void
}

export function OrgChartNodeDetailDrawer({
  open,
  onOpenChange,
  node,
  employeeStatus,
  onViewEmployee,
}: OrgChartNodeDetailDrawerProps) {
  const visibleEmployees = useMemo(() => {
    if (!node) return []
    if (employeeStatus === 'all') return node.employees
    return node.employees.filter((e) => e.status === employeeStatus)
  }, [node, employeeStatus])

  const vacancies = node
    ? Math.max(0, node.authorized_positions - node.employees.length)
    : 0

  if (!node) return null

  return (
    <FormDrawer open={open} onOpenChange={onOpenChange}>
      <FormDrawerContent>
        <FormDrawerHeader>
          <FormDrawerTitle>{labels.rrhh.orgChart.nodeDetail}</FormDrawerTitle>
        </FormDrawerHeader>
        <FormDrawerBody>
          <div className="space-y-6">
            <DetailSection title={labels.rrhh.orgChart.positionInfo}>
              <DetailField label={labels.rrhh.positions.fields.name} value={node.name} />
              <DetailField label={labels.rrhh.employees.fields.area} value={node.area_name} />
              <DetailField
                label={labels.rrhh.positions.fields.authorizedPositions}
                value={String(node.authorized_positions)}
              />
              {vacancies > 0 && (
                <DetailField
                  label={labels.rrhh.orgChart.vacancies(vacancies)}
                  value={
                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                      {vacancies}
                    </Badge>
                  }
                />
              )}
            </DetailSection>

            <DetailSection title={labels.rrhh.orgChart.employeeList}>
              {visibleEmployees.length === 0 ? (
                <p className="py-3 text-sm text-muted-foreground">
                  {labels.rrhh.orgChart.noEmployees}
                </p>
              ) : (
                <div className="divide-y divide-border/50">
                  {visibleEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {employee.name}
                        </span>
                        <Badge
                          variant={employee.status === 'active' ? 'default' : 'destructive'}
                          className="h-4 text-[9px] px-1.5"
                        >
                          {employee.status === 'active'
                            ? labels.rrhh.employees.statuses.active
                            : labels.rrhh.employees.statuses.blocked}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onOpenChange(false)
                          setTimeout(() => onViewEmployee(String(employee.id)), 220)
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {labels.rrhh.orgChart.viewEmployee}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </DetailSection>
          </div>
        </FormDrawerBody>
        <FormDrawerFooter />
      </FormDrawerContent>
    </FormDrawer>
  )
}
