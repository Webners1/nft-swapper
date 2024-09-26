import { NFTDataType } from '@/types';
import React, { FC } from 'react';
import Button from '../ui/button/button';
import Card from '../ui/card';

interface MarketPlaceBuyProps {
  items: Array<NFTDataType>;
  numPerRow: number;
  onLoadMore: (num: number) => void;
}

const MarketPlaceBuy: FC<MarketPlaceBuyProps> = ({
  items,
  numPerRow,
  onLoadMore,
}) => {
  const loadMore = () => {
    onLoadMore(numPerRow * 3);
  };

  return (
    <>
      <div className={`my-10 grid custom-grid-cols-${numPerRow} gap-4 py-10`}>
        {items.map((card, cardIdx) => {
          return (
            <React.Fragment key={`${card.name}_${cardIdx}`}>
              <Card card={card} />
            </React.Fragment>
          );
        })}
      </div>
      <Button
        color="primary"
        size="small"
        className="mx-auto"
        onClick={() => loadMore()}
      >
        Load More
      </Button>
    </>
  );
};

export default MarketPlaceBuy;
