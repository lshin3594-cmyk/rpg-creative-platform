import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Генератор РПГ', icon: 'Gamepad2' },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Icon name="Wand2" size={24} className="text-primary" />
            <span>Генератор историй</span>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                asChild
                variant={location.pathname === item.path ? 'default' : 'ghost'}
              >
                <Link to={item.path} className="flex items-center gap-2">
                  <Icon name={item.icon as any} size={18} />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};