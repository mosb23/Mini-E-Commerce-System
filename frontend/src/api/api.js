// Use environment variable for API base URL, fallback to Render backend for production
const API_BASE = process.env.REACT_APP_API_URL || "https://mini-e-commerce-system.onrender.com/api/";

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

export async function createProduct(productData) {
  try {
    const res = await fetch(`${API_BASE}products/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    
    const responseData = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      throw new Error(responseData.error || responseData.detail || `Failed to create product (${res.status})`);
    }
    
    return responseData;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error(`Network error: ${error.message || 'Could not connect to server'}`);
  }
}

export async function updateProduct(id, productData) {
  try {
    const res = await fetch(`${API_BASE}products/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    
    const responseData = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      throw new Error(responseData.error || responseData.detail || `Failed to update product (${res.status})`);
    }
    
    return responseData;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error(`Network error: ${error.message || 'Could not connect to server'}`);
  }
}

export async function deleteProduct(id) {
  try {
    const res = await fetch(`${API_BASE}products/${id}/`, {
      method: "DELETE",
    });
    
    if (!res.ok) {
      const responseData = await res.json().catch(() => ({}));
      throw new Error(responseData.error || responseData.detail || `Failed to delete product (${res.status})`);
    }
    
    return true;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error(`Network error: ${error.message || 'Could not connect to server'}`);
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const res = await fetch(`${API_BASE}orders/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    
    const responseData = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      throw new Error(responseData.error || responseData.detail || `Failed to update order (${res.status})`);
    }
    
    return responseData;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error(`Network error: ${error.message || 'Could not connect to server'}`);
  }
}

export async function deleteOrder(id) {
  try {
    const res = await fetch(`${API_BASE}orders/${id}/`, {
      method: "DELETE",
    });
    
    if (!res.ok) {
      const responseData = await res.json().catch(() => ({}));
      throw new Error(responseData.error || responseData.detail || `Failed to delete order (${res.status})`);
    }
    
    return true;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error(`Network error: ${error.message || 'Could not connect to server'}`);
  }
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
