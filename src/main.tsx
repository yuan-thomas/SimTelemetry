import React from "react";
import ReactDOM from "react-dom/client";
import { TelemetryProvider } from "./telemetry";
import { Dashboard } from "./dashboard";
import { ConfigProvider, useConfig } from "./SettingContext";
import "./styles.css";

console.log("✅ main.tsx loaded");

const App: React.FC = () => {
  const { getMaxRetention } = useConfig();
  
  return (
    <TelemetryProvider>
      <Dashboard />
    </TelemetryProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
