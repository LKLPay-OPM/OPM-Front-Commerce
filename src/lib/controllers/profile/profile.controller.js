/* services */
import { profileService } from "./services/profile.service";

export class ProfileController {
  /* datos de mongo */
  static async getProfile() {
    try {
      const data = await profileService.getProfile();
      return data;
    } catch (e) {
      return { error: true, message: String(e) };
    }
  }
  static async getSession() {
    try {
      const data = await profileService.getSession();
      return data;
    } catch (e) {
      return { error: true, message: String(e) };
    }
  }
}
