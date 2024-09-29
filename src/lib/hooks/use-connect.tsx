import { useEffect, useState, createContext, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { NFTDataType } from '@/types';
import { useContext } from 'react';
import NFTSwapperABI from '../../abi/nftswapper.json';

const web3modalStorageKey = 'WEB3_CONNECT_CACHED_PROVIDER';
// export const WalletContext = createContext<any>({});
const apiKey = '68JvmwmnZk2qDYdyPENtpGPh'; // Replace with your actual API key

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

export const fetchNftsByOwner = async (
  address: string,
  apiKey: string
): Promise<NFTDataType[] | undefined> => {
  const url = `https://scrollapi.nftscan.com/api/v2/account/own/0x76151eb2cc64df8f51550b5341ddcedf4be8676a?erc_type=erc721&show_attribute=true&sort_field=&sort_direction=`;

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
    console.log(data.data);
    // Transforming the data into the NFTDataType format
    const nftData: NFTDataType[] = data.data.content.map((item: any) => {
      const asset = item; // Assuming 'item' contains the asset data
      return {
        tokenId: parseInt(asset.token_id, 10),
        img: asset.image_uri || asset.token_uri,
        name: asset.name || 'Unnamed NFT',
        description: asset.description || 'No description available',
        owner: asset.owner || null,
        address: asset.contract_address || null,
      };
    });

    // Console log the description and owner for each NFT

    return nftData;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error so it can be caught by the caller
  }
};

type Order = {
  owner: string;
  nftAddress: string;
  nftId: number;
  isActive: boolean;
};

// Function to get all active orders

export const fetchNftsById = async (
  contract_address: string,
  tokenId: number,
  id: number
): Promise<any | undefined> => {
  const url = `https://scrollapi.nftscan.com/api/v2/assets/${contract_address}/${tokenId}?show_attribute=true`;

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
    // Transforming the data into the NFTDataType format
    const asset = data.data;
    console.log(asset);
    return {
      tokenId: parseInt(asset.token_id, 10),
      id: id,
      img: asset.image_uri || asset.token_uri,
      name: asset.name || 'Unnamed NFT',
      description: asset.description || 'No description available',
      owner: asset.owner || null,
      address: asset.contract_address || null,
      properties: asset.attributes,
    };

    // Console log the description and owner for each NFT
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error so it can be caught by the caller
  }
};

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

export const createOrder = async (nftAddress: string, nftId: string) => {
  const { nftSwapperContract } = useWallet();
  try {
    if (!nftSwapperContract) {
      throw new Error(
        'Contract not initialized. Make sure the wallet is connected.'
      );
    }
    const tx = await nftSwapperContract.createOrder(nftAddress, nftId);
    await tx.wait();
    console.log('Order created successfully. Transaction hash:', tx.hash);
    return tx.hash;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const makeOffer = async (
  orderId: number,
  nftOffered: string[],
  offeredIds: number[]
) => {
  const { nftSwapperContract } = useWallet();
  try {
    if (!nftSwapperContract) {
      throw new Error(
        'Contract not initialized. Make sure the wallet is connected.'
      );
    }

    const tx = await nftSwapperContract.makeOffer(
      orderId,
      nftOffered,
      offeredIds
    );
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error making offer:', error);
    throw error;
  }
};

export const acceptOffer = async (orderId: number, offerId: number) => {
  const { nftSwapperContract } = useWallet();
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

export const cancelOrder = async (orderId: number) => {
  const { nftSwapperContract } = useWallet();
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

export const getAllOrder = async () => {
  const { nftSwapperContract } = useWallet();
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

  const getOffers = async (orderId: number) => {
    
    try {
      if (!nftSwapperContract) {
        throw new Error(
          'Contract not initialized. Make sure the wallet is connected.'
        );
      }

      const offers = await nftSwapperContract.getOffers(orderId);
      return offers;
    } catch (error) {
      console.error('Error getting offers:', error);
      throw error;
    }
  };

  const getOrder = async (orderId: number): Promise<Order>  => {
    try {
      if (!nftSwapperContract) {
        throw new Error(
          'Contract not initialized. Make sure the wallet is connected.'
        );
      }

      const offers = await nftSwapperContract.getOrderDetails(orderId);
      return offers;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllOrders = async () => {
    try {
      // First, get the total number of orders
      // const totalOrders = await nftSwapperContract.getAllOrder();
      const totalOrders = 4; // For demo purposes
      const activeNftDetails = []; // Object to store active orders

      // Iterate through each order ID
      for (let i = 0; i < totalOrders; i++) {
        // const orderDetails = await nftSwapperContract.getOrderDetails(i); // Fetch order details
        const demoOrders = [
          {
            owner: '0x1234567890abcdef1234567890abcdef12345678',
            nftAddress: '0x303963f2480d9995e5596658986dd2a0af9a28e5',
            nftId: Math.floor(Math.random() * (1450 - 100 + 1)) + 100,
            isActive: true,
          },
          {
            owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            nftAddress: '0x303963f2480d9995e5596658986dd2a0af9a28e5',
            nftId: Math.floor(Math.random() * (1450 - 100 + 1)) + 100,
            isActive: true,
          },
          {
            owner: '0x7890abcdefabcdef1234567890abcdef12345678',
            nftAddress: '0x303963f2480d9995e5596658986dd2a0af9a28e5',
            nftId: Math.floor(Math.random() * (1450 - 100 + 1)) + 100,
            isActive: false,
          },
          {
            owner: '0x56789abcdef1234567890abcdef1234567890abc',
            nftAddress: '0x303963f2480d9995e5596658986dd2a0af9a28e5',
            nftId: Math.floor(Math.random() * (1450 - 100 + 1)) + 100,
            isActive: true,
          },
          {
            owner: '0x34567890abcdefabcdef1234567890abcdef1234',
            nftAddress: '0x303963f2480d9995e5596658986dd2a0af9a28e5',
            nftId: Math.floor(Math.random() * (1450 - 100 + 1)) + 100,
            isActive: false,
          },
        ];

        // Destructure the order details
        const { owner, nftAddress, nftId, isActive } = demoOrders[i]; // Get order details for the current index

        // Check if the order is active
        if (isActive) {
          // Store the active order in the object
          const nftDetail = await fetchNftsById(nftAddress, nftId, i); // Pass the nftId directly
          activeNftDetails[i] = nftDetail; // Store the NFT detail by order index
        }
      }

      setActiveNftDetails(activeNftDetails); // Update state with active orders
    } catch (error) {
      console.log(error);
    }
  };
  const NFTSwapperAddress = '0xxxx';

  const ALCHEMY_RPC_URL =
    'https://scroll-mainnet.g.alchemy.com/v2/Jz-BSrictOj9uU5eTH1EBC6Eqc8SPhiV'; // Replace with your actual Alchemy Scroll URL
  const SCROLL_CHAIN_ID = 534352;

  const SCROLL_NETWORK_PARAMS = {
    chainId: '0x82750', // Hexadecimal version of 534352
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
        const fetchedNfts = await fetchNftsByOwner(web3Address, apiKey);
        setUserNfts(fetchedNfts);
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
    return userListedNfts;
  };

  const getBalance = async (provider: Web3Provider, walletAddress: string) => {
    const walletBalance = await provider.getBalance(walletAddress);
    const balanceInEth = ethers.utils.formatEther(walletBalance);
    setBalance(balanceInEth);
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
        getOffers,
        getAllOrder,
        userListedNfts,
        getAllOrders,
        getSigner,
        nftSwapperContract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
