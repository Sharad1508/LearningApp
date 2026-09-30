import { useDispatch } from 'react-redux';
import { HeaderTextButton } from '../../ui/HeaderTextButton';
import { logout } from './authSlice';

export function LogoutButton() {
  const dispatch = useDispatch();
  return (
    <HeaderTextButton title="Log out" onPress={() => dispatch(logout())} />
  );
}
