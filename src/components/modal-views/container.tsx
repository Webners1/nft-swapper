import cn from 'classnames';
import { Fragment, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Dialog } from '@/components/ui/dialog';
import { Transition } from '@/components/ui/transition';
import Button from '@/components/ui/button';
import { Close } from '@/components/icons/close';
import { useModal, MODAL_VIEW } from '@/components/modal-views/context';
import ChangePriceView from '../marketplace/change-price';
import BidValue from '../marketplace/bidValue';
// dynamic imports
const SearchView = dynamic(() => import('@/components/search/view'));
const SelectWallet = dynamic(() => import('@/components/nft/select-wallet'));

const renderModalContent = (view: MODAL_VIEW | string) => {
  switch (view) {
    case 'SEARCH_VIEW':
      return <SearchView />;
    case 'WALLET_CONNECT_VIEW':
      return <SelectWallet />;
    case 'CHANGE_PRICE':
      return <ChangePriceView nftStatus="ON_SALE" />;
    case 'SET_NEW_PRICE':
      return <ChangePriceView nftStatus="READY_FOR_SALE" />;
      case 'BID_VALUE':
  return <BidValue nftStatus="READY_FOR_SALE" />;

    default:
      return null;
  }
};

export const ModalContainer = () => {
  const router = useRouter();
  const { view, isOpen, closeModal } = useModal();

  useEffect(() => {
    // close search modal when route change
    router.events.on('routeChangeStart', closeModal);
    return () => {
      router.events.off('routeChangeStart', closeModal);
    };
  }, []);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden p-4 text-center sm:p-6 lg:p-8 xl:p-10 3xl:p-12"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 z-40 cursor-pointer bg-gray-700 bg-opacity-60 backdrop-blur" />
        </Transition.Child>

        {/* This element is to trick the browser into centering the modal contents. */}
        {view && view !== 'SEARCH_VIEW' && (
          <span className="inline-block h-full align-middle" aria-hidden="true">
            &#8203;
          </span>
        )}

        {/* This element is need to fix FocusTap headless-ui warning issue */}
        <div className="sr-only">
          <Button
            size="small"
            color="gray"
            shape="circle"
            onClick={closeModal}
            className="opacity-50 hover:opacity-80 "
          >
            <Close className="h-auto w-[13px]" />
          </Button>
        </div>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-105"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-105"
        >
          <div
            className={cn(
              'relative z-50 inline-block w-full text-left align-middle',
              'xs:w-auto'
            )}
          >
            {view && renderModalContent(view)}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
