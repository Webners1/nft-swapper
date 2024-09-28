import { useModal } from '@/components/modal-views/context';
import { NFTDataType } from '@/types';
import { useRouter } from 'next/router';
import { FC } from 'react';
import Button from '../button/button';

type CardType = 'SELL' | 'BUY' | 'CHANGE_PRICE' | 'BID_VALUE';

interface CardProps {
  cn?: string;
  card: NFTDataType;
  cardType?: CardType;
}

const Card: FC<CardProps> = ({ cn, card, cardType = 'BID_VALUE' }) => {
  const router = useRouter();
  const { openModal } = useModal();
  let btnText = '';
  switch (cardType) {
    case 'SELL':
      btnText = 'Sell';
      break;
    case 'CHANGE_PRICE':
      btnText = 'See offers';
      break;
    default:
    case 'BID_VALUE':
      btnText = 'Make an Offer';
      break;
  }
  const handleSubmit = (card: NFTDataType) => {
    console.log('Button clicked:', cardType); // Debug line
    if (cardType === 'CHANGE_PRICE') {
    } else if (cardType === 'BID_VALUE') {
      console.log('Opening BID_VALUE modal'); // Debug line
      openModal('BID_VALUE', card);
    } else if (cardType === 'SELL') {
      openModal('SET_NEW_PRICE', card);
    }
  };
  
  const showDetail = () => {
    router.push(`/marketplace/${card.address}/${card.id}`);
  };
  return (
    <>
      <div
        className={`${cn} cursor-pointer rounded-xl bg-white p-5 shadow-card`}
      >
        <div className="relative w-full">
          <img
            className="rounded-lg bg-gray-100 p-2"
            src={card.img}
            alt={card.name}
            onClick={() => showDetail()}
          />
        </div>
        <p className="mt-2 font-semibold text-gray-600">{card.name}</p>
        <p className="text-gray-400">{card.owner}</p>
        <p className="my-2 font-semibold text-gray-600">
          {card.price} {card.currency}
        </p>
        <Button
          className="mt-5"
          size="block"
          color="primary"
          shape="rounded"
          onClick={() => handleSubmit(card)}
        >
          {btnText}
        </Button>
        {cardType === 'change_price' && (
          <a className="mx-auto mt-3 flex cursor-pointer justify-center underline">
            Remove listing
          </a>
        )}
      </div>
    </>
  );
};

export default Card;
