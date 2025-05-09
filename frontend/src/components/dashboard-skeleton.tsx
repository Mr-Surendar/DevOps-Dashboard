import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3 mb-3" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
