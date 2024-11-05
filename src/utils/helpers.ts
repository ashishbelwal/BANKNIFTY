import {
  ExpiryDataForContract,
  ExpiryDataForOptionChain,
  MergedDataItem,
} from "@/types";

export function sortDates(dateArray: string[]): string[] {
  return dateArray.sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
}

export function mergeData(
  expiryDataForContract: ExpiryDataForContract,
  expiryDataForOptionChain: ExpiryDataForOptionChain
): MergedDataItem[] {
  const mergedData = expiryDataForContract.map((contract) => {
    const index = expiryDataForOptionChain?.strike?.indexOf(contract.strike);

    return index !== -1
      ? {
          ...contract,
          call_close: expiryDataForOptionChain?.call_close?.[index],
          put_close: expiryDataForOptionChain?.put_close?.[index],
          call_delta: expiryDataForOptionChain?.call_delta?.[index],
          call_gamma: expiryDataForOptionChain?.call_gamma?.[index],
          call_implied_vol: expiryDataForOptionChain?.call_implied_vol?.[index],
          call_rho: expiryDataForOptionChain?.call_rho?.[index],
          call_theta: expiryDataForOptionChain?.call_theta?.[index],
          call_timestamp: expiryDataForOptionChain?.call_timestamp?.[index],
          call_vega: expiryDataForOptionChain?.call_vega?.[index],
          put_delta: expiryDataForOptionChain?.put_delta?.[index],
          put_gamma: expiryDataForOptionChain?.put_gamma?.[index],
          put_implied_vol: expiryDataForOptionChain?.put_implied_vol?.[index],
          put_rho: expiryDataForOptionChain?.put_rho?.[index],
          put_theta: expiryDataForOptionChain?.put_theta?.[index],
          put_timestamp: expiryDataForOptionChain?.put_timestamp?.[index],
          put_vega: expiryDataForOptionChain?.put_vega?.[index],
        }
      : {
          ...contract,
          call_close: null,
          put_close: null,
          call_delta: null,
          call_gamma: null,
          call_implied_vol: null,
          call_rho: null,
          call_theta: null,
          call_timestamp: null,
          call_vega: null,
          put_delta: null,
          put_gamma: null,
          put_implied_vol: null,
          put_rho: null,
          put_theta: null,
          put_timestamp: null,
          put_vega: null,
        };
  });
  const uniqueData = Array.from(
    new Map(mergedData.map((item) => [item.strike, item])).values()
  );
  return uniqueData.sort((a, b) => a.strike - b.strike);
}
