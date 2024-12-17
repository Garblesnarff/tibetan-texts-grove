import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileType } from "@/types/upload";

/**
 * Hook for handling file validation and selection
 * Includes admin verification and file type checking
 */
export const useFileValidation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Verifies if the current user has admin privileges
   * @returns {Promise<boolean>} True if user is admin, false otherwise
   */
  const verifyAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to upload files.');
    }

    if (session.user.email !== 'wonky.coin@gmail.com') {
      throw new Error('Only admin users can upload files.');
    }

    return session;
  };

  /**
   * Extracts a formatted title from a filename
   * @param {string} fileName - The name of the file
   * @returns {string} Formatted title with spaces and proper capitalization
   */
  const extractTitleFromFileName = (fileName: string) => {
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    return nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return {
    verifyAdminStatus,
    extractTitleFromFileName,
    navigate,
    toast
  };
};