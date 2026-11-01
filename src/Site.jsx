import {useEffect} from 'react';
import PointOfSale from './App.jsx';
import CompanyOverview from './CompanyOverview.jsx';
import {COMPANY_PATH,POS_PATH,isPointOfSalePath} from './routes.js';

export default function Site(){
  const legacyPayment=new URLSearchParams(location.search).has('payment');
  const pointOfSale=isPointOfSalePath(location.pathname)||legacyPayment;
  useEffect(()=>{
    if(legacyPayment&&!isPointOfSalePath(location.pathname))history.replaceState({},'',POS_PATH+location.search+location.hash);
    document.title=pointOfSale?'Patala-Pay | Point of Sale, Licences & Hardware':'Patala-Pay | Payment Solutions & Affordable POS in South Africa';
    document.querySelector('meta[name="description"]')?.setAttribute('content',pointOfSale?'Explore Patala-Pay POS licences, packages and hardware for South African small businesses.':'Meet Patala-Pay, a South African payment solutions startup developing new payment ideas and providing affordable point of sale, Web Admin and online store tools.');
    document.querySelector('link[rel="canonical"]')?.setAttribute('href','https://www.primon.co.za'+(pointOfSale?POS_PATH:COMPANY_PATH));
  },[pointOfSale,legacyPayment]);
  return pointOfSale?<PointOfSale/>:<CompanyOverview/>;
}
