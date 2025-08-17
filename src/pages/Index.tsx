import { useEffect } from "react";
import Map from "@/components/Map";
import { useRestaurants } from "@/hooks/useRestaurants";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { data: restaurants = [], isLoading, error } = useRestaurants();

  useEffect(() => {
    document.title = "Restaurant Map – Notion data";
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="w-full p-4 border-b border-border">
        <h1 className="text-xl font-semibold">Restaurant Map</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {restaurants.length} restaurants loaded from Notion
        </p>
      </header>

      <main className="relative w-full h-[calc(100vh-5rem)]">
        {isLoading && (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            Loading restaurants…
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 grid place-items-center text-destructive">
            Failed to load restaurant data.
          </div>
        )}

        {!isLoading && !error && (
          <Map restaurants={restaurants} />
        )}

        <div className="absolute bottom-4 inset-x-0 flex justify-center z-[1000]">
          <Button asChild className="shadow-lg">
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
