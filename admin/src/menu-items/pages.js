// assets
import { IconKey } from '@tabler/icons';
import { IconCalendarEvent } from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconCalendarEvent
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  // title: 'Pages',
  // caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'doctor-list',
      title: 'Doctor',
      type: 'item',
      url: '/doctor-list',
      icon: icons.IconCalendarEvent,
      breadcrumbs: false
    },
    {
      id: 'hospital-list',
      title: 'Hospital',
      type: 'item',
      url: 'hospital-list',
      icon: icons.IconKey,
      external: true,
      target: true
    }
  ]
};

export default pages;
