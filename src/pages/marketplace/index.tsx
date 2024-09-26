import { useEffect } from 'react';
import { useRouter } from 'next/router';
import routes from '@/config/routes';

const MarketplacePage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push(routes.buy);
  }, []);

  return undefined;
};

export default MarketplacePage;
