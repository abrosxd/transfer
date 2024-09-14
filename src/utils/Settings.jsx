import React, { createContext, useContext } from "react";
import Airtable from "airtable";

const SettingsContext = createContext();

const settings = {
  apiKey:
    "pateokblS4CsG7taE.3ce31722d7f0dba6b8deec493201d25f489d29c93568bd9ea7b49ab5b6a633c6",
  baseId: "appSNMO8drd0jsR3F",
  webhook: "https://api.abros.dev/webhook/tiptoporder",
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
