'use client'

import { type ColumnDef, type SortingState, type OnChangeFn, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { DebouncedInput } from '@/components/ui/debounced-input'
import { labels } from '@/lib/labels'

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  pagination?: PaginationMeta
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  columnFilters?: Record<string, string>
  onColumnFilterChange?: (columnId: string, value: string | null) => void
  filterOptions?: Record<string, { label: string; value: string }[]>
  onPageChange?: (page: number) => void
  onPerPageChange?: (perPage: number) => void
}

const ALL_VALUE = '__all__'
const PER_PAGE_OPTIONS = [10, 15, 25, 50]

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  pagination,
  sorting = [],
  onSortingChange,
  columnFilters = {},
  onColumnFilterChange,
  filterOptions = {},
  onPageChange,
  onPerPageChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    enableMultiSort: false,
    state: { sorting },
    onSortingChange,
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {/* Header row: column names + sort indicators */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="flex items-center gap-1 hover:text-foreground -ml-1 px-1 py-0.5 rounded transition-colors"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : sorted === 'desc' ? (
                            <ArrowDown className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}

            {/* Filter row: one input per column with filterType meta */}
            {onColumnFilterChange && (
              <TableRow>
                {table.getHeaderGroups()[0]?.headers.map((header) => {
                  const meta = header.column.columnDef.meta
                  const columnId = header.column.id
                  const filterValue = columnFilters[columnId] ?? ''

                  return (
                    <TableHead key={`filter-${header.id}`} className="py-1 px-2">
                      {meta?.filterType === 'text' ? (
                        <DebouncedInput
                          value={filterValue}
                          onChange={(val) =>
                            onColumnFilterChange(columnId, val || null)
                          }
                          placeholder={meta.filterPlaceholder ?? labels.table.filterPlaceholder}
                          className="h-8 text-xs"
                        />
                      ) : meta?.filterType === 'select' ? (
                        <Select
                          value={filterValue || ALL_VALUE}
                          onValueChange={(val) =>
                            onColumnFilterChange(
                              columnId,
                              val === ALL_VALUE ? null : val
                            )
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL_VALUE}>
                              {labels.table.allItems}
                            </SelectItem>
                            {(filterOptions[columnId] ?? []).map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : null}
                    </TableHead>
                  )
                })}
              </TableRow>
            )}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {labels.table.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {labels.table.results(pagination.total)}
            </p>
            {onPerPageChange && (
              <div className="flex items-center gap-2">
                <Select
                  value={String(pagination.per_page)}
                  onValueChange={(val) => { if (val) onPerPageChange(Number(val)) }}
                >
                  <SelectTrigger className="h-8 w-[70px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PER_PAGE_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground text-xs">
                  {labels.table.perPage}
                </span>
              </div>
            )}
          </div>

          {pagination.last_page > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {labels.table.page} {pagination.current_page} {labels.table.of}{' '}
                {pagination.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
              >
                {labels.table.previous}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
              >
                {labels.table.next}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
