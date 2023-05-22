import { useCallback, useState } from 'react';
import {
  call,
  ContractOptions,
  ContractPromise,
  DecodedContractResult,
} from '../../../core/mod.ts';
import { useAbiMessage } from './useAbiMessage.ts';
import { useWallet } from '../wallets/useWallet.ts';

export type CallSend<T> = (
  args?: unknown[],
  options?: ContractOptions,
  caller?: string,
) => Promise<DecodedContractResult<T> | undefined>;

export interface UseCall<T> {
  send: CallSend<T>;
  isSubmitting: boolean;
}

export enum CallError {
  ContractUndefined = 'Contract is undefined',
  InvalidAbiMessage = 'Invalid ABI Message',
  NoResponse = 'No response',
}

export interface Call<T> extends UseCall<T> {
  result?: DecodedContractResult<T>;
}

export function useCall<T>(
  contract: ContractPromise | undefined,
  message: string,
): Call<T> {
  const [result, setResult] = useState<DecodedContractResult<T>>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abiMessage = useAbiMessage(contract, message);
  const { account } = useWallet();

  const send = useCallback(
    async (
      args,
      options,
      caller,
    ): Promise<DecodedContractResult<T> | undefined> => {
      const callingAddress = caller ? caller : account?.address;
      if (!abiMessage || !contract || !callingAddress) return;

      try {
        setIsSubmitting(true);
        const callResult = await call<T>(
          contract,
          abiMessage,
          callingAddress,
          args,
          options,
        );
        setResult(callResult);
        setIsSubmitting(false);

        return callResult;
      } catch (e: unknown) {
        console.error(e);
        setIsSubmitting(false);
        return;
      }
    },
    [account, abiMessage],
  );

  return { send, isSubmitting, result };
}