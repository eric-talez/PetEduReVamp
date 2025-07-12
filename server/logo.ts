import { storage } from "./storage";

let currentLogo: string | null = null;

export const logoService = {
  async getCurrentLogo(): Promise<string | null> {
    return currentLogo;
  },

  async setCurrentLogo(logoUrl: string): Promise<void> {
    currentLogo = logoUrl;
  },

  async removeLogo(): Promise<void> {
    currentLogo = null;
  }
};