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
import { WalletContext } from '@/lib/hooks/use-connect';
import Link from 'next/link';
const MarketPlaceBuy: NextPageWithLayout = () => {
  const [isLoading, showLoading, hideLoading] = useLoading();
  const [items, setItems] = useState<Array<any>>([]);
  const [numPerRow, setNumPerRow] = useState<number>(0);
  const router = useRouter();

  const { fetchNftsById, nftSwapperContract } = useContext(WalletContext);
  const address = '0x76151eb2cc64df8f51550b5341ddcedf4be8676a';

  const getAllOrders = async () => {
    if (!nftSwapperContract) return;
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
    try {
      // First, get the total number of orders
      console.log({ nftSwapperContract });

      const totalOrders = await nftSwapperContract.getOrder();

      console.log({ totalOrders });
      // Iterate through each order ID
      // const totalOrders = 4; // Replace with your actual call: await nftSwapperContract.getAllOrder();
      const nftDetails: NFTDataType[] = []; // Array to store active orders

      // Replace this with your actual order fetching logic

      // Iterate through demo orders
      for (let i = 1; i <= totalOrders.toNumber(); i++) {
        // Destructure the order details from demoOrders[i]
        const orderDetails = await nftSwapperContract.getOrderDetails(i); // Fetch order details

        const { owner, nftAddress, nftId, isActive } = orderDetails;
        // Check if the order is active
        if (isActive) {
          // Store the active order in the array
          const nftDetail: NFTDataType = await fetchNftsById(
            nftAddress,
            nftId.toNumber(),
            i
          );
          nftDetails.push(nftDetail);
          // Add the NFT detail to the array
        }
      }
      return nftDetails; // Return the array of active orders
    } catch (error) {
      console.error(error);
      return demoOrders; // Return an empty array on error
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      showLoading();
      try {
        setItems(await getAllOrders()); // Set the fetched items
      } catch (error) {
        console.error(error);
      } finally {
        hideLoading();
      }
    };

    fetchOrders();
  }, [nftSwapperContract]); // Empty dependency array to run only once on mount

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
console.log({items})
  return (
    <>
      <NextSeo
        title="NFTSwapper - Marketplace"
        description="NFTSwapper Marketplace Buy"
      />
      <div className={`my-10 grid custom-grid-cols-${numPerRow} gap-4 py-10`}>
      {items?.map((nft, index) => {
  console.log("NFT Data: ", nft[0]);  // Log each nft object to the console

  return (
    <Link
      href={`/marketplace/${nft[0].address}/${nft[0].tokenId}/${nft[0].id}`}
      passHref
      key={`${nft[0].name}_${index}`}  // Make sure key is applied on the top-level element
    >
      <a>
        <Card
          card={{
            img: nft[0].img,
            name: nft[0].name,
            id: nft[0].id,
            address: nft[0].address,
            owner: nft[0].owner,
          }}
          onClick={() => handleNFTClick(nft[0])}
        />
      </a>
    </Link>
  );
})}

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
