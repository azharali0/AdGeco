const api_url = 'http://localhost:3001/v1/auth/login';

async function testLogin(email, password) {
  try {
    const res = await fetch(api_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:3000' },
      body: JSON.stringify({ email, password })
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Login successful for ${email}:`, Object.keys(data));
    } else {
      console.error(`❌ Login failed for ${email} (Status ${res.status}):`, await res.text());
    }
  } catch (err) {
    console.error(`❌ Network error for ${email}:`, err.message);
  }
}

async function run() {
  await new Promise(resolve => setTimeout(resolve, 5000)); // wait for API to start
  console.log('Testing logins...');
  await testLogin('admin@adgeco.local', 'Password123!');
  await testLogin('publisher@adgeco.local', 'Password123!');
  await testLogin('advertiser@adgeco.local', 'Password123!');
}

run();
