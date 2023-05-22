import { useEffect, useState } from 'react';
import { useApi } from '../substrate/useApi.ts';
import { useBlockHeader } from './useBlockHeader.ts';
import { ChainId } from '../../../chains/mod.ts';
import { useChain } from '../mod.ts';
import { DeriveBalancesAccount } from '../../../core/mod.ts';

export interface WithAddress {
  address: string | undefined;
}

export const useBalance = (
  account: WithAddress | undefined,
  chainId?: ChainId,
): DeriveBalancesAccount | undefined => {
  const [balance, setBalance] = useState<DeriveBalancesAccount>();
  const { blockNumber } = useBlockHeader(chainId) || {};
  const chainConfig = useChain(chainId);
  const chain = useApi(chainConfig?.id);

  useEffect(() => {
    if (!chain?.api || !account || !account.address) return;
    chain.api.derive.balances.account(account.address).then(setBalance).catch(
      console.error,
    );
  }, [blockNumber, account]);

  return balance;
};