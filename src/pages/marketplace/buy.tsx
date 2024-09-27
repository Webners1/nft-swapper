import React, { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { breakPoints } from '@/lib/hooks/use-breakpoint';
import Button from '@/components/ui/button/button';
import Card from '@/components/ui/card';
import { NextPageWithLayout, NFTDataType } from '@/types';
import demoData from '../../data/demo.json';
import useLoading from '@/lib/hooks/use-loading';      
import FullPageLoading from '@/components/ui/loading/full-page-loading';
import MarketPlaceLayout from '@/layouts/maketplace/layout';

const MarketPlaceBuy: NextPageWithLayout = () => {
  const [isLoading, showLoading, hideLoading] = useLoading();
  const [items, setItems] = useState<Array<NFTDataType>>(
    demoData.cardData.slice(0, 6)
  );
  const [numPerRow, setNumPerRow] = useState<number>(0);
  const loadMore = () => {
    showLoading();
    setTimeout(() => {
      const newItems = Array(numPerRow * 3).fill(demoData.cardData[0]);
      setItems([...items, ...newItems]);
      hideLoading();
    }, 3000);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      const width = window.innerWidth;
      if (width >= breakPoints['3xl']) {
        setNumPerRow(6);
      } else if (width < breakPoints['3xl'] && width >= breakPoints['2xl']) {
        setNumPerRow(6);
      } else if (width < breakPoints['2xl'] && width >= breakPoints.xl) {
        setNumPerRow(5);
      } else if (width < breakPoints.xl && width >= breakPoints.lg) {
        setNumPerRow(3);
      } else if (width < breakPoints.lg && width >= breakPoints.md) {
        setNumPerRow(3);
      } else if (width < breakPoints.md && width >= breakPoints.sm) {
        setNumPerRow(2);
      } else if (width < breakPoints.sm && width >= breakPoints.xs) {
        setNumPerRow(2);
      } else {
        setNumPerRow(1);
      }
    };
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();

    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return (
    <>
      <NextSeo
        title="NFTSW - Marketplace"
        description="NFTSW Marketplace Buy"
      />
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
      {isLoading && <FullPageLoading />}
    </>
  );
};

MarketPlaceBuy.getLayout = function getLayout(page) {
  return <MarketPlaceLayout>{page}</MarketPlaceLayout>;
};

export default MarketPlaceBuy;
