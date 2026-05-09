import { ADMIN_DASHBOARD, OFFICER_DASHBOARD, AUDITOR_DASHBOARD, COMPLIANCE_DASHBOARD, TRADER_DASHBOARD } from "../elements/constants";

export interface NavLink {
    label: string;
    path: string;
    icon?: string;
}

export const ROLE_CONFIG: Record<string, NavLink[]> = {
    FARMER: [
        { label: 'Home', path: '/dashboard/farmer/home' }
    ],
    OFFICER: [
        { label: 'Home', path: `${OFFICER_DASHBOARD}home` },
        //{ label: 'Inventory', path: `${OFFICER_DASHBOARD}inventory` },
        { label: 'History', path: `${OFFICER_DASHBOARD}history` }
        //{label: 'Documents', path: `${OFFICER_DASHBOARD}documents` } 
    ],
    TRADER:[
        { label: 'Home', path: `${TRADER_DASHBOARD}home` },
        { label: 'Crop Listings', path: `${TRADER_DASHBOARD}croplistings` },
        { label: 'Orders', path: `${TRADER_DASHBOARD}orders`}
    ],
    ADMIN: [
        { label: 'Home', path: `${ADMIN_DASHBOARD}home` },
        { label: 'Reports', path: `${ADMIN_DASHBOARD}reports` },
        { label: 'Notifications', path: `${ADMIN_DASHBOARD}notifications` }
    ],
    AUDITOR:[
        {label:'Home',path:`${AUDITOR_DASHBOARD}home`},
        {label:'Audits',path:`${AUDITOR_DASHBOARD}entry`},
    ],
    COMPLIANCE:[
        {label:'Home',path:`${COMPLIANCE_DASHBOARD}home`},
        {label:'Compliances',path:`${COMPLIANCE_DASHBOARD}entry`},
    ],
};