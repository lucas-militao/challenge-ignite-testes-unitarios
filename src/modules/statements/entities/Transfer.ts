import { OperationType, Statement } from "@modules/statements/entities/Statement";
import { User } from "@modules/users/entities/User";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity("transfers")
class Transfer {
  @PrimaryColumn()
  id: string;

  @Column()
  statement_id: string;

  @Column()
  sender_id: string;

  @Column()
  receiver_id: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Transfer };
