/* services */
import { profileService } from "./services/profile.service";

export class ProfileController {
  static async getProfile() {
    try {
      const data = await profileService.getProfile();
      return data;
    } catch (e) {
      if (
        String(e).includes("Document with the requested ID could not be found")
      ) {
        return await profileService.createProfile();
      }
      return { error: true, message: String(e) };
    }
  }
}
