import React, { useContext, useState } from 'react';
import { NextSeo } from 'next-seo';
import Card from '@/components/ui/card';
import { NextPageWithLayout, NFTDataType } from '@/types';
import demoData from '../../data/demo.json';
import MarketPlaceLayout from '@/layouts/maketplace/layout';
import { useEvmContractNFTs } from '@moralisweb3/next';
import { ERC721TOKEN_ADDRESS } from '@/lib/constants/web3_contants';
import { WalletContext } from '@/lib/hooks/use-connect';

const MarketPlaceSell: NextPageWithLayout = () => {
  const options = {
    chain: '0x5',
    address: ERC721TOKEN_ADDRESS,
  };
  const { UserNfts } = useContext(WalletContext);
  const [items] = useState<Array<NFTDataType>>(UserNfts);
  const [saleItems] = useState<Array<NFTDataType>>(
    UserNfts?.slice(0, 3) 
  );
  const [floorPrice] = useState<number>(20);
  const [totalTrade] = useState<number>(210022);
  console.log(UserNfts);
  return (
    <>
      <NextSeo
        title="NFTSW - Marketplace"
        description="NFTSW - Marketplace Sell"
      />
      <section className="flex items-center gap-x-12 border-b-2 border-gray-300 py-10">
        <div className="flex flex-col gap-y-1">
          <h2>{floorPrice} ETH</h2>
          <p className="text-gray-400">floor price</p>
        </div>
        <div className="flex flex-col gap-y-1">
          <h2>{totalTrade}</h2>
          <p className="text-gray-400">total trades</p>
        </div>
      </section>
      <section className="border-b-2 border-gray-300 pt-7 pb-5">
        <h2>Your NFT&apos;s for sale</h2>
        <div className="my-5 flex flex-wrap gap-4">
          {saleItems?.map((card, cardIdx) => {
            return (
              <React.Fragment key={`${card.name}_${cardIdx}`}>
                <Card card={card} cardType="CHANGE_PRICE" cn="max-w-[250px]" />
              </React.Fragment>
            );
          })}
        </div>
      </section>
      <section className="pt-7 pb-5">
        <h2>Your NFT&apos;s</h2>
        <div className="my-5 flex flex-wrap gap-4">
          {items?.map((card, cardIdx) => {
            return (
              <React.Fragment key={`${card.name}_${cardIdx}`}>
                <Card card={card} cardType="SELL" cn="max-w-[250px]" />
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </>
  );
};
MarketPlaceSell.getLayout = function getLayout(page) {
  return <MarketPlaceLayout>{page}</MarketPlaceLayout>;
};
export default MarketPlaceSell;
