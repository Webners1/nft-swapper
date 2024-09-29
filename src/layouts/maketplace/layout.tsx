import React, { FC } from 'react';
import Select from '@/components/ui/select';
import MinimalLayout from '@/layouts/_minimal';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  children: React.ReactNode;
}

const MarketPlaceLayout: FC<Props> = ({ children }) => {
  const router = useRouter();
  return (
    <>
      <MinimalLayout>
        <div className="relative">
          <div className="flex flex-row border-b-2 border-gray-300">
            <span
              className={`border-b-2 border-gray-400 px-5 py-2 font-semibold text-gray-600 ${
                router.pathname.includes('buy') ? 'border-b-2' : 'border-none'
              }`}
            >
              <Link href={'/marketplace/buy'}>BUY</Link>
            </span>
            <span
              className={`border-gray-400 px-5 py-2 font-semibold text-gray-600 ${
                router.pathname.includes('sell') ? 'border-b-2' : 'border-none'
              }`}
            >
              <Link href={'/marketplace/sell'}>SELL</Link>
            </span>
          </div>
       
        </div>
        {children}
      </MinimalLayout>
    </>
  );
};

export default MarketPlaceLayout;
