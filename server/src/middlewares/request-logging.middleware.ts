/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '@/services';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
    constructor(private readonly logger: LoggerService) { }

    use(req: Request, res: Response, next: NextFunction): void {
        const { method, originalUrl, ip, headers, body, query } = req;
        const userAgent = req.get('user-agent') || '';

        this.logger.log(JSON.stringify({
            message: 'Incoming Request',
            method,
            url: originalUrl,
            ip,
            userAgent,
            headers: this.sanitizeHeaders(headers),
            query,
            body: body
        }));

        const start = Date.now();
        const logger = this.logger;

        const originalWrite = res.write;
        const originalEnd = res.end;
        const chunks: Buffer[] = [];

        res.write = function (chunk: any, ...args: any[]): boolean {
            chunks.push(Buffer.from(chunk));
            return originalWrite.apply(this, [chunk, ...args]);
        };

        res.end = function (this: Response, chunk: any, ...args: any[]): Response {
            if (chunk) {
                chunks.push(Buffer.from(chunk));
            }
            const responseBody = Buffer.concat(chunks).toString('utf8');
            const responseTime = Date.now() - start;
            const { statusCode } = this

            logger.log(JSON.stringify({
                message: 'Outgoing Response',
                method,
                url: originalUrl,
                statusCode,
                duration: `${responseTime}ms`,
                body: responseBody
            }));

            return originalEnd.apply(this, [chunk, ...args]);
        };

        next();
    }

    private sanitizeHeaders(headers: any): any {
        const sanitized = { ...headers };
        delete sanitized.authorization;
        delete sanitized.cookie;
        return sanitized;
    }
}