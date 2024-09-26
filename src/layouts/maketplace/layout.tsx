import React, { FC } from 'react';
import Select from '@/components/ui/select';
import MinimalLayout from '@/layouts/_minimal';
import demoData from '../../data/demo.json';
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
          <div className="absolute right-10 top-0 flex items-center gap-x-5 text-sm">
            <Select
              selectType="GROUP_SELECT"
              cn="min-w-[200px] px-3 py-2 bg-white rounded-md"
              optionBoardCn="py-2 bg-white rounded-md"
              options={demoData.sortOptions}
              optionCn="hover:bg-gray-200"
              groupCn="text-gray-400"
              placeholder="Sort by"
              onSelect={(val) => {
                console.log(val);
              }}
            />
            <span>{Number(demoData.totalNFTs).toLocaleString()} items</span>
          </div>
        </div>
        {children}
      </MinimalLayout>
    </>
  );
};

export default MarketPlaceLayout;
