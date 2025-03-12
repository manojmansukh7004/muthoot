import React from 'react';
import RootNavigator from './src/navigation';
import { QueryClientProvider } from 'react-query';
import { queryClient } from 'api/ReactQuery/TwoWheeler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Demo } from 'react-native-two-wheeler-loan';
function App() {
  return (
    // Demo 
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {/* <CombinedProvider> */}
          <RootNavigator />
        {/* </CombinedProvider> */}
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
export default App;
