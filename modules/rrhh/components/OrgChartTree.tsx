'use client'

import { useState, useCallback, useMemo } from 'react'
import type { OrgChartNode as OrgChartNodeType, OrgChartEmployee } from '../types'
import { OrgChartNode } from './OrgChartNode'
import styles from './org-chart-tree.module.css'

interface ProcessedNode {
  id: number
  name: string
  areaId: number
  areaName: string
  reportsToId: number | null
  authorizedPositions: number
  allEmployeeCount: number
  employees: OrgChartEmployee[]
  children: ProcessedNode[]
}

interface OrgChartTreeProps {
  nodes: OrgChartNodeType[]
  selectedAreaId: number | null
  employeeStatus: 'all' | 'active' | 'blocked'
  onNodeClick: (positionId: number) => void
}

function buildTrees(
  nodes: OrgChartNodeType[],
  selectedAreaId: number | null,
  employeeStatus: 'all' | 'active' | 'blocked'
): ProcessedNode[] {
  const nodeMap = new Map<number, ProcessedNode>()
  for (const node of nodes) {
    const displayEmployees =
      employeeStatus === 'all'
        ? node.employees
        : node.employees.filter((e) => e.status === employeeStatus)

    nodeMap.set(node.id, {
      id: node.id,
      name: node.name,
      areaId: node.area_id,
      areaName: node.area_name,
      reportsToId: node.reports_to_id,
      authorizedPositions: node.authorized_positions,
      allEmployeeCount: node.employees.length,
      employees: displayEmployees,
      children: [],
    })
  }

  let roots: ProcessedNode[] = []
  for (const node of nodeMap.values()) {
    if (node.reportsToId && nodeMap.has(node.reportsToId)) {
      nodeMap.get(node.reportsToId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  if (selectedAreaId !== null) {
    const matchingIds = new Set<number>()
    for (const node of nodeMap.values()) {
      if (node.areaId === selectedAreaId) {
        matchingIds.add(node.id)
      }
    }

    const ancestorIds = new Set<number>()
    for (const id of matchingIds) {
      let current = nodeMap.get(id)
      while (current?.reportsToId && nodeMap.has(current.reportsToId)) {
        ancestorIds.add(current.reportsToId)
        current = nodeMap.get(current.reportsToId)
      }
    }

    const keepIds = new Set([...matchingIds, ...ancestorIds])

    function pruneByArea(node: ProcessedNode): ProcessedNode | null {
      node.children = node.children
        .map((child) => pruneByArea(child))
        .filter((child): child is ProcessedNode => child !== null)
      return keepIds.has(node.id) ? node : null
    }

    roots = roots
      .map((root) => pruneByArea(root))
      .filter((root): root is ProcessedNode => root !== null)
  }

  if (employeeStatus !== 'all') {
    function pruneEmpty(node: ProcessedNode): ProcessedNode | null {
      node.children = node.children
        .map((child) => pruneEmpty(child))
        .filter((child): child is ProcessedNode => child !== null)

      const vacancies = node.authorizedPositions - node.allEmployeeCount
      const hasContent = node.employees.length > 0 || vacancies > 0 || node.children.length > 0
      return hasContent ? node : null
    }

    roots = roots
      .map((root) => pruneEmpty(root))
      .filter((root): root is ProcessedNode => root !== null)
  }

  return roots
}

function getInitialExpanded(roots: ProcessedNode[]): Set<number> {
  const expanded = new Set<number>()
  function walk(node: ProcessedNode, depth: number) {
    if (depth < 2) {
      expanded.add(node.id)
      for (const child of node.children) {
        walk(child, depth + 1)
      }
    }
  }
  for (const root of roots) {
    walk(root, 0)
  }
  return expanded
}

export function OrgChartTree({ nodes, selectedAreaId, employeeStatus, onNodeClick }: OrgChartTreeProps) {
  const trees = useMemo(
    () => buildTrees(nodes, selectedAreaId, employeeStatus),
    [nodes, selectedAreaId, employeeStatus]
  )

  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => getInitialExpanded(trees))

  const [prevTreeKey, setPrevTreeKey] = useState(() => `${selectedAreaId}-${employeeStatus}`)
  const treeKey = `${selectedAreaId}-${employeeStatus}`
  if (treeKey !== prevTreeKey) {
    setPrevTreeKey(treeKey)
    const newDefaults = getInitialExpanded(trees)
    setExpandedIds((prev) => {
      const merged = new Set(prev)
      for (const id of newDefaults) {
        merged.add(id)
      }
      return merged
    })
  }

  const toggleExpand = useCallback((id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  function renderNode(node: ProcessedNode) {
    const isExpanded = expandedIds.has(node.id)
    const vacancies = Math.max(0, node.authorizedPositions - node.allEmployeeCount)
    const showChildren = isExpanded && node.children.length > 0

    return (
      <li key={node.id} className={`flex flex-col items-center ${styles.childNode}`}>
        <OrgChartNode
          positionName={node.name}
          areaName={node.areaName}
          employees={node.employees}
          vacancies={vacancies}
          hasChildren={node.children.length > 0}
          isExpanded={isExpanded}
          onToggleExpand={() => toggleExpand(node.id)}
          onClick={() => onNodeClick(node.id)}
        />

        {showChildren && (
          <ul className={`flex items-start justify-center pt-5 ${styles.children}`}>
            {node.children.map((child) => renderNode(child))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {trees.map((root) => (
        <ul key={root.id} className="flex items-start justify-center">
          <li className="flex flex-col items-center">
            <OrgChartNode
              positionName={root.name}
              areaName={root.areaName}
              employees={root.employees}
              vacancies={Math.max(0, root.authorizedPositions - root.allEmployeeCount)}
              hasChildren={root.children.length > 0}
              isExpanded={expandedIds.has(root.id)}
              onToggleExpand={() => toggleExpand(root.id)}
              onClick={() => onNodeClick(root.id)}
            />
            {expandedIds.has(root.id) && root.children.length > 0 && (
              <ul className={`flex items-start justify-center pt-5 ${styles.children}`}>
                {root.children.map((child) => renderNode(child))}
              </ul>
            )}
          </li>
        </ul>
      ))}
    </div>
  )
}
