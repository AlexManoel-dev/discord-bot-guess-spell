import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('user')
export class User {

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ name: 'discord_id' })
  discordId: string;

  @Column()
  points: number;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}