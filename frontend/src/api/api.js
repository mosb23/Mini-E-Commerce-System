const API_BASE = "http://127.0.0.1:8000/api/";

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}products/`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}products/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}orders/`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function createOrder(items, customerInfo) {
  try {
    const requestBody = { 
      items,
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address
    };
    
    console.log('Sending order request:', requestBody);
    
    const res = await fetch(`${API_BASE}orders/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    
    const responseData = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      console.error('Order creation failed:', {
        status: res.status,
        statusText: res.statusText,
        error: responseData
      });
      throw new Error(responseData.error || responseData.detail || `Failed to create order (${res.status})`);
    }
    
    return responseData;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    // Network error or other issues
    console.error('Network error:', error);
    throw new Error(`Network error: ${error.message || 'Could not connect to server'}`);
  }
}
