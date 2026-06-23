class RoWifiClient {
    constructor(config = {}) {
        if (!config.apiToken) {
            throw new Error('RoWifiClient Error: apiToken is required.');
        }

        if (!config.guildId) {
            throw new Error('RoWifiClient Error: guildId is required.');
        }
        
        this.apiToken = config.apiToken;
        this.guildId = config.guildId;
        this.baseUrl = 'https://api.rowifi.xyz';
    }

    async _request(endpoint, options = {}) {
        const url = `${this.baseUrl}/v3/${endpoint}`;

        const headers = {

            'Authorization': `Bot ${this.apiToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const textData = await response.text();
            const data = textData ? JSON.parse(textData) : {};

            if (!response.ok) {
                throw new Error(`RoWifi API Error: ${data.message || response.statusText || 'Unknown Error'} (Status Code: ${response.status})`);
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param {string} userId
     */
    async getRobloxUserId(userId) {
        if (!userId) {
            throw new Error('RoWifiClient Error: userId parameter is required.');
        }

        const data = await this._request(`guilds/${this.guildId}/members/${userId}`);
        return data.roblox_id;
    }

    /**
     * @param {string} robloxId
     * @returns {Promise<string[]>}
     */

    async getDiscordUserIds(robloxId) {
        if (!robloxId) {
            throw new Error('RoWifiClient Error: robloxId parameter is required.');
        }

        const data = await this._request(`guilds/${this.guildId}/members/roblox/${robloxId}`);
        if (Array.isArray(data)) {
            return data.map(item => item.discord_id);
        }
        
        if (data && data.discord_id) {
            return [data.discord_id];
        }

        return [];
    }
}

module.exports = RoWifiClient;