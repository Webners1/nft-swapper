import { useEffect, useState, createContext, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { NFTDataType } from '@/types';

const web3modalStorageKey = 'WEB3_CONNECT_CACHED_PROVIDER';

export const WalletContext = createContext<any>({});

// Move these functions outside of WalletProvider
export const fetchNftsByOwner = async (
  address: string,
  apiKey: string
): Promise<NFTDataType[] | undefined> => {
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

    // Transforming the data into the NFTDataType format
    const nftData: NFTDataType[] = data.data.flatMap((item: any) =>
      item.assets.map((asset: any) => ({
        id: parseInt(asset.token_id, 10),
        img: asset.image_uri || asset.token_uri,
        name: asset.name || 'Unnamed NFT',
        description: asset.description || 'No description available',
        owner: asset.owner || null,
      }))
    );

    // Console log the description and owner for each NFT
    nftData.forEach((nft) => {
      console.log(`NFT Name: ${nft.name}`);
      console.log(`Description: ${nft.description}`);
      console.log(`Owner: ${nft.owner}`);
      console.log(`img: ${nft.img}`);
      console.log(`id: ${nft.id}`);

      console.log('---');
    });

    return nftData;
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
      error: null
    };
  } catch (err) {
    return {
      nftData: [],
      error: err instanceof Error ? err.message : 'An unknown error occurred'
    };
  }
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [UserNfts, setUserNfts] = useState<
    NFTDataType[] | NFTDataType | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const apiKey = '68JvmwmnZk2qDYdyPENtpGPh'; // Replace with your actual API key
  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });

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

  const setWalletAddress = async (provider: Web3Provider) => {
    try {
      const signer = provider.getSigner();
      if (signer) {
        const web3Address = await signer.getAddress();
        setAddress(web3Address);
        await getBalance(provider, web3Address);  // Ensure getBalance finishes
  
        if (web3Address) {
          const fetchedNfts = await fetchNftsByOwner(
            '0x76151eb2cc64df8f51550b5341ddcedf4be8676a', // Your test address
            apiKey
          );
          setUserNfts(fetchedNfts); // Update UserNfts
          console.log("NFTs fetched:", fetchedNfts);
        }
      }
    } catch (error) {
      console.log('Error in setWalletAddress:', error);
    }
  };
  

  const getSigner = () => {
    if (address === undefined) return undefined;
    const provider = getProvider();
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
        error,
        connectToWallet,
        disconnectWallet,
        getProvider,
        getSigner,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};


