import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun, Plus } from "lucide-react";
import { useTheme } from "next-themes";

type MobileNavigationProps = {
  restaurantCount: number;
};

const MobileNavigation = ({ restaurantCount }: MobileNavigationProps) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Menu button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-app-surface-elevated"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background border-border">
              <nav className="space-y-6 mt-8">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-foreground">Restaurant Guide</h2>
                  <p className="text-sm text-muted-foreground">
                    Discover amazing places to eat
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    asChild
                    className="w-full justify-start bg-gradient-primary hover:opacity-90 text-primary-foreground"
                  >
                    <a
                      href="https://nathanpham.notion.site/1e217e06a1e18010bf7bf0492fd68fb5?pvs=105"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Review
                    </a>
                  </Button>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-app-surface-elevated">
                    <span className="text-sm font-medium">Dark Mode</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="h-8 w-8 rounded-full"
                    >
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Statistics
                    </h3>
                    <div className="text-2xl font-bold text-primary">
                      {restaurantCount}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      restaurants available
                    </p>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Center - App title */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Eats
            </h1>
          </div>

          {/* Right side - Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full hover:bg-app-surface-elevated"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileNavigation;