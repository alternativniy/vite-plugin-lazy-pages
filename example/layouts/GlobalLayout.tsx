import { Outlet, useNavigation } from 'react-router-dom';

import Menu from '../components/Menu';

export default function GlobalLayout() {
  const navigation = useNavigation();

  return (
    <div>
      <Menu />
      {navigation.state === 'loading' ? 'Loading route...' : <Outlet />}
    </div>
  )
}