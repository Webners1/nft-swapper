import { Close } from '../icons/close';
import { useModal } from '../modal-views/context';
import Button from '../ui/button/button';
import { FC, useState, useCallback } from 'react';
import { NFTDataType } from '@/types';
import { createOrder, useWallet } from '@/lib/hooks/use-connect';

type NFT_STATUS = 'ON_SALE' | 'READY_FOR_SALE';
interface ChangePriceViewProps {
  nftStatus: NFT_STATUS;
}

const ChangePriceView: FC<ChangePriceViewProps> = ({ nftStatus }) => {
  const { closeModal, data } = useModal();
  const [card] = useState<NFTDataType>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nftSwapperContract } = useWallet(); // Use the useWallet hook here

  // Set header and button text based on nftStatus
  const headerTxt = nftStatus === 'READY_FOR_SALE' ? '🖼️ Auction Your NFT' : 'Default Header';
  const btnTxt = nftStatus === 'READY_FOR_SALE' ? 'Approve' : 'Default Button';

  // Function to handle the order creation
  const handleCreateOrder = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!nftSwapperContract) {
        throw new Error('Contract not initialized. Make sure the wallet is connected.');
      }
      // Pass nftSwapperContract to createOrder
      const txHash = await createOrder(card.address, card.id, nftSwapperContract);
      console.log('Order created successfully for NFT ID:', card.id, 'Transaction hash:', txHash);
      closeModal();
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [card.address, card.id, closeModal, nftSwapperContract]);

  return (
    <div className="flex min-w-[360px] flex-col rounded-xl bg-white p-8">
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

      <h5>{`See What Others Have to Offer! 🔥💎`}</h5>

      {error && <p className="text-red-500">{error}</p>}

      <Button
        className="mt-4"
        variant="solid"
        size="block"
        shape="rounded"
        onClick={handleCreateOrder}
        disabled={isLoading || !nftSwapperContract}
      >
        {isLoading ? 'Processing...' : btnTxt}
      </Button>
    </div>
  );
};

export default ChangePriceView;