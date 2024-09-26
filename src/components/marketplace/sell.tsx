import { NFTDataType } from '@/types';
import React, { FC } from 'react';
import Card from '../ui/card';

interface MarketPlaceSellProps {
  items: Array<NFTDataType>;
  saleItems: Array<NFTDataType>;
  floorPrice: number;
  totalTrade: number;
}

const MarketPlaceSell: FC<MarketPlaceSellProps> = ({
  items,
  saleItems,
  floorPrice = 0,
  totalTrade = 0,
}) => {
  return (
    <>
      <section className="flex items-center gap-x-12 border-b-2 border-gray-300 py-10">
        <div className="flex flex-col gap-y-1">
          <h2>{floorPrice} ETH</h2>
          <p className="text-gray-400">floor price</p>
        </div>
        <div className="flex flex-col gap-y-1">
          <h2>{totalTrade}</h2>
          <p className="text-gray-400">total trades</p>
        </div>
      </section>
      <section className="border-b-2 border-gray-300 pt-7 pb-5">
        <h2>Your NFT&apos;s for sale</h2>
        <div className="my-5 flex flex-wrap gap-4">
          {saleItems.map((card, cardIdx) => {
            return (
              <React.Fragment key={`${card.name}_${cardIdx}`}>
                <Card card={card} cardType="CHANGE_PRICE" cn="max-w-[250px]" />
              </React.Fragment>
            );
          })}
        </div>
      </section>
      <section className="pt-7 pb-5">
        <h2>Your NFT&apos;s</h2>
        <div className="my-5 flex flex-wrap gap-4">
          {items.map((card, cardIdx) => {
            return (
              <React.Fragment key={`${card.name}_${cardIdx}`}>
                <Card card={card} cardType="SELL" cn="max-w-[250px]" />
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default MarketPlaceSell;
