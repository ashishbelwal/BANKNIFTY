import React, { useEffect, useState } from 'react';
import { Contract, ContractData, OptionData } from '@/types/index';
import { Segmented, Space, Table } from 'antd';
import { Options } from 'next/dist/server/base-server';
import moment from 'moment';
import { setupWebSocket } from '@/utils/api';

interface OptionChainProps {
  contracts: ContractData;
  optionChain: OptionData;
}

interface MergedDataItem {
    strike: number;
    // Add other properties as needed
    [key: string]: any;
}

const columns = [
    {
        title: 'Delta',
        dataIndex: 'call_delta',
        key: 'call_delta',
        render: (value: number) => value ? Number(value).toFixed(2) : null,
    },
    
    {
        title: 'Call LTP',
        dataIndex: 'call_ltp',
        key: 'call_ltp',
        render: (value: number) => value ? value : '-',
    },
    {
        title: 'Lots',
        dataIndex: 'call_lots',
        key: 'call_lots',
        render: (value: number) => value ? value : '-',
    },
    {
        title: 'Strike',
        dataIndex: 'strike',
        key: 'strike',
        render: (value: number) => value ? value : '-',
       
    },
    {
        title: 'IV',
        dataIndex: 'put_implied_vol',
        key: 'put_implied_vol',
        render: (value: number) => value ? Number(value * 100).toFixed(2) : null,
    },
    {
        title: 'Lots',
        dataIndex: 'put_lots',
        key: 'put_lots',
        render: (value: number) => value ? value : '-',
    },
    {
        title: 'Put LTP',
        dataIndex: 'put_ltp',
        key: 'put_ltp',
        render: (value: number) => value ? value : '-',
    },
    {
        title: 'Put Delta',
        dataIndex: 'put_delta',
        key: 'put_delta',
        render: (value: number) => value ? Number(value).toFixed(2) : null,
    },
];

function sortDates(dateArray: string[]): string[] {
    return dateArray.sort((a: string, b: string) => {
        return new Date(a).getTime() - new Date(b).getTime();
    });
}

const OptionChain = ({ contracts, optionChain }: OptionChainProps) => {
    const [expiries, setExpiries] = useState<string[]>([]);
    const [selectedExpiry, setSelectedExpiry] = useState<string | null>(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [formattedExpiries, setFormattedExpiries] = useState<string[]>([]);

    useEffect(() => {
        setTableLoading(true);
        console.log({contracts})
        const unSortedniqueExpiries = Object.keys(contracts.OPT);
        const uniqueExpiries = sortDates(unSortedniqueExpiries);
        setExpiries(uniqueExpiries);
        const formatted = uniqueExpiries.map(expiry => {
            const expiryDate = moment(expiry);
            const daysToExpiry = expiryDate.diff(moment(), 'days');
            return `${expiryDate.format('DD MMM')}(${daysToExpiry}d)`;
        });
        setFormattedExpiries(formatted);

        if (uniqueExpiries.length > 0) {
            setSelectedExpiry(uniqueExpiries[0]);
        }
        setTableLoading(false);
    }, [optionChain, contracts]);

    useEffect(() => {
        setTableLoading(true);
        if (selectedExpiry) {
            const expiryDataForContract: any = contracts.OPT[selectedExpiry];
            const expiryDataForOptionChain:any = optionChain.options[selectedExpiry];

            // const webSocketData = setupWebSocket(selectedExpiry)
            
            const mergedData = expiryDataForContract.map((contract:any) => {
                const index = expiryDataForOptionChain.strike.indexOf(contract.strike);
                
                if (index !== -1) {
                    return {
                        ...contract,
                        call_close: expiryDataForOptionChain.call_close[index],
                        put_close: expiryDataForOptionChain.put_close[index],
                        call_delta: expiryDataForOptionChain.call_delta[index],
                        call_gamma: expiryDataForOptionChain.call_gamma[index],
                        call_implied_vol: expiryDataForOptionChain.call_implied_vol[index],
                        call_rho: expiryDataForOptionChain.call_rho[index],
                        call_theta: expiryDataForOptionChain.call_theta[index],
                        call_timestamp: expiryDataForOptionChain.call_timestamp[index],
                        call_vega: expiryDataForOptionChain.call_vega[index],
                        put_delta: expiryDataForOptionChain.put_delta[index],
                        put_gamma: expiryDataForOptionChain.put_gamma[index],
                        put_implied_vol: expiryDataForOptionChain.put_implied_vol[index],
                        put_rho: expiryDataForOptionChain.put_rho[index],
                        put_theta: expiryDataForOptionChain.put_theta[index],
                        put_timestamp: expiryDataForOptionChain.put_timestamp[index],
                        put_vega: expiryDataForOptionChain.put_vega[index],
                    };
                } else {
                    return {
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
                }
            }).filter(Boolean);

            const sortedData: MergedDataItem[] = mergedData.sort((a: MergedDataItem, b: MergedDataItem) => a.strike - b.strike);

            const uniqueData: MergedDataItem[] = sortedData.reduce((acc: MergedDataItem[], current: MergedDataItem) => {
                const x = acc.find(item => item.strike === current.strike);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);

            console.log({uniqueData})

            setTableData(uniqueData);
            setTableLoading(false);
        }
    }, [selectedExpiry]);

    

    return (
        <div style={{width: '100%'}}>
            <Space direction='vertical' style={{width: '100%'}} size={'large'} >
            <Segmented<string>
                options={formattedExpiries}
                value={selectedExpiry ? moment(selectedExpiry).format('DD MMM') + `(${moment(selectedExpiry).diff(moment(), 'days')}d)` : undefined}
                onChange={(value) => {
                    const selectedDate = expiries[formattedExpiries.indexOf(value)];
                    setSelectedExpiry(selectedDate);
                }}
            />
            <Table dataSource={tableData} columns={columns} loading={tableLoading}  />
            </Space>
            
        </div>
    );
};

export default OptionChain;
