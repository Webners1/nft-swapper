import { useModal } from '@/components/modal-views/context';
import { NFTDataType } from '@/types';
import { useRouter } from 'next/router';
import { FC } from 'react';
import Button from '../button/button';

type CardType = 'SELL' | 'BUY' | 'CHANGE_PRICE';

interface CardProps {
  cn?: string;
  card: NFTDataType;
  cardType?: CardType;
}

const Card: FC<CardProps> = ({ cn, card, cardType = 'buy' }) => {
  const router = useRouter();
  let btnText = '';
  const { openModal } = useModal();
  switch (cardType) {
    case 'SELL':
      btnText = 'Sell';
      break;
    case 'CHANGE_PRICE':
      btnText = 'Change price';
      break;
    default:
      btnText = 'Buy';
      break;
  }
  const handleSubmit = (card: NFTDataType) => {
    if (cardType === 'CHANGE_PRICE') openModal('CHANGE_PRICE', card);
    else if (cardType === 'SELL') openModal('SET_NEW_PRICE', card);
  };
  const showDetail = () => {
    router.push(`/marketplace/${card.id}`);
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
