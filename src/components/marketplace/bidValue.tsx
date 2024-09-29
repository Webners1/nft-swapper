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
  
  const headerTxt = 'Bid Price';
  const btnTxt = 'Place Bid';
  const handleSelect = (selectedList: NFTDataType[], selectedItem: NFTDataType) => {
    setSelectedNfts(selectedList);
 console.log({selectedNfts})

  };

  const handleRemove = (selectedList: NFTDataType[], selectedItem: NFTDataType) => {
    setSelectedNfts(selectedList);
 console.log({selectedNfts})

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
