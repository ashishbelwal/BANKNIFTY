import { createStyles } from "antd-style";

export const optionTradingColumn = [
  {
    title: "Delta",
    dataIndex: "call_delta",
    key: "call_delta",
    render: (value: number) => (value ? Number(value).toFixed(2) : null),
  },

  {
    title: "Call LTP",
    dataIndex: "call_ltp",
    key: "call_ltp",
    render: (value: number) => (value ? value : "-"),
  },
  {
    title: "Lots",
    dataIndex: "call_lots",
    key: "call_lots",
    render: (value: number) => (value ? value : "-"),
  },
  {
    title: "Strike",
    dataIndex: "strike",
    key: "strike",
    render: (value: number) => (value ? value : "-"),
  },
  {
    title: "IV",
    dataIndex: "put_implied_vol",
    key: "put_implied_vol",
    render: (value: number) => (value ? Number(value * 100).toFixed(2) : null),
  },
  {
    title: "Lots",
    dataIndex: "put_lots",
    key: "put_lots",
    render: (value: number) => (value ? value : "-"),
  },
  {
    title: "Put LTP",
    dataIndex: "put_close",
    key: "put_close",
    render: (value: number) => (value ? value : "-"),
  },
  {
    title: "Put Delta",
    dataIndex: "put_delta",
    key: "put_delta",
    render: (value: number) => (value ? Number(value).toFixed(2) : null),
  },
];

export const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table {
        .ant-table-container {
          .ant-table-body,
          -table-content {
            scrollbar-width: thin;
            scrollbar-color: unset;
          }
        }
      }
    `,
  };
});
