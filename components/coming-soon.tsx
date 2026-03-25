'use client'

import { Clock, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { labels } from '@/lib/labels'

interface ComingSoonProps {
  /** Module name displayed as heading */
  title: string
  /** Optional estimated launch date (e.g., "Junio 2026") */
  estimatedDate?: string
}

export function ComingSoon({ title, estimatedDate }: ComingSoonProps) {
  const router = useRouter()

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 240px)' }}>
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-7 w-7 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{labels.comingSoon.title}</h2>
              <p className="text-sm text-muted-foreground">{labels.comingSoon.description}</p>
            </div>

            {estimatedDate && (
              <div className="rounded-lg bg-muted px-4 py-2">
                <p className="text-xs text-muted-foreground">{labels.comingSoon.estimatedDate}</p>
                <p className="text-sm font-medium">{estimatedDate}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
