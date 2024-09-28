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
  const { openModal } = useModal();

  const { address, id } = router.query;
  const [nft, setNFT] = useState<NFTDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [card, setCard] = useState<NFTDataType | null>(null);
  const user_address = '0x76151eb2cc64df8f51550b5341ddcedf4be8676a';

  // Log router readiness and query for debugging
  useEffect(() => {
    if (router.isReady) {
      console.log('Router is ready:', router.query); // Debugging
    }
  }, [router.isReady]);

  let btnText = 'Make an Offer';

  const handleSubmit = (card: NFTDataType) => {
    console.log('Opening BID_VALUE modal'); // Debug line
    openModal('BID_VALUE', card);
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
            setCard({
              id: parseInt(nft.token_id, 10),
              img: nft.image_uri || nft.token_uri,
              name: nft.name || 'Unnamed NFT',
              description: nft.description || 'No description available',
              owner: nft.owner || null,
              address: nft.contract_address || null,
            });
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
        <h1 className="mb-4 text-3xl font-bold">{nft.name}</h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <img
              src={nft.img}
              alt={nft.name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div>
            <p className="mb-2 text-xl">
              <strong>Owner:</strong> {nft.owner}
            </p>
            <p className="mb-2 text-xl">
              <strong>ID:</strong> {nft.id}
            </p>
            <p className="mb-4 text-xl">
              <strong>Description:</strong> {nft.description}
            </p>
            {/* Add more details as needed */}

            <div className="flex w-full flex-col gap-y-3 rounded-xl bg-white p-5">
              <h2>Properties</h2>
              {/* {nft?.map((property, pIdx) => {
              return (
                <div
                  className="flex w-full items-center"
                  key={`${pIdx}_${property.name}`}
                >
                  <span className="w-1/3">{property.name}</span>
                  <span className="w-1/3">{property.value}</span>
                  <span className="w-1/3">{property.trait}</span>
                </div>
              );
            })} */}
            </div>
          </div>
        </div>
        <Button
          className="mt-5"
          size="block"
          color="primary"
          shape="rounded"
          onClick={() => handleSubmit(card)}
        >
          {btnText}
        </Button>
      </div>
    </>
  );
};

NFTDetailComponent.getLayout = function getLayout(page) {
  return <MarketPlaceLayout>{page}</MarketPlaceLayout>;
};

export default NFTDetailComponent;
