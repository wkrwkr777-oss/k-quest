@echo off
chcp 65001
echo.
echo ========================================================
echo        K-Quest 결제 시스템 자동 설정 마법사 🧙‍♂️
echo ========================================================
echo.
echo secrets.js 파일에서 키를 읽어오고 있습니다...
echo.

node -e "
const fs = require('fs');
const secrets = require('./secrets.js');

const envContent = \`
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=\${secrets.SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=\${secrets.SUPABASE_ANON_KEY}

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=\${secrets.PAYPAL_CLIENT_ID}
PAYPAL_CLIENT_SECRET=\${secrets.PAYPAL_SECRET}

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=\${secrets.STRIPE_PUBLISHABLE_KEY}
STRIPE_SECRET_KEY=\${secrets.STRIPE_SECRET_KEY}

# Business Info
NEXT_PUBLIC_BUSINESS_NAME=포텐포텐
NEXT_PUBLIC_BUSINESS_NAME_EN=potenpoten
NEXT_PUBLIC_BUSINESS_OWNER=박세희
NEXT_PUBLIC_BUSINESS_OWNER_EN=Park Se-hee
NEXT_PUBLIC_BUSINESS_REGISTRATION_NUMBER=375-34-01719
NEXT_PUBLIC_ECOMMERCE_PERMIT_NUMBER=제2025-용인수지-3105호
NEXT_PUBLIC_BUSINESS_ADDRESS=경기도 용인시 수지구 풍덕대로2790번길 7, 3층 302-S86호 (죽전동)
NEXT_PUBLIC_BUSINESS_EMAIL=wkrwkr777@gmail.com

# Domain
NEXT_PUBLIC_DOMAIN=https://quest-k.com
\`;

fs.writeFileSync('.env', envContent);
fs.writeFileSync('.env.local', envContent);
console.log('✅ 모든 설정이 완료되었습니다!');
"

echo.
echo ========================================================
echo   설정이 끝났습니다! 이제 결제 시스템이 작동합니다.
echo ========================================================
echo.
pause
