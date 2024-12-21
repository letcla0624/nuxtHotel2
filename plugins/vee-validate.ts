import { email, min, required } from "@vee-validate/rules";
import { configure, defineRule } from "vee-validate";

import { localize, setLocale } from "@vee-validate/i18n";
import zhTW from "@vee-validate/i18n/dist/locale/zh_TW.json";

export default defineNuxtPlugin((nuxtApp) => {
  // 定義全域的規則
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);

  // 自訂驗證規則
  defineRule("isPhone", (value: string) => {
    const phoneNumberRegex = /^(09)[0-9]{8}$/;
    return phoneNumberRegex.test(value) ? true : "需要正確的電話號碼";
  });

  // 驗證新密碼
  defineRule("newPasswordMatch", (value: string, [target]: string) => {
    return value !== target ? true : "新密碼不能與舊密碼一樣";
  });
  defineRule("passwordMatch", (value: string, [target]: string) => {
    return value === target ? true : "密碼不一致";
  });

  // 設定多國語系與驗證訊息
  configure({
    // 載入繁體中文的設定檔，產生繁體中文的驗證訊息
    generateMessage: localize({ zh_TW: zhTW }),
    validateOnInput: true, // 輸入文字時立即進行驗證
  });

  // 設定預設語言為繁體中文
  setLocale("zh_TW");
});
