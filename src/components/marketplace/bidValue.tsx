import { Close } from '../icons/close';
import { useModal } from '../modal-views/context';
import Button from '../ui/button/button';
import InputLabel from '../ui/input-label';
import Input from '../ui/forms/input';
import { FC, useContext, useState } from 'react';
import { NFTDataType } from '@/types';
import Multiselect from 'multiselect-react-dropdown';
import { WalletContext } from '@/lib/hooks/use-connect';

type NFT_STATUS = 'ON_SALE' | 'READY_FOR_SALE';
interface BidValueViewProps {
  nftStatus: NFT_STATUS;
}

const BidValue: FC<BidValueViewProps> = () => {
  const { closeModal, data } = useModal();
  const [card, setCard] = useState<NFTDataType>(data);
  const [selectedNfts, setSelectedNfts] = useState<NFTDataType[] | null>();
  const { UserNfts } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  console.log(data)

  const handleMakeOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      for (const nft of selectedNfts) {
        // Assuming you have the orderId and offeredIds prepared
        const orderId = nft.orderId; // Placeholder, replace this with actual logic for orderId
        const offeredIds = [nft.id]; // If you're offering just one NFT at a time

        // Call makeOffer function
        await makeOffer(data?.id, nft.address, offeredIds);
      }
      console.log('All orders created successfully');
      closeModal();
    } catch (error) {
      console.error('Error creating orders:', error);
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
