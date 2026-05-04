export interface NavLink {
    label: string;
    path: string;
    icon?: string;
}

export const ROLE_CONFIG: Record<string, NavLink[]> = {
    FARMER: [
        { label: 'Home', path: '/farmer/home' }
    ],
    OFFICER: [
        { label: 'Home', path: '/officer/home' }
    ],
    ADMIN: [
        { label: 'Home', path: '/admin/home' },
        { label: 'Reports', path: '/admin/reports' }
    ]
};