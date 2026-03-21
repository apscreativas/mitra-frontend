'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { labels } from '@/lib/labels'
import { usePreviewDataScope } from '../hooks'
import type { DataScopeRulePreviewInput } from '../types'

interface ScopeRulePreviewProps {
  entity: string
  type: string
  configuration: Record<string, unknown>
}

export function ScopeRulePreview({ entity, type, configuration }: ScopeRulePreviewProps) {
  const [userId, setUserId] = useState('')
  const previewMutation = usePreviewDataScope()

  function handlePreview() {
    if (!userId.trim()) return
    const input: DataScopeRulePreviewInput = { entity, type, configuration, user_id: userId.trim() }
    previewMutation.mutate(input)
  }

  const result = previewMutation.data?.data

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h4 className="font-medium">{labels.dataScopes.preview}</h4>
      <div className="flex items-center gap-2">
        <Input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="max-w-xs"
          type="text"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handlePreview}
          disabled={previewMutation.isPending || !userId.trim() || !entity || !type}
        >
          {previewMutation.isPending ? labels.common.loading : labels.dataScopes.preview}
        </Button>
      </div>

      {result && (
        <div className="space-y-2">
          <p className="text-sm">
            <Badge variant="secondary">{result.count}</Badge>{' '}
            {labels.dataScopes.previewResults}
          </p>
          {result.sample.length > 0 && (
            <ul className="text-sm text-muted-foreground space-y-1">
              {result.sample.map((item) => (
                <li key={item.id} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">#{item.id}</span>
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
