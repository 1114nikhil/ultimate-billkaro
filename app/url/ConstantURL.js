
//  export const BASE_URL=()=>'http://192.168.0.244:9006/PosErp/v1';//office private url
 export const BASE_URL=()=>'http://106.51.64.62:9006/PosErp/v1';//public url
 export const LOGIN_URL=()=>'/Auth/login';
 export const LOGOUT_URL=()=>'/Auth/signout';

 export const CUSTOMER_PAGINATION=()=>'/Act/customer?itemSize=5&page=';

 export const ADD_CUSTOMER=()=>'/Act/customer';
 export const ADD_STATE=()=>'/Act/customer/getGeogrphRgn';
 export const PRE_ADD_CUSTOMER=()=>'/Act/customer/preAdd';
 export const CUSTOMER_CUST_CODE =() => '/Act/customer/';
 export const EDIT_CUSTOMER =() => '/Act/customer';
 
 export const PRODUCT_LIST=()=>'/Inv/inventory/list';
 export const PRE_ADD_PRODUCT_ORDER =()=>'/PurSal/salesOrder/preAdd';
 export const ADD_PRODUCT = () => '/PurSal/salesOrder';

 export const SALES_EXICUTIVE_URL=()=>'/User/usergroups/salesExecutiveList?itemSize=2&page=';
 export const GET_GEOLOCATION_URL=()=>'/User/usergroups/getGeogrphRgn';

 export const GET_REPORT=()=>'/PurSal/salesOrder/getBillsReport';
 export const EXPORT_REPORT=()=>'/PurSal/salesOrder/getBillsReportExport';
 export const GET_ITEM=()=>'/PurSal/salesOrder/getitemsReport';
 export const EXPORT_ITEM=()=>'/PurSal/salesOrder/getItemsReportExport';

