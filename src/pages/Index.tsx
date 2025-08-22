import { useEffect } from "react";
import RestaurantList from "@/components/RestaurantList";
import { useRestaurants } from "@/hooks/useRestaurants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: restaurants = [], isLoading, error } = useRestaurants();

  useEffect(() => {
    document.title = "Restaurant Reviews – Find your next meal";
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="w-full p-6 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Restaurant Reviews</h1>
          <p className="text-muted-foreground mt-1">
            Discover and review amazing places to eat
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {restaurants.length} restaurants available
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {isLoading && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive text-lg font-medium">Failed to load restaurant data</p>
            <p className="text-muted-foreground mt-2">Please try refreshing the page</p>
          </div>
        )}

        {!isLoading && !error && (
          <RestaurantList restaurants={restaurants} />
        )}

        <div className="mt-12 text-center">
          <Button asChild>
            <a
              href="https://food.nathanlepham.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Leave A Review
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
