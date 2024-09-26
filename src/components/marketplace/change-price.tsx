import { Close } from '../icons/close';
import { useModal } from '../modal-views/context';
import Button from '../ui/button/button';
import InputLabel from '../ui/input-label';
import Input from '../ui/forms/input';
import { FC, useState } from 'react';
import { NFTDataType } from '@/types';

type NFT_STATUS = 'ON_SALE' | 'READY_FOR_SALE';
interface ChangePriceViewProps {
  nftStatus: NFT_STATUS;
}

const ChangePriceView: FC<ChangePriceViewProps> = ({ nftStatus }) => {
  const { closeModal, data } = useModal();
  const [card, setCard] = useState<NFTDataType>(data);
  let headerTxt = 'Change the price';
  let btnTxt = 'Change';
  switch (nftStatus) {
    case 'READY_FOR_SALE':
      headerTxt = 'Set new price';
      btnTxt = 'Save';
      break;
    default:
      break;
  }
  const updatePrice = () => {
    data.price = card.price;
    closeModal();
  };
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

        <InputLabel title="Price" />
        <Input
          defaultValue={card.price}
          onChange={(e) => setCard({ ...card, price: Number(e.target.value) })}
          min={0}
          pattern="[+-]?([0-9]*[.])?[0-9]+"
          type="text"
          placeholder="Enter the amount of token to buy"
          inputClassName="spin-button-hidden"
        />
        <Button
          className="mt-4"
          variant="solid"
          size="block"
          shape="rounded"
          onClick={() => updatePrice()}
        >
          {btnTxt}
        </Button>
      </div>
    </>
  );
};

export default ChangePriceView;
