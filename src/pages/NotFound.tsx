import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocale } from '@/hooks/useLocale';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const { locale } = useLocale();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.32))] bg-muted/30">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link to={`/${locale}/`}>
          <Button>
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
