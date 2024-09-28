// import BoxArrowUpRightIcon from '@/components/icons/box-arrow-up-right';
// import ReloadIcon from '@/components/icons/reload';
// import ShareIcon from '@/components/icons/share';
// import ThreeDotsIcon from '@/components/icons/threedots';
// import Button from '@/components/ui/button/button';
// import MinimalLayout from '@/layouts/_minimal';
// import { NFTDataType, NextPageWithLayout } from '@/types';
// import { GetStaticPaths, GetStaticProps } from 'next';
// import { NextSeo } from 'next-seo';
// import { ParsedUrlQuery } from 'querystring';
// import { useState } from 'react';
// import demoData from '../../data/demo.json';

// interface IParams extends ParsedUrlQuery {
//   id: string;
// }

// export const getStaticPaths: GetStaticPaths = async () => {
//   const arr: Array<NFTDataType> = demoData.cardData;
//   return {
//     paths: arr.map((item) => {
//       return {
//         params: { id: String(item.id).toString() },
//       };
//     }),
//     fallback: false,
//   };
// };

// export const getStaticProps: GetStaticProps = async (context) => {
//   const { id } = context.params as IParams;
//   const cardData = demoData.cardData.filter(
//     (item) => item.id === Number(id)
//   )[0];
//   return {
//     props: {
//       data: cardData,
//     },
//   };
// };

// const NFTDetailPage: NextPageWithLayout = ({ data }) => {
//   const [nftData] = useState<NFTDataType>(data as NFTDataType);
//   const properties = [
//     { name: 'Background', value: 'None', trait: '66% have this trait' },
//     {
//       name: 'Collection',
//       value: 'Pudgy Crew Socks',
//       trait: '66% have this trait',
//     },
//     { name: 'Item', value: 'Crew Socks', trait: '66% have this trait' },
//     {
//       name: 'Parent name',
//       value: 'Pudgy Penguin',
//       trait: '66% have this trait',
//     },
//     { name: 'Property', value: 'Common', trait: '66% have this trait' },
//     { name: 'Property', value: 'Crafted', trait: '66% have this trait' },
//     { name: 'Type', value: 'Footwear', trait: '66% have this trait' },
//   ];
//   return (
//     <>
//       <NextSeo title="STAKING" description="Bunzz - Staking Boilerplate" />
//       <div className="flex w-full flex-col gap-y-5 gap-x-10 px-5 xs:flex-row xs:gap-y-0 2xl:px-56">
//         <div className="flex w-full flex-col gap-y-4">
//           <div className="flex w-full gap-x-5">
//             <div className="w-full">
//               <img src={nftData.img} className="rounded-xl bg-white p-5" />
//             </div>
//             <div className="flex flex-col gap-y-3">
//               <Button color="white" shape="circle">
//                 <ShareIcon />
//               </Button>
//               <Button color="white" shape="circle">
//                 <ThreeDotsIcon />
//               </Button>
//               <Button color="white" shape="circle">
//                 <BoxArrowUpRightIcon />
//               </Button>
//               <Button color="white" shape="circle">
//                 <ReloadIcon />
//               </Button>
//             </div>
//           </div>
//           <div className="flex items-center gap-x-2">
//             <h3 className="">{nftData.name}</h3>
//             <sub className="text-gray-400">Owned by</sub>
//             <sub>{nftData.owner}</sub>
//           </div>
//           <p>Current Price</p>
//           <h1>
//             {nftData.price} {nftData.currency}{' '}
//             <span className="text-base text-gray-400">$100.05</span>
//           </h1>
//           <Button
//             shape="rounded"
//             variant="solid"
//             size="small"
//             className="w-[150px]"
//           >
//             Buy
//           </Button>
//         </div>

//         <div className="flex w-full flex-col gap-y-5">
//           <div className="flex w-full flex-col gap-y-3 rounded-xl bg-white p-5">
//             <h2>Description</h2>
//             <p>
//               Lorem Ipsum is simply dummy text of the printing and typesetting
//               industry. Lorem Ipsum has been the industry&apos;s standard dummy
//               text ever since the 1500s, when an unknown printer took a galley
//               type and scrambled it to make a type specimen book. It has
//               survived not only five centuries, but also the leap into
//               electronic typesetting, remaining essentially unchanged. It was
//               popularised in the 1960s with the release of Letraset sheets
//               containing Lorem Ipsum passages, and more recently with desktop
//               publishing software like Aldus PageMaker including versions of
//               Lorem Ipsum.
//             </p>
//           </div>
//           <div className="flex w-full flex-col gap-y-3 rounded-xl bg-white p-5">
//             <h2>Properties</h2>
//             {properties.map((property, pIdx) => {
//               return (
//                 <div
//                   className="flex w-full items-center"
//                   key={`${pIdx}_${property.name}`}
//                 >
//                   <span className="w-1/3">{property.name}</span>
//                   <span className="w-1/3">{property.value}</span>
//                   <span className="w-1/3">{property.trait}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// NFTDetailPage.getLayout = function getLayout(page) {
//   return <MinimalLayout>{page}</MinimalLayout>;
// };

// export default NFTDetailPage;
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { NFTDataType } from '@/types';
import { fetchNftsByOwner } from '@/lib/hooks/use-connect';
import FullPageLoading from '@/components/ui/loading/full-page-loading';
import MarketPlaceLayout from '@/layouts/maketplace/layout';

const NFTDetailComponent: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [nft, setNFT] = useState<NFTDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = '68JvmwmnZk2qDYdyPENtpGPh';
  const address = '0x76151eb2cc64df8f51550b5341ddcedf4be8676a';

  useEffect(() => {
    const fetchNFTDetails = async () => {
      if (router.isReady && id) {
        try {
          const nfts = await fetchNftsByOwner(address, apiKey);
          const selectedNFT = nfts.find(nft => nft.id.toString() === id); // Ensure type consistency
          if (selectedNFT) {
            setNFT(selectedNFT);
          } else {
            console.error('NFT not found');
          }
        } catch (error) {
          console.error('Error fetching NFT details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNFTDetails();
  }, [router.isReady, id, apiKey, address]); // Added dependencies for better performance

  if (isLoading) {
    return <FullPageLoading />;
  }

  if (!nft) {
    return <div>NFT not found</div>;
  }

  return (
    <>
      <NextSeo
        title={`NFTSW - ${nft.name}`}
        description={`Details for NFT: ${nft.name}`}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{nft.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={nft.img} alt={nft.name} className="w-full rounded-lg shadow-lg" />
          </div>
          <div>
            <p className="text-xl mb-2"><strong>Owner:</strong> {nft.owner}</p>
            <p className="text-xl mb-2"><strong>ID:</strong> {nft.id}</p>
            <p className="text-xl mb-4"><strong>Description:</strong> {nft.description}</p>
            {/* Add more details as needed */}
          </div>
        </div>
      </div>
    </>
  );
};

NFTDetailComponent.getLayout = function getLayout(page) {
  return <MarketPlaceLayout>{page}</MarketPlaceLayout>;
};

export default NFTDetailComponent;
