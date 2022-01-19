import { Statement } from "@modules/statements/entities/Statement";
import { User } from "@modules/users/entities/User";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

@Entity("transfers")
class Transfer {
  @PrimaryColumn()
  id: string;

  @Column()
  statement_id: string;

  @OneToOne(() => Statement, statement => statement.transfer)
  @JoinColumn({ name: "statement_id" })
  statement: Statement;

  @Column()
  receiver_id: string;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Transfer };
