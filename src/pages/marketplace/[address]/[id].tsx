import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { NFTDataType } from '@/types';
import {
  fetchNftsById,
  fetchNftsByOwner,
  WalletContext,
} from '@/lib/hooks/use-connect';
import FullPageLoading from '@/components/ui/loading/full-page-loading';
import MarketPlaceLayout from '@/layouts/maketplace/layout';
import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/button';

const NFTDetailComponent: React.FC = () => {
  const router = useRouter();
  const { openModal, data } = useModal();

  const { address, id } = router.query;
  const [nft, setNFT] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user_address = '0x76151eb2cc64df8f51550b5341ddcedf4be8676a';

  // Log router readiness and query for debugging
  useEffect(() => {
    if (router.isReady) {
      console.log('Router is ready:', router.query); // Debugging
    }
  }, [router.isReady]);

  let btnText = 'Make an Offer';

  const handleSubmit = () => {
    console.log('Opening BID_VALUE modal'); // Debug line
    openModal('BID_VALUE', nft);
  };

  useEffect(() => {
    const fetchNFTDetails = async () => {
      if (router.isReady && id && address) {
        // Ensure router is ready and id is available
        console.log('Fetching for ID:', id); // Debugging
        try {
          const nfts = await fetchNftsById(address, id);
          if (nfts) {
            setNFT(nfts);
            console.log({ nfts });
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
  }, [router.isReady, id]);

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
        <h1 className="mb-6 text-4xl font-extrabold text-gray-900">
          {nft.name}
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex justify-center">
            <img
              src={`https://ipfs.io/ipfs/${nft.img}`}
              alt={nft.name}
              className="w-full max-w-md transform rounded-lg shadow-2xl transition-transform hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-3 text-xl font-semibold">
                <span className="font-bold">Owner:</span> {nft.owner}
              </p>
              <p className="mb-3 text-xl font-semibold text-blue-600">
                <span className="font-bold">Token ID:</span>
                <span className="ml-2 rounded bg-gray-200 px-2 py-1">
                  {nft.id}
                </span>
              </p>
              <p className="mb-4 text-lg italic text-gray-700">
                <span className="font-bold">Description:</span>
                <span className="ml-2 text-gray-600">{nft.description}</span>
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Properties</h2>
              <div className="rounded-lg bg-white p-5 shadow-lg">
                {nft.properties?.map((property, pIdx) => (
                  <div
                    className="mb-3 flex items-center rounded-lg bg-gray-50 p-4 shadow transition-shadow duration-300 hover:shadow-md"
                    key={`${pIdx}_${property.attribute_name}`}
                  >
                    <span className="w-1/3 font-medium text-gray-800">
                      {property.attribute_name}
                    </span>
                    <span className="w-1/3 text-gray-600">
                      {property.attribute_value}
                    </span>
                    <span className="w-1/3 text-gray-500">
                      {property.percentage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-blue-700 md:w-auto"
            onClick={() => handleSubmit()}
          >
            {btnText}
          </Button>
        </div>
      </div>
      <OffersTab currentUser={user_address} />
    </>
  );
};

NFTDetailComponent.getLayout = function getLayout(page) {
  return <MarketPlaceLayout>{page}</MarketPlaceLayout>;
};

export default NFTDetailComponent;
export interface OfferType {
  offerMaker: string;
  nfts: NFTDataType[];
}
const OffersTab = ({ currentUser }) => {
  // Define the OfferType interface to represent an offer with multiple NFTs

  // Sample demo offers
  const demoOffers: OfferType[] = [
    {
      offerMaker: '0xOfferMakerAddress1',
      nfts: [
        {
          id: 1,
          img: 'QmUo4Bc5kKrHT4HTs3h9hfK2MB8jcK4sD5aDh61w9FFmKK', // Example IPFS hash for image
          address: '0x1234567890abcdef1234567890abcdef12345678',
          name: 'Cool Cat #1',
          owner: '0xOwnerAddress1',
        },
      ],
    },
    {
      offerMaker: '0xOfferMakerAddress2',
      nfts: [
        {
          id: 2,
          img: 'QmUo4Bc5kKrHT4HTs3h9hfK2MB8jcK4sD5aDh61w9FFmKK',
          address: '0x1234567890abcdef1234567890abcdef12345679',
          name: 'Crypto Punks #2',
          owner: '0xOwnerAddress2',
        },
        {
          id: 3,
          img: 'QmUo4Bc5kKrHT4HTs3h9hfK2MB8jcK4sD5aDh61w9FFmKK',
          address: '0x1234567890abcdef1234567890abcdef12345680',
          name: 'Bored Ape #3',
          owner: '0xOwnerAddress1',
        },
      ],
    },
    {
      offerMaker: '0xOfferMakerAddress3',
      nfts: [
        {
          id: 4,
          img: 'QmUo4Bc5kKrHT4HTs3h9hfK2MB8jcK4sD5aDh61w9FFmKK',
          address: '0x1234567890abcdef1234567890abcdef12345681',
          name: 'Art Blocks #4',
          owner: '0xOwnerAddress3',
        },
        {
          id: 5,
          img: 'QmUo4Bc5kKrHT4HTs3h9hfK2MB8jcK4sD5aDh61w9FFmKK',
          address: '0x1234567890abcdef1234567890abcdef12345682',
          name: 'Art Blocks #5',
          owner: '0xOwnerAddress1',
        },
        {
          id: 6,
          img: 'QmUo4Bc5kKrHT4HTs3h9hfK2MB8jcK4sD5aDh61w9FFmKK',
          address: '0x1234567890abcdef1234567890abcdef12345683',
          name: 'Art Blocks #6',
          owner: '0xOwnerAddress2',
        },
      ],
    },
  ];
  return (
    <>
      <h1 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
        NFT Offers
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="py-4 px-6 text-left">Offer Maker</th>
              <th className="py-4 px-6 text-left">NFTs</th>
              <th className="py-4 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {demoOffers.map((offer, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 transition duration-300 hover:bg-gray-50"
              >
                <td className="py-3 px-6 font-semibold">{offer.offerMaker}</td>
                <td className="py-3 px-6">
                  <div className="flex flex-wrap gap-4">
                    {offer.nfts.map((nft) => (
                      <div
                        key={nft.id}
                        className="flex items-center rounded-lg bg-gray-100 p-4 shadow-md transition-transform hover:scale-105"
                      >
                        <img
                          src={`https://ipfs.io/ipfs/${nft.img}`}
                          alt={nft.name}
                          className="mr-3 h-16 w-16 rounded"
                        />
                        <div>
                          <h3 className="text-lg font-medium">{nft.name}</h3>
                          <p className="text-sm text-gray-500">
                            Collection:
                            <a
                              href={`https://www.zkmarkets.com/scroll-mainnet/collections${nft.address}/nfts/${nft.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {nft.address}
                            </a>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-6">
                  {offer.nfts.some((nft) => nft.owner === currentUser) ? (
                    <button
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition-colors duration-300 hover:bg-blue-700"
                      onClick={() =>
                        handleAcceptOffer(offer.nfts.map((nft) => nft.id))
                      }
                    >
                      Accept Offer
                    </button>
                  ) : (
                    <span className="text-gray-500">Not Your NFT</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// Mock function to handle accepting an offer
const handleAcceptOffer = (nftId) => {
  // Implement your accept offer logic here
  console.log(`Offer accepted for NFT ID: ${nftId}`);
};
