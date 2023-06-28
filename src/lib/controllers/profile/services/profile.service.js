/* clients */
import { profilesClient } from "$lib/repos/axios";

class ProfileService {
  async getProfile() {
    return await profilesClient.get(`/user/profile`);
  }
}

export const profileService = new ProfileService();
