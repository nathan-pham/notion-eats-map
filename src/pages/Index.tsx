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
      {/* Mobile App Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Restaurant Reviews
              </h1>
              <p className="text-xs text-muted-foreground">
                {restaurants.length} amazing places to eat
              </p>
            </div>
            <Button 
              asChild 
              size="sm"
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 px-4"
            >
              <a
                href="https://nathanpham.notion.site/1e217e06a1e18010bf7bf0492fd68fb5?pvs=105"
                target="_blank"
                rel="noopener noreferrer"
              >
                Add Review
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-6">
        {isLoading && (
          <div className="space-y-6 mt-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-app-surface-elevated" />
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1 bg-app-surface-elevated" />
                <Skeleton className="h-10 w-32 bg-app-surface-elevated" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-32 w-full rounded-xl bg-app-surface-elevated" />
                  <Skeleton className="h-4 w-3/4 bg-app-surface-elevated" />
                  <Skeleton className="h-4 w-1/2 bg-app-surface-elevated" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-16 mt-6 space-y-3">
            <div className="text-6xl mb-4">😵</div>
            <p className="text-lg font-medium text-destructive">Failed to load restaurants</p>
            <p className="text-muted-foreground">Please check your connection and try again</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="mt-6">
            <RestaurantList restaurants={restaurants} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
