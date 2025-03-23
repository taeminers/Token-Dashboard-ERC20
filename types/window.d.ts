interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on?: (eventName: string, handler: (params: any) => void) => void;
    removeListener?: (
      eventName: string,
      handler: (params: any) => void
    ) => void;
    selectedAddress?: string | null;
    isMetaMask?: boolean;
    isConnected?: () => boolean;
  };
}
