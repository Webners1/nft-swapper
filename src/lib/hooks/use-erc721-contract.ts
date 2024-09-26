import { useState } from 'react';
import { Contract, BigNumber as BN } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import ERC721_ABI from '../../assets/abis/erc721.json';
import { OneToken, ERC721TOKEN_ADDRESS } from '@/lib/constants/web3_contants';
import { toast } from 'react-toastify';

export const useERC721Contract = (provider: Web3Provider | undefined) => {
  const [erc721Contract] = useState<Contract>(
    new Contract(ERC721TOKEN_ADDRESS, ERC721_ABI, provider?.getSigner())
  );
  const [tokenBalance, setTokenBalance] = useState<BN>();
  const [totalSupply, setTotalSupply] = useState<BN>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();
  const [isApproved, setIsApproved] = useState<boolean>();

  const getBalance = async (address: string) => {
    try {
      const balance = await erc721Contract.balanceOf(address);
      setTokenBalance(balance);
      return balance;
    } catch (error) {
      console.log(error, 'Catch error Account is not connected');
      setTokenBalance(BN.from(0));
      return BN.from(0);
    }
  };

  const getTotalSupply = async () => {
    try {
      const _totalSupply = await erc721Contract.totalSupply();
      setTotalSupply(_totalSupply);
      return _totalSupply;
    } catch (error) {
      console.log(error, 'Catch error Account is not connected');
      setTotalSupply(BN.from(0));
      return BN.from(0);
    }
  };

  const getTokenSymbol = async () => {
    try {
      const _tokenSymbol = await erc721Contract.symbol();
      setTokenSymbol(_tokenSymbol);
      return _tokenSymbol;
    } catch (error) {
      console.log(error, 'Catch error Account is not connected');
      setTokenSymbol('BUNZZ');
      return 'BUNZZ';
    }
  };

  const getIsApproved = async () => {
    try {
      const _tokenSymbol = await erc721Contract.symbol();
      setTokenSymbol(_tokenSymbol);
      return _tokenSymbol;
    } catch (error) {
      console.log(error, 'Catch error Account is not connected');
      setTokenSymbol('BUNZZ');
      return 'BUNZZ';
    }
  };

  const approveToken = async (spenderAddress: string, amount: number) => {
    try {
      const tx = await erc721Contract.approve(
        spenderAddress,
        OneToken.mul(amount)
      );
      console.log(tx);
      await tx.wait();
      toast('Token approve successful!');
      return true;
    } catch (error) {
      console.log(error);
      toast.error('Token approve failed.');
      return false;
    }
  };

  return {
    ERC721TOKEN_ADDRESS,
    erc721Contract,
    tokenBalance,
    getBalance,
    approveToken,
  };
};
