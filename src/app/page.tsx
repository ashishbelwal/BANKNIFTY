"use client";
import { useState, useEffect } from 'react';
import OptionChain from '@/components/OptionChain';
import { fetchContracts, fetchOptionChain } from '@/utils/api';
import { Contract, ContractData, OptionData } from '@/types';
import styles from "./page.module.css";
import { Spin, Typography } from 'antd';

const { Title } = Typography;

export default function Home() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [optionChain, setOptionChain] = useState<OptionData[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchData = async () => {
    try {
      const contractsData = await fetchContracts();
      setContracts(contractsData);
      const optionChainData = await fetchOptionChain();
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
          <OptionChain contracts={contracts} optionChain={optionChain as any} />
        )}
      </main>
      <footer className={styles.footer}>
        <p>Options Trading Platform</p>
      </footer>
    </div>
  );
}
