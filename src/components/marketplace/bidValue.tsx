import { Close } from '../icons/close';
import { useModal } from '../modal-views/context';
import Button from '../ui/button/button';
import InputLabel from '../ui/input-label';
import Input from '../ui/forms/input';
import { FC, useState } from 'react';
import { NFTDataType } from '@/types';

type NFT_STATUS = 'ON_SALE' | 'READY_FOR_SALE';
interface BidValueViewProps {
  nftStatus: NFT_STATUS;
}

const BidValue: FC<BidValueViewProps> = ({ nftStatus }) => {
  const { closeModal, data } = useModal();
  const [card, setCard] = useState<NFTDataType>(data);
  let headerTxt = 'Bid Price';
  let btnTxt = 'Place Bid';
  switch (nftStatus) {
    case 'READY_FOR_SALE':
      headerTxt = 'Bid a price';
      btnTxt = 'Place Bid';
      break;
    default:
      break;
  }
  // const updatePrice = () => {
  //   data.price = card.price;
  //   closeModal();
  // };
  return (
    <>
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

        <InputLabel title="Bid" />
        <Input
          defaultValue={card.price}
          onChange={(e) => setCard({ ...card, price: Number(e.target.value) })}
          min={0}
          pattern="[+-]?([0-9]*[.])?[0-9]+"
          type="text"
          placeholder="Enter the amount to bid"
          inputClassName="spin-button-hidden"
        />
        <Button
          className="mt-4"
          variant="solid"
          size="block"
          shape="rounded"
          // onClick={() => updatePrice()}
        >
          {btnTxt}
        </Button>
      </div>
    </>
  );
};

export default BidValue;
