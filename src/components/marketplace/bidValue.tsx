import React, { FC, useContext, useState } from 'react';
import { Close } from '../icons/close';
import { useModal } from '../modal-views/context';
import Button from '../ui/button/button';
import InputLabel from '../ui/input-label';
import Input from '../ui/forms/input';
import { NFTDataType } from '@/types';
import { WalletContext, createOrder } from '@/lib/hooks/use-connect';

interface BidValueProps {
  nft?: NFTDataType;
}

const BidValue: FC<BidValueProps> = ({ nft }) => {
  const { closeModal } = useModal();

  const [bidAmount, setBidAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Log the nft data for debugging
  console.log('BidValue NFT:', nft); // Debugging

  const handleBid = async () => {
    if (!bidAmount) {
      setError('Please enter a bid amount');
      return;
    }
    setIsLoading(true);
    try {
      // Call your function to create an order
      await createOrder(nft, bidAmount);
      // Handle successful bid (e.g., show a success message)
      closeModal();
    } catch (err) {
      setError('Failed to place bid');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Place Your Bid for {nft?.name}</h2>
      <InputLabel htmlFor="bidAmount">Bid Amount</InputLabel>
      <Input
        id="bidAmount"
        type="text"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button onClick={handleBid} disabled={isLoading}>
        {isLoading ? 'Placing Bid...' : 'Place Bid'}
      </Button>
      <Button onClick={closeModal}>Cancel</Button>
    </div>
  );
};
export default BidValue;