import { Close } from '../icons/close';
import { useModal } from '../modal-views/context';
import Button from '../ui/button/button';
import InputLabel from '../ui/input-label';
import Input from '../ui/forms/input';
import { FC, useContext, useState } from 'react';
import { NFTDataType } from '@/types';
import Multiselect from 'multiselect-react-dropdown';
import { makeOffer, WalletContext } from '@/lib/hooks/use-connect';
import { useRouter } from 'next/router';

type NFT_STATUS = 'ON_SALE' | 'READY_FOR_SALE';
interface BidValueViewProps {
  nftStatus: NFT_STATUS;
}

const BidValue: FC<BidValueViewProps> = () => {
  const { closeModal, data } = useModal();
  const [card, setCard] = useState<NFTDataType>(data);
  const router = useRouter()
  const [selectedNfts, setSelectedNfts] = useState<NFTDataType[] | null>();
  const { UserNfts, makeOffer } = useContext(WalletContext);
  const { id } = router.query;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  console.log({UserNfts})

  const handleMakeOrder = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      // Prepare arrays to hold the NFT addresses and offered IDs
      const offeredIds = [];
      const nftAddresses = [];
  
      // Iterate through selected NFTs to collect addresses and IDs
      for (const nft of selectedNfts) {
        offeredIds.push(nft.tokenId); // Add tokenId of the NFT
        nftAddresses.push(nft.address); // Add address of the NFT
      }
      // Call makeOffer function with all NFT addresses and offered IDs
      await makeOffer(id, nftAddresses, offeredIds);
  
      console.log('Offer created successfully');
      closeModal();
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const headerTxt = 'Bid Price';
  const btnTxt = 'Place Bid';
  const handleSelect = (
    selectedList: NFTDataType[],
    selectedItem: NFTDataType
  ) => {
    setSelectedNfts(selectedList);
    console.log({ selectedNfts });
  };

  const handleRemove = (
    selectedList: NFTDataType[],
    selectedItem: NFTDataType
  ) => {
    setSelectedNfts(selectedList);
    console.log({ selectedNfts });
  };

  return (
    <>
      <div className="flex min-h-[360px] min-w-[360px] flex-col rounded-xl bg-white p-8">
        <div className="mb-7 flex items-center justify-between">
          <h3>{headerTxt}</h3>
          <Button
            color="white"
            variant="ghost"
            shape="circle"
            onClick={closeModal}
          >
            <Close className="h-4 w-4" />
          </Button>
        </div>

        <InputLabel title="Bid" />

        <Multiselect
          displayValue="name"
          key={"tokenId"}
          onKeyPressFn={function noRefCheck() {}}
          onRemove={handleRemove}
          onSearch={function noRefCheck() {}}
          onSelect={handleSelect}
          options={UserNfts}
        />
        <br />

        <div className="flex space-x-4">
          <Button onClick={handleMakeOrder} disabled={isLoading}>
            {isLoading ? 'Placing Bid...' : 'Place Bid'}
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </div>
      </div>
    </>
  );
};

export default BidValue;
