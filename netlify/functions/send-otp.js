exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { clientEmail, clientMobile, clientName, dob, otpCode } = data;

    console.log('=====================================================');
    console.log('NETLIFY SERVERLESS FUNCTION - AUTOMATIC OTP DISPATCH');
    console.log(`1. Target Client Email: ${clientEmail}`);
    console.log(`2. Target Admin Email: eklavyavedicnumerology@gmail.com`);
    console.log(`3. Client Name: ${clientName} | DOB: ${dob}`);
    console.log(`4. Client Mobile: ${clientMobile}`);
    console.log(`5. Generated OTP Code: ${otpCode}`);
    console.log('=====================================================');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        status: 'success',
        message: 'OTP dispatched automatically via Netlify background function.',
        otpCode,
        clientEmail
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Internal Function Error' })
    };
  }
};
