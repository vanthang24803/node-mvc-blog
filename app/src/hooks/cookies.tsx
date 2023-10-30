import { useCookies } from 'react-cookie';

export function useToken() {
  const [cookies] = useCookies(['token']);
  return cookies.token;
}
