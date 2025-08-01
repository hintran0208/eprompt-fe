// Utility functions for the application
import { invoke } from '@tauri-apps/api/core';

export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Tauri-specific clipboard function that works on all platforms
export const copyToClipboardTauri = async (text) => {
  try {
    await invoke('copy_clipboard', { text });
    console.log('Successfully copied to clipboard via Tauri');
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard via Tauri:', error);
    
    // Try fallback method on Windows
    if (window.__TAURI__ && navigator.platform.toLowerCase().includes('win')) {
      console.log('Trying Windows fallback clipboard method...');
      try {
        await invoke('copy_clipboard_fallback', { text });
        console.log('Successfully copied to clipboard via Windows fallback');
        return true;
      } catch (fallbackError) {
        console.error('Windows fallback also failed:', fallbackError);
      }
    }
    
    return false;
  }
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

export const formatDate = (date) => {
  if (!date) return "";

  const now = new Date();
  const inputDate = new Date(date);
  const diffTime = Math.abs(now - inputDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return inputDate.toLocaleDateString();
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const exportToJSON = (data, filename = "data.json") => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
