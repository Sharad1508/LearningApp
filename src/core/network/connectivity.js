import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';


const toOnline = state =>
  state.isConnected !== false && state.isInternetReachable !== false;

export async function isOnline() {
  return toOnline(await NetInfo.fetch());
}

export function useIsOnline() {
  const [online, setOnline] = useState(true);
  useEffect(
    () => NetInfo.addEventListener(state => setOnline(toOnline(state))),
    [],
  );
  return online;
}
