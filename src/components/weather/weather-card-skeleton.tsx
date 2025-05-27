import { Skeleton } from '@/components/ui/skeleton';

export function WeatherCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-center pt-4">
        <Skeleton className="h-8 w-3/4 mx-auto md:h-10" />
      </div>
      <div className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="w-full justify-center flex flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
          <div className="flex flex-col space-y-2 flex-grow gap-2">
            <Skeleton className="h-6 w-3/4 md:h-7" />
            <Skeleton className="h-4 w-1/2 md:h-5" />
            <Skeleton className="h-4 w-1/2 md:h-5" />
          </div>
        </div>
        {/* Skeleton for WeatherChart */}
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
