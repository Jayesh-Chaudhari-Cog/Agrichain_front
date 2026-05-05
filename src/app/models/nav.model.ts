import { ADMIN_DASHBOARD } from "../elements/constants";

export interface NavLink {
    label: string;
    path: string;
    icon?: string;
}

export const ROLE_CONFIG: Record<string, NavLink[]> = {
    FARMER: [
        { label: 'Home', path: 'farmer/home' }
    ],
    OFFICER: [
        { label: 'Home', path: '/officer/home' }
    ],
    ADMIN: [
        { label: 'Home', path: `${ADMIN_DASHBOARD}home` },
        { label: 'Reports', path: `${ADMIN_DASHBOARD}reports` },
        { label: 'Notifications', path: `${ADMIN_DASHBOARD}notifications` }
    ]
};