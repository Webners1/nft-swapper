import React, { FC, useContext, useState } from 'react';
import { Close } from '../icons/close';
import { useModal } from '../modal-views/context';
import Button from '../ui/button/button';
import InputLabel from '../ui/input-label';
import Input from '../ui/forms/input';
import { NFTDataType } from '@/types';
import { WalletContext, makeOffer } from '@/lib/hooks/use-connect';

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

  const handleMakeOrder = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      for (const nft of selectedNfts) {
        // Assuming you have the orderId and offeredIds prepared
        const orderId = nft.orderId; // Placeholder, replace this with actual logic for orderId
        const offeredIds = [nft.id]; // If you're offering just one NFT at a time
  
        // Call makeOffer function
        await makeOffer(orderId, nft.address, offeredIds);
      }
      console.log("All orders created successfully");
      closeModal();
    } catch (error) {
      console.error("Error creating orders:", error);
      setError("Failed to create order. Please try again.");
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
      <Button onClick={handleMakeOrder} disabled={isLoading}>
        {isLoading ? 'Placing Bid...' : 'Place Bid'}
      </Button>
      <Button onClick={closeModal}>Cancel</Button>
    </div>
  );
};
export default BidValue;