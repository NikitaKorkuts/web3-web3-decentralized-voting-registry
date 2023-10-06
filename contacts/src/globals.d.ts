interface Window {
  ethereum?: {
    enable: unknown;
    on: unknown;
    off: unknown;
  };
  web3?: {
    eth: unknown;
    currentProvider: unknown;
  }
}
interface ISurveyRegistry {
  networks: unknown[];
  abi: unknown;
}

declare let SurveyRegistry: unknown;
declare let web3: unknown;
declare let ethereum;