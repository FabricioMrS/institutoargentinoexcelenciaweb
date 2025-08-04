import DOMPurify from 'dompurify';

/**
 * Security utilities for input sanitization and validation
 */

// Environment-aware logging
const isDevelopment = import.meta.env.MODE === 'development';

export const securityLogger = {
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[SECURITY INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.warn(`[SECURITY WARN] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.error(`[SECURITY ERROR] ${message}`, ...args);
    }
    // In production, you might want to send to logging service
  }
};

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false
  });
};

/**
 * Sanitize plain text input
 */
export const sanitizeText = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra minúscula' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos un número' };
  }
  
  return { isValid: true, message: 'Contraseña válida' };
};

/**
 * File upload security validation
 */
export const validateFileUpload = (file: File): { isValid: boolean; message: string } => {
  // File size limit: 10MB
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, message: 'El archivo es demasiado grande. Máximo 10MB.' };
  }

  // Allowed image types
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  // Allowed document types
  const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  const allowedTypes = [...allowedImageTypes, ...allowedDocTypes];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP) y documentos (PDF, DOC, DOCX).' };
  }

  // Check file extension matches MIME type
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeToExtension: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp'],
    'application/pdf': ['pdf'],
    'application/msword': ['doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx']
  };

  const expectedExtensions = mimeToExtension[file.type];
  if (!expectedExtensions || !extension || !expectedExtensions.includes(extension)) {
    return { isValid: false, message: 'La extensión del archivo no coincide con su tipo.' };
  }

  return { isValid: true, message: 'Archivo válido' };
};

/**
 * Sanitize filename for safe storage
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
};