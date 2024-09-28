import { Close } from '../icons/close';
import { useModal } from '../modal-views/context';
import Button from '../ui/button/button';
import InputLabel from '../ui/input-label';
import Input from '../ui/forms/input';
import { FC, useState } from 'react';
import { NFTDataType } from '@/types';
import Multiselect from 'multiselect-react-dropdown';

type NFT_STATUS = 'ON_SALE' | 'READY_FOR_SALE';
interface BidValueViewProps {
  nftStatus: NFT_STATUS;
}

const BidValue: FC<BidValueViewProps> = ({ nftStatus }) => {
  const { closeModal, data } = useModal();
  const [card, setCard] = useState<NFTDataType>(data);
  const [userNfts, setUserNfts] = useState<NFTDataType>([
    {
      cat: 'Group 1',
      key: 'Option 1',
    },
    {
      cat: 'Group 1',
      key: 'Option 2',
    },
    {
      cat: 'Group 1',
      key: 'Option 3',
    },
    {
      cat: 'Group 2',
      key: 'Option 4',
    },
    {
      cat: 'Group 2',
      key: 'Option 5',
    },
    {
      cat: 'Group 2',
      key: 'Option 6',
    },
    {
      cat: 'Group 2',
      key: 'Option 7',
    },
  ]);
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
          displayValue="key"
          onKeyPressFn={function noRefCheck() {}}
          onRemove={function noRefCheck() {}}
          onSearch={function noRefCheck() {}}
          onSelect={function noRefCheck() {}}
          options={userNfts}
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
