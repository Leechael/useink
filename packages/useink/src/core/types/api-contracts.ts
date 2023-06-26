import { Result } from './result.ts';
import { ISubmittableResult } from './substrate.ts';
import { SubmittableResult } from '@polkadot/api';
import { AbiMessage, DecodedEvent } from '@polkadot/api-contract/types';
import {
  Balance,
  ContractExecResult,
  DispatchError,
  StorageDeposit,
  Weight,
} from '@polkadot/types/interfaces';

export type {
  ContractExecResult,
  ContractExecResultResult,
} from '@polkadot/types/interfaces';
export type { AbiMessage, ContractOptions } from '@polkadot/api-contract/types';
export { Abi, ContractPromise } from '@polkadot/api-contract';

// rome-ignore lint/correctness/noUnusedVariables: The Release flow breaks when exporting from '@polkadot/api-contract/base/contract';
export declare class ContractSubmittableResult extends SubmittableResult {
  readonly contractEvents?: DecodedEvent[] | undefined;
  constructor(result: ISubmittableResult, contractEvents?: DecodedEvent[]);
}

export interface ContractCallResultRaw {
  readonly callResult: ContractExecResult;
  readonly abiMessage: AbiMessage;
}

export interface CallInfo {
  gasRequired: Weight;
  gasConsumed: Weight;
  storageDeposit: StorageDeposit;
}

export interface TxInfo {
  gasRequired: Weight;
  gasConsumed: Weight;
  storageDeposit: StorageDeposit;
  partialFee: Balance;
}

export interface ContractExecResultDecoded<T>
  extends Omit<TxInfo, 'partialFee'> {
  readonly decoded: T;
  readonly raw: ContractExecResult;
}

export interface TxExecResultDecoded<T> extends TxInfo {
  readonly decoded: T;
  readonly raw: ContractExecResult;
}

export type DecodedResult<T> = Result<T, DispatchError>;

export type DecodedContractResult<T> = DecodedResult<
  ContractExecResultDecoded<T>
>;

export type DecodedTxResult<T> = DecodedResult<TxExecResultDecoded<T>>;