import { createClient } from '@clickhouse/client'
import { Inject } from '@nestjs/common';

export class clickHouseService {
    constructor(@Inject('CLICKHOUSE') private readonly client : any) {
    }

    async insert(data: any) {
        // await this.client.query('INSERT INTO prompt_logger.logs (user_id, prompt_id, prompt_type, prompt_text, prompt_response, prompt_time, prompt_date) VALUES', data);
        console.log(this.client);
        return "Hello";
    }
} 