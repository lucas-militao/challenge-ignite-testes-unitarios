import { OperationType } from "@modules/statements/entities/Statement";
import { User } from "@modules/users/entities/User";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity("transfers")
class Transfer {
  @PrimaryColumn()
  id: string;

  @Column()
  sender_id: string;

  @OneToMany(() => User, user => user.statement)
  @JoinColumn({name: "sender_id"})
  sender: User;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  type: OperationType;

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
