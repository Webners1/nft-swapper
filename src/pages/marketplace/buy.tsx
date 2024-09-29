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
import {
  fetchNftsById,
  fetchNftsByOwner,
  WalletContext,
} from '@/lib/hooks/use-connect';
import Link from 'next/link';
const MarketPlaceBuy: NextPageWithLayout = () => {
  const [isLoading, showLoading, hideLoading] = useLoading();
  const [items, setItems] = useState<Array<any>>([]);
  const [numPerRow, setNumPerRow] = useState<number>(0);
  const router = useRouter();

  const address = '0x76151eb2cc64df8f51550b5341ddcedf4be8676a';

  const getAllOrders = async () => {
    try {
      // First, get the total number of orders

      // const totalOrders = await nftSwapperContract.getAllOrder();

      // Iterate through each order ID
      // const orderDetails = await nftSwapperContract.getOrderDetails(i); // Fetch order details
      const totalOrders = 4; // Replace with your actual call: await nftSwapperContract.getAllOrder();
      const nftDetails = []; // Array to store active orders

      // Replace this with your actual order fetching logic
      const demoOrders = [
        {
          owner: '0x1234567890abcdef1234567890abcdef12345678',
          nftAddress: '0x303963f2480d9995e5596658986dd2a0af9a28e5',
          nftId: Math.floor(Math.random() * (1450 - 100 + 1)) + 100,
          isActive: true,
        },
        {
          owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          nftAddress: '0x303963f2480d9995e5596658986dd2a0af9a28e5',
          nftId: Math.floor(Math.random() * (1450 - 100 + 1)) + 100,
          isActive: true,
        },
        {
          owner: '0x7890abcdefabcdef1234567890abcdef12345678',
          nftAddress: '0x303963f2480d9995e5596658986dd2a0af9a28e5',
          nftId: Math.floor(Math.random() * (1450 - 100 + 1)) + 100,
          isActive: false,
        },
        {
          owner: '0x56789abcdef1234567890abcdef1234567890abc',
          nftAddress: '0x303963f2480d9995e5596658986dd2a0af9a28e5',
          nftId: Math.floor(Math.random() * (1450 - 100 + 1)) + 100,
          isActive: true,
        },
        {
          owner: '0x34567890abcdefabcdef1234567890abcdef1234',
          nftAddress: '0x303963f2480d9995e5596658986dd2a0af9a28e5',
          nftId: Math.floor(Math.random() * (1450 - 100 + 1)) + 100,
          isActive: false,
        },
      ];

      // Iterate through demo orders
      for (let i = 0; i < totalOrders; i++) {
        // Destructure the order details from demoOrders[i]
        const { owner, nftAddress, nftId, isActive } = demoOrders[i];

        // Check if the order is active
        if (isActive) {
          // Store the active order in the array
          const nftDetail = await fetchNftsById(nftAddress, nftId, i);
          nftDetails.push(nftDetail); // Add the NFT detail to the array
        }
      }

      return nftDetails; // Return the array of active orders
    } catch (error) {
      console.error(error);
      return []; // Return an empty array on error
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      showLoading();
      try {
        const nftDetails = await getAllOrders(); // Fetch the orders
        console.log({ nftDetails });
        setItems(nftDetails); // Set the fetched items
      } catch (error) {
        console.error(error);
      } finally {
        hideLoading();
      }
    };

    fetchOrders();
  }, []); // Empty dependency array to run only once on mount

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
    router.push(`/nft/${nft.address}${nft.id}`);
  };

  return (
    <>
      <NextSeo
        title="NFTSwapper - Marketplace"
        description="NFTSwapper Marketplace Buy"
      />
      <div className={`my-10 grid custom-grid-cols-${numPerRow} gap-4 py-10`}>
        {items?.map((nft, index) => (
          <Link
            href={`/marketplace/${nft.address}/${nft.tokenId}/${nft.id}`}
            passHref
          >
            <a>
              <React.Fragment key={`${nft.name}_${index}`}>
                <Card
                  card={{
                    img: nft.img,
                    name: nft.name,
                    id: nft.id,
                    address: nft.address,
                    owner: nft.owner,
                  }}
                  onClick={() => handleNFTClick(nft)}
                />
              </React.Fragment>
            </a>
          </Link>
        ))}
      </div>
      <Button color="primary" size="small" className="mx-auto">
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
