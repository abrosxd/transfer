import React, { createContext, useContext } from "react";
import Airtable from "airtable";

const SettingsContext = createContext();

const settings = {
  apiKey:
    "patZs0xLRQaVH0yJo.6b37088cccb3ce09e6abf49e350c39d5011e0e8f7cb478fa33d47eaa6667e8be",
  baseId: "appSNMO8drd0jsR3F",
  webhook: "https://hook.eu2.make.com/4hrujnqf8nt252pm923igl9w8bv3dm0l",
  tableArticles: "Articles",
  tableTransfer: "Transfer",
  tableReviews: "Reviews",
  tableCurrency: "Currency",
};

async function fetchTableData(apiKey, baseId, tableName) {
  const base = new Airtable({ apiKey }).base(baseId);
  const records = await base(tableName).select().firstPage();
  return records.map((record) => record.fields);
}

export function Settings({ children }) {
  return (
    <SettingsContext.Provider value={{ ...settings, fetchTableData }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
