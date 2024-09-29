import { useEffect, useState, createContext, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { NFTDataType } from '@/types';
import { useContext } from 'react';
// import {NFTSwappetABI} from "path"

const web3modalStorageKey = 'WEB3_CONNECT_CACHED_PROVIDER';
let nftSwapperContract: ethers.Contract | null = null; 
// export const WalletContext = createContext<any>({});
const apiKey = '68JvmwmnZk2qDYdyPENtpGPh'; // Replace with your actual API key

interface WalletContextType {
  address: string | undefined;
  balance: string | undefined;
  UserNfts: NFTDataType[] | NFTDataType | undefined;
  loading: boolean;
  apiKey: string;
  error: boolean;
  connectToWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getProvider: () => ethers.providers.Web3Provider | undefined;
  getSigner: () => ethers.Signer | undefined;
  nftSwapperContract: ethers.Contract | null;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

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
    console.log(data.data)
    // Transforming the data into the NFTDataType format
    const nftData: NFTDataType[] = data.data.content.map((item: any) => {
      const asset = item; // Assuming 'item' contains the asset data
      return {
        id: parseInt(asset.token_id, 10),
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

export const fetchNftsById = async (
  contract_address: string,
  id: string
): Promise<NFTDataType[] | undefined> => {
  const url = `https://scrollapi.nftscan.com/api/v2/assets/${contract_address}/${id}?show_attribute=true`;

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
    console.log(asset)
    return {
      id: parseInt(asset.token_id, 10),
      img: asset.image_uri || asset.token_uri,
      name: asset.name || 'Unnamed NFT',
      description: asset.description || 'No description available',
      owner: asset.owner || null,
      address: asset.contract_address || null,
      properties: asset.attributes
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
      throw new Error("Contract not initialized. Make sure the wallet is connected.");
    }
    const tx = await nftSwapperContract.createOrder(nftAddress, nftId);
    await tx.wait();
    console.log("Order created successfully. Transaction hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const makeOffer = async (orderId: number, nftOffered: string, offeredIds: number[]) => {
  const { nftSwapperContract } = useWallet();
  try {
    if (!nftSwapperContract) {
      throw new Error("Contract not initialized. Make sure the wallet is connected.");
    }

    const tx = await nftSwapperContract.makeOffer(orderId, nftOffered, offeredIds);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error making offer:", error);
    throw error;
  }
};

export const acceptOffer = async (orderId: number, offerId: number) => {
  const { nftSwapperContract } = useWallet();
  try {
    if (!nftSwapperContract) {
      throw new Error("Contract not initialized. Make sure the wallet is connected.");
    }

    const tx = await nftSwapperContract.acceptOffer(orderId, offerId);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error accepting offer:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId: number) => {
  const { nftSwapperContract } = useWallet();
  try {
    if (!nftSwapperContract) {
      throw new Error("Contract not initialized. Make sure the wallet is connected.");
    }

    const tx = await nftSwapperContract.cancelOrder(orderId);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
};

export const getOffers = async (orderId: number) => {
  const { nftSwapperContract } = useWallet();
  try {
    if (!nftSwapperContract) {
      throw new Error("Contract not initialized. Make sure the wallet is connected.");
    }

    const offers = await nftSwapperContract.getOffers(orderId);
    return offers;
  } catch (error) {
    console.error("Error getting offers:", error);
    throw error;
  }
};

export const getOrderDetails = async (orderId: number) => {
  const { nftSwapperContract } = useWallet();
  try {
    if (!nftSwapperContract) {
      throw new Error("Contract not initialized. Make sure the wallet is connected.");
    }

    const order = await nftSwapperContract.orders(orderId);
    return {
      owner: order.owner,
      nftAddress: order.nftAddress,
      nftId: order.nftId.toString(),
      isActive: order.isActive
    };
  } catch (error) {
    console.error("Error getting order details:", error);
    throw error;
  }
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {


  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [UserNfts, setUserNfts] = useState<NFTDataType[] | NFTDataType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [nftSwapperContract, setNftSwapperContract] = useState<ethers.Contract | null>(null);

  const web3Modal = typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });

  useEffect(() => {
    async function checkConnection() {
      try {
        if (window && window.ethereum) {
          if (localStorage.getItem(web3modalStorageKey)) {
            await connectToWallet();
          }
        } else {
          console.log('window or window.ethereum is not available');
        }
      } catch (error) {
        console.log(error, 'Catch error Account is not connected');
      }
    }
    checkConnection().then();
  }, []);

      const NFTSwapperAddress = "0xxxx";


  const setWalletAddress = async (provider: Web3Provider) => {
    try {
      const signer = provider.getSigner();
      if (signer) {
        const web3Address = await signer.getAddress();
        setAddress(web3Address);
        await getBalance(provider, web3Address);

        const newNftSwapperContract = new ethers.Contract(NFTSwapperAddress, NFTSwapperABI, signer);
        setNftSwapperContract(newNftSwapperContract);

        if (web3Address) {
          const fetchedNfts = await fetchNftsByOwner(web3Address, apiKey);
          setUserNfts(fetchedNfts);
        }
      }
    } catch (error) {
      console.log('Error in setWalletAddress:', error);
    }
  };
  const getSigner = () => {
    if (address === undefined) return undefined;
    const provider = getProvider();
      console.log('Signer:', signer); // Log the signer to inspect

    return provider?.getSigner();
  };

  const getProvider = () => {
    if (typeof window == 'undefined') {
      return undefined;
    }
    return new ethers.providers.Web3Provider(window.ethereum);
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
        getSigner,
        nftSwapperContract
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
