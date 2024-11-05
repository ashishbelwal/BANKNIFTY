"use client";
import { useState, useEffect } from 'react';
import { fetchContracts, fetchOptionChain } from '@/utils/api';
import { CashData, CashInstrument, Contract, ContractData, FutureInstrumentCollection, Futures, ImpliedFutures, OptionData, Options, VixData } from '@/types';
import styles from "./page.module.css";
import { Spin, Typography } from 'antd';
import OptionChain from '@/components/OptionChain';

const { Title } = Typography;

export default function Home() {
  const [contracts, setContracts] = useState<ContractData>({
    OPT: {} as Contract,
    CASH: {} as CashInstrument,
    FUT: {} as FutureInstrumentCollection

  });
  const [optionChain, setOptionChain] = useState<OptionData>({
    options: {} as Options,
    candle: "",
    underlying: "",
    implied_futures: {} as ImpliedFutures,
    futures: {} as Futures,
    cash: {} as CashData,
    vix: {} as VixData
  });
  const [loading, setLoading] = useState(true);


  const fetchData = async () => {
    try {
      const contractsData: ContractData = await fetchContracts();
      setContracts(contractsData);
      const optionChainData: OptionData = await fetchOptionChain();
      setOptionChain(optionChainData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.page}>
      <Title level={3}>Options Trading Platform</Title>
      <main className={styles.main}>
      
        {loading ? (
          <Spin />
        ) : (
          <OptionChain contracts={contracts} optionChain={optionChain} />
        )}
      </main>
      <footer className={styles.footer}>
        <p>Options Trading Platform</p>
      </footer>
    </div>
  );
}
