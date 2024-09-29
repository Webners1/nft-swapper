import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import BidValue from '@/components/bid-value';

interface Offer {
  proposer: string; // Address of the offer maker
  nftOffered: string[]; // Contract addresses of the NFTs offered
  offeredIds: number[]; // Token IDs of the offered NFTs
}

interface Order {
  owner: string; // Address of the order creator
  nftAddress: string; // Contract address of the NFT listed
  nftId: number; // Token ID of the NFT listed
  isActive: boolean; // Status of the order (active or not)
}

interface OrderWithOffers {
  order: Order;
  offers: Offer[];
}

const useOrderWithOffers = (orderId: number) => {
  const [orderWithOffers, setOrderWithOffers] =
    useState<OrderWithOffers | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [getOrder, getOffers] = useContext(WalletContext);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function
  const fetchOrderAndOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Assuming getOrder and getOffers are available functions from your file
      const order: Order = await getOrder(orderId);
      const offers: Offer[] = await getOffers(orderId);

      // Set the combined result in state
      setOrderWithOffers({ order, offers });
    } catch (error) {
      console.error('Error fetching order and offers:', error);
      setError('Failed to fetch order and offers');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Fetch data when the component mounts or when orderId changes
  useEffect(() => {
    fetchOrderAndOffers();
  }, [fetchOrderAndOffers]);

  return { orderWithOffers, loading, error };
};
const NFTDetailComponent: React.FC = () => {
  const router = useRouter();
  const { openModal, data } = useModal();

  const { address, id } = router.query;
  const { orderWithOffers, loading, error } = useOrderWithOffers(id);
  const demoOrderWithOffers: OrderWithOffers = {
    order: {
      owner: '0x303963f2480d9995e5596658986dd2a0af9a28e5', // Address of the order creator (the NFT contract)
      nftAddress: '0x303963f2480d9995e5596658986dd2a0af9a28e5', // NFT contract address
      nftId: 1, // Sample NFT token ID
      isActive: true, // Status of the order
    },
    offers: [
      {
        proposer: '0xa1b2c3d4e5f67890abcdef1234567890abcdef12', // Address of the offer maker
        nftOffered: ['0x303963f2480d9995e5596658986dd2a0af9a28e5'], // Contract address of the NFT offered
        offeredIds: [1077], // Token IDs of the offered NFTs
      },
      {
        proposer: '0xb1c2d3e4f5g67890abcdef1234567890abcdef34', // Another offer maker's address
        nftOffered: ['0x303963f2480d9995e5596658986dd2a0af9a28e5','0x303963f2480d9995e5596658986dd2a0af9a28e5','0x303963f2480d9995e5596658986dd2a0af9a28e5','0x303963f2480d9995e5596658986dd2a0af9a28e5'], // Contract address of the NFT offered
        offeredIds: [2058,1300,1034,1034], // Token IDs of the offered NFTs
      },
      {
        proposer: '0xc1d2e3f4g5h67890abcdef1234567890abcdef56', // Yet another offer maker's address
        nftOffered: ['0x303963f2480d9995e5596658986dd2a0af9a28e5','0x303963f2480d9995e5596658986dd2a0af9a28e5'], // Contract address of the NFT offered
        offeredIds: [1470,1350], // Token IDs of the offered NFTs
      },
    ],
  };

  const [nft, setNFT] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user_address = '0x76151eb2cc64df8f51550b5341ddcedf4be8676a';

  // Log router readiness and query for debugging
  useEffect(() => {
    if (router.isReady) {
      console.log('Router is ready:', router.query); // Debugging
    }
  }, [router.isReady]);

  const btnText = 'Make an Offer';


  useEffect(() => {
    const fetchNFTDetails = async () => {
      if (router.isReady && id && address) {
        try {
          console.log('Fetching NFT with ID:', id, ' and Address:', address); // Debugging
          const nfts = await fetchNftsById(address, id);
          if (nfts) {
            setNFT(nfts);
            console.log('NFTs fetched:', nfts); // Debugging
          } else {
            console.error('No NFT data returned from fetchNftsById');
          }
        } catch (error) {
          console.error('Error fetching NFT details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    fetchNFTDetails();
  }, [router.isReady, id, address]);

  if (isLoading) {
    return <FullPageLoading />;
  }

  
  const handleSubmit = () => {
    console.log('NFT data in handleSubmit:', nft); // Debugging
    if (nft) {
      openModal('BID_VALUE', { nft });
    } else {
      console.error('NFT is not set properly in handleSubmit');
    }
  };
  

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
              className="w-full max-w-md transform rounded-lg shadow-2xl transition-transform hover:scale-105"/>
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
      <OffersTab
        currentUser={user_address}
        orderWithOffers={demoOrderWithOffers}
        getNFtById={fetchNftsById}
      />
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
const OffersTab = ({ currentUser, orderWithOffers, getNFtById }) => {
  // Extract offers from the fetched data
  const { offers } = orderWithOffers;

  // State to hold fetched NFT details and loading/error states
  const [nftDetails, setNftDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTDetails = async () => {
      setLoading(true); // Set loading state to true
      setError(null); // Reset error state

      try {
        const details = {};
        await Promise.all(
          offers.map(async (offer) => {
            // Fetch NFT details for each NFT offered
            const nftFetchPromises = offer.nftOffered.map(
              async (nftAddress, index) => {
                const offerId = offer.offeredIds[index]; // Get corresponding offer ID
                const nftDetail = await getNFtById(nftAddress, offerId); // Fetch NFT by address and ID
                details[offerId] = nftDetail; // Store the NFT detail by ID
              }
            );
            await Promise.all(nftFetchPromises); // Wait for all NFT fetch promises to resolve
          })
        );
        setNftDetails(details); // Update NFT details state
      } catch (error) {
        setError('Error fetching NFT details.'); // Set error message if an error occurs
        console.error('Error fetching NFT details:', error);
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    if (offers.length > 0) {
      fetchNFTDetails(); // Fetch details only if there are offers
    }
  }, [offers]);

  if (loading) return <div>Loading...</div>; // Display loading message
  if (error) return <div>{error}</div>; // Display error message

  return (
    <>
      <h1 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
        NFT Offers
      </h1>
      {loading ? ( // Show loading state
        <div className="text-center">Loading NFT details...</div>
      ) : error ? ( // Show error message if there was an error
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="py-4 px-6 text-left">Offer Maker</th>
                <th className="py-4 px-6 text-left">NFTs</th>
                <th className="py-4 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 transition duration-300 hover:bg-gray-50"
                >
                  <td className="py-3 px-6 font-semibold">{offer.proposer}</td>
                  <td className="py-3 px-6">
                    <div className="flex flex-wrap gap-4">
                      {offer.nftOffered.map((nftId, nftIndex) => {
                        const nft = nftDetails[offer.offeredIds[nftIndex]]; // Get the NFT detail by ID
                        return nft ? ( // Check if the NFT data is available
                          <div
                            key={nftIndex}
                            className="flex items-center rounded-lg bg-gray-100 p-4 shadow-md transition-transform hover:scale-105"
                          >
                            <img
                              src={`https://ipfs.io/ipfs/${nft.img}`} // Ensure the correct image URL is used
                              alt={`NFT ${nftId}`} // Use the ID for alt text
                              className="mr-3 h-16 w-16 rounded"
                            />
                            <div>
                              <h3 className="text-lg font-medium">{nft.name}</h3>
                              <p className="text-sm text-gray-500">
                                Collection:
                                <a
                                  href={`https://www.zkmarkets.com/scroll-mainnet/collections/${nft.address}/nfts/${nftId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {nft.address}
                                </a>
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div key={nftIndex} className="flex items-center">
                            <p className="text-gray-500">Loading NFT...</p>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    {offer.nftOffered.some(
                      (nftId) => nftDetails[offer.offeredIds.find(id => id === nftId)]?.owner === currentUser
                    ) ? (
                      <button
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition-colors duration-300 hover:bg-blue-700"
                        onClick={() => handleAcceptOffer(offer.nftOffered)}
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
      )}
    </>
  );
};

// Mock function to handle accepting an offer
const handleAcceptOffer = (nftId) => {
  // Implement your accept offer logic here
  console.log(`Offer accepted for NFT ID: ${nftId}`);
};
