import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { OauthClient } from '@/entities';

const SALT_ROUNDS = 10;
const CLIENT_ID_BYTES = 16;
const CLIENT_SECRET_BYTES = 32;

@Injectable()
export class OAuthClientService {
  constructor(
    @InjectRepository(OauthClient)
    private readonly clientRepository: Repository<OauthClient>,
  ) {}

  async registerClient(
    name: string,
    redirectUri: string,
  ): Promise<{ clientId: string; clientSecret: string }> {
    const existing = await this.clientRepository.findOne({ where: { name } });
    if (existing) {
      throw new ConflictException(`OAuth client "${name}" already exists`);
    }

    const clientId = crypto.randomBytes(CLIENT_ID_BYTES).toString('hex');
    const clientSecret = crypto
      .randomBytes(CLIENT_SECRET_BYTES)
      .toString('hex');
    const clientSecretHash = await bcrypt.hash(clientSecret, SALT_ROUNDS);

    const client = this.clientRepository.create({
      clientId,
      clientSecretHash,
      name,
      redirectUri,
    });

    await this.clientRepository.save(client);

    return { clientId, clientSecret };
  }

  async findByClientId(clientId: string): Promise<OauthClient> {
    const client = await this.clientRepository.findOne({
      where: { clientId, isActive: true },
    });

    if (!client) {
      throw new NotFoundException(`OAuth client not found`);
    }

    return client;
  }

  async validateClient(
    clientId: string,
    clientSecret: string,
  ): Promise<OauthClient> {
    const client = await this.findByClientId(clientId);
    const isValid = await bcrypt.compare(clientSecret, client.clientSecretHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    return client;
  }

  async validateRedirectUri(
    clientId: string,
    redirectUri: string,
  ): Promise<void> {
    const client = await this.findByClientId(clientId);
    if (client.redirectUri !== redirectUri) {
      throw new UnauthorizedException('Invalid redirect URI');
    }
  }
}
