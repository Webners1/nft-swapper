import {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { NFTDataType } from '@/types';
import { useContext } from 'react';
import NFTSwapperABI from '../../abi/nftswapper.json';
import NFTABI from '../../abi/nft.json';

const web3modalStorageKey = 'WEB3_CONNECT_CACHED_PROVIDER';
// export const WalletContext = createContext<any>({});
const apiKey = '68JvmwmnZk2qDYdyPENtpGPh'; // Replace with your actual API key
const NFTSwapperAddress = '0x2e8941e75Fa5a3C4f97D007cEc0520A18fd1B922';
const ALCHEMY_RPC_URL =
  'https://scroll-sepolia.g.alchemy.com/v2/Jz-BSrictOj9uU5eTH1EBC6Eqc8SPhiV'; // Replace with your actual Alchemy Scroll URL
const SCROLL_CHAIN_ID = 534351;

interface WalletContextType {
  address: string | undefined;
  balance: string | undefined;
  UserNfts: NFTDataType[] | NFTDataType | undefined;
  loading: boolean;
  apiKey: string;
  error: boolean;
  getOffers: (orderId: number) => Promise<any>;
  getAllOrder: () => Promise<void>;
  getAllOrders: () => Promise<void>;
  userListedNfts: NFTDataType[] | NFTDataType | undefined;
  getOrder: (orderId: number) => Promise<Order>;
  connectToWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getProvider: () => ethers.providers.Web3Provider | undefined;
  getSigner: () => ethers.Signer | undefined;
  nftSwapperContract: ethers.Contract | null;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

const convertIpfsToHttp = (ipfsUri: string): string => {
  if (!ipfsUri) return '';
  return ipfsUri.replace('ipfs://', 'https://dweb.link/ipfs/');
};

interface NFTDetails {
  id?: number;
  tokenId: number;
  img: string;
  name: string;
  description: string;
  owner: string | null;
  address: string | null;
}

interface Contract {
  balanceOf: (owner: string) => Promise<any>; // Adjust the type of return value if needed
  tokenOfOwnerByIndex: (owner: string, index: number) => Promise<any>; // Adjust the type of return value if needed
  tokenURI: (tokenId: number) => Promise<string>;
  address: string;
}

const initializeContract = (
  address: string,
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) => {
  if (!address || !signerOrProvider) {
    throw new Error(
      'Missing required parameters: address, ABI, or signer/provider.'
    );
  }

  // Initialize the contract
  return new ethers.Contract(address, NFTABI, signerOrProvider);
};

type Order = {
  owner: string;
  nftAddress: string;
  nftId: number;
  isActive: boolean;
};

// Function to get all active orders

export const fetchNFTData = async (address: string, apiKey: string) => {
  try {
    const data = await fetchNftsByOwner(address, apiKey);
    return {
      nftData: data || [],
      error: null,
    };
  } catch (err) {
    return {
      nftData: [],
      error: err instanceof Error ? err.message : 'An unknown error occurred',
    };
  }
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [UserNfts, setUserNfts] = useState<
    NFTDataType[] | NFTDataType | undefined
  >(undefined);

  const [ActiveNftDetails, setActiveNftDetails] = useState<any>(undefined);
  const [userListedNfts, setListedUserNfts] = useState<
    NFTDataType[] | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [nftSwapperContract, setNftSwapperContract] =
    useState<ethers.Contract | null>(null);

  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });

  useEffect(() => {
    async function checkConnection() {
      try {
        if (window && window.ethereum) {
          if (localStorage.getItem(web3modalStorageKey)) {
            await connectToWallet();
          }
          if (ActiveNftDetails) {
            getUserListed();
          }
        } else {
          console.log('window or window.ethereum is not available');
        }
      } catch (error) {
        console.log(error, 'Catch error Account is not connected');
      }
    }
    checkConnection().then();
  }, [ActiveNftDetails]);

  const nft_array = [
    '0xB1613B1cDe1CEa6a275D439b6107a9100AF1a27b',
    '0x7163E545D34f59e3833a63bCA36bc3Efa26f4298',
    '0xc3Ab3A9C784e139277eeB175E37C52f1a9D1362e',
  ];

  // Update UserNfts whenever fetchedNfts changes
  useEffect(() => {
    if (!UserNfts) {
      fetchNFTs(address || '', nft_array);
    }
  }, [address, nft_array]);
  const getOffers = async (orderId: number) => {
    try {
      const web3Provider = getWeb3Provider();

      // Check if we're connected to Scroll

      const signer = web3Provider.getSigner();
      const newNftSwapperContract = new ethers.Contract(
        NFTSwapperAddress,
        NFTSwapperABI,
        signer
      );
      setNftSwapperContract(newNftSwapperContract);
      const offers = await newNftSwapperContract.offers(orderId);
      return offers;
    } catch (error) {
      console.error('Error getting offers:', error);
      throw error;
    }
  };

  const getOrder = async (orderId: number): Promise<Order> => {
    try {
      const web3Provider = getWeb3Provider();

      // Check if we're connected to Scroll

      const signer = web3Provider.getSigner();

      const newNftSwapperContract = new ethers.Contract(
        NFTSwapperAddress,
        NFTSwapperABI,
        signer
      );
      setNftSwapperContract(newNftSwapperContract);
      const offers = await newNftSwapperContract.getOrderDetails(orderId);
      return offers;
    } catch (error) {
      console.log(error);
    }
  };

  const createOrder = async (nftAddress: string, nftId: number) => {
    try {
      if (!nftSwapperContract) {
        throw new Error(
          'Contract not initialized. Make sure the wallet is connected.'
        );
      }

      // Use Web3Provider instead of JsonRpcProvider to get the signer
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner(); // Signer is required to send transactions

      // Get the NFT contract instance with the signer
      const nftContract = new ethers.Contract(nftAddress, NFTABI, signer);

      console.log(nftContract);

      // Check if the nftSwapperContract is approved to transfer the NFT
      const ownerAddress = await signer.getAddress();
      console.log(ownerAddress);
      console.log(address);

      const name = await nftContract.name(); // Single token approval check
      console.log(ownerAddress);
      console.log(name);

      const approvedAddress = await nftContract.getApproved(nftId); // Single token approval check

      if (approvedAddress !== nftSwapperContract.address) {
        // If not approved, call the approve function
        const approvalTx = await nftContract.approve(
          nftSwapperContract.address,
          nftId
        );
        await approvalTx.wait();
        console.log(
          'NFT approved successfully. Transaction hash:',
          approvalTx.hash
        );
      }

      // Now create the order
      const tx = await nftSwapperContract.createOrder(nftAddress, nftId);
      await tx.wait();
      console.log('Order created successfully. Transaction hash:', tx.hash);
      return tx.hash;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const makeOffer = async (
    orderId: number,
    nftOffered: string[],
    offeredIds: number[]
  ) => {
    try {
      if (!nftSwapperContract) {
        throw new Error(
          'Contract not initialized. Make sure the wallet is connected.'
        );
      }

      // Use Web3Provider instead of JsonRpcProvider to get the signer
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner(); // Signer is required to send transactions

      // Iterate through the NFTs offered
      for (let i = 0; i < nftOffered.length; i++) {
        const nftContractAddress = nftOffered[i];
        const tokenId = offeredIds[i];

        // Initialize the NFT contract
        const nftContract = new ethers.Contract(
          nftContractAddress,
          NFTABI,
          signer
        );

        // Check if the NFT is approved for the swapper contract
        const isApproved = await nftContract.getApproved(tokenId);

        if (isApproved !== nftSwapperContract.address) {
          console.log(
            `Approving NFT with tokenId ${tokenId} from contract ${nftContractAddress}`
          );

          // Approve the NFT for the swapper contract
          const approvalTx = await nftContract.approve(
            nftSwapperContract.address,
            tokenId
          );
          await approvalTx.wait();

          console.log(
            `NFT with tokenId ${tokenId} approved successfully. Transaction hash:`,
            approvalTx.hash
          );
        }
      }

      // After all NFTs are approved, make the offer
      console.log(orderId, nftOffered, offeredIds);
      const tx = await nftSwapperContract.makeOffer(
        orderId,
        nftOffered,
        offeredIds
      );
      await tx.wait();

      console.log('Offer made successfully. Transaction hash:', tx.hash);
      return tx.hash;
    } catch (error) {
      console.error('Error making offer:', error);
      throw error;
    }
  };
  const acceptOffer = async (orderId: number, offerId: number) => {
    try {
      if (!nftSwapperContract) {
        throw new Error(
          'Contract not initialized. Make sure the wallet is connected.'
        );
      }

      const tx = await nftSwapperContract.acceptOffer(orderId, offerId);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error accepting offer:', error);
      throw error;
    }
  };

  const cancelOrder = async (orderId: number) => {
    try {
      if (!nftSwapperContract) {
        throw new Error(
          'Contract not initialized. Make sure the wallet is connected.'
        );
      }

      const tx = await nftSwapperContract.cancelOrder(orderId);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  };

  const getAllOrder = async () => {
    try {
      if (!nftSwapperContract) {
        throw new Error(
          'Contract not initialized. Make sure the wallet is connected.'
        );
      }

      const offers = await nftSwapperContract.getOrder();
      return offers;
    } catch (error) {
      console.error('Error getting offers:', error);
      throw error;
    }
  };

  const fetchMetadata = async (tokenUri: string, retries = 5, delay = 1000) => {
    const httpUri = convertIpfsToHttp(tokenUri); // Convert IPFS URI to HTTP
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(httpUri);
        if (!response.ok)
          throw new Error(`Failed to fetch metadata from ${httpUri}`);
        return await response.json(); // Return the metadata
      } catch (err) {
        console.error('Error fetching token metadata:', err);
        if (attempt === retries - 1) return null; // Return null if last attempt fails
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, attempt))
        ); // Exponential backoff
      }
    }
    return null; // Fallback return
  };

  // Function to fetch NFTs owned by the user
  const fetchNFTs = async (
    userAddress: string,
    nftContractAddresses: string[]
  ) => {
    const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC_URL);

    // Memoize the contract initialization
    const nftContracts = nftContractAddresses.map(
      (address) => new ethers.Contract(address, NFTABI, provider)
    );
    if (!userAddress || nftContracts.length === 0) return;
    setLoading(true);
    setError(null);
    const nfts = [];

    try {
      const balances = await Promise.all(
        nftContracts.map((nftContract) => nftContract.balanceOf(userAddress))
      );
      for (let i = 0; i < nftContracts.length; i++) {
        const balance = balances[i];
        console.log({ balances });
        for (let index = 0; index < balance.toNumber(); index++) {
          const tokenId = await nftContracts[i].tokenOfOwnerByIndex(
            userAddress,
            index
          );
          const tokenUri = await nftContracts[i].tokenURI(tokenId);
          const metadata = await fetchMetadata(tokenUri);

          if (metadata) {
            const newNft: NFTDetails = {
              tokenId: tokenId.toNumber(),
              img: metadata.image || convertIpfsToHttp(tokenUri),
              name: metadata.name || 'Unnamed NFT',
              description: metadata.description || 'No description available',
              owner: userAddress,
              address: nftContracts[i].address,
            };

            nfts.push(newNft);
            console.log({ nfts });
          }
        }
      }
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to fetch NFTs.');
    } finally {
      setLoading(false);
    }
    setUserNfts((UserNfts = nfts));
  };

  // const ALCHEMY_RPC_URL =
  //   'https://scroll-mainnet.g.alchemy.com/v2/Jz-BSrictOj9uU5eTH1EBC6Eqc8SPhiV'; // Replace with your actual Alchemy Scroll URL

  // const SCROLL_CHAIN_ID = 534352;

  // const SCROLL_NETWORK_PARAMS = {
  //   chainId: '0x82750', // Hexadecimal version of 534352
  //   chainName: 'Scroll',
  //   nativeCurrency: {
  //     name: 'ETH',
  //     symbol: 'ETH',
  //     decimals: 18,
  //   },
  //   rpcUrls: [ALCHEMY_RPC_URL], // Update with Scroll's RPC URL
  //   blockExplorerUrls: ['https://blockexplorer.scroll.io'], // Scroll block explorer URL
  // };
  const SCROLL_NETWORK_PARAMS = {
    chainId: '0x8274f', // Hexadecimal version of 534352
    chainName: 'Scroll',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [ALCHEMY_RPC_URL], // Update with Scroll's RPC URL
    blockExplorerUrls: ['https://blockexplorer.scroll.io'], // Scroll block explorer URL
  };

  const setWalletAddress = async () => {
    try {
      const web3Provider = getWeb3Provider();
      const jsonRpcProvider = getJsonRpcProvider();

      // Check if we're connected to Scroll
      const network = await web3Provider.getNetwork();
      if (network.chainId !== SCROLL_CHAIN_ID) {
        // Prompt user to switch to the Scroll network
        await switchToScrollNetwork();
      }

      const signer = web3Provider.getSigner();
      const web3Address = await signer.getAddress();
      setAddress(web3Address);
      await getBalance(jsonRpcProvider, web3Address); // Use JsonRpcProvider for balance checking.

      const newNftSwapperContract = new ethers.Contract(
        NFTSwapperAddress,
        NFTSwapperABI,
        signer
      );
      setNftSwapperContract(newNftSwapperContract);

      if (web3Address) {
        // const fetchedNfts = await fetchNftsByOwner(web3Address, apiKey);
        // setUserNfts(fetchedNfts);
      }
    } catch (error) {
      console.error('Error in setWalletAddress:', error);
    }
  };

  // Function to switch the network to Scroll
  const switchToScrollNetwork = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.error('MetaMask is not installed');
      return;
    }

    try {
      // Try to switch the network
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SCROLL_NETWORK_PARAMS.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          // Add the Scroll chain to MetaMask
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SCROLL_NETWORK_PARAMS],
          });
        } catch (addError) {
          console.error('Failed to add the Scroll network:', addError);
        }
      } else {
        console.error('Failed to switch network:', switchError);
      }
    }
  };

  const getWeb3Provider = () => {
    return new ethers.providers.Web3Provider(window.ethereum);
  };

  const getJsonRpcProvider = () => {
    return new ethers.providers.JsonRpcProvider(ALCHEMY_RPC_URL);
  };

  const getSigner = () => {
    if (address === undefined) return undefined;
    const provider = getProvider();
    return provider?.getSigner();
  };

  const getProvider = () => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    // Initialize the provider using the Alchemy Scroll RPC URL
    return new ethers.providers.JsonRpcProvider(ALCHEMY_RPC_URL);
  };

  const getUserListed = () => {
    setListedUserNfts(ActiveNftDetails.filter((nft) => nft.owner === address));
  };

  const getBalance = async (provider: Web3Provider, walletAddress: string) => {
    const walletBalance = await provider.getBalance(walletAddress);
    const balanceInEth = ethers.utils.formatEther(walletBalance);
    setBalance(balanceInEth);
  };

  const fetchNftsById = async (
    contract_address: string,
    tokenId: number,
    id: number
  ): Promise<any | undefined> => {
    const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC_URL);

    // Memoize the contract initialization
    const nftContracts = new ethers.Contract(
      contract_address,
      NFTABI,
      provider
    );

    if (nftContracts.length === 0) return;
    setLoading(true);
    setError(null);
    const nfts = [];
    const Owner = '';
    try {
      console.log(tokenId);
      const tokenUri = await nftContracts.tokenURI(tokenId);
      const metadata = await fetchMetadata(tokenUri);

      const Owner = await nftContracts.ownerOf(tokenId);

      if (metadata) {
        const newNft: NFTDetails = {
          id: id,
          tokenId: tokenId,
          img: metadata.image || convertIpfsToHttp(tokenUri),
          name: metadata.name || 'Unnamed NFT',
          description: metadata.description || 'No description available',
          owner: Owner,
          address: nftContracts.address,
        };

        nfts.push(newNft);
      }
      console.log('ffff', { nfts });
      return nfts;
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to fetch NFTs.');
    }
  };

  const disconnectWallet = () => {
    setAddress(undefined);
    web3Modal && web3Modal.clearCachedProvider();
  };

  const checkIfExtensionIsAvailable = () => {
    if (
      (window && window.web3 === undefined) ||
      (window && window.ethereum === undefined)
    ) {
      setError(true);
      web3Modal && web3Modal.toggleModal();
    }
  };

  const connectToWallet = async () => {
    try {
      setLoading(true);
      checkIfExtensionIsAvailable();
      const connection = web3Modal && (await web3Modal.connect());
      const provider = new ethers.providers.Web3Provider(connection);
      await subscribeProvider(connection);

      setWalletAddress(provider);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(
        error,
        'got this error on connectToWallet catch block while connecting the wallet'
      );
    }
  };

  const subscribeProvider = async (connection: any) => {
    connection.on('close', () => {
      disconnectWallet();
    });
    connection.on('accountsChanged', async (accounts: string[]) => {
      if (accounts?.length) {
        setAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(connection);
        getBalance(provider, accounts[0]);
      } else {
        disconnectWallet();
      }
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        UserNfts,
        loading,
        apiKey,
        error,
        connectToWallet,
        disconnectWallet,
        getProvider,
        getOrder,
        createOrder,
        makeOffer,
        acceptOffer,
        cancelOrder,
        fetchNftsById,
        getOffers,
        getAllOrder,
        userListedNfts,
        getSigner,
        nftSwapperContract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
