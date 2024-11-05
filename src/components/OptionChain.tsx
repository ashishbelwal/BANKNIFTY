import React, { useEffect, useState, useMemo } from "react";
import {
  ExpiryDataForContract,
  ExpiryDataForOptionChain,
  ExpiryState,
  MergedDataItem,
  OptionChainProps,
  TableState,
} from "@/types/index";
import { Segmented, Space, Table } from "antd";
import moment from "moment";
import { setupWebSocket } from "@/utils/api";
import { optionTradingColumn, useStyle } from "@/utils/constants";
import { sortDates, mergeData } from "@/utils/helpers";

interface WsDataItem {
  token: string | number;
  ltp: string | number;
}

const OptionChain: React.FC<OptionChainProps> = ({
  contracts,
  optionChain,
}) => {
  const { styles } = useStyle();
  const tblRef: Parameters<typeof Table>[0]["ref"] = React.useRef(null);
  const [expiryState, setExpiryState] = useState<ExpiryState>({
    availableExpiries: [],
    formattedExpiries: [],
    selectedExpiry: null,
  });
  const [tableState, setTableState] = useState<TableState>({
    data: [],
    loading: false,
  });

  const [wsData, setWsData] = useState<WsDataItem[]>([]);

  const { sortedExpiries, formattedExpiryOptions } = useMemo(() => {
    const uniqueExpiries = Object.keys(contracts.OPT);
    const sorted = sortDates(uniqueExpiries);
    const formatted = sorted.map((expiry) => {
      const expiryDate = moment(expiry);
      const daysToExpiry = expiryDate.diff(moment(), "days");
      return `${expiryDate.format("DD MMM")}(${daysToExpiry}d)`;
    });
    return { sortedExpiries: sorted, formattedExpiryOptions: formatted };
  }, [contracts.OPT]);

  useEffect(() => {
    setExpiryState({
      availableExpiries: sortedExpiries,
      formattedExpiries: formattedExpiryOptions,
      selectedExpiry: sortedExpiries[0] || null,
    });
  }, [sortedExpiries, formattedExpiryOptions]);

  useEffect(() => {
    if (expiryState.selectedExpiry) {
      setTableState((prev) => ({ ...prev, loading: true }));
      const expiryDataForContract: ExpiryDataForContract =
        contracts.OPT[expiryState.selectedExpiry];
      const expiryDataForOptionChain: ExpiryDataForOptionChain =
        optionChain.options[expiryState.selectedExpiry];
      const mergedData: MergedDataItem[] = mergeData(
        expiryDataForContract,
        expiryDataForOptionChain
      );
      setTableState({ data: mergedData, loading: false });
      const ws = setupWebSocket(expiryState.selectedExpiry);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setWsData(data.ltp);
      };
      // return () => ws.close();
    }
  }, [JSON.stringify(expiryState.selectedExpiry), contracts.OPT, optionChain.options]);

  useEffect(() => {
    console.log({wsData});
    if (wsData && wsData.length > 0) {
      setTableState((prev) => ({
        ...prev,
        data: prev.data.map((item) => {
          const wsItem = wsData.find((ws) => ws.token === item.token);
          return wsItem
            ? {
                ...item,
                call_ltp:
                  item.option_type === "CE"
                    ? Number(wsItem.ltp).toFixed(2)
                    : item.call_ltp,
              }
            : item;
        }),
      }));
    }
  }, [wsData]);

  useEffect(() => {
    tblRef.current?.scrollTo({ index: 0 });
  }, [expiryState.selectedExpiry]);

  return (
    <div style={{ width: "100%" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Segmented<string>
          options={expiryState.formattedExpiries}
          value={
            expiryState.selectedExpiry
              ? moment(expiryState.selectedExpiry).format("DD MMM") +
                `(${moment(expiryState.selectedExpiry).diff(
                  moment(),
                  "days"
                )}d)`
              : undefined
          }
          onChange={(value) => {
            const selectedDate =
              expiryState.availableExpiries[
                expiryState.formattedExpiries.indexOf(value)
              ];
            setExpiryState((prev) => ({
              ...prev,
              selectedExpiry: selectedDate,
            }));
          }}
        />
        <Table
          ref={tblRef}
          dataSource={tableState.data}
          scroll={{ y: 650 }}
          className={styles.customTable}
          rowKey="strike"
          columns={optionTradingColumn}
          loading={tableState.loading}
          pagination={false}
        />
      </Space>
    </div>
  );
};

export default OptionChain;
