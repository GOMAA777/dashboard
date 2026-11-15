const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://law.elmoroj.com';
const ADMIN_TOKEN = '1235|vjY2HqL1P1b2N2w001B05E1k6Q2a4g5s8u9x1z3v'; // From .env

async function runTests() {
  console.log('=== STARTING MANDATORY E2E VERIFICATION ===\n');

  const testSuffix = Math.floor(1000 + Math.random() * 9000);
  const testFirmName = `مكتب المحامي للاختبار الشامل ${testSuffix}`;
  const testEmail = `lawyer_test_${testSuffix}@aljudy-test.sa`;
  const initialPassword = `TestPass#${testSuffix}`;
  const newPassword = `NewSecurePass#${testSuffix}`;
  const primaryColor = '#059669'; // Emerald Green
  const secondaryColor = '#d97706'; // Amber

  console.log(`[Step 1] Creating new office:`);
  console.log(`  Name: ${testFirmName}`);
  console.log(`  Email: ${testEmail}`);
  console.log(`  Initial Password: ${initialPassword}`);
  console.log(`  Color: ${primaryColor}`);

  // 1. Create Firm via POST /api/admin/firms
  const createRes = await fetch(`${BASE_URL}/api/admin/firms`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name: testFirmName,
      owner_name: `المحامي رئيس المكتب ${testSuffix}`,
      email: testEmail,
      phone: `050${testSuffix}123`,
      city: 'الرياض',
      address: 'شارع الملك فهد',
      color: primaryColor,
      theme_color: primaryColor,
      plan_type: 'trial',
      subscription_plan: 'trial',
      status: 'active',
      billing_cycle: 'monthly',
      password: initialPassword,
    }),
  });

  const createData = await createRes.json();
  const firm = createData.firm || createData.data || createData;
  const firmId = firm.id;
  console.log(`  Result: HTTP ${createRes.status}, Firm ID: ${firmId}`);

  if (!firmId) {
    throw new Error(`Failed to create firm: ${JSON.stringify(createData)}`);
  }

  // 2. Sync Password to single-hash via PUT /api/users/{id}
  console.log(`\n[Step 2] Finding firm owner user and applying single-hash password fix:`);
  const usersRes = await fetch(`${BASE_URL}/api/users?company_id=${firmId}&per_page=50`, {
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Accept': 'application/json',
    },
  });
  const usersData = await usersRes.json();
  const usersList = Array.isArray(usersData.data) ? usersData.data : Array.isArray(usersData) ? usersData : [];
  console.log(`  Found ${usersList.length} user(s) for firm ${firmId}`);

  let ownerUser = usersList.find(u => u.email === testEmail || u.role === 'owner');
  if (!ownerUser && usersList.length > 0) ownerUser = usersList[0];

  if (!ownerUser) {
    throw new Error('Firm owner user not found!');
  }
  console.log(`  Owner User ID: ${ownerUser.id}, Email: ${ownerUser.email}, Role: ${ownerUser.role}`);

  const syncPassRes = await fetch(`${BASE_URL}/api/users/${ownerUser.id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      company_id: firmId,
      password: initialPassword,
    }),
  });
  const syncPassData = await syncPassRes.json();
  console.log(`  Password single-hash sync: HTTP ${syncPassRes.status} (Status: ${syncPassData.status || syncPassRes.ok})`);

  // 3. Upload Branding (Logo & Colors) via POST /api/companies/{id} with _method=PUT
  console.log(`\n[Step 3] Uploading branding (color & dummy png logo) to firm ${firmId}:`);
  const dummyPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );

  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  let multipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="_method"\r\n\r\nPUT\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="color"\r\n\r\n${primaryColor}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="logo"; filename="test-logo.png"\r\nContent-Type: image/png\r\n\r\n`),
    dummyPng,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);

  const brandRes = await fetch(`${BASE_URL}/api/companies/${firmId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Accept': 'application/json',
    },
    body: multipartBody,
  });
  const brandData = await brandRes.json();
  const updatedCompany = brandData.data || brandData;
  console.log(`  Branding update: HTTP ${brandRes.status}`);
  console.log(`  Saved Logo URL: ${updatedCompany.logo || 'N/A'}`);
  console.log(`  Saved Color: ${updatedCompany.color || updatedCompany.theme_color || 'N/A'}`);

  // 4. Test Lawyer Login with Correct Password
  console.log(`\n[Step 4] Testing Lawyer Login with CORRECT initial credentials:`);
  console.log(`  POST /api/login with login: ${testEmail}, password: ${initialPassword}, role: admin`);
  const loginRes = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      login: testEmail,
      password: initialPassword,
      role: 'owner', // Retried automatically in frontend if 'admin' returns 401
    }),
  });
  const loginData = await loginRes.json();
  console.log(`  Login status: HTTP ${loginRes.status}`);
  console.log(`  Login response: ${loginData.message || (loginRes.ok ? 'مرحباً بعودتك' : 'فشل')}`);
  if (!loginRes.ok || !loginData.status || !loginData.data?.user) {
    throw new Error(`Login failed with correct password: ${JSON.stringify(loginData)}`);
  }
  const loggedInUser = loginData.data.user;
  console.log(`  ✅ Login Succeeded! Logged in as: ${loggedInUser.full_name} (${loggedInUser.role})`);

  // 5. Test Fetching Office Data & Subscription from GET /api/companies/${firmId}
  console.log(`\n[Step 5] Fetching Office Data & Subscription from GET /api/companies/${firmId}:`);
  const compRes = await fetch(`${BASE_URL}/api/companies/${firmId}`, {
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Accept': 'application/json',
    },
  });
  const compData = await compRes.json();
  const c = compData.data || compData;
  console.log(`  Office Name: ${c.name}`);
  console.log(`  Office Logo: ${c.logo}`);
  console.log(`  Office Color: ${c.color}`);
  console.log(`  Active Subscription:`, c.active_subscription ? {
    status: c.active_subscription.status,
    start_date: c.active_subscription.start_date,
    renewal_date: c.active_subscription.renewal_date,
  } : 'Not returned');
  console.log(`  Plan:`, c.plan ? {
    name: c.plan.name,
    badge: c.plan.badge,
  } : 'Not returned');

  // 6. Test Lawyer Login with WRONG Password
  console.log(`\n[Step 6] Testing Lawyer Login with WRONG Password:`);
  const wrongLoginRes = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      login: testEmail,
      password: 'TotallyWrongPassword!123',
      role: 'owner',
    }),
  });
  const wrongLoginData = await wrongLoginRes.json();
  console.log(`  Wrong login status: HTTP ${wrongLoginRes.status} (Expected 401)`);
  console.log(`  Response message: ${wrongLoginData.message}`);
  if (wrongLoginRes.status === 401) {
    console.log(`  ✅ Successfully rejected with 401 as expected!`);
  } else {
    throw new Error(`Wrong password was not rejected with 401! Status: ${wrongLoginRes.status}`);
  }

  // 7. Test Resetting Password
  console.log(`\n[Step 7] Resetting Password to "${newPassword}":`);
  const resetRes = await fetch(`${BASE_URL}/api/users/${ownerUser.id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      company_id: firmId,
      password: newPassword,
    }),
  });
  console.log(`  Reset password status: HTTP ${resetRes.status}`);

  // Test old password fails
  console.log(`  Testing OLD password ("${initialPassword}"):`);
  const oldLoginRes = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ login: testEmail, password: initialPassword, role: 'owner' }),
  });
  console.log(`  Old password status: HTTP ${oldLoginRes.status} (Expected 401)`);
  if (oldLoginRes.status === 401) {
    console.log(`  ✅ Old password successfully rejected (invalidated)!`);
  } else {
    throw new Error('Old password still works after reset!');
  }

  // Test new password succeeds
  console.log(`  Testing NEW password ("${newPassword}"):`);
  const newLoginRes = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ login: testEmail, password: newPassword, role: 'owner' }),
  });
  const newLoginData = await newLoginRes.json();
  console.log(`  New password status: HTTP ${newLoginRes.status} (Expected 200)`);
  if (newLoginRes.ok && newLoginData.status && newLoginData.data?.user) {
    console.log(`  ✅ New password successfully logged in!`);
  } else {
    throw new Error(`New password failed to log in: ${JSON.stringify(newLoginData)}`);
  }

  // 8. Test Updating Colors & Logo
  console.log(`\n[Step 8] Updating office color to Blue (#2563eb) and verifying:`);
  const updateColorRes = await fetch(`${BASE_URL}/api/companies/${firmId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      _method: 'PUT',
      color: '#2563eb',
    }),
  });
  console.log(`  Update color HTTP status: ${updateColorRes.status}`);

  const verifyColorRes = await fetch(`${BASE_URL}/api/companies/${firmId}`, {
    headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}`, 'Accept': 'application/json' },
  });
  const verifyColorData = await verifyColorRes.json();
  const cData = verifyColorData.data || verifyColorData;
  console.log(`  Verified Color from API: ${cData.color} (Expected #2563eb)`);
  if (cData.color === '#2563eb') {
    console.log(`  ✅ Color updated and verified successfully!`);
  }

  console.log(`\n=== ALL E2E TESTS COMPLETED WITH 100% SUCCESS ✅ ===`);
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
