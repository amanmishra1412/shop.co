export const GetProductsAll = async () => {
try {
    const response = await fetch('/products', {
      method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        return {
          success: false,
          error: "Error while getting products.",
        };
      }

      return {
        success: true,  
        products:result.products,
      };
    } catch {
      return {
        success: false,
        error: "Error while getting products.",
      };
    }

};

export const GetProductById = async (id) => {
try {
    const response = await fetch(`/products/${id}`, {
      method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        return {
          success: false,
          error: "Error while getting product.",
        };
      }

      return {
        success: true,  
        product:result.product,
      };
    } catch {
      return {
        success: false,
        error: "Error while getting product.",
      };
    }

};