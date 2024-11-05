// ------------------------CASH DATA INTERFACE-------------------------------- //
export interface CashInstrument {
  token: string;
  symbol: string;
  lot_size: number;
  tick_size: number;
  max_qty_in_order: number;
  expiry: string;
  strike: number;
  underlying: string;
  instrument_type: string;
  option_type: string;
  exchange: string;
  is_tradable: boolean;
}
export interface FutureInstrument {
  token: string;
  symbol: string;
  lot_size: number;
  tick_size: number;
  max_qty_in_order: number;
  expiry: string;
  strike: number;
  underlying: string;
  instrument_type: string;
  option_type: string;
  exchange: string;
  is_tradable: boolean;
}

export interface FutureInstrumentCollection {
  [expiryDate: string]: FutureInstrument;
}
export interface Contract {
  [date: string]: Array<{
    token: string;
    symbol: string;
    lot_size: number;
    tick_size: number;
    max_qty_in_order: number;
    expiry: string;
    strike: number;
    underlying: string;
    instrument_type: string;
    option_type: string;
    exchange: string;
    is_tradable: boolean;
  }>;
}

export interface ContractData {
  OPT: Contract;
  CASH: CashInstrument;
  FUT: FutureInstrumentCollection;
}

// ------------------------OPTION DATA INTERFACE-------------------------------- //

export interface Options {
  [date: string]: {
    call_close: (number | null)[];
    call_delta: (number | null)[];
    call_gamma: (number | null)[];
    call_implied_vol: (number | null)[];
    call_rho: (number | null)[];
    call_theta: (number | null)[];
    call_timestamp: (number | null)[];
    call_vega: (number | null)[];
    put_close: (number | null)[];
    put_delta: (number | null)[];
    put_gamma: (number | null)[];
    put_implied_vol: (number | null)[];
    put_rho: (number | null)[];
    put_theta: (number | null)[];
    put_timestamp: (number | null)[];
    put_vega: (number | null)[];
    strike: number[];
  };
}

export interface ImpliedFutures {
  [expiryDate: string]: number;
}

export interface FutureData {
  timestamp: string;
  close: number;
}

export interface Futures {
  [expiryDate: string]: FutureData;
}

export interface CashData {
  timestamp: string;
  close: number;
}

export interface VixData {
  timestamp: string;
  close: number;
}

export interface OptionData {
  options: Options;
  candle: string;
  underlying: string;
  implied_futures: ImpliedFutures;
  futures: Futures;
  cash: CashData;
  vix: VixData;
}

export interface ExpiryData {
  token: string;
  symbol: string;
  lot_size: number;
  tick_size: number;
  max_qty_in_order: number;
  expiry: string;
  strike: number;
  underlying: string;
  instrument_type: string;
  option_type: string;
  exchange: string;
  is_tradable: boolean;
}

export type ExpiryDataForContract = Array<{
    token: string;
    symbol: string;
    lot_size: number;
    tick_size: number;
    max_qty_in_order: number;
    expiry: string;
    strike: number;
    underlying: string;
    instrument_type: string;
    option_type: string;
    exchange: string;
    is_tradable: boolean;
  }>;
  

export interface ExpiryDataForOptionChain {
  call_close: (number | null)[];
  call_delta: (number | null)[];
  call_gamma: (number | null)[];
  call_implied_vol: (number | null)[];
  call_rho: (number | null)[];
  call_theta: (number | null)[];
  call_timestamp: (number | null)[];
  call_vega: (number | null)[];
  put_close: (number | null)[];
  put_delta: (number | null)[];
  put_gamma: (number | null)[];
  put_implied_vol: (number | null)[];
  put_rho: (number | null)[];
  put_theta: (number | null)[];
  put_timestamp: (number | null)[];
  put_vega: (number | null)[];
  strike: number[];
}

export interface TableState {
  data: MergedDataItem[];
  loading: boolean;
}

export interface ExpiryState {
  availableExpiries: string[];
  formattedExpiries: string[];
  selectedExpiry: string | null;
}

export interface MergedDataItem {
  strike: number;
  call_close: number | null;
  put_close: number | null;
  is_tradable: boolean;
  [key: string]: string | number | null | boolean;
}

export interface OptionChainProps {
  contracts: ContractData;
  optionChain: OptionData;
}
