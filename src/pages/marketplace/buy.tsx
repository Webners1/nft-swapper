import React, { useState, useEffect, useContext } from 'react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { breakPoints } from '@/lib/hooks/use-breakpoint';
import Button from '@/components/ui/button/button';
import Card from '@/components/ui/card';
import { NextPageWithLayout, NFTDataType } from '@/types';
import useLoading from '@/lib/hooks/use-loading';      
import FullPageLoading from '@/components/ui/loading/full-page-loading';
import MarketPlaceLayout from '@/layouts/maketplace/layout';
import { fetchNftsByOwner, WalletContext } from '@/lib/hooks/use-connect';
import Link from 'next/link';
const MarketPlaceBuy: NextPageWithLayout = () => {
  const [isLoading, showLoading, hideLoading] = useLoading();
  const [items, setItems] = useState<Array<NFTDataType>>([]);
  const [numPerRow, setNumPerRow] = useState<number>(0);
  const router = useRouter();
  const apiKey = '68JvmwmnZk2qDYdyPENtpGPh';
  const address = '0x76151eb2cc64df8f51550b5341ddcedf4be8676a';

  useEffect(() => {
    const fetchNFTs = async () => {
      if (address) {
        showLoading();
        try {
          const nfts = await fetchNftsByOwner(address, apiKey);
          if (nfts) {
            setItems(nfts);
          }
        } catch (error) {
          console.error('Error fetching NFTs:', error);
        } finally {
          hideLoading();
        }
      }
    };

    fetchNFTs();
  }, [address]);

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

  const handleNFTClick = (nft: NFTDataType) => {
    router.push(`/nft/${nft.id}`);
  };

  return (
    <>
      <NextSeo
        title="NFTSW - Marketplace"
        description="NFTSW Marketplace Buy"
      />
      <div className={`my-10 grid custom-grid-cols-${numPerRow} gap-4 py-10`}>
        {items.map((nft, index) => (
          <Link href={`/nft/${nft.id}`} passHref>
          <a>
          <React.Fragment key={`${nft.name}_${index}`}>
            <Card 
              card={{
                img: nft.img,
                name: nft.name,
                owner: nft.owner,
              }} 
              onClick={() => handleNFTClick(nft)}
            />
          </React.Fragment>
          </a>
        </Link>
        

        
        ))}
      </div>
      <Button
        color="primary"
        size="small"
        className="mx-auto"
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