const chats = {};

class Chat {
  static API = null;
  static modelName = null;
  static apiKey = null;
  static Mode = [];
  
  constructor(chatId) {
    this.id = chatId;
    this.history = [];
    this.mode = JSON.parse(JSON.stringify(Chat.Mode));
    this.modelName = Chat.modelName;
    this.apiKey = Chat.apiKey;
    this.API = Chat.API;
    this.debounce = false;
  }
  async post(message) {
    if (this.debounce) return false;
    this.debounce = true;
    
    const userMessage = {
      role: "user",
      content: message
    };
    try {
      const response = await fetch(this.API, {
        method: "POST",
        headers: {
          "Authorization": "Bearer "+this.apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            ...this.history,
            ...this.mode,
            userMessage
          ]}
        )
      });
      const result = await response.json();
      this.debounce = false;
      if (result.choices && result.choices[0].message.content) {
        this.history.push(userMessage);
        this.history.push(result.choices[0].message);
        return result.choices[0].message.content;
      } else {
        if (result.error) {
          return new Error(result.error.message);
        };
      };
      return false;
    } catch(e) {
      this.debounce = false;
      return e;
    };
  }
  reset() {
    this.history = [];
    return true;
  }
  system(message, role) {
    const roles = ["user", "assistant", "system"];
    if (!roles.includes(role)) role = roles[0];
    
    this.history.push({role, content: message});
    return true;
  }
};

module.exports = id => chats[id] ? chats[id] : chats[id] = new Chat(id);
module.exports.Chat = Chat;
module.exports.chats = chats;