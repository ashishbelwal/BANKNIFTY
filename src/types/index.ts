export interface Contract {
    [date: string]: {
    token: string;
    symbol: string;
    lot_size: number;
    tick_size: number;
    max_qty_in_order: number;
    expiry: string; // ISO 8601 format (e.g., "2024-10-23")
    strike: number;
    underlying: string;
    instrument_type: string; // e.g., "OPT"
    option_type: string; // e.g., "CE"
    exchange: string; // e.g., "NSE"
    is_tradable: boolean;
    }
}
interface Options {
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
export interface ContractData  {
    OPT: Contract;
}

export interface ContractOptionData {

}

export interface OptionData {
    options: Options;
}

