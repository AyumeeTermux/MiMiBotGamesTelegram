
export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: { id: number; username?: string; first_name: string; };
    text: string;
    chat: { id: number; };
  };
}

export class TelegramService {
  private static baseUrl(token: string) {
    return `https://api.telegram.org/bot${token}`;
  }

  static async getUpdates(token: string, offset: number): Promise<TelegramUpdate[]> {
    try {
      const response = await fetch(`${this.baseUrl(token)}/getUpdates?offset=${offset}&timeout=30`);
      const data = await response.json();
      return data.ok ? data.result : [];
    } catch (error) { return []; }
  }

  static async sendMessage(token: string, chatId: number, text: string, parseMode: string = 'Markdown', replyMarkup?: any) {
    await fetch(`${this.baseUrl(token)}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode, reply_markup: replyMarkup })
    });
  }

  static async sendPhoto(token: string, chatId: number, photoBlob: Blob, caption?: string) {
    const formData = new FormData();
    formData.append('chat_id', chatId.toString());
    formData.append('photo', photoBlob, 'image.png');
    if (caption) formData.append('caption', caption);
    await fetch(`${this.baseUrl(token)}/sendPhoto`, { method: 'POST', body: formData });
  }
}
