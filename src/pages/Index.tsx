import { useEffect } from "react";
import RestaurantList from "@/components/RestaurantList";
import MobileNavigation from "@/components/MobileNavigation";
import { useRestaurants } from "@/hooks/useRestaurants";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: restaurants = [], isLoading, error } = useRestaurants();

  useEffect(() => {
    document.title = "Eats – Find your next meal";
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <MobileNavigation restaurantCount={restaurants.length} />

      <main className="max-w-4xl mx-auto px-4 pb-safe-bottom pb-6">
        {isLoading && (
          <div className="space-y-6 mt-6">
            <div className="space-y-4 animate-fade-in">
              <Skeleton className="h-12 w-full bg-app-surface-elevated rounded-xl" />
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1 bg-app-surface-elevated rounded-lg" />
                <Skeleton className="h-10 w-24 bg-app-surface-elevated rounded-lg" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3 animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <Skeleton className="h-40 w-full rounded-xl bg-app-surface-elevated" />
                  <div className="p-2 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-app-surface-elevated rounded" />
                    <Skeleton className="h-3 w-1/2 bg-app-surface-elevated rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-20 mt-6 space-y-4 animate-bounce-in">
            <div className="text-7xl mb-6">😵</div>
            <p className="text-xl font-semibold text-destructive">Failed to load restaurants</p>
            <p className="text-muted-foreground">Please check your connection and try again</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="mt-6 animate-fade-in">
            <RestaurantList restaurants={restaurants} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
