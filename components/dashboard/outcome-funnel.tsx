import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { outcomeFunnel, compact } from '@/lib/mock-data'

const barColors = [
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-4',
  'bg-chart-3',
  'bg-primary',
]

export function OutcomeFunnel() {
  const max = outcomeFunnel[0].value
  return (
    <Card>
      <CardHeader>
        <CardTitle>Outcome funnel</CardTitle>
        <CardDescription>
          Enrolled → Completed → Certified → Employed → Retained
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {outcomeFunnel.map((stage, i) => {
          const pct = Math.round((stage.value / max) * 100)
          const conversion =
            i === 0 ? 100 : Math.round((stage.value / outcomeFunnel[i - 1].value) * 100)
          return (
            <div key={stage.stage} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium">{stage.stage}</span>
                <span className="tabular-nums text-muted-foreground">
                  {stage.value.toLocaleString('en-IN')}
                  <span className="ml-2 text-xs">
                    {i === 0 ? `${pct}% of intake` : `${conversion}% carried forward`}
                  </span>
                </span>
              </div>
              <div className="h-8 w-full overflow-hidden rounded-md bg-muted">
                <div
                  className={`flex h-full items-center justify-end rounded-md px-2 text-xs font-medium text-primary-foreground ${barColors[i]}`}
                  style={{ width: `${Math.max(pct, 12)}%` }}
                >
                  {compact(stage.value)}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
