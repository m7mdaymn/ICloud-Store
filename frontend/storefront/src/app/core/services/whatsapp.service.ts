import { Injectable, inject } from '@angular/core';
import { LanguageService } from './language.service';
import { environment } from '@env/environment';

export interface WhatsAppMessageParams {
  type: 'unit' | 'product';
  id: number;
  name: string;
  price?: number;
  condition?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {
  private languageService = inject(LanguageService);

  generateWhatsAppUrl(params: WhatsAppMessageParams): string {
    const phone = environment.whatsappNumber.replace(/[^0-9]/g, '');
    const message = this.generateMessage(params);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  }

  openWhatsApp(params: WhatsAppMessageParams): void {
    const url = this.generateWhatsAppUrl(params);
    window.open(url, '_blank');
  }

  private generateMessage(params: WhatsAppMessageParams): string {
    const isArabic = this.languageService.isArabic();

    if (isArabic) {
      return this.generateArabicMessage(params);
    } else {
      return this.generateEnglishMessage(params);
    }
  }

  private generateArabicMessage(params: WhatsAppMessageParams): string {
    const typeLabel = params.type === 'unit' ? 'جهاز' : 'منتج';
    const conditionLabel = params.condition ? this.getConditionArabic(params.condition) : '';
    const priceLabel = params.price ? `السعر: ${params.price.toLocaleString('ar-EG')} ج.م` : '';

    let message = `مرحباً، أنا مهتم بـ${typeLabel}:\n`;
    message += `📱 ${params.name}\n`;
    if (conditionLabel) message += `📋 الحالة: ${conditionLabel}\n`;
    if (priceLabel) message += `💰 ${priceLabel}\n`;
    message += `\nأرجو التواصل معي لمزيد من التفاصيل.`;

    return message;
  }

  private generateEnglishMessage(params: WhatsAppMessageParams): string {
    const typeLabel = params.type === 'unit' ? 'device' : 'product';
    const conditionLabel = params.condition ? this.getConditionEnglish(params.condition) : '';
    const priceLabel = params.price ? `Price: ${params.price.toLocaleString('en-US')} EGP` : '';

    let message = `Hello, I'm interested in this ${typeLabel}:\n`;
    message += `📱 ${params.name}\n`;
    if (conditionLabel) message += `📋 Condition: ${conditionLabel}\n`;
    if (priceLabel) message += `💰 ${priceLabel}\n`;
    message += `\nPlease contact me for more details.`;

    return message;
  }

  private getConditionArabic(condition: string): string {
    const map: Record<string, string> = {
      'New': 'جديد',
      'Used': 'مستعمل',
      'Refurbished': 'مجدد'
    };
    return map[condition] || condition;
  }

  private getConditionEnglish(condition: string): string {
    return condition;
  }
}
