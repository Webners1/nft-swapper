import { Close } from '../icons/close';
import { useModal } from '../modal-views/context';
import Button from '../ui/button/button';
import InputLabel from '../ui/input-label';
import Input from '../ui/forms/input';
import { FC, useState } from 'react';
import { NFTDataType } from '@/types';
import { MultiSelect } from 'primereact/multiselect';

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
  const [selectedCountries, setSelectedCountries] = useState(null);
  const countries = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' },
  ];

  const countryTemplate = (option) => {
    return (
      <div className="align-items-center flex">
        <img
          alt={option.name}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`flag mr-2 flag-${option.code.toLowerCase()}`}
          style={{ width: '18px' }}
        />
        <div>{option.name}</div>
      </div>
    );
  };
  const [selectedCities, setSelectedCities] = useState(null);
  const cities = [
    { name: 'New York', code: 'NY' , image:""},
    { name: 'Rome', code: 'RM' ,image:""},
    { name: 'London', code: 'LDN' ,image:""},
    { name: 'Istanbul', code: 'IST' ,image:""},
    { name: 'Paris', code: 'PRS' ,image:""},
    { name: 'PariDSAs', code: 'PRRS' ,image:""},
    { name: 'ParSDSAis', code: 'PDRS' ,image:""},
    { name: 'ParSSAis', code: 'PSRS' ,image:""},
    { name: 'ParSDis', code: 'PRSS' ,image:""},
  ];
  // const updatePrice = () => {
  //   data.price = card.price;
  //   closeModal();
  // };

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

        <div className="card justify-content-center flex">
          <MultiSelect
            value={selectedCountries}
            options={countries}
            onChange={(e) => setSelectedCountries(e.value)}
            optionLabel="name"
            placeholder="Select Countries"
            itemTemplate={countryTemplate}
            className="p-multiselect"
            display="chip"
          />
        </div>

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
