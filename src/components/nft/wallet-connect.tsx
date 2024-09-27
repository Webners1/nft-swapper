import cn from 'classnames';
import Button from '@/components/ui/button';
import { WalletContext } from '@/lib/hooks/use-connect';
import { Menu } from '@/components/ui/menu';
import { Transition } from '@/components/ui/transition';
import { PowerIcon } from '@/components/icons/power';
import { useModal } from '@/components/modal-views/context';
import { useContext } from 'react';
import { Network, Alchemy } from 'alchemy-sdk';
import { useEffect } from 'react';

export const WalletConnect = ({ btnClassName }: { btnClassName?: string }) => {
  const { openModal } = useModal();
  const { address, disconnectWallet, balance } = useContext(WalletContext);



  const fetchNftsByOwner = async (address, apiKey) => {
    const url = `https://restapi.nftscan.com/api/v2/account/own/all/${address}?chain=scroll_mainnet&erc_type=erc721,erc1155&show_attribute=false`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching NFTs: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('NFTs owned by address on Scroll mainnet:', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
// Example usage
      const apiKey = ' api key'; // Replace with your actual API key
      fetchNftsByOwner('0x76151eb2cc64df8f51550b5341ddcedf4be8676a', apiKey);

  
  
 

  return (
    <>
      {address ? (
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
          <div className="relative flex-shrink-0">
            <Menu>
              <Menu.Button className="border-gray w-35 block h-12 overflow-hidden rounded-full border-2 border-solid px-2 shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large dark:border-gray-700">
                {address.slice(0, 6)}
                {'...'}
                {address.slice(address.length - 6)}
              </Menu.Button>
              <Transition
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Menu.Items className="absolute -right-20 mt-3 w-72 origin-top-right rounded-lg bg-white shadow-large dark:bg-gray-900 sm:-right-14">
                  <Menu.Item>
                    <Menu.Item>
                      <div className="border-b border-dashed border-gray-200 px-6 py-5 dark:border-gray-700">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium -tracking-tighter text-gray-600 dark:text-gray-400">
                            Address
                          </span>
                          <span className="rounded-lg bg-gray-100 px-2 py-1 text-sm tracking-tighter dark:bg-gray-800">
                            {address.slice(0, 6)}
                            {'...'}
                            {address.slice(address.length - 6)}
                          </span>
                        </div>
                        <div className="mt-3 font-medium uppercase tracking-wider text-gray-900 dark:text-white">
                          {balance} ETH
                        </div>
                      </div>
                    </Menu.Item>
                  </Menu.Item>
                  <Menu.Item>
                    <div className="p-3">
                      <div
                        className="flex cursor-pointer items-center gap-3 rounded-lg py-2.5 px-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                        onClick={disconnectWallet}
                      >
                        <PowerIcon />
                        <span className="grow uppercase">Disconnect</span>
                      </div>
                    </div>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => openModal('WALLET_CONNECT_VIEW')}
          className={cn('shadow-main hover:shadow-large', btnClassName)}
        >
          CONNECT
        </Button>
      )}
    </>
  );
};

export default WalletConnect;
