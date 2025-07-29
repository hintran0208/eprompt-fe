// API configuration with CORS handling
const BASE = import.meta.env.DEV ? "/api" : "https://api.eprompt.me";

async function apiCall(endpoint, options = {}) {
  const url = `${BASE}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Only add CORS mode in production
  if (!import.meta.env.DEV) {
    config.mode = 'cors';
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    
    // Provide more helpful error messages for common issues
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to the API. Please check your internet connection and try again.');
    }
    
    if (error.message.includes('CORS')) {
      throw new Error('Network error: Unable to connect to the API due to security restrictions.');
    }
    
    throw error;
  }
}

export async function getAllTemplates() {
  return await apiCall("/template/all");
}

export async function generatePrompt(template, input, vaultItem) {
  const response = await apiCall("/generate", {
    method: "POST",
    body: JSON.stringify({
      template,
      context: input,
      vaultItem,
    }),
  });

  return { prompt: response.prompt, vaultItem: response.vaultItem };
}

export async function refinePrompt(type, prompt, vaultId) {
  const response = await apiCall("/refine/prompt", {
    method: "POST",
    body: JSON.stringify({
      prompt,
      refinementType: type,
      vaultId,
    }),
  });

  return response.refinedPrompt;
}

export async function generateAIContent(prompt, isRefined = false, vaultId) {
  const response = await apiCall("/ai-generate", {
    method: "POST",
    body: JSON.stringify({
      text: prompt,
      isRefinedPrompt: isRefined,
      vaultId,
    }),
  });

  return response.result;
}

export async function refineContent(type, content, vaultId) {
  const response = await apiCall("/refine/content", {
    method: "POST",
    body: JSON.stringify({
      content,
      refinementType: type,
      vaultId,
    }),
  });

  return response.refinedContent;
}

export async function getRefineTypes() {
  const response = await apiCall("/refine/types");
  
  return {
    prompt: response.prompt || { types: [], tools: [] },
    content: response.content || { types: [], tools: [] },
  };
}

export async function searchPrompts(query) {
  const response = await apiCall("/search", {
    method: "POST",
    body: JSON.stringify({
      query: query,
      limit: 5, 
    }),
  });

  return response || [];
}

export async function updateVaultItem(vaultItem) { 
  const response = await apiCall("/vault/update", {
    method: "POST",
    body: JSON.stringify(vaultItem),
  });

  return response.vaultItem;
}

export async function deleteVaultItem(vaultId) {
  const response = await apiCall(`/vault/delete/${vaultId}`, {
    method: "DELETE",
  });
  
  return response;
}

export async function getVaultItemsByUserId(id) {
  const response = await apiCall(`/vault/user/${id}`);
  return response;
}
