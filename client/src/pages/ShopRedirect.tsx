import React, { useEffect } from 'react';
import { Redirect } from 'wouter';

export default function ShopRedirectPage() {
  console.log("ShopRedirect 컴포넌트 마운트됨");
  
  // 단순히 ShopBasicPage로 리디렉션합니다
  return <Redirect to="/shop-basic" />;
}