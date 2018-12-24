export class Utils {
  static randomComment(): string {
    let text = '';
    const possible = ' ABCDEFGHIJKLMNOPQRSTUVWXY Zabcdefghijklmnopqrstuvwxyz 0123456789';

    for (let i = 0; i < Math.random() * 1000; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
