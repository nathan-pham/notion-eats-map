import { useEffect, useMemo, useState } from "react";
import Map from "@/components/Map";
import { useRestaurants } from "@/hooks/useRestaurants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TOKEN_KEY = "mapbox_public_token";

const Index = () => {
  const { data: restaurants = [], isLoading, error } = useRestaurants();
  const [token, setToken] = useState<string>("");
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    document.title = "Restaurant Map – Notion data";
    const stored = localStorage.getItem(TOKEN_KEY) || "";
    setToken(stored);
    setInput(stored);
  }, []);

  const hasToken = useMemo(() => token && token.trim().length > 0, [token]);

  const handleSaveToken = () => {
    localStorage.setItem(TOKEN_KEY, input.trim());
    setToken(input.trim());
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="w-full p-4 border-b border-border">
        <h1 className="text-xl font-semibold">Restaurant Map</h1>
      </header>

      <main className="relative w-full h-[calc(100vh-4rem)]">
        {!hasToken && (
          <section className="absolute z-10 inset-x-0 top-6 mx-4 rounded-lg border border-border bg-card/80 backdrop-blur p-4 shadow-sm">
            <h2 className="text-sm font-medium mb-2">Mapbox public token required</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Paste your Mapbox public token to load the map. You can later move this to Supabase Edge Function Secrets for better management.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="pk.eyJ..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveToken}>Save</Button>
            </div>
          </section>
        )}

        {isLoading && (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">Loading restaurants…</div>
        )}
        {error && (
          <div className="absolute inset-0 grid place-items-center text-destructive">Failed to load data.</div>
        )}

        {hasToken && !isLoading && !error && (
          <Map accessToken={token} restaurants={restaurants} />
        )}

        <div className="absolute bottom-4 inset-x-0 flex justify-center z-10">
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
