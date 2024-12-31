import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ZeroBounceService {
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('ZERO_BOUNCE_API_KEY');
  }

  async validateEmail(email: string): Promise<boolean> {
    const apiUrl = `https://api.zerobounce.net/v2/validate?api_key=${this.apiKey}&email=${email}`;
    try {
      const response = await lastValueFrom(this.httpService.get(apiUrl));
      const data = response.data;

      return data.status === 'valid';
    } catch (error) {
      console.error('Error validating email:', error.message);
      throw new HttpException('Email validation failed', 500);
    }
  }
}
